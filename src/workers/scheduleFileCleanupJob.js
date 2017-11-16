const CronJob   = require('cron').CronJob
const path      = require('path')

async function connect(container) {
  return async (pathDir) => {
    console.log(pathDir)
    console.log(path.dirname(require.main.filename))
  }
}

 module.exports = Object.create({connect})
