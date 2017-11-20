const startCleanupTmpFilesJob = require('./startCleanupTmpFilesJob')

async function connect(container) {
  return {
    startCleanupTmpFilesJob: await startCleanupTmpFilesJob.connect(container)
  }
}

module.exports = Object.create({connect})
