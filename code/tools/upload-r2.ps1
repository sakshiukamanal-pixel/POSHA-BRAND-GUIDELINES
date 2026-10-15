# Uploads everything in /assets to the Cloudflare R2 bucket from .env, keeping the same paths.
#   assets/07-gallery/x.jpg  ->  <R2_PUBLIC_URL>/07-gallery/x.jpg
# Uses R2's S3 endpoint (R2_ENDPOINT) with AWS Signature V4: access key = R2_ACCESS_KEY_ID,
# secret = SHA-256 of CLOUDFLARE_API_TOKEN (Cloudflare's rule for bucket-scoped tokens). Secrets are never printed.
#   powershell -ExecutionPolicy Bypass -File code/tools/upload-r2.ps1            (everything)
#   powershell -ExecutionPolicy Bypass -File code/tools/upload-r2.ps1 -Only brand (paths containing "brand")
#   add -Changed to upload only files that differ in size from what's already in the bucket
param([string]$Only = '', [switch]$Changed, [int]$Limit = 0)
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$cfg = @{}
Get-Content (Join-Path $root '.env') | ForEach-Object { if ($_ -match '^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$') { $cfg[$Matches[1]] = $Matches[2].Trim('"', "'") } }
foreach ($k in 'CLOUDFLARE_API_TOKEN', 'R2_ACCESS_KEY_ID', 'R2_ENDPOINT', 'R2_BUCKET') { if (-not $cfg[$k]) { throw "Missing $k in .env" } }

# ---- AWS SigV4 helpers
$sha = [Security.Cryptography.SHA256]::Create()
function Hex([byte[]]$b) { -join ($b | ForEach-Object { $_.ToString('x2') }) }
function Sha256Hex([string]$s) { Hex ($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes($s))) }
function Hmac([byte[]]$key, [string]$msg) { $h = New-Object Security.Cryptography.HMACSHA256 (, $key); $h.ComputeHash([Text.Encoding]::UTF8.GetBytes($msg)) }
$secret = Sha256Hex $cfg.CLOUDFLARE_API_TOKEN
$endpoint = $cfg.R2_ENDPOINT.TrimEnd('/'); $hostName = ([Uri]$endpoint).Host
function SignedHeaders([string]$method, [string]$canonicalUri) {
  $now = [DateTime]::UtcNow; $amz = $now.ToString('yyyyMMddTHHmmssZ'); $day = $now.ToString('yyyyMMdd')
  $scope = "$day/auto/s3/aws4_request"
  $canon = "$method`n$canonicalUri`n`nhost:$hostName`nx-amz-content-sha256:UNSIGNED-PAYLOAD`nx-amz-date:$amz`n`nhost;x-amz-content-sha256;x-amz-date`nUNSIGNED-PAYLOAD"
  $toSign = "AWS4-HMAC-SHA256`n$amz`n$scope`n$(Sha256Hex $canon)"
  $k = Hmac ([Text.Encoding]::UTF8.GetBytes("AWS4$secret")) $day; $k = Hmac $k 'auto'; $k = Hmac $k 's3'; $k = Hmac $k 'aws4_request'
  $sig = Hex (Hmac $k $toSign)
  @{
    'x-amz-date' = $amz; 'x-amz-content-sha256' = 'UNSIGNED-PAYLOAD'
    Authorization = "AWS4-HMAC-SHA256 Credential=$($cfg.R2_ACCESS_KEY_ID)/$scope, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=$sig"
  }
}
$types = @{
  '.png' = 'image/png'; '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'; '.webp' = 'image/webp'; '.gif' = 'image/gif'; '.svg' = 'image/svg+xml'
  '.avif' = 'image/avif'; '.mp4' = 'video/mp4'; '.webm' = 'video/webm'; '.mov' = 'video/quicktime'; '.zip' = 'application/zip'
  '.otf' = 'font/otf'; '.ttf' = 'font/ttf'; '.woff' = 'font/woff'; '.woff2' = 'font/woff2'; '.pdf' = 'application/pdf'
}

$assets = Join-Path $root 'assets'
$files = Get-ChildItem $assets -Recurse -File | Where-Object { $_.Name -ne '.gitkeep' -and $_.Name -notlike '._*' -and $_.Name -notlike '.DS_Store' }
if ($Only) { $files = $files | Where-Object { $_.FullName -like "*$Only*" } }
if ($Limit) { $files = $files | Select-Object -First $Limit }

$ok = 0; $skip = 0; $fail = 0; $bytes = 0; $t0 = Get-Date
foreach ($f in $files) {
  $key = $f.FullName.Substring($assets.Length + 1).Replace('\', '/')
  $canonicalUri = "/$($cfg.R2_BUCKET)/" + ((($key -split '/') | ForEach-Object { [Uri]::EscapeDataString($_) }) -join '/')
  $url = "$endpoint$canonicalUri"
  if ($Changed -and $cfg.R2_PUBLIC_URL) {
    try {
      $head = Invoke-WebRequest -Method Head -Uri ("$($cfg.R2_PUBLIC_URL)/" + ((($key -split '/') | ForEach-Object { [Uri]::EscapeDataString($_) }) -join '/')) -UseBasicParsing
      if ([long]$head.Headers['Content-Length'] -eq $f.Length) { $skip++; continue }
    } catch { }
  }
  $ct = $types[$f.Extension.ToLower()]; if (-not $ct) { $ct = 'application/octet-stream' }
  $tries = 0
  while ($true) {
    try {
      Invoke-WebRequest -Method Put -Uri $url -Headers (SignedHeaders 'PUT' $canonicalUri) -ContentType $ct -InFile $f.FullName -TimeoutSec 600 -UseBasicParsing | Out-Null
      $ok++; $bytes += $f.Length
      Write-Host ("ok   {0,8:N0} KB  {1}" -f ($f.Length / 1KB), $key)
      break
    } catch {
      $tries++
      if ($tries -ge 3) {
        $fail++
        $msg = $_.Exception.Message; if ($_.ErrorDetails) { $msg = $_.ErrorDetails.Message }
        Write-Host "FAIL $key - $msg"
        break
      }
      Start-Sleep -Seconds (2 * $tries)
    }
  }
}
Write-Host ("`nUploaded {0} files ({1:N1} MB), skipped {2}, failed {3} in {4:N0}s" -f $ok, ($bytes / 1MB), $skip, $fail, ((Get-Date) - $t0).TotalSeconds)
if ($cfg.R2_PUBLIC_URL) { Write-Host "Public base: $($cfg.R2_PUBLIC_URL)/" }
