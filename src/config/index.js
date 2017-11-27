const {
  serverSettings,
  redisSettings,
  pathSettings,
  cloudConvertSettings,
  awsSettings
}                   = require('./config')

const di            = require('./di')
const cache         = require('./cache')
const cdn           = require('./cdn')
const fileConverter = require('./fileConverter')
const models        = require('../lib/models')
const fileHelpers   = require('../bin/fileHelpers')

const bindArgs = {
  serverSettings,
  redisSettings,
  pathSettings,
  fileHelpers,
  cache,
  cloudConvertSettings,
  fileConverter,
  awsSettings,
  cdn,
  models
}

const init = di.initDI.bind(null, bindArgs)

module.exports = Object.create({ init })
