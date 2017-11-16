const scheduleFileCleanupJob = require('./scheduleFileCleanupJob')
const scheduleDirCleanupJob = require('./scheduleDirCleanupJob')

async function connect(container) {
  return {
    scheduleFileCleanupJob: await scheduleFileCleanupJob.connect(),
    scheduleDirCleanupJob: await scheduleDirCleanupJob.connect()
  }
}

module.exports = Object.create({connect})
