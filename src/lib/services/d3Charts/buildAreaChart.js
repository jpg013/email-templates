// import { scaleTime, scaleLinear } from 'd3-scale';
// import { select } from 'd3-selection';
// import { curveLinear, area, stack, line } from 'd3-shape';
// import makeYAxis from './makeYAxis';
// import makeXAxis from './makeXAxis';
// import { easeCubicInOut } from 'd3-ease';
// import getMinMaxValues from './getMinMaxValues';
// import drawMouseEffects from './drawMouseEffects';

const margins = {
 top: 0,
 bottom: 0,
 left: 0,
 right: 0,
 axisLeft: 50,
 axisBottom: 25
};

drawChart(data, keys, axisKey, ) {
 const { height, width } = this.areaChartRef.getBoundingClientRect();

 this.areaChartDimensions = {
   height,
   width
 };

 /*
  * padded height and width
  */
 let paddedHeight = height - margins.top - margins.bottom;
 let paddedWidth = width - margins.left - margins.right;

 if (this.props.displayAxes) {
   /*
    * Adjust width for axes
    */
   paddedWidth = paddedWidth - margins.axisLeft;
   paddedHeight = paddedHeight - margins.axisBottom;
 }

 const svg = select(this.areaChartRef.querySelector('svg'));

 const translateX = margins.left + this.props.displayAxes ? margins.axisLeft : 0;

 const clipRect = svg
   .append('clipPath')
   .attr('id', 'area-chart-rect-clip')
   .append('rect')
   .attr('height', height)
   .attr('width', 0);

 const { minY, maxY, minX, maxX } = getMinMaxValues(this.props.data, keys, axisKey);

 const y = scaleLinear()
   .range([paddedHeight, 0])
   .domain([minY, maxY]);

 const x = scaleTime()
   .range([0, paddedWidth])
   .domain([minX, maxX]);

 const valueStack = stack().keys(keys);

 const valueArea = area()
   .x(d => x(d.data[axisKey]))
   .y0(d => y(d[0]))
   .y1(d => y(d[1]))
   .curve(curveLinear);

 const valueLine = line()
   .x(d => x(d.data.day))
   .y(d => y(d[1]))
   .curve(curveLinear);

 const stackData = valueStack(data);

 if (this.props.displayAxes) {
   makeYAxis(svg, width, height, y, margins.axisLeft);
   makeXAxis(svg, width, height, x, margins.axisLeft, margins.axisBottom);
 }

 const g = svg
   .append('g')
   .attr('transform', `translate(${translateX}, ${margins.top})`)
   .attr('clip-path', 'url(#area-chart-rect-clip)');

 const layer = g.selectAll('.layer')
   .data(stackData)
   .enter()
   .append('g')
   .attr('class', 'layer');

 layer.append('path')
   .attr('class', this.props.getLineClass)
   .attr('d', valueLine);

 layer.append('path')
   .attr('class', this.props.getAreaClass)
   .attr('d', valueArea);

}


function buildAreaChart(dom, d3, data) {
  const document = dom.window.document
  const datavizSvg = d3.select(document.querySelector('#dataviz-container'))

}

export default AreaChart;
