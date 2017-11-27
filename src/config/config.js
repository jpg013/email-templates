const path = require('path')
const appDir = path.dirname(require.main.filename)

const serverSettings = {
  port: process.env.CONTAINER_PORT || 3000
}

const redisSettings = {
  connection: process.env.REDIS_CONNECTION || 'redis://localhost:6379'
}

const awsSettings = {
  base_url: process.env.AWS_S3_URL || 'https://s3.us-east-2.amazonaws.com',
  bucket_name: process.env.AWS_S3_BUCKET || 'dunamitest',
  id: process.env.AWS_ACCESS_KEY_ID,
  key: process.env.AWS_SECRET_ACCESS_KEY
}

const pathSettings = {
  tmpFileDir: path.resolve(appDir, 'public', 'tmp'),
  fileDir: path.resolve(appDir, 'public', 'static'),
  staticImagesDir: path.resolve(appDir, 'public', 'static'),
  templatesDir: path.resolve(appDir, 'lib', 'services', 'templateEngine', 'templates'),
  templateChartsDir: path.resolve(appDir, 'lib', 'services', 'templateEngine', 'charts')
}

const cloudConvertSettings = {
  api_key: 'ilKNOzJz2nABUbch3MYYE0JKZVCR-_id-2rpSrXWHac3wNcV2crq1gf-pRYpdrd2iVob15rFTGtJkSpUIdW_ug'
}

module.exports = Object.assign({}, {
  serverSettings,
  redisSettings,
  pathSettings,
  cloudConvertSettings,
  awsSettings
})
