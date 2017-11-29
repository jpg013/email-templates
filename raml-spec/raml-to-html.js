const raml2html = require('raml2html')
const path      = require('path')
const fs        = require('fs')

const sourceFile = path.resolve(__dirname, 'api.raml')
const destFile   = path.resolve(__dirname + '/../src', 'public', 'static', 'api_reference.html')

const configWithDefaultTheme = raml2html.getConfigForTheme();

const writeFileStreamAsync = (string, file) => {
  return new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(file)

    ws.on('finish', resolve);
    ws.on('error', reject)
    ws.write(string)
    ws.end();
  });
}

raml2html.render(sourceFile, configWithDefaultTheme)
  .then(html => writeFileStreamAsync(html, destFile))
  .catch(console.log)
