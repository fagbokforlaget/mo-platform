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
    --file          package.json file path [default: ./package.json]
    --configFile    configuration file [default: ~/.mo-config.json]
    --distDir       bundled dist directory [default: ./dist]

    {bold Examples}
    moapp search mycoolapp
    moapp deploy
    moapp rollback 0.0.1
    `)
}
