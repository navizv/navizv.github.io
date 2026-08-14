Param (
    [Parameter(Mandatory=$True)][String]$SourcePath
)


Get-ChildItem $SourcePath\*  -recurse -Include *.json,*.html,*.xml,*.js,*.txt,*.css,*.csv | ForEach-Object {
$content = $_ | Get-Content

Set-Content -PassThru $_.Fullname $content -Encoding UTF8 -Force}