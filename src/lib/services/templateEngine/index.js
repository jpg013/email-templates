const ejs             = require('ejs')
const makeTemplateMap = require("./makeTemplateMap")

async function connect(container) {
  const { pathSettings, fileHelpers } = container

  if (!pathSettings || !fileHelpers) {
    throw new Error('missing required dependency')
  }

  const templateMap = await makeTemplateMap(fileHelpers, pathSettings)

  function compileTemplate(name, opts={}) {
    const tpl = templateMap[name]

    if (!tpl) {
      throw new Error('invalid template')
    }

    const { markup, charts, images } = tpl

    // Compile the tpl
    return {
      render: ejs.compile(markup, opts),
      charts,
      images
    }
  }

  return {
    compileTemplate
  }
}

module.exports = Object.create({connect})
