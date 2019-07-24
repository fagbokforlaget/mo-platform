const fs = require('fs')
const chalk = require('chalk')
const packageJson = require('../../package.json')

module.exports = function() {
  console.log(chalk`Mo app CLI tool {bold v${packageJson.version}}`)
  console.log(chalk`Usage: moapp {bold subcommand} <options>

    {bold Subcommands}
    {green info}      prints package name and version info from package.json
    {green login}     Logs user in to mo cloud
    {green search}    Searches package and version history on mo cloud
    {green deploy}    Deploys app to mo cloud
    {green delete}    Deletes app from mo cloud
    {green rollback}  Rollbacks to a specific version on mo cloud

    {bold Advance options}
    --name          app name, it will override name from package.json
    --file          package.json file path [default: ./package.json]
    --configFile    configuration file [default: ~/.mo-config.json]
    --dist          bundled dist directory [default: ./dist]
    --env           depolyment environment [default: prod] prod, dev and stage available

    {bold Examples}
    moapp login
    moapp search mycoolapp
    moapp deploy --env=dev
    moapp rollback 0.0.1 --env=dev
    `)
}
