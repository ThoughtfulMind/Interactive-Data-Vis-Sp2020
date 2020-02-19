// data load
// reference for d3.autotype: https://github.com/d3/d3-dsv#autoType
console.log("Going to read")
d3.csv("./data/MostCommonWordsGoogleBooks.csv", d3.autoType).then(data => {
    console.log("data read");
  
    /** CONSTANTS */
    // constants help us reference the same values throughout our code
    const width = window.innerWidth * 2,
      height = window.innerHeight / 2,
      paddingInner = 0.2,
      margin = { top: 20, bottom: 30, left: 30, right: 30 };
  
    /** SCALES */
    // reference for d3.scales: https://github.com/d3/d3-scale
    const xScale = d3
      .scaleBand()
      .domain(data.map(d => d.WORD))
      .range([margin.left, width - margin.right])
      .paddingInner(paddingInner);
  
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.COUNT)])
      .range([height - margin.bottom, margin.top]);
  
    // reference for d3.axis: https://github.com/d3/d3-axis
    const xAxis = d3.axisBottom(xScale).ticks(data.length);
  
    /** MAIN CODE */
    const svg = d3
      .select("#d3-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    // append rects
    const rect = svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("y", d => yScale(d.COUNT))
      .attr("x", d => xScale(d.WORD))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - margin.bottom - yScale(d.COUNT))
      .attr("fill", "steelblue")
  
    // append text
    const text = svg
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("class", "label")
      // this allows us to position the text in the center of the bar
      .attr("x", d => xScale(d.WORD) + (xScale.bandwidth() / 4))
      .attr("y", d => yScale(d.COUNT))
      .text(d => d.COUNT)
      .attr("dy", "1.25em");
  
    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis);
  });