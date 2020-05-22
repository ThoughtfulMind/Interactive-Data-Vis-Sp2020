// https://observablehq.com/d/04346cef73963688@128
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["GeneralAviationUSLLClean.csv",new URL("./files/89a452f934524888d284fb4e8b2e06a52630ebd8fed7ccac73beaf198b7101c31ecb657fa3b12c5d55a41aa900b9bc49af98e6ffb7afcdf93506084ec33e8a3d",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Rodica — Voronoi Experiment`
)});
  main.variable(observer("chart")).define("chart", ["d3","topojson","us","filteredData"], function(d3,topojson,us,filteredData)
{
 // projection
  const proj = d3.geoAlbers().scale(1300).translate([487.5, 305])
  
  const svg = d3
    .create("svg") // d3.select("#container")
    .attr("viewBox", [0, 0, 975, 610]);
  
 svg.append("path")
      .datum(topojson.merge(us, us.objects.states.geometries.filter(d => d.id !== "02" && d.id !== "15")))
      .attr("fill", "#F6F7F7")
      .attr("d", d3.geoPath());
  svg
    .append("path")
    .attr("fill", "red")
    .attr("opacity", .3)
    .datum({ type: "FeatureCollection", features: filteredData })
    .attr("d", d3.geoPath(proj).pointRadius(1.5));

  svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke", "#06469a")
    .attr("pointer-events", "all")
    .selectAll("path")
    .data(d3.geoVoronoi().polygons(filteredData).features)
    .join("path")
    .attr("d", d3.geoPath(proj))
    .append("title")
     .text(d => {
  const location = d.properties
  //console.log("d", d)
     //console.log("d.properties.site.properties",d.properties.site.properties["Location"])   
  return d.properties.site.properties["Location"]
          //return "test"
       });

  return svg.node(); // observable specific
}
);
  main.variable(observer()).define(["d3","filteredData"], function(d3,filteredData){return(
d3.geoVoronoi().polygons(filteredData).features
)});
  main.variable(observer("d")).define("d", ["filteredData"], function(filteredData){return(
filteredData[0]
)});
  main.variable(observer()).define(["d"], function(d){return(
d.properties["Location"]
)});
  main.variable(observer("filteredData")).define("filteredData", ["data"], function(data){return(
data.filter(d => d.properties.InjurySeverity === "Fatal")
)});
  main.variable(observer("projection")).define("projection", ["d3"], function(d3){return(
d3.geoAlbers().scale(1300).translate([487.5, 305])
)});
  main.variable(observer("us")).define("us", ["d3"], function(d3){return(
d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json")
)});
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require("topojson-client@3")
)});
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
d3.csvParse(
  await FileAttachment("GeneralAviationUSLLClean.csv").text(),
  d => ({
    type: "Feature",
    properties: d,
    geometry: {
      type: "Point",
      coordinates: [+d.Longitude, +d.Latitude]
    }
  })
)
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3", "d3-array", "d3-geo-voronoi@1")
)});
  return main;
}
