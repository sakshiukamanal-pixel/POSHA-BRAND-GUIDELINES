# Optional local preview server — serves the portal at http://localhost:8080
# exactly as it will behave once hosted. (Opening index.html directly also works.)
# Handles requests in parallel and supports byte ranges, so videos stream without
# blocking the rest of the site.
param([int]$Port = 0)

$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)

# Port: -Port argument > PORT in .env > 8080
if (-not $Port) {
  $envFile = Join-Path $root '.env'
  if (Test-Path $envFile) {
    $line = Get-Content $envFile | Where-Object { $_ -match '^\s*PORT\s*=\s*(\d+)' } | Select-Object -First 1
    if ($line -match '(\d+)') { $Port = [int]$Matches[1] }
  }
  if (-not $Port) { $Port = 8080 }
}
$types = @{
  '.html' = 'text/html; charset=utf-8'; '.js' = 'text/javascript; charset=utf-8'; '.css' = 'text/css; charset=utf-8'
  '.json' = 'application/json'; '.svg' = 'image/svg+xml'; '.png' = 'image/png'; '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'
  '.webp' = 'image/webp'; '.gif' = 'image/gif'; '.avif' = 'image/avif'; '.mp4' = 'video/mp4'; '.webm' = 'video/webm'
  '.mov' = 'video/quicktime'; '.m4v' = 'video/mp4'; '.woff' = 'font/woff'; '.woff2' = 'font/woff2'; '.ttf' = 'font/ttf'; '.otf' = 'font/otf'
  '.zip' = 'application/zip'; '.pdf' = 'application/pdf'
}

# Runs once per request, on a pool thread
$handler = {
  param($ctx, $root, $types)
  $req = $ctx.Request; $res = $ctx.Response
  try {
    $path = [Uri]::UnescapeDataString($req.Url.AbsolutePath).TrimStart('/')
    if ($path -eq '') { $path = 'index.html' }
    # never serve hidden files such as .env or .gitignore
    if ($path -split '/' | Where-Object { $_.StartsWith('.') }) { $res.StatusCode = 404; return }
    $file = [IO.Path]::GetFullPath((Join-Path $root $path))
    if (-not ($file.StartsWith($root) -and [IO.File]::Exists($file))) { $res.StatusCode = 404; return }

    $len = (New-Object IO.FileInfo $file).Length
    $ext = [IO.Path]::GetExtension($file).ToLower()
    $res.ContentType = if ($types[$ext]) { $types[$ext] } else { 'application/octet-stream' }
    $res.Headers.Add('Cache-Control', 'no-cache')
    $res.Headers.Add('Accept-Ranges', 'bytes')

    $start = [long]0; $end = [long]($len - 1)
    $range = $req.Headers['Range']
    if ($range -and $range -match '^bytes=(\d*)-(\d*)') {
      if ($Matches[1] -ne '') { $start = [long]$Matches[1]; if ($Matches[2] -ne '') { $end = [Math]::Min([long]$Matches[2], $len - 1) } }
      elseif ($Matches[2] -ne '') { $start = [Math]::Max([long]0, $len - [long]$Matches[2]) }   # bytes=-N (last N bytes)
      if ($start -gt $end) { $res.StatusCode = 416; $res.Headers.Add('Content-Range', "bytes */$len"); return }
      $res.StatusCode = 206
      $res.Headers.Add('Content-Range', "bytes $start-$end/$len")
    }
    $count = $end - $start + 1
    $res.ContentLength64 = $count
    if ($req.HttpMethod -eq 'HEAD') { return }

    $fs = [IO.File]::Open($file, 'Open', 'Read', 'ReadWrite')
    try {
      [void]$fs.Seek($start, 'Begin')
      $buf = New-Object byte[] 65536
      $left = $count
      while ($left -gt 0) {
        $n = $fs.Read($buf, 0, [int][Math]::Min($buf.Length, $left))
        if ($n -le 0) { break }
        $res.OutputStream.Write($buf, 0, $n)
        $left -= $n
      }
    } finally { $fs.Close() }
  } catch {
    # client went away mid-transfer (normal when a video is skipped or paused) — ignore
  } finally {
    try { $res.Close() } catch {}
  }
}

$pool = [runspacefactory]::CreateRunspacePool(1, 12)
$pool.Open()
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Posha portal running at http://localhost:$Port/  (Ctrl+C to stop)"

$jobs = New-Object System.Collections.ArrayList
try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $ps = [powershell]::Create()
    $ps.RunspacePool = $pool
    [void]$ps.AddScript($handler).AddArgument($ctx).AddArgument($root).AddArgument($types)
    [void]$jobs.Add(@{ ps = $ps; handle = $ps.BeginInvoke() })
    # tidy up finished requests
    for ($i = $jobs.Count - 1; $i -ge 0; $i--) {
      if ($jobs[$i].handle.IsCompleted) { try { $jobs[$i].ps.EndInvoke($jobs[$i].handle) } catch {}; $jobs[$i].ps.Dispose(); $jobs.RemoveAt($i) }
    }
  }
} finally {
  $listener.Stop(); $pool.Close()
}
