const jsdom           = require("jsdom");
const d3              = require('d3')
const buildDonutChart = require('./buildDonutChart')

const { JSDOM } = jsdom;

async function connect(container) {

  function buildD3Chart(id='', markup='', data={}) {
    const dom = new JSDOM(markup, { runScripts: "dangerously" })

    switch(id) {
      case 'donut_chart':
        return buildDonutChart(dom, d3, data)
      default:
        return
    }
 }

  return {
    buildD3Chart
  }
}

module.exports = Object.create({connect})
