const CronJob       = require('cron').CronJob
const winston       = require('winston')

function logJob(err) {
  if (err) {
    winston.log('info', `Cleanup tmp files job completed with error, `, err);
  } else {
    winston.log('info', `Cleanup tmp files job completed successfully`);
  }
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
    err => logJob(err),
    true,
    'America/Los_Angeles'
  )
}

 module.exports = cleanupTmpFiles
