function donutChart(d3) {
    var width,
        height,
        margin = {top: 10, right: 10, bottom: 10, left: 10},
        colour = d3.scaleOrdinal(['#10CF50', '#FF4F2F', '#6B6969']), // colour scheme
        variable, // value in data that will dictate proportions on chart
        category, // compare data by
        padAngle, // effectively dictates the gap between slices
        floatFormat = d3.format('.4r'),
        cornerRadius, // sets how rounded the corners are on each slice
        percentFormat = d3.format(',.0%');

    function chart(selection) {
        selection.each(function(data) {
            // generate chart

            // ===========================================================================================
            // Set up constructors for making donut. See https://github.com/d3/d3-shape/blob/master/README.md
            //var radius = Math.min(width, height) / 2; -- 250
            const radius = 310

            // creates a new pie generator
            var pie = d3.pie()
                .value(function(d) {
                  return floatFormat(d[variable]);
                })
                .sort(null);

            // contructs and arc generator. This will be used for the donut. The difference between outer and inner
            // radius will dictate the thickness of the donut
            var arc = d3.arc()
                .outerRadius(radius * 0.8)
                .innerRadius(radius * 0.4)
                .cornerRadius(cornerRadius)
                .padAngle(padAngle);

            // this arc is used for aligning the text labels
            var outerArc = d3.arc()
                .outerRadius(radius * 0.9)
                .innerRadius(radius * 0.9);
            // ===========================================================================================

            // ===========================================================================================
            // append the svg object to the selection
            var svg = selection.append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .style('-webkit-filter', 'drop-shadow( 0px 3px 3px rgba(0,0,0,.3) )')
                .style('filter', 'drop-shadow( 0px 3px 3px rgba(0,0,0,.25) )')
              .append('g')
                .style('background', 'pink')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
            // ===========================================================================================

            // ===========================================================================================
            // g elements to keep elements within svg modular
            svg.append('g').attr('class', 'slices');
            svg.append('g').attr('class', 'labelName')
              .style('font-family', 'sans-serif')
              .style('font-weight', '500')
              .style('font-style', 'normal')
              .style('font-size', '34px');
            svg.append('g').attr('class', 'lines');
            // ===========================================================================================

            // ===========================================================================================
            // add and colour the donut slices
            var path = svg.select('.slices')
                .datum(data).selectAll('path')
                .data(pie)
              .enter().append('path')
                .attr('fill', function(d) { return colour(d.data[category]); })
                .attr('d', arc);
            // ===========================================================================================

            // ===========================================================================================
            // add text labels
            var label = svg.select('.labelName').selectAll('text')
                .data(pie)
              .enter().append('text')
                .attr('dy', '.35em')
                .html(function(d) {
                    const formattedCategory = d.data[category].toUpperCase().slice(0, 1) + d.data[category].slice(1)
                    // add "key: value" for given category. Number inside tspan is bolded in stylesheet.
                    return `<tspan style="fill: #59595a; stroke: #59595a; font-style: normal; font-weight: 700; font-size: 46px">${percentFormat(d.data[variable])}</tspan>` +
                      ` <tspan dx="10" style="fill: #9F9F9F; stroke: #9F9F9F; font-style: normal; font-weight: 500; font-size: 34px">${formattedCategory}</tspan>`

                    //return formattedCategory + ': <tspan style="font-style: normal; font-weight: 500; font-size: 34px">' + percentFormat(d.data[variable]) + '</tspan>';
                })
                .attr('transform', function(d) {

                    // effectively computes the centre of the slice.
                    // see https://github.com/d3/d3-shape/blob/master/README.md#arc_centroid
                    var pos = outerArc.centroid(d);

                    // changes the point to be on left or right depending on where label is.
                    pos[0] = radius * 0.85 * (midAngle(d) < Math.PI ? 1 : -1);
                    return 'translate(' + pos + ')';
                })
                .style('text-anchor', function(d) {
                    // if slice centre is on the left, anchor text to start, otherwise anchor to end
                    return (midAngle(d)) < Math.PI ? 'start' : 'end';
                });
            // ===========================================================================================

            // ===========================================================================================
            // add lines connecting labels to slice. A polyline creates straight lines connecting several points
            var polyline = svg.select('.lines')
                .selectAll('polyline')
                .data(pie)
              .enter().append('polyline')
                .style('opacity', '.4')
                .style('stroke', 'black')
                .style('stroke-width', '2px')
                .style('fill', 'none')
                .attr('points', function(d) {

                    // see label transform function for explanations of these three lines.
                    var pos = outerArc.centroid(d);
                    pos[0] = radius * 0.85 * (midAngle(d) < Math.PI ? 1 : -1);
                    return [arc.centroid(d), outerArc.centroid(d), pos]
                });
            // ===========================================================================================

            // ===========================================================================================
            // Functions

            // calculates the angle for the middle of a slice
            function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }
        });
    }

    // getter and setter functions. See Mike Bostocks post "Towards Reusable Charts" for a tutorial on how this works.
    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.margin = function(value) {
        if (!arguments.length) return margin;
        margin = value;
        return chart;
    };

    chart.radius = function(value) {
        if (!arguments.length) return radius;
        radius = value;
        return chart;
    };

    chart.padAngle = function(value) {
        if (!arguments.length) return padAngle;
        padAngle = value;
        return chart;
    };

    chart.cornerRadius = function(value) {
        if (!arguments.length) return cornerRadius;
        cornerRadius = value;
        return chart;
    };

    chart.colour = function(value) {
        if (!arguments.length) return colour;
        colour = value;
        return chart;
    };

    chart.variable = function(value) {
        if (!arguments.length) return variable;
        variable = value;
        return chart;
    };

    chart.category = function(value) {
        if (!arguments.length) return category;
        category = value;
        return chart;
    };

    return chart;
}

function buildDonutChart(dom, d3, data) {
  const document = dom.window.document
  const datavizElement = d3.select(document.querySelector('#dataviz-container'))

  const donut = donutChart(d3)
       .width(1213)
       .height(644)
       .cornerRadius(3) // sets how rounded the corners are on each slice
       .padAngle(0.025) // effectively dictates the gap between slices
       .variable('percent')
       .category('type');

  datavizElement
    .datum(data)  // bind data to the div
    .call(donut); // draw chart in div

  return document.querySelector('svg').outerHTML
}

module.exports = buildDonutChart
