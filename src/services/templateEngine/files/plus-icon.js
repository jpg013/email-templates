const markup = `<svg fill="#10CF50" viewBox="0 0 24 24" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>

`

module.exports = {
  id: 'plus_icon',
  cacheKey: 'plus_icon',
  type: 'static_svg',
  markup,
  opts: {
    height: 150,
    width: 150
  }
}
