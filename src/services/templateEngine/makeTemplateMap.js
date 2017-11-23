const file = require('../../libs/file')
const path = require('path')

function buildTemplateMap(templates, charts) {
  // Map reduce over templates
  return templates.map(tpl => {
    const tplCharts = tpl.charts.map(cur => {
      const tplChart = charts.find(c => c.id === cur.id)

      if (!tplChart) {
        throw new Error('missing template chart')
      }

      return Object.assign({}, cur, tplChart)
    })

    return Object.assign({}, tpl, {
      charts: tplCharts
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
  const tplCharts = await loadTemplateCharts(pathSettings)

  return buildTemplateMap(templates, tplCharts)
}
