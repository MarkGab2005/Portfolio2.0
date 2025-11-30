Param()

# Stop any running python processes that appear to be serving via http.server
$found = Get-WmiObject Win32_Process | Where-Object { $_.CommandLine -and $_.CommandLine -match 'http\.server' }
if($found){
  $found | ForEach-Object {
    try{ Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue } catch {}
  }
  Write-Output ("Stopped {0} server process(es)." -f ($found.Count))
} else {
  Write-Output "No http.server process found."
}
