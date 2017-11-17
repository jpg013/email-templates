const markup = `<html>
  <body>
  <div style="height: 60px; background: #EAEAEB; padding: 0 20px; display: flex; align-items: center; justify-content: center;">
    <div style="position: relative; left: -25px; top: -20px">
      <img  src="<%- files[0] %>" />
    </div>

    <div style="display: flex; align-items: center; justify-content: center; margin-left: auto; line-height: 60px; color: #F5A623; font-size: 16px; padding-left: 10px; font-family: Arial; letter-spacing: .7px">
      <div style="padding-right: 10px; position: relative; top: -1px;">
        <img  src="<%- files[1] %>" />
      </div>
      <span>
        Sentiment Alert
      </span>
    </div>
  </div>
  </body>
</html>`

module.exports = {
  name: 'volumeChange',
  markup,
  type: 'view',
  files: ['dunamiLogoSvg', 'alertIconSvg']
}
