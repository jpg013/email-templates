const file = require('../../libs/file')
const path = require('path')

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
  const svgs = await file.readDirAsync(path.resolve(__dirname, 'svg'))
  return svgs.map(s => require(`./svg/${s}`))
}

async function loadTemplateViews() {
  // Read in views
  const views = await file.readDirAsync(path.resolve(__dirname, 'views'))
  return views.map(v => require(`./views/${v}`))
}

module.exports = async () => {
  const templateViews = await loadTemplateViews()
  const templateSvgs = await loadTemplateSvgs()

  return mapTemplateViewSvgs(templateViews, templateSvgs)
}
