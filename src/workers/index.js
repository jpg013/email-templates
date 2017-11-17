const cleanupTmpFileJob = require('./cleanupTmpFileJob')

async function connect(container) {
  return {
    cleanupTmpFileJob: await cleanupTmpFileJob.connect()
  }
}

module.exports = Object.create({connect})
