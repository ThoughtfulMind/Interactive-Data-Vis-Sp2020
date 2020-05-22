
import {
  Map
} from "./map.js"

let map;


/* APPLICATION STATE */
let state = {
  // Dataset
  geoUSA: 
  //
  intro: 0,
}


/* LOAD DATA FOR THE VORONOI MAP */
Promise.all([
  d3.json("./data/usState.json"),
  d3.json("./data/.geo.json"),
  d3.csv("./data/GeneralAviationUSLLClean.csv", d3.autoType),
])
  findWidth();
  setScales();
  init();
});


// SCALES
function setScales() {
  state.projectionUSA = d3.geoAlbersUsa().fitSize([state.width, state.height], state.geoUSA);
  state.InjurySeverity = d3.map(state.dataLethality, d => d.Lethality).keys();

/* INIT */
function init() {
  map = new Map(state, setGlobalState);
  draw();
}


/* DRAW */
function draw() {
  map.draw(state, setGlobalState);
}


/* UTILITY FUNCTIONS */
function setGlobalState(nextState) {
  state = {
      ...state,
      ...nextState,
  };
}

function findWidth() {
  let element = document.querySelector("chart")
  let rect = element.getBoundingClientRect();
  setGlobalState({
      width: Math.floor(rect.width * 0.9),
      height: Math.floor(rect.height / 5),
  });
}