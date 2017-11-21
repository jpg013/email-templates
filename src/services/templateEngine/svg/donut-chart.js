const markup = `<!DOCTYPE html>
  <head>
    <meta charset="UTF-8">
    <title>Reusable Donut Chart in D3 v4</title>
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,700" rel="stylesheet">

    <style>
      body {
        font-family: 'Roboto', sans-serif;
        color: #333333;
        padding: 0 !important;
        margin: 0 !important;
      }

      svg {
        -webkit-filter: drop-shadow( 0px 3px 3px rgba(0,0,0,.3) );
        filter: drop-shadow( 0px 3px 3px rgba(0,0,0,.25) );
      }

      polyline{
        opacity: .3;
        stroke: black;
        stroke-width: 2px;
        fill: none;
      }

      .labelName tspan {
        font-style: normal;
        font-weight: 700;
      }

      .labelName {
        font-size: 0.9em;
        font-style: normal;
      }

      .dataviz__container {
        height: 100vh;
        width: 100vw;
        background: pink;
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
  id: 'donut_chart',
  markup,
  opts: {
    height: 960,
    width: 500
  }
}
