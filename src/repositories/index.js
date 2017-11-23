const cacheRepository       = require('./cacheRepository')
const fileConverterRepository = require('./fileConverterRepository')

async function connect(container) {
  return {
    cacheRepository: await cacheRepository.connect(container),
    fileConverterRepository: await fileConverterRepository.connect(container)
  }
}

module.exports = Object.create({ connect })
