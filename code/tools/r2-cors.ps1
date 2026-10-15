# Sets a CORS rule on the R2 bucket so the portal (any origin) can fetch files for
# "Download as SVG/PNG", font loading and forced downloads. GET/HEAD only — read access.
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$cfg = @{}
Get-Content (Join-Path $root '.env') | ForEach-Object { if ($_ -match '^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$') { $cfg[$Matches[1]] = $Matches[2].Trim('"', "'") } }

$sha = [Security.Cryptography.SHA256]::Create()
function Hex([byte[]]$b) { -join ($b | ForEach-Object { $_.ToString('x2') }) }
function Sha256Hex([byte[]]$b) { Hex ($sha.ComputeHash($b)) }
function Hmac([byte[]]$key, [string]$msg) { $h = New-Object Security.Cryptography.HMACSHA256 (, $key); $h.ComputeHash([Text.Encoding]::UTF8.GetBytes($msg)) }
$secret = Sha256Hex ([Text.Encoding]::UTF8.GetBytes($cfg.CLOUDFLARE_API_TOKEN))
$endpoint = $cfg.R2_ENDPOINT.TrimEnd('/'); $hostName = ([Uri]$endpoint).Host

$body = '<?xml version="1.0" encoding="UTF-8"?><CORSConfiguration><CORSRule><AllowedOrigin>*</AllowedOrigin><AllowedMethod>GET</AllowedMethod><AllowedMethod>HEAD</AllowedMethod><AllowedHeader>*</AllowedHeader><ExposeHeader>Content-Length</ExposeHeader><ExposeHeader>Content-Type</ExposeHeader><MaxAgeSeconds>86400</MaxAgeSeconds></CORSRule></CORSConfiguration>'
$bytes = [Text.Encoding]::UTF8.GetBytes($body)
$payloadHash = Sha256Hex $bytes
$md5 = [Convert]::ToBase64String([Security.Cryptography.MD5]::Create().ComputeHash($bytes))

$now = [DateTime]::UtcNow; $amz = $now.ToString('yyyyMMddTHHmmssZ'); $day = $now.ToString('yyyyMMdd'); $scope = "$day/auto/s3/aws4_request"
$uri = "/$($cfg.R2_BUCKET)"
$canon = "PUT`n$uri`ncors=`ncontent-md5:$md5`nhost:$hostName`nx-amz-content-sha256:$payloadHash`nx-amz-date:$amz`n`ncontent-md5;host;x-amz-content-sha256;x-amz-date`n$payloadHash"
$toSign = "AWS4-HMAC-SHA256`n$amz`n$scope`n$(Sha256Hex ([Text.Encoding]::UTF8.GetBytes($canon)))"
$k = Hmac ([Text.Encoding]::UTF8.GetBytes("AWS4$secret")) $day; $k = Hmac $k 'auto'; $k = Hmac $k 's3'; $k = Hmac $k 'aws4_request'
$sig = Hex (Hmac $k $toSign)
$headers = @{
  'Content-MD5' = $md5; 'x-amz-date' = $amz; 'x-amz-content-sha256' = $payloadHash
  Authorization = "AWS4-HMAC-SHA256 Credential=$($cfg.R2_ACCESS_KEY_ID)/$scope, SignedHeaders=content-md5;host;x-amz-content-sha256;x-amz-date, Signature=$sig"
}
try {
  $r = Invoke-WebRequest -Method Put -Uri "$endpoint$uri`?cors" -Headers $headers -Body $bytes -ContentType 'application/xml' -UseBasicParsing
  Write-Host "CORS set: HTTP $($r.StatusCode)"
} catch {
  $msg = $_.Exception.Message; if ($_.ErrorDetails) { $msg = $_.ErrorDetails.Message }
  Write-Host "CORS not set: $msg"
}
