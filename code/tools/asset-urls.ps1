# Builds the public Cloudflare R2 URL for every file in /assets:
#   <R2_PUBLIC_URL>/<path inside assets>
# Writes asset-urls.csv (open in Excel/Sheets) and asset-urls.txt (one URL per line) in the project root.
#   add -Check to also confirm each URL is live (HEAD request)
param([switch]$Check)
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$cfg = @{}
Get-Content (Join-Path $root '.env') | ForEach-Object { if ($_ -match '^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$') { $cfg[$Matches[1]] = $Matches[2].Trim('"', "'") } }
$base = $cfg.R2_PUBLIC_URL.TrimEnd('/')
if (-not $base) { throw 'R2_PUBLIC_URL missing in .env' }

$assets = Join-Path $root 'assets'
$kinds = @{ '.png' = 'image'; '.jpg' = 'image'; '.jpeg' = 'image'; '.webp' = 'image'; '.svg' = 'image'; '.gif' = 'image'; '.mp4' = 'video'; '.webm' = 'video'; '.mov' = 'video'; '.zip' = 'download'; '.otf' = 'font'; '.ttf' = 'font'; '.woff' = 'font'; '.woff2' = 'font' }
$rows = Get-ChildItem $assets -Recurse -File |
  Where-Object { $_.Name -ne '.gitkeep' -and $_.Name -notlike '._*' -and $_.Name -notlike '.DS_Store' } |
  Sort-Object FullName |
  ForEach-Object {
    $key = $_.FullName.Substring($assets.Length + 1).Replace('\', '/')
    $url = "$base/" + ((($key -split '/') | ForEach-Object { [Uri]::EscapeDataString($_) }) -join '/')
    $code = if ($_.BaseName -match '^(psh-[a-z]+\d*-\d+)') { $Matches[1].ToUpper() } else { '' }
    $status = ''
    if ($Check) { try { $status = (Invoke-WebRequest -Method Head -Uri $url -UseBasicParsing -TimeoutSec 30).StatusCode } catch { $status = 'missing' } }
    [pscustomobject]@{ section = ($key -split '/')[0]; code = $code; type = $kinds[$_.Extension.ToLower()]; size_kb = [int]($_.Length / 1KB); path = $key; url = $url; status = $status }
  }
$rows | Select-Object section, code, type, size_kb, path, url, status | Export-Csv (Join-Path $root 'asset-urls.csv') -NoTypeInformation -Encoding UTF8
[IO.File]::WriteAllLines((Join-Path $root 'asset-urls.txt'), [string[]]($rows | ForEach-Object { $_.url }), (New-Object Text.UTF8Encoding $false))
Write-Host "$($rows.Count) URLs -> asset-urls.csv, asset-urls.txt"
if ($Check) { $bad = @($rows | Where-Object { $_.status -ne 200 }); Write-Host "live: $($rows.Count - $bad.Count), not live: $($bad.Count)"; $bad | Select-Object -First 10 | ForEach-Object { Write-Host "  missing: $($_.path)" } }
