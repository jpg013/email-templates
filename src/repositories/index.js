const cacheRepository = require('./cacheRepository')
const cdnRepository = require('./cdnRepository')

async function connect(container) {
  return {
    cacheRepository: await cacheRepository.connect(container),
    cdnRepository: await cdnRepository.connect(container)
  }
}

module.exports = Object.create({connect})
