/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  radius = 5;

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svg;
let xScale;
let yScale;

/* APPLICATION STATE */
let state = {
  data: [],
  country: "All" // + YOUR FILTER SELECTION
};

/* LOAD DATA */
d3.csv("../data/fide_historical.csv", d3.autoType).then(raw_data => {
  // + SET YOUR DATA PATH
  console.log("raw_data", raw_data);
  state.data = raw_data;
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in 
function init() {
  // SCALES
  xScale = d3
    .scaleLinear()
    .domain(d3.extent(state.data, d => d.rank))
    .range([margin.left, width - margin.right]);

  yScale = d3
    .scaleLinear()
    .domain(d3.extent(state.data, d => d.games))
    .range([height - margin.bottom, margin.top]);

  // AXES
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // UI ELEMENT SETUP
  // add dropdown (HTML selection) for interaction
  // HTML select reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
  const selectElement = d3.select("#dropdown").on("change", function() {
    console.log("new selected title is", this.value);
    // `this` === the selectElement
    // this.value holds the dropdown value a user just selected
    state.country = this.value;
    draw(); // re-draw the graph based on this new selection
  });

  // add in dropdown options from the unique values in the data
  selectElement
    .selectAll("option")
    .data(["All", "RUS", "USA", "CHN"]) // unique data values-- (hint: to do this programmatically take a look `Sets`)
    .join("option")
    .attr("value", d => d)
    .text(d => d);

  // create an svg element in our main `d3-container` element
  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // add the xAxis
  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", "50%")
    .attr("dy", "3em")
    .text("Monthly rankings (Fide.com: July 2000 – June 2017)");

  // add the yAxis
  svg
    .append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("y", "50%")
    .attr("dx", "-3em")
    .attr("writing-mode", "vertical-lr")
    .text("Games");

  // + CREATE SVG ELEMENT

  // + CALL AXES

  draw(); // calls the draw function
}

/* DRAW FUNCTION */
 // we call this everytime there is an update to the data/state
function draw() {
  let filteredData = state.data;
  // if there is a selectedParty, filter the data before mapping it to our elements
  if (state.country !== "All") {
    filteredData = state.data.filter(d => d.country === state.country);
  }
  console.log("Data size: " + filteredData.length)
  const dot = svg
    .selectAll(".dot")
    .data(filteredData, d => d.name) // use `d.name` as the `key` to match between HTML and data elements
    .join(
      enter =>
        // enter selections -- all data elements that don't have a `.dot` element attached to them yet
        enter
          .append("circle")
          .attr("class", "dot") // Note: this is important so we can identify it in future updates
          .attr("stroke", "lightgrey")
          .attr("opacity", 0.5)
          .attr("fill", d => {
            if (d.country === "RUS") return "#DE282E";
            else if (d.country === "USA") return "#3c3b6e";
            else if (d.country === "CHN") return "#aa381e";
            //else if (d.country === "All Others") return "#F0F0F0";
            else return "#F0F0F0";
          })
          .attr("r", radius)
          .attr("cy", d => yScale(d.games))
          .attr("cx", d => margin.left) // initial value - to be transitioned
          .call(enter =>
            enter
              .transition() // initialize transition
              //.delay(d => 200 * d.rating) // delay on each element
              //.duration(200) // duration 200ms
              .attr("cx", d => xScale(d.rank))
          ),
      update =>
        update.call(update =>
          // update selections -- all data elements that match with a `.dot` element
          update
            .transition()
            .duration(1)
            .attr("stroke", "white")
            .transition()
            .duration(1)
            .attr("stroke", "lightgrey")
        ),
      exit =>
        exit.call(exit =>
          // exit selections -- all the `.dot` element that no longer match to HTML elements
          exit
            .transition()
           //.delay(d => 50 * d.rating)
           // .duration(500)
            .attr("cx", width)
            .remove()
        )
    );
  console.log("draw")
  // + FILTER DATA BASED ON STATE

  // const dot = svg
  //   .selectAll("circle")
  //   .data(filteredData, d => d.name)
  //   .join(
  //     enter => enter, // + HANDLE ENTER SELECTION
  //     update => update, // + HANDLE UPDATE SELECTION
  //     exit => exit // + HANDLE EXIT SELECTION
  //   );
}
