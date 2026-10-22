# Runs the official generator's initializer unchanged, for a fresh local TestFlow realm.
[CmdletBinding()]
param(
    [string]$SubscriptionEmail,
    [ValidatePattern('^[a-z][a-z0-9-]{0,39}$')][string]$RealmName = 'testflow',
    [switch]$CheckOnly
)
. (Join-Path $PSScriptRoot 'tide-common.ps1')
$bash = Find-TestFlowBash
$jqExe = Join-Path $TestFlowTools 'jq.exe'
if (!(Test-Path -LiteralPath $jqExe) -or !(Test-Path -LiteralPath (Join-Path $TestFlowTools 'jq'))) {
    throw 'Run scripts/prepare-tide-tools.ps1 first; the official initializer requires jq.'
}
if ((Get-FileHash -LiteralPath $jqExe -Algorithm SHA256).Hash.ToLowerInvariant() -ne 'a6fc67fedaf9128a3309a1e2ebb8b986aeccf70122ee46d2cb4849e423f0c627') {
    throw 'Local jq checksum does not match the pinned official release.'
}
$oldPath = $env:PATH
try {
    $env:PATH = "$TestFlowTools;$oldPath"
    & $bash --noprofile --norc -c 'for tool in curl jq sed mktemp; do command -v "$tool" >/dev/null || exit 1; done; jq --version'
    if ($LASTEXITCODE -ne 0) { throw 'Git Bash dependencies are incomplete.' }
} finally { $env:PATH = $oldPath }
if ($CheckOnly) { Write-Host 'Initializer dependencies passed. No Docker call, realm change or identity enrollment was performed.'; return }

if ([string]::IsNullOrWhiteSpace($SubscriptionEmail)) { throw 'Pass -SubscriptionEmail with your real team member email for the official Tide setup.' }
try { $parsedEmail = [Net.Mail.MailAddress]::new($SubscriptionEmail) } catch { throw 'SubscriptionEmail must be a valid email address.' }
if ($parsedEmail.Address -ne $SubscriptionEmail) { throw 'Use only the email address, without a display name.' }
$docker = Find-TestFlowDocker
Assert-TestFlowEngine $docker
# The idempotent start helper verifies ownership/mount/loopback binding before we send credentials.
& (Join-Path $PSScriptRoot 'start-tidecloak.ps1')
try { $null = Invoke-WebRequest -UseBasicParsing -Uri "$TestFlowAuthOrigin/realms/master/.well-known/openid-configuration" -TimeoutSec 10 }
catch { throw 'TideCloak is not ready at 127.0.0.1:8080 yet. Wait for startup and rerun this initializer.' }
$adapterPath = Join-Path $TestFlowApp 'tidecloak.json'
if ((Test-Path -LiteralPath $adapterPath) -and ([IO.File]::ReadAllText($adapterPath).Trim() -notin @('', '{}'))) {
    throw 'tidecloak.json already contains configuration. This helper will not overwrite it or reinitialize a realm.'
}
$bootstrap = Get-TestFlowBootstrap
$settings = @{
    PATH = "$TestFlowTools;$oldPath"
    TIDECLOAK_LOCAL_URL = $TestFlowAuthOrigin
    CLIENT_APP_URL = $TestFlowOrigin
    NEW_REALM_NAME = $RealmName
    CLIENT_NAME = 'testflow'
    KC_USER = $bootstrap['KC_BOOTSTRAP_ADMIN_USERNAME']
    KC_PASSWORD = $bootstrap['KC_BOOTSTRAP_ADMIN_PASSWORD']
    SUBSCRIPTION_EMAIL = $SubscriptionEmail
    ALLOW_EXISTING_REALM = ''
    ADAPTER_OUTPUT_PATH = $adapterPath.Replace('\', '/')
    REALM_JSON_PATH = (Join-Path $TestFlowApp 'init/realm.json').Replace('\', '/')
}
$saved = @{}
foreach ($key in $settings.Keys) { $saved[$key] = [Environment]::GetEnvironmentVariable($key, 'Process') }
Push-Location -LiteralPath $TestFlowApp
try {
    foreach ($key in $settings.Keys) { [Environment]::SetEnvironmentVariable($key, $settings[$key], 'Process') }
    Write-Host "Creating fresh realm '$RealmName' for $TestFlowOrigin with the official Tide initializer."
    Write-Host 'Complete the one-time enrollment link when printed. Keep that link private; do not paste terminal output into the public repository.'
    Write-Host 'The initializer stops if this realm already exists. Do not enable ALLOW_EXISTING_REALM to bypass that check.'
    & $bash --noprofile --norc 'init/tcinit.sh'
    if ($LASTEXITCODE -ne 0) { throw 'Official initialization did not finish. Preserve its output locally and inspect the realm with the Tide team before retrying; no automatic deletion was performed.' }
    Write-Host "Next: restart TestFlow on $TestFlowOrigin and sign in. Add the two capabilities and additional independent stewards in the real Tide console."
} finally {
    foreach ($key in $saved.Keys) { [Environment]::SetEnvironmentVariable($key, $saved[$key], 'Process') }
    $bootstrap = $null
    $settings = $null
    Pop-Location
}
