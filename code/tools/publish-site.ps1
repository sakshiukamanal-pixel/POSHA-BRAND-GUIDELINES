# Publishes the website files (code/ + database/, no tools, no .env) to R2 under _site/
# and writes site-manifest.json (path + SHA-1 of each file). Vercel's build (build.mjs)
# pulls exactly these files and refuses any whose checksum doesn't match.
#   powershell -ExecutionPolicy Bypass -File code/tools/publish-site.ps1
# Then press Redeploy on the latest deployment in Vercel (or run `vercel --prod` from the project folder).
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$cfg = @{}
Get-Content (Join-Path $root '.env') | ForEach-Object { if ($_ -match '^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$') { $cfg[$Matches[1]] = $Matches[2].Trim('"', "'") } }
foreach ($k in 'CLOUDFLARE_API_TOKEN', 'R2_ACCESS_KEY_ID', 'R2_ENDPOINT', 'R2_BUCKET', 'R2_PUBLIC_URL') { if (-not $cfg[$k]) { throw "Missing $k in .env" } }

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
  @{
    'x-amz-date' = $amz; 'x-amz-content-sha256' = 'UNSIGNED-PAYLOAD'
    Authorization = "AWS4-HMAC-SHA256 Credential=$($cfg.R2_ACCESS_KEY_ID)/$scope, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=$(Hex (Hmac $k $toSign))"
  }
}
$types = @{ '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css; charset=utf-8'; '.js' = 'text/javascript; charset=utf-8'; '.json' = 'application/json'; '.svg' = 'image/svg+xml' }

$files = @(Get-ChildItem (Join-Path $root 'code'), (Join-Path $root 'database') -Recurse -File |
  Where-Object { $_.FullName -notlike '*\code\tools\*' -and $_.Name -notlike '.*' -and $types.ContainsKey($_.Extension.ToLower()) } |
  Sort-Object FullName)
$sha1 = [Security.Cryptography.SHA1]::Create()
$list = foreach ($f in $files) {
  $rel = $f.FullName.Substring($root.Length + 1).Replace('\', '/')
  $canonicalUri = "/$($cfg.R2_BUCKET)/_site/" + ((($rel -split '/') | ForEach-Object { [Uri]::EscapeDataString($_) }) -join '/')
  Invoke-WebRequest -Method Put -Uri "$endpoint$canonicalUri" -Headers (SignedHeaders 'PUT' $canonicalUri) -ContentType $types[$f.Extension.ToLower()] -InFile $f.FullName -UseBasicParsing | Out-Null
  Write-Host "ok  $rel"
  [ordered]@{ path = $rel; sha1 = (Hex ($sha1.ComputeHash([IO.File]::ReadAllBytes($f.FullName)))); size = $f.Length }
}
$manifest = [ordered]@{ base = $cfg.R2_PUBLIC_URL.TrimEnd('/'); files = @($list) }
$manifestPath = Join-Path $root 'site-manifest.json'
[IO.File]::WriteAllText($manifestPath, ($manifest | ConvertTo-Json -Depth 4), (New-Object Text.UTF8Encoding $false))
$canonicalUri = "/$($cfg.R2_BUCKET)/_site/site-manifest.json"
Invoke-WebRequest -Method Put -Uri "$endpoint$canonicalUri" -Headers (SignedHeaders 'PUT' $canonicalUri) -ContentType 'application/json' -InFile $manifestPath -UseBasicParsing | Out-Null
Write-Host "`nPublished $($files.Count) site files -> site-manifest.json"
