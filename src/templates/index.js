const fs                  = require('fs')
const { promisify }       = require('util')
const path                = require('path')

const readDirAsync   = promisify(fs.readdir)

const walkTemplateTree = (template, map) => {
  if (!template) {
    throw new Error('missing template')
  }

  if (!template.children.length) {
    return template
  }

  template.children = template.children.map(cur => walkTemplateTree(map[cur], map))
  return template
}

async function connect() {
  // Read in files
  const files = await readDirAsync(path.resolve(__dirname, 'views'))
  const templates = files
    .map(file => require(`./views/${file}`))
    .reduce((acc, cur) => {
      acc[cur.name] = cur
      return acc
    }, {})

  Object.keys(templates).forEach(cur => {
    walkTemplateTree(templates[cur], templates)
  })

  return templates

}

module.exports = Object.create({connect})
