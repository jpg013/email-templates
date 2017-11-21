const CronJob       = require('cron').CronJob
const fs            = require('fs')
const { promisify } = require('util')
const winston       = require('winston')

const readDirAsync   = promisify(fs.readdir)
const unlinkAsync = promisify(fs.unlink)
const statAsync = promisify(fs.stat)

function logJob(err, dirPath) {
  if (err) {
    winston.log('info', `Cleanup directory ${dirPath} job completed with error, `, err);
  } else {
    winston.log('info', `Cleanup directory ${dirPath} job completed successfully`);
  }
}

async function cleanupDir(cb, dirPath) {
  const now = new Date()
  const deletionTime = now.setMilliseconds(now.getMilliseconds() - 30000) // Don't delete files created within last 30 seconds
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

function connect(container) {
  const { pathSettings } = container

  if (!pathSettings) {
    throw new Error('missing required dependency')
  }

  return () => {
    const dirpath = pathSettings.tmpFileDir

    return new CronJob(
      '0 */1 * * * *', // Every 1 minute
      cb => cleanupDir(cb, dirpath).then(cb).catch(cb),
      err => logJob(err, dirpath),
      true,
      'America/Los_Angeles'
    )
  }
}

 module.exports = Object.create({connect})
