const ejs             = require('ejs')
const makeTemplateMap = require("./makeTemplateMap")

async function connect(container) {
  const { pathSettings } = container

  if (!pathSettings) {
    throw new Error('missing required dependency')
  }

  const templateMap = await makeTemplateMap(pathSettings)

  function compileTemplate(name, data) {
    const tpl = templateMap[name]

    if (!tpl) {
      throw new Error('invalid template')
    }

    const { markup, charts, files } = tpl

    // Compile the tpl
    return {
      compiledMarkup: ejs.compile(markup, {}),
      charts,
      files
    }
  }

  function renderTemplate(compiledTpl, args) {
    return compiledTpl(args)
  }

  return {
    compileTemplate,
    renderTemplate
  }
}

module.exports = Object.create({connect})
