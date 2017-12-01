const {
  serverSettings,
  pathSettings,
  cloudConvertSettings,
  awsSettings
}                   = require('./config')

const di            = require('./di')
const cdn           = require('./cdn')
const models        = require('../lib/models')
const fileHelpers   = require('../bin/fileHelpers')

const bindArgs = {
  serverSettings,
  pathSettings,
  fileHelpers,
  awsSettings,
  cdn,
  models
}

const init = di.initDI.bind(null, bindArgs)

module.exports = Object.create({ init })
