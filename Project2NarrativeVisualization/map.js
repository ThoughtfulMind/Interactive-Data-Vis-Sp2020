class Map {
    constructor(state, setGlobalState) {

    }

    draw(state, setGlobalState) {

        // Color scale for operators
        let colorScale = d3.scaleOrdinal().domain(state.operatorList).range(["#b7c7df", "#06469a"]);

        let subtitle = d3.select("#Viz1-subtitle");

        let svg = d3
            .select("#Viz1-visual")
            .append("svg")
            .attr("width", state.width)
            .attr("height", state.height);

        // Title of chart
        let title = d3
            .select("#Viz1-title")
            .text("Aviation Accidents")
            .style("opacity", "0")
            .transition(d3.easeElastic)
            .duration(1200)
            .style("opacity", "1");

        let tooltip = d3.select("#Viz1-visual")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

    

        function setUpMap() {
            // US map background
            svg
                .selectAll(".landUSA")
                .append("g")
                .data(state.geoUSA.features)
                .join("path")
                .attr("d", state.pathUSA)
                .attr("class", "landUSA")
                .attr("fill", "#b7c7df")
                .style("opacity", "0")
                .transition(d3.easeElastic)
                .duration(900)
                .style("opacity", "1");

            svg
                .selectAll(".InvestigationType")
                .append("g")
                .data(state.geoAviation.features)
                .join("path")
                .attr("d", state.pathUSA)
                .attr("class", "InvestigationType")
                .attr("fill", "#06469a")
                .style("opacity", "0")
                .transition(d3.easeElastic)
                .duration(300)
                .style("opacity", "1");

            state.dataLoadStatus = "loaded";

            d3.select("#visibility-toggle").style("display", "visible");

        }

        setUpMap();
};