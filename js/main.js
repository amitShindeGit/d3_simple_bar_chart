/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 1 - Star Break Coffee
 */

const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 100, BOTTOM: 100 };
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 400 - MARGIN.BOTTOM - MARGIN.TOP;

let flag = true;

const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.BOTTOM + MARGIN.TOP);

const x = d3.scaleBand().range([0, WIDTH]).paddingInner(0.3).paddingOuter(0.2);

const y = d3.scaleLinear().range([HEIGHT, 0]);

const g = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

const xAxisGroup = g
  .append("g")
  .attr("class", "X axis")
  .attr("transform", `translate(0, ${HEIGHT})`);

const yAxisGroup = g.append("g").attr("class", "Y axis");

d3.csv("data/revenues.csv").then((data) => {
  data.forEach((element) => {
    element.revenue = Number(element.revenue);
    element.profit = Number(element.profit);
  });

  d3.interval(() => {
    flag = !flag;
    const newData = flag ? data : data.slice(1);
    update(newData);
  }, 1000);

  update(data);

  function update(data) {
    const value = flag ? "profit" : "revenue";
    const t = d3.transition().duration(750);

    x.domain(data.map((e) => e.month));
    y.domain([0, d3.max(data, (d) => d[value])]);

    const xAxisCall = d3.axisBottom(x);
    xAxisGroup.transition(t).call(xAxisCall);

    const yAxisCall = d3.axisLeft(y);
    yAxisGroup.transition(t).call(yAxisCall);

    //Join new data with old elements
    const rects = g.selectAll("rect").data(data, d => d.month);

    //Exit old elements not present in new data
    rects
      .exit()
      .attr("fill", "red")
      .transition(t)
      .attr("height", 0)
      .attr("y", y(0))
      .remove();

    //Update old elements present in new data
    rects
      .transition(t)
      .attr("y", (d) => y(d[value]))
      .attr("x", (d) => x(d.month))
      .attr("width", x.bandwidth)
      .attr("height", (d) => HEIGHT - y(d[value]));

    //Enter new elements present in new data
    rects
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.month))
      .attr("width", x.bandwidth)
      .attr("fill", "grey")
      .attr("y", y(0))
      .attr("height", 0)
      .merge(rects)
      .transition(t)
      .attr("y", (d) => y(d[value]))
      .attr("height", (d) => HEIGHT - y(d[value]));
  }
});
