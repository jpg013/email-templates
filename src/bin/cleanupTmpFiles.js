const CronJob         = require('cron').CronJob
const winston         = require('winston')

const FILE_EXPIRATION = 300000 // 5 minutes

function logJob(err) {
  winston.log('info', `Cleanup tmp files job completed`);
}

async function cleanDir(cb, fileHelpers) {
  const now = new Date()
  const deletionTime = now.setMilliseconds(now.getMilliseconds() - FILE_EXPIRATION)
  const fileStats = await fileHelpers.getTmpFileStats()
  const filesNeedDeleted = fileStats.filter(cur => cur.createdTime < deletionTime)

  return await Promise.all(filesNeedDeleted.map(cur => fileHelpers.deleteTmpFile(cur.fileId)))
}

function cleanupTmpFiles(fileHelpers) {
  const startTime = new Date()

  startTime.setSeconds(startTime.getSeconds() + 1);

  return new CronJob(
    startTime,
    cb => cleanDir(cb, fileHelpers).then(cb).catch(cb),
    logJob,
    true,
    'America/Los_Angeles'
  )
}

 module.exports = cleanupTmpFiles
