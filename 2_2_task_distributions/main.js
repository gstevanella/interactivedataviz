/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = {top:20, bottom:50, left:30, right:20},  //we give margins for the sides and the top/bottom
  radius = 7;

/* LOAD DATA */
d3.csv("../data/scout_score.csv", d3.autoType).then(data => {
  console.log(data)

    /* SCALES */
const xScale = d3.scaleLinear()
  .domain([0, d3.max(data.map(d=> d.cleaning_maintenance_score))])
  .range([margin.left, width - margin.right])
  .nice()

const yScale = d3.scaleLinear ()
  .domain([0, d3.max(data, d => d.operations_score)])
  .range ([height - margin.bottom, margin.top])
  .nice()

const colorScale = d3.scaleOrdinal()
  .domain(["BRONX","BROOKLYN","MANHATTAN", "QUEENS", "STATEN ISLAND"])
  .range(["green", "blue", "red", "orange", "yellow"])
    
    /* HTML ELEMENTS - elements to append*/
const svg = d3.select ("#container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

svg.append("text")      
  .attr("x",  width - margin.left )
  .attr("y",  height - margin.bottom + 45) //original .attr("y",  height-margin.bottom)
  .style("text-anchor", "middle")
  .text("Cleaning & Maintenance Score");

//axes scales

const xAxis = d3.axisBottom(xScale)
svg.append("g")  //you want to append as a group of things, visuals to your svg
  .attr("transform", `translate(0,${height - margin.bottom})`)  //you need both dollar sign and curly brackets
  .call(xAxis); //this is going to call what I stated above (the axes)
    

const yAxis = d3.axisLeft(yScale)
svg.append("g")
  .attr("transform", `translate(${margin.left},0)`)
  .call(yAxis);


const dot = svg
  .selectAll("circle")
  .data(data, d => d.Agency)
  .join("circle")
  .attr("cx", d => xScale(d.cleaning_maintenance_score))
  .attr("cy", d =>yScale(d.operations_score))
  .transition()  //order matters, hence this needs to go before the radius
  .duration(4000)  // order matters, hence this needs to go before the radius
  .delay(200) //in ms // order matters, hence this needs to go before the radius
  .attr("r", radius)
  .attr("fill", d => colorScale(d.Borough))
});
