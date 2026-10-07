# Build the blog and publish dist/ to the gh-pages branch (GitHub Pages).
# Usage (from repo root):  pwsh -File scripts/deploy-gh-pages.ps1
# Site: https://ninestonelee.github.io/chatsapiensblog/
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

node node_modules/typescript/bin/tsc --noEmit
node node_modules/vite/bin/vite.js build --base=/chatsapiensblog/

# SPA fallback + disable Jekyll processing
Copy-Item dist/index.html dist/404.html -Force
New-Item -ItemType File -Force dist/.nojekyll | Out-Null

$remote = git remote get-url origin
$rev = git rev-parse --short HEAD
Push-Location dist
try {
  if (Test-Path .git) { Remove-Item .git -Recurse -Force }
  git init -q -b gh-pages
  git add -A
  git -c user.name="ninestonelee" -c user.email="ninestone.lee@gmail.com" commit -q -m "deploy: $rev"
  git push -f $remote gh-pages
} finally {
  if (Test-Path .git) { Remove-Item .git -Recurse -Force }
  Pop-Location
}
Write-Output "Deployed $rev -> https://ninestonelee.github.io/chatsapiensblog/"
