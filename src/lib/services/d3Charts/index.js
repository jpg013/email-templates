const buildDonutChart = require('./buildDonutChart')

async function connect(container) {
  async function buildD3Chart(id='', markup='', data={}) {
    const dom = new JSDOM(markup, { runScripts: "dangerously" })

    switch(id) {
      case 'donut_chart':
        return await buildDonutChart(dom, d3, data)
      default:
        return
    }
 }

  return {
    buildD3Chart
  }
}

module.exports = Object.create({connect})
