# Shared local-only paths; no global environment or machine configuration changes.
$ErrorActionPreference = 'Stop'
$TestFlowApp = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$TestFlowLocal = Join-Path $TestFlowApp '.testflow'
$TestFlowTools = Join-Path $TestFlowLocal 'tools'
$TestFlowCredentials = Join-Path $TestFlowLocal 'tidecloak-bootstrap.env'
$TestFlowContainer = 'haiquayxe-testflow-tidecloak'
$TestFlowImage = 'tideorg/tidecloak-dev:latest'
$TestFlowOrigin = 'http://127.0.0.1:3030'
$TestFlowAuthOrigin = 'http://127.0.0.1:8080'

function Find-TestFlowDocker {
    $installed = Get-Command docker.exe -ErrorAction SilentlyContinue
    if ($installed) { return $installed.Source }
    foreach ($candidate in @('D:\Applications\DockerDesktop\resources\bin\docker.exe', "$env:ProgramFiles\Docker\Docker\resources\bin\docker.exe")) {
        if (Test-Path -LiteralPath $candidate) { return $candidate }
    }
    throw 'Docker CLI was not found. Install/open Docker Desktop first.'
}

function Find-TestFlowBash {
    $git = Get-Command git.exe -ErrorAction SilentlyContinue
    $candidates = @('D:\Git\bin\bash.exe', "$env:ProgramFiles\Git\bin\bash.exe")
    if ($git) { $candidates += Join-Path (Split-Path (Split-Path $git.Source -Parent) -Parent) 'bin\bash.exe' }
    foreach ($candidate in $candidates) {
        if (Test-Path -LiteralPath $candidate) { return $candidate }
    }
    throw 'Git for Windows Bash was not found. This helper does not use the WindowsApps WSL bash shim.'
}

function Assert-TestFlowEngine([string]$Docker) {
    if ($env:DOCKER_HOST -and $env:DOCKER_HOST -notmatch '^npipe:////\./pipe/') {
        throw 'DOCKER_HOST points outside a local Windows Docker pipe. This helper only manages local Docker Desktop.'
    }
    $endpoint = & $Docker context inspect --format '{{.Endpoints.docker.Host}}' 2>$null
    if ($LASTEXITCODE -ne 0 -or "$endpoint".Trim() -notmatch '^npipe:////\./pipe/') {
        throw 'The selected Docker context is not a local Windows named pipe. Choose the local Docker Desktop context first.'
    }
    try { $engine = & $Docker info --format '{{.OSType}}' 2>$null }
    catch { throw 'Docker Linux engine is not ready. Finish the Windows restart, open Docker Desktop, and wait for Engine running. Nothing was started or downloaded.' }
    if ($LASTEXITCODE -ne 0 -or "$engine".Trim() -ne 'linux') {
        throw 'Docker Linux engine is not ready. Finish the Windows restart, open Docker Desktop, and wait for Engine running. Nothing was started or downloaded.'
    }
}

function Get-TestFlowBootstrap {
    if (!(Test-Path -LiteralPath $TestFlowCredentials)) {
        throw 'Local bootstrap credentials are missing. Run scripts/start-tidecloak.ps1 first. Do not regenerate credentials for an existing data volume.'
    }
    $values = @{}
    foreach ($line in [IO.File]::ReadAllLines($TestFlowCredentials)) {
        if ($line -match '^([A-Z_]+)=(.*)$') { $values[$matches[1]] = $matches[2] }
    }
    if (!$values['KC_BOOTSTRAP_ADMIN_USERNAME'] -or !$values['KC_BOOTSTRAP_ADMIN_PASSWORD']) {
        throw 'The ignored bootstrap credential file is incomplete. Restore the original file; do not reset the data volume.'
    }
    return $values
}
