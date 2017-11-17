const path = require('path')
const appDir = path.dirname(require.main.filename)

const serverSettings = {
  port: process.env.CONTAINER_PORT || 3000
}

const cacheSettings = {
  connection: process.env.REDIS_CONNECTION || 'redis://localhost:6379'
}

const pathSettings = {
  tmpFileDir: path.resolve(appDir, 'tmp_files')
}

const cdnSettings = {
  cloud_name: 'dzviurxyn',
  api_key: '339281513636957',
  api_secret: 'vB0fNehUCPZNKgeNVcQO4xQygl0'
}

module.exports = Object.assign({}, { serverSettings, cacheSettings, pathSettings, cdnSettings })
