const fs                  = require('fs')
const { promisify }       = require('util')
const path                = require('path')

const readDirAsync = promisify(fs.readdir)

async function connect(container) {
  const { pathSettings } = container

  if (!pathSettings) {
    throw new Error('missing required path settings dependency')
  }

  function mapTemplateViewSvgs(views, svgs) {
    return views.map(v => {
      if (!v.svgs || !v.svgs.length) {
        return v
      }

      return Object.assign({}, v, {
        svgs: v.svgs.map(cur => svgs.find(s => s.id === cur))
      })
    })
    .reduce((acc, cur) => {
      acc[cur.id] = cur
      return acc
    }, {})
  }

  async function loadTemplateSvgs() {
    // Read in svgs
    const svgs = await readDirAsync(path.resolve(__dirname, 'svg'))
    return svgs.map(s => require(`./svg/${s}`))
  }

  async function loadTemplateViews() {
    // Read in views
    const views = await readDirAsync(path.resolve(__dirname, 'views'))
    return views.map(v => require(`./views/${v}`))
  }

  const templateViews = await loadTemplateViews()
  const templateSvgs = await loadTemplateSvgs()

  return mapTemplateViewSvgs(templateViews, templateSvgs)
}

module.exports = Object.create({connect})
