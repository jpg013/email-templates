const {
  serverSettings,
  cacheSettings,
  pathSettings,
  cdnSettings
}                 = require('./config')
const di          = require('./di')
const cache       = require('./cache')
const cdn         = require('./cdn')

const bindArgs = {
  serverSettings,
  cacheSettings,
  pathSettings,
  cache,
  cdnSettings,
  cdn
}

const init = di.initDI.bind(null, bindArgs)

module.exports = Object.create({ init })
