const file = require('../../libs/file')
const path = require('path')

function buildTemplateMap(templates, files, charts) {
  return views.map(v => {
    if (!v.files || !v.files.length) {
      return v
    }

    const mappedFiles = v.files.map(cur => {
      const file = files.find(f => f.id === cur.id)

      if (!file) {
        throw new Error('missing file')
      }

      return Object.assign({}, cur, file)
    })

    return Object.assign({}, v, {
      files: mappedFiles
    })
  })
  .reduce((acc, cur) => {
    acc[cur.id] = cur
    return acc
  }, {})
}


async function loadTemplateCharts(pathSettings) {
  // Read in charts
  const charts = await file.readDirAsync(pathSettings.templateChartsDir)
  return charts.map(c => require(path.resolve(pathSettings.templateChartsDir, c)))
}

async function loadTemplates(pathSettings) {
  // Read in templates
  const tpls = await file.readDirAsync(pathSettings.templateDir)
  return tpls.map(t => require(path.resolve(pathSettings.templateDir, t)))
}

module.exports = async (pathSettings, file) => {
  const templates = await loadTemplates(pathSettings)
  const tplcharts = await loadTemplateCharts(pathSettings)

  // return buildTemplateMap(templateViews, templateFiles)
  return templates
}
