const markup = `<div style="height: 60px; background: #EAEAEB; display: flex; align-items: center; padding: 0 20px">
  <div>
    <%- children[0] %>
  </div>

  <div style="margin-left: auto; margin-top: -5px">
    <%- children[1] %>
  </div>
  <span style="color: #F5A623; font-size: 16px; padding-left: 10px; font-family: Arial; letter-spacing: .7px">
    Sentiment Alert
  </span>
</div>`

module.exports = {
  name: 'volumeChangeHeader',
  markup,
  isSvg: false,
  children: ['dunamiLogo', 'alertIcon']
}
