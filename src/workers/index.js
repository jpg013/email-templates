const runCleanupTmpFilesJob = require('./runCleanupTmpFilesJob')

async function connect(container) {
  return {
    runCleanupTmpFilesJob: await runCleanupTmpFilesJob.connect(container)
  }
}

module.exports = Object.create({connect})
