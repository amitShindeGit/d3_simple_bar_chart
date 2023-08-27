/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 1 - Star Break Coffee
 */

const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 100, BOTTOM: 100 };
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 400 - MARGIN.BOTTOM - MARGIN.TOP;

const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.BOTTOM + MARGIN.TOP);

const g = svg.append("g").attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)  

d3.csv("data/revenues.csv").then((data) => {
  data.forEach((element) => {
    element.revenue = Number(element.revenue);
    element.profit = Number(element.profit);
  });
  console.log(data);

  const x = d3
    .scaleBand()
    .domain(data.map((e) => e.month))
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2);

    console.log(x.bandwidth,"x");

  const y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, (d) => d.revenue)
    ])
    .range([ HEIGHT, 0]);

    console.log(y,"y")

  const xAxisCall = d3.axisBottom(x);
  g.append("g")
    .attr("class", "X axis")
    .attr("transform", `translate(0, ${HEIGHT})`)
    .call(xAxisCall);

  const yAxisCall = d3.axisLeft(y);
  g.append("g").attr("class", "Y axis").call(yAxisCall);

  const rects = g.selectAll("rect").data(data);

  rects
    .enter()
    .append("rect")
    .attr("y", d => y(d.revenue))
    .attr("x", (d) => x(d.month))
    .attr("width", x.bandwidth)
    .attr("height", (d) => HEIGHT - y(d.revenue))
    .attr("fill", "grey");
});
