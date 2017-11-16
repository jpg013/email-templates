const serverSettings = {
  port: process.env.CONTAINER_PORT || 3000
}

const cacheSettings = {
  connection: process.env.REDIS_CONNECTION || 'redis://localhost:6379'
}

module.exports = Object.assign({}, { serverSettings, cacheSettings })
