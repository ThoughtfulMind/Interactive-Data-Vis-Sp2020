/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;

/**
 * APPLICATION STATE
 * */
let state = {
  geojson: null,
  extremes: null,
  hover: {
    latitude: null,
    longitude: null,
    state: null,
  },
};

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
  d3.json("../../data/us-state.json"),
  d3.csv("../../data/time_series_covid_19_confirmed.csv", d3.autoType),
]).then(([geojson, extremes]) => {
  state.geojson = geojson;
  state.extremes = extremes;
  console.log("State: ", state);
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
  // our projection and path are only defined once, and we don't need to access them in the draw function,
  // so they can be locally scoped to init()
  const projection = d3.geoAlbersUsa().fitSize([width, height], state.geojson);
  const path = d3.geoPath().projection(projection);

  // create an svg element in our main `d3-container` element
  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg
    .selectAll(".state")
    // all of the features of the geojson, meaning all the states as individuals
    .data(state.geojson.features)
    .join("path")
    .attr("d", path)
    .attr("class", "state")
    .attr("fill", "transparent")
    .on("mouseover", d => {
      // when the mouse rolls over this feature, do this
      state.hover["State"] = d.properties.NAME;
      //state.hover["Cases"] = d.properties.total;
      draw(); // re-call the draw function when we set a new hoveredState
    });

    
  // EXAMPLE 1: going from Lat-Long => x, y
  // for how to position a dot
  const ConfirmedCases = [{ latitude: 40.7128, longitude: -74.0060,},
    { latitude: 47.7511, longitude: -120.74, },
    { latitude: 40.6331, longitude: -89.3985, },
    { latitude: 34.0489, longitude: -111.094, },
    { latitude: 33.7879, longitude: -117.853, },
    { latitude: 34.0522, longitude: -118.2437, },
    { latitude: 37.3541, longitude: -121.9552, },
    { latitude: 42.3601, longitude: -71.0589, },
    { latitude: 36.5761, longitude: -120.9876, },
    { latitude: 43.0731, longitude: -89.4012, },
    { latitude: 32.7157, longitude: -117.1611, },
    { latitude: 29.4241, longitude: -98.4936, },
      ];
  svg
    .selectAll("circle")
    .data(ConfirmedCases)
    .join("circle")
    .attr("r", 20)
    .attr("fill", "red")
    .attr("fill-opacity", 0.7)
    .attr("stroke-width", 0.5)
    .attr("transform", d => {
      const [x, y] = projection([d.longitude, d.latitude]);
      return `translate(${x}, ${y})`;
    });
    

  
  // EXAMPLE 2: going from x, y => lat-long
  // this triggers any movement at all while on the svg
  svg.on("mousemove", () => {
    // we can use d3.mouse() to tell us the exact x and y positions of our cursor
    const [mx, my] = d3.mouse(svg.node());
    // projection can be inverted to return [lat, long] from [x, y] in pixels
    const proj = projection.invert([mx, my]);
    //state.hover["Longitude"] = proj[0];
    //state.hover["Latitude"] = proj[1];
    state.hover["Red dot"] = "confirmed cases";
    //draw();
  });

  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
  // return an array of [key, value] pairs
  hoverData = Object.entries(state.hover);

  d3.select("#hover-content")
    .selectAll("div.row")
    .data(hoverData)
    .join("div")
    .attr("class", "row")
    .html(
      d =>
        // each d is [key, value] pair
        d[1] // check if value exist
          ? `${d[0]}: ${d[1]}` // if they do, fill them in
          : null // otherwise, show nothing

    );
}
