const svg            = require('./svg')
const templateEngine = require('./templateEngine')

async function connect(container) {
  return {
    svg: await svg.connect(container),
    templateEngine: await templateEngine.connect(container)
  }
}

module.exports = Object.create({connect})
