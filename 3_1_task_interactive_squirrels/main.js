//VARIABLES
const width = window.innerWidth * 0.5, //we define width and height and we keep referring to them later in the coding
 height = window.innerHeight * 0.7,
 margin = { top: 20, bottom: 60, left: 60, right: 80},
 radius = 5;

//we now need global scope as we are using sclaes in multiple functions

let svg;
let xScale;
let yScale;
let colorScale;
let xAxis;
let yAxis;

//APPLICATION STATE//
let state = {
  data:[],
  selection: "all"
};


//DATA (put .then to make the next thing happen)

d3.csv('../data/squirrelActivities.csv', d3.autoType).then(raw_data => {
  console.log("data", raw_data);
  state.data = raw_data;
  init();
});

//INITIALISATION OF FUNCTION //

function init() {
// SCALE

  yScale = d3.scaleBand()
  .domain(state.data.map(d=> d.activity))
  .range ([height - margin.bottom, margin.top])
  .paddingInner(0.3)

  xScale = d3.scaleLinear()
  .domain([0, d3.max(state.data, d=> d.count)])
  .range ([0, width - margin.right])  //original .range ([0, width])     if gets error go back to this one
  
  colorScale = d3.scaleOrdinal()
  .domain(state.data.map(d=> d.activity))
  .range(["red", "blue", "purple", "green","orange"])

  const container = d3.select("#container")
    .style("position", "relative");


  svg = container //refer to the above container
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("position", "relative"); 

  tooltip = d3.select("body")  //remember that this is done in 2 steps - first you create the above container and secondly you go to HTML elements to add the tooltip
    .append("div")  //this allow for styling control - suggested by the professor, but not mandatory
    .attr("class", "tooltip")  //this is good practice in case we would like to style this later
    .style("z-index", "10")  //z index, ensuring it appears on top , we give it a 10 as a default
    .style("position", "absolute")
    .style("visibility", "hidden")  //controlling what appears on screen
    .style("opacity", 0.8) //optional step semi-opaque
    .style("padding", "8px")  //to leave room 
    .text("tooltip"); 

  const dropdown = d3.select("#dropdown")

  dropdown.selectAll("options")  //create a set of options that will appear
    .data(["all", "foraging", "running", "chasing", "climbing", "eating"])
    .join("option")
    .attr("value", d => d)  //pass back to your state management tracking area //for every item of the array, we want to show the individual ones
    .text(d => d)  //I want the text to appear 
  
  dropdown.on("change", event => {  //functions go in curly brackets - this is an event function
    state.selection = event.target.value   //when the drop down changes the user should be able to se a change that goes to affect the let variable
    console.log(state.selection)
    draw();  //change in graphics base on selection - up to this point all is showing in the console but we need the reaction from the chart
  })

  draw();
}
//DRAW FUNCTION//
function draw () {

  const filteredData = state.data
   .filter(d=> state.selection === d.activity || state.selection === "all")
 

  xAxis = d3.axisBottom(xScale)
  yAxis = d3.axisLeft(yScale)
 
 svg.append("g")
  .attr("transform", `translate(${margin.left},${height-margin.bottom})`)
  .call(xAxis)

svg.append("g") 
  .attr("transform", `translate(${margin.left - 0.5},0)`)
  .call(yAxis)
  .selectAll("text")  
  .style("text-anchor", "end")
  .attr("dx", "-.8em")
  .attr("dy", ".15em")
  .attr("transform", "rotate(-20)");

  //SEKECT JOIN DRAW - data is how we name the data table
  svg.selectAll("rect") //select all the data
    .data(filteredData)  //select all of that graphics
    .join("rect") //take all the rectangles or circles and join them
//so if there are 400 rectangles in our data, then create 400 rectangles
   .attr("height", yScale.bandwidth)
   .attr("width", d=> xScale(d.count))
   .attr("x", d => margin.left)  // these need to match up with the scale
   .attr("y", d=>  yScale(d.activity))
   .attr("fill", d => colorScale(d.activity))
    ///.attr("fill", "#0040ff")
     .on("mouseover", function(event, d, i){
       tooltip
         .html(`<div>activity: ${d.activity}</div>
          <div>number of times recorded: ${d.count}</div>`)
          .style("visibility", "visible")
          .style("opacity", .8)
          .style("border-radius", "6px")
          .style("background", "cornflowerblue")
          
      })

     .on("mousemove", function(event){
       tooltip
        .style("top", event.pageY - 10 + "px")  //for the top position find the event Y area where the mouse is moving and show the tooltip there
        .style("left", event.pageX + 10 + "px");
      })

    .on("mouseout", function (event,d) {  //function to clear everything out
      tooltip
        .html(``)  //outside the area we just want to clear out the tooltip and make it invisible again
        .style("visibility", "hidden");
    });
}