const runCleanupTmpFilesJob = require('./runCleanupTmpFilesJob')
const cacheStaticFiles      = require('./cacheStaticFiles')

async function connect(container) {
  return {
    runCleanupTmpFilesJob: await runCleanupTmpFilesJob.connect(container),
    cacheStaticFiles: await cacheStaticFiles.connect(container)
  }
}

module.exports = Object.create({connect})
