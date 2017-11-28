const CronJob       = require('cron').CronJob
const winston       = require('winston')

function logJob(err) {
  winston.log('info', `Cleanup tmp files job completed`);
}

async function cleanDir(cb, fileHelpers) {
  const dirFiles = await fileHelpers.readTmpDir()

  return await Promise.all(dirFiles.map(f => fileHelpers.deleteTmpFile(f)))
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
