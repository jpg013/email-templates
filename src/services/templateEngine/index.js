const ejs             = require('ejs')
const makeTemplateMap = require("./makeTemplateMap")

async function connect(container) {
  const templateMap = makeTemplateMap()

  function compileVolumeChangeTemplate() {
    const tpl = templateMap.volume_change

    if (!tpl) {
      throw new Error('missing required template')
    }

    // Compile the tpl
    return {
      compiledTpl: ejs.compile(tpl.markup, {}),
      svgs: tpl.svgs
    }
  }

  function renderTemplate(compiledTpl, args) {
    return compiledTpl(args)
  }

  return {
    compileVolumeChangeTemplate,
    renderTemplate
  }
}

module.exports = Object.create({connect})
