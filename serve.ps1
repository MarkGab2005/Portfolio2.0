Param(
    [int]$Port = 8000
)
$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $root

# Start python HTTP server in background (no visible console)
try{
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = 'python'
  $psi.Arguments = "-m http.server $Port"
  $psi.WorkingDirectory = $root
  $psi.CreateNoWindow = $true
  $psi.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Hidden
  [System.Diagnostics.Process]::Start($psi) | Out-Null
  Start-Sleep -Milliseconds 400
  try{
    Start-Process "http://localhost:$Port"
    Write-Output "Server started on http://localhost:$Port"
  } catch {
    Write-Output "Server started on port $Port, but failed to open browser. Visit http://localhost:$Port"
  }
} catch {
  Write-Error "Failed to start server: $_"
}
