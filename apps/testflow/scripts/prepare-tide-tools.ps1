# Downloads a portable jq into ignored app storage; no installer or global PATH change.
[CmdletBinding()]
param()
. (Join-Path $PSScriptRoot 'tide-common.ps1')
$null = Find-TestFlowBash
$jqExe = Join-Path $TestFlowTools 'jq.exe'
$expected = 'a6fc67fedaf9128a3309a1e2ebb8b986aeccf70122ee46d2cb4849e423f0c627'
# Official jq 1.8.2 Windows AMD64 release and asset SHA-256:
# https://github.com/jqlang/jq/releases/expanded_assets/jq-1.8.2
$url = 'https://github.com/jqlang/jq/releases/download/jq-1.8.2/jq-windows-amd64.exe'
if ($env:PROCESSOR_ARCHITECTURE -ne 'AMD64') { throw 'This portable helper is for Windows AMD64.' }
if (!(Test-Path -LiteralPath $TestFlowTools)) { $null = New-Item -ItemType Directory -Path $TestFlowTools }
if (!(Test-Path -LiteralPath $jqExe)) {
    $temporary = Join-Path $TestFlowTools 'jq.download'
    $curl = (Get-Command curl.exe -ErrorAction Stop).Source
    & $curl --fail --location --silent --show-error --connect-timeout 15 --max-time 120 --output $temporary $url
    if ($LASTEXITCODE -ne 0) { throw 'Could not download official jq. No executable was installed.' }
    if ((Get-FileHash -LiteralPath $temporary -Algorithm SHA256).Hash.ToLowerInvariant() -ne $expected) {
        throw 'jq checksum did not match the official release. The download will not be executed.'
    }
    Move-Item -LiteralPath $temporary -Destination $jqExe
}
if ((Get-FileHash -LiteralPath $jqExe -Algorithm SHA256).Hash.ToLowerInvariant() -ne $expected) {
    throw 'Existing local jq checksum differs from the pinned official release. Refusing to execute it.'
}
# Native Windows jq needs --binary under Git Bash to avoid CR characters in tokens/IDs.
# https://jqlang.org/manual/#invoking-jq
$wrapper = @'
#!/usr/bin/env bash
exec "$(dirname -- "$0")/jq.exe" --binary "$@"
'@
[IO.File]::WriteAllText((Join-Path $TestFlowTools 'jq'), $wrapper.Replace("`r`n", "`n") + "`n", [Text.UTF8Encoding]::new($false))
Write-Host 'Portable jq 1.8.2 is ready and its official SHA-256 matches. Global PATH is unchanged.'
