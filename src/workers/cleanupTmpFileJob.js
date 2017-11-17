const CronJob       = require('cron').CronJob
const fs            = require('fs')
const { promisify } = require('util')
const winston       = require('winston')

const readDirAsync   = promisify(fs.readdir)
const unlinkAsync = promisify(fs.unlink)
const statAsync = promisify(fs.stat)


function logJob(err, {dirPath}) {
  if (err) {
    winston.log('info', `Cleanup directory ${dirPath} job completed with error, `, err);
  } else {
    winston.log('info', `Cleanup directory ${dirPath} job completed successfully`);
  }
}

async function cleanupDir(cb, {dirPath, msOffset}) {
  const now = new Date()
  const deletionTime = now.setMilliseconds(now.getMilliseconds() - 9) // Don't delete files created within last 9 seconds
  const files = await readDirAsync(dirPath)

  const fileStats = await Promise.all(files.map(async cur => {
    const fileStats = await statAsync(`${dirPath}/${cur}`)

    return Object.assign({}, {
      createdTime: fileStats.birthtime.getTime(),
      fileName: cur
    })
  }))

  const filesNeedDeleted = fileStats.filter(cur => deletionTime > cur.createdTime)

  await Promise.all(filesNeedDeleted.map(cur => unlinkAsync(`${dirPath}/${cur.fileName}`)))
}

async function connect(container) {
  return (dirPath, delay=10) => {
    const startTime = new Date();
    startTime.setSeconds(startTime.getSeconds() + delay);

    const bindArgs = { dirPath }

    return new CronJob(
      startTime,
      cb => {
        cleanupDir(cb, bindArgs)
          .then(cb)
          .catch(cb)
      },
      err => logJob(err, bindArgs),
      true,
      'America/Los_Angeles'
    )
  }
}

 module.exports = Object.create({connect})
