const fs                  = require('fs')
const { promisify }       = require('util')
const path                = require('path')

const readDirAsync   = promisify(fs.readdir)

async function loadTemplateViews() {
  // Read in files
  const files = await readDirAsync(path.resolve(__dirname, 'views'))

  return files
    .map(file => require(`./views/${file}`))
    .reduce((acc, cur) => {
      acc[cur.name] = cur
      return acc
    }, {})
}

async function connect() {
  return await loadTemplateViews()
}

module.exports = Object.create({connect})
