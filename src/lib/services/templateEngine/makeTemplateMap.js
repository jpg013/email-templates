function buildTemplateMap(templates, charts) {
  // Map reduce over templates
  return templates.map(tpl => {
    const tplCharts = tpl.charts.map(cur => {
      const tplChart = charts.find(c => c.name === cur.chartName)

      if (!tplChart) {
        throw new Error('missing template chart')
      }

      return Object.assign({}, cur, { markup: tplChart.markup })
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

module.exports = async (fileHelpers, pathSettings) => {
  const templates = await fileHelpers.loadDirFiles(pathSettings.templatesDir)
  const tplCharts = await fileHelpers.loadDirFiles(pathSettings.templateChartsDir)

  return buildTemplateMap(templates, tplCharts)
}
