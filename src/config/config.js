const serverSettings = {
  port: process.env.CONTAINER_PORT
}

const cacheSettings = {
  connection: process.env.REDIS_CONNECTION
}

module.exports = Object.assign({}, { serverSettings, cacheSettings })
