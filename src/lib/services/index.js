const d3Charts       = require('./d3Charts')
const templateEngine = require('./templateEngine')
const fileConverter  = require('./fileConverter')
const svgToPng       = require('./svgToPng')
const cdn            = require('./cdn')

async function connect(container) {
  return {
    fileConverter: await fileConverter.connect(container),
    templateEngine: await templateEngine.connect(container),
    svgToPng: await svgToPng.connect(container),
    d3Charts: await d3Charts.connect(container),
    cdn: await cdn.connect(container)
  }
}

module.exports = Object.create({connect})
