const markup = `<html>
  <body>
    <% for(var i=0; i < children.length; i++) {%>
       <%- children[i] %>
    <% } %>
  </body>
</html>`

module.exports = {
  name: 'base',
  markup,
  isSvg: false,
  children: []
}
