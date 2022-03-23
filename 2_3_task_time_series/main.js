 /* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,  
 height = window.innerHeight * 0.7,
 margin = {top:20, bottom:20, left:30, right:60}; 

/* LOAD DATA */
d3.csv('../data/water_consumption_ny.csv', d => {
  return {
   year: new Date(+d.Year, 0, 1),  //this is to ensure the computer reads the date as year, month, day
   consumption: +d.PerCapita  //this is to ensure number is read as a number as opposed to text
  }
}).then(data => {
  console.log(data);  

  // SCALES
const xScale = d3.scaleTime()
  .domain(d3.extent(data, d=> d.year))
  .range([margin.left, width-margin.right])
  .nice()

const yScale = d3.scaleLinear()
  .domain([0, d3.max(data, d=> d.consumption)])
  .range([height-margin.bottom, margin.top])
  .nice()

  // CREATE SVG ELEMENT
const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  // BUILD AND CALL AXES
const xAxis = d3.axisBottom(xScale)
svg.append("g")
  .style("font", "15px times")
  .attr("transform", `translate(0, ${height - margin.bottom})`)  //this is from prof
  .call(xAxis);

const yAxis = d3.axisLeft(yScale)
svg.append("g")
  .style("font", "13px times")
  .attr("transform", `translate(${margin.left},0)`)   //double check
  .call(yAxis);  


  // LINE GENERATOR FUNCTION
const lineGen = d3.line()
   .x(d => xScale(d.year))
   .y(d => yScale(d.consumption))
 

  // DRAW LINE
svg.selectAll("path.line")
    .data([data])
    .join("path")
    .attr("class", "line")
    .attr("stroke", "blue")
    .style("stroke-width", 4)
    .attr("fill","none")
    .attr("d", d => lineGen(d))
});