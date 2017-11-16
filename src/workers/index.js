const scheduleDirCleanupJob = require('./scheduleDirCleanupJob')

async function connect(container) {
  return {
    scheduleDirCleanupJob: await scheduleDirCleanupJob.connect()
  }
}

module.exports = Object.create({connect})
