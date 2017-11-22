const ejs             = require('ejs')
const makeTemplateMap = require("./makeTemplateMap")

async function connect(container) {
  const templateMap = await makeTemplateMap()

  function compileVolumeChangeTemplate(data) {
    const tpl = templateMap.volume_change

    if (!tpl) {
      throw new Error('missing required template')
    }

    const files = tpl.files.map(cur => {
      if (!cur.dataProp) {
        return cur
      }

      return Object.assign({}, cur, {
        data: data[cur.dataProp]
      })
    })

    // Compile the tpl
    return {
      compiledTpl: ejs.compile(tpl.markup, {}),
      files
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
