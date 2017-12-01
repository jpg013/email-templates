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
        positive: relative
      }

      .areaChart__svg {
        width: 100%;
        height: 100%;
      }

      .areaChart {
        width: 100%;
        height: 100%;
        position: relative;
      }

      .areaChart__indicator__line {
        stroke: #1D2838;
        fill: #1D2838;
        stroke-opacity: 0;
        opacity: 0;
        shape-rendering: crispEdges;
        stroke-width: 1px;
      }

      .area__chart__axis__label {
        font-size: 16px;
        font-weight: 500;
        stroke: #59595A;
        fill: #59595A;
        font-family: sans-serif;
        letter-spacing: .8px;
      }

      .area__chart__axis__tick {
        font-size: 10px;
        font-weight: 300;
        stroke: #9F9F9F;
        font-family: sans-serif;
      }

      .area__chart__axis__line__ticks {
        stroke: #9F9F9F;
        stroke-opacity: .5;
      }

      .area__chart__axis__line {
        stroke: #1D2838;
        fill: #1D2838;
        stroke-opacity: .8;
        opacity: .8;
        shape-rendering: crispEdges;
      }

      .area__chart__axis__grid__line {
        stroke: #9F9F9F;
        fill: none;
        stroke-opacity: .5;
        opacity: .5;
        shape-rendering: crispEdges;
        height: 1px;
      }
    </style>

  </head>
  <body>
    <div class="dataviz__container">
      <svg id="dataviz-container" class="areaChart__svg"></svg>
    </div>
  </body>
</html>`

module.exports = {
  name: 'area_chart',
  markup
}
