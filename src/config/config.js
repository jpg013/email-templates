const path = require('path')
const appDir = path.dirname(require.main.filename)

const serverSettings = {
  port: process.env.CONTAINER_PORT || 3000
}

const cacheSettings = {
  connection: process.env.REDIS_CONNECTION || 'redis://localhost:6379'
}

const pathSettings = {
  tmpFileDir: path.resolve(appDir, 'public', 'tmp'),
  fileDir: path.resolve(appDir, 'public', 'static'),
  staticImagesDir: path.resolve(appDir, 'public', 'static'),
  templatesDir: path.resolve(appDir, 'lib', 'services', 'templateEngine', 'templates'),
  templateChartsDir: path.resolve(appDir, 'lib', 'services', 'templateEngine', 'charts')
}

const cdnSettings = {
  cloud_name: 'dzviurxyn',
  api_key: '339281513636957',
  api_secret: 'vB0fNehUCPZNKgeNVcQO4xQygl0'
}

const fileConverterSettings = {
  api_key: 'ilKNOzJz2nABUbch3MYYE0JKZVCR-_id-2rpSrXWHac3wNcV2crq1gf-pRYpdrd2iVob15rFTGtJkSpUIdW_ug'
}

module.exports = Object.assign({}, {
  serverSettings,
  cacheSettings,
  pathSettings,
  cdnSettings,
  fileConverterSettings
})
