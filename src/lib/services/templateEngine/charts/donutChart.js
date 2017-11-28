const markup = `<!DOCTYPE html>
  <head>
    <meta charset="UTF-8">
    <title>Reusable Donut Chart in D3 v4</title>

    <style>
      body {
        font-family: 'Roboto', sans-serif;
        color: #333333;
        padding: 0 !important;
        margin: 0 !important;
      }

      .dataviz__container {
        height: 100vh;
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    </style>

    <script src="index.js"></script>
  </head>
  <body>
    <div class="dataviz__container">
      <div id="dataviz-container"></div>
    </div>
  </body>
</html>`

module.exports = {
  name: 'donut_chart',
  markup
}
