const path = require('path')
const appDir = path.dirname(require.main.filename)

const serverSettings = {
  port: process.env.CONTAINER_PORT || 3030
}

const redisSettings = {
  connection: process.env.REDIS_CONNECTION || 'redis://localhost:6379'
}

const awsSettings = {
  base_url: process.env.AWS_S3_URL || 'https://s3.us-east-2.amazonaws.com',
  bucket_name: process.env.AWS_S3_BUCKET || 'dunamitest',
  id: process.env.AWS_ACCESS_KEY_ID,
  key: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-2'
}

const pathSettings = {
  tmpFileDir: path.resolve(appDir, 'public', 'tmp'),
  fileDir: path.resolve(appDir, 'public', 'static'),
  staticFileDir: path.resolve(appDir, 'public', 'static'),
  templatesDir: path.resolve(appDir, 'lib', 'services', 'templateEngine', 'templates'),
  templateAttachmentsDir: path.resolve(appDir, 'lib', 'services', 'templateEngine', 'attachments')
}

const cloudConvertSettings = {
  api_key: process.env.CLOUD_CONVERT_API_KEY
}

module.exports = Object.assign({}, {
  serverSettings,
  redisSettings,
  pathSettings,
  cloudConvertSettings,
  awsSettings
})
