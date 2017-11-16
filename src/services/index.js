const svgToPng     = require('./svgToPng')
const templateEngine = require('./templateEngine')

async function connect(container) {
  return {
    svgToPng: await svgToPng.connect(container),
    templateEngine: await templateEngine.connect(container)
  }
}

module.exports = Object.create({connect})
