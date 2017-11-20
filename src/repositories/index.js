const cacheRepository       = require('./cacheRepository')
const cdnRepository         = require('./cdnRepository')
const fileConverterRepository = require('./fileConverterRepository')

async function connect(container) {
  return {
    cacheRepository: await cacheRepository.connect(container),
    cdnRepository: await cdnRepository.connect(container),
    fileConverterRepository: await fileConverterRepository.connect(container)
  }
}

module.exports = Object.create({connect})
