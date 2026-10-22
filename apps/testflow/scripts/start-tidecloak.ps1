# Starts only this app's local development TideCloak container. Does not create a realm.
[CmdletBinding()]
param([switch]$CheckOnly)
. (Join-Path $PSScriptRoot 'tide-common.ps1')
$docker = Find-TestFlowDocker
Assert-TestFlowEngine $docker
if ($CheckOnly) { Write-Host 'Docker Linux engine is ready. No container or file was created.'; return }
$dataPath = Join-Path $TestFlowLocal 'tidecloak-data'
$labelKey = 'org.haiquayxe.testflow.workspace'
$existing = & $docker container ls --all --filter "name=^/$TestFlowContainer$" --format '{{.Names}}'
if ($LASTEXITCODE -ne 0) { throw 'Could not list Docker containers.' }

function Get-ContainerField([string]$Format) {
    $value = & $docker inspect --format $Format $TestFlowContainer
    if ($LASTEXITCODE -ne 0) { throw 'Could not inspect the existing TideCloak container.' }
    return $value
}
function Normalize-MountPath([string]$Value) {
    $normalized = $Value.Replace('\', '/').TrimEnd('/').ToLowerInvariant()
    # Docker Desktop may expose the host bind as a Linux-translated path.
    if ($normalized -match '^/(?:run/desktop/mnt/host|host_mnt)/([a-z])/(.*)$') {
        $normalized = $matches[1] + ':/' + $matches[2]
    }
    return $normalized
}

if ($existing) {
    $labels = (Get-ContainerField '{{json .Config.Labels}}') | ConvertFrom-Json
    $image = Get-ContainerField '{{.Config.Image}}'
    $mounts = @((Get-ContainerField '{{json .Mounts}}') | ConvertFrom-Json)
    $ports = (Get-ContainerField '{{json .HostConfig.PortBindings}}') | ConvertFrom-Json
    $dataMount = @($mounts | Where-Object { $_.Destination -eq '/opt/keycloak/data/h2' -and $_.Type -eq 'bind' })
    $binding = @($ports.'8080/tcp')
    if ($labels.$labelKey -ne $TestFlowApp -or $image -ne $TestFlowImage -or
        $dataMount.Count -ne 1 -or (Normalize-MountPath $dataMount[0].Source) -ne (Normalize-MountPath $dataPath) -or
        $binding.Count -ne 1 -or $binding[0].HostIp -ne '127.0.0.1' -or $binding[0].HostPort -ne '8080' -or
        @($ports.PSObject.Properties).Count -ne 1) {
        throw 'A container with this name has different ownership, storage, image or ports. It was left unchanged. Inspect it before choosing a new name or migrating data.'
    }
    $null = Get-TestFlowBootstrap
    if ((Get-ContainerField '{{.State.Running}}') -ne 'true') {
        $null = & $docker start $TestFlowContainer
        if ($LASTEXITCODE -ne 0) { throw 'Could not start the existing container. It was not removed or recreated.' }
    }
    Write-Host 'Reusing the existing TestFlow container and data.'
} else {
    if ((Test-Path -LiteralPath $dataPath) -and @(Get-ChildItem -LiteralPath $dataPath -Force).Count -gt 0 -and !(Test-Path -LiteralPath $TestFlowCredentials)) {
        throw 'Persistent data exists without its bootstrap credential file. Restore the original credentials before starting; nothing was overwritten.'
    }
    $null = New-Item -ItemType Directory -Path $dataPath -Force
    if (!(Test-Path -LiteralPath $TestFlowCredentials)) {
        $random = [Security.Cryptography.RandomNumberGenerator]::Create()
        try {
            $bytes = New-Object byte[] 32
            $random.GetBytes($bytes)
            $password = ([BitConverter]::ToString($bytes)).Replace('-', '').ToLowerInvariant()
            $random.GetBytes($bytes)
            $username = 'bootstrap-' + ([BitConverter]::ToString($bytes[0..5])).Replace('-', '').ToLowerInvariant()
            [IO.File]::WriteAllText($TestFlowCredentials, "KC_BOOTSTRAP_ADMIN_USERNAME=$username`nKC_BOOTSTRAP_ADMIN_PASSWORD=$password`n", [Text.UTF8Encoding]::new($false))
        } finally { $random.Dispose(); $password = $null; $bytes = $null }
    }
    $null = Get-TestFlowBootstrap
    # env-file avoids putting credentials on the Docker command line or printing them.
    $runArgs = @('run', '--detach', '--name', $TestFlowContainer, '--label', "$labelKey=$TestFlowApp",
        '--publish', '127.0.0.1:8080:8080', '--mount', "type=bind,source=$dataPath,target=/opt/keycloak/data/h2",
        '--env-file', $TestFlowCredentials, $TestFlowImage)
    $null = & $docker @runArgs
    if ($LASTEXITCODE -ne 0) { throw 'Docker could not start TideCloak. Credentials and data were preserved; no container was deleted.' }
    Write-Host 'Started TideCloak on 127.0.0.1:8080; persistent data and credentials are in ignored .testflow storage.'
}
$digest = & $docker image inspect --format '{{json .RepoDigests}}' $TestFlowImage
if ($LASTEXITCODE -eq 0) { [IO.File]::WriteAllText((Join-Path $TestFlowLocal 'tidecloak-image-digests.json'), "$digest`n") }
Write-Host 'Wait for http://127.0.0.1:8080 to respond, then run scripts/initialize-tidecloak.ps1 with your real enrollment email.'
Write-Host 'This helper does not enroll identities, approve governance requests, or enable automatic Windows startup.'
