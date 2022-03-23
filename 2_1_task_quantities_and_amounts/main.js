/* CONSTANTS AND GLOBALS */
// const width = ;
// const height = ;

//VARIABLES
const width = window.innerWidth * 0.5; //we define width and height and we keep referring to them later in the coding
const height = window.innerHeight * 0.7;
const margin = { top: 20, bottom: 60, left: 60, right: 80};

//DATA (put .then to make the next thing happen)

d3.csv('../data/squirrelActivities.csv', d3.autoType)
.then(data => {
    console.log("data", data)


// SCALE

const yScale = d3.scaleBand()
  .domain(data.map(d=> d.activity))
  .range ([height - margin.bottom, margin.top])
  .paddingInner(0.3)

const xScale = d3.scaleLinear()
  .domain([0, d3.max(data, d=> d.count)])
  .range ([0, width - margin.right])  //original .range ([0, width])     if gets error go back to this one
  
const colorScale = d3.scaleOrdinal()
  .domain(data.map(d=> d.activity))
  .range(["red", "blue", "purple", "green","orange"])
//ELEMENTS APPEND

const svg = d3.select ("#barchart") //defining how big the svg is
  .append("svg")
  .attr("width", width)
  .attr("height", height)

const xAxis = d3.axisBottom(xScale)
const yAxis = d3.axisLeft(yScale)
 
svg.append("g")
    .attr("transform", `translate(${margin.left},${height-margin.bottom})`)
    .call(xAxis)

svg.append("g")
    .attr("transform", `translate(${margin.left - 0.5},0)`)
    .call(yAxis)

  //SEKECT JOIN DRAW - data is how we name the data table
svg.selectAll("rect") //select all the data
  .data(data)  //select all of that graphics
  .join("rect") //take all the rectangles or circles and join them
//so if there are 400 rectangles in our data, then create 400 rectangles
  .attr("height", yScale.bandwidth())
  .attr("width", d=> xScale(d.count))
  .attr("x", d => margin.left)  // these need to match up with the scale
  .attr("y", d=>  yScale(d.activity))
  .attr("fill", d => colorScale(d.activity))
    ///.attr("fill", "#0040ff")
  
  

});