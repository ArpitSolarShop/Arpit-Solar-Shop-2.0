# Fix encoding issues in solar pages
$ErrorActionPreference = "Stop"

# Shakti Solar - Fix Hindi text
Write-Host "Fixing Shakti Solar..."
$shaktiPath = "src\app\(website)\shakti-solar\page.tsx"
(Get-Content $shaktiPath -Raw -Encoding UTF8).Replace("à¤®à¥à¤«à¥à¤¤ à¤¬à¤¿à¤œà¤²à¥€ à¤¯à¥‹à¤œà¤¨à¤¾", "मुफ्त बिजली योजना") | Set-Content $shaktiPath -NoNewline -Encoding UTF8

# Tata Solar - Fix Hindi text
Write-Host "Fixing Tata Solar..."
$tataPath = "src\app\(website)\tata-solar\page.tsx"
(Get-Content $tataPath -Raw -Encoding UTF8).Replace("à¤®à¥à¤«à¥à¤¤ à¤¬à¤¿à¤œà¤²à¥€ à¤¯à¥‹à¤œà¤¨à¤¾", "मुफ्त बिजली योजना") | Set-Content $tataPath -NoNewline -Encoding UTF8

# Integrated - Fix dashes
Write-Host "Fixing Integrated..."
$integratedPath = "src\app\(website)\integrated\page.tsx"
(Get-Content $integratedPath -Raw -Encoding UTF8).Replace("â€"", "—") | Set-Content $integratedPath -NoNewline -Encoding UTF8

Write-Host "All fixes applied!"
