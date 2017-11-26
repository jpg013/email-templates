const path          = require('path')
const fs            = require('fs')
const { promisify } = require('util')

const readDirAsync  = promisify(fs.readdir)

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

async function loadTemplateCharts(templateChartsDir) {
  // Read in charts
  const charts = await readDirAsync(templateChartsDir)
  return charts.map(c => require(path.resolve(templateChartsDir, c)))
}

async function loadTemplates(templatesDir) {
  // Read in templates
  const tpls = await readDirAsync(templatesDir)
  return tpls.map(t => require(path.resolve(templatesDir, t)))
}

module.exports = async (pathSettings) => {
  const templates = await loadTemplates(pathSettings.templatesDir)
  const tplCharts = await loadTemplateCharts(pathSettings.templateChartsDir)

  return buildTemplateMap(templates, tplCharts)
}
