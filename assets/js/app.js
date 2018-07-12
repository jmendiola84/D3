// D3 Scatterplot Assignment

// Students:
// =========
// Follow your written instructions and create a scatter plot with D3.js.
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data/data.csv", function(err, censusData) {
  if (err) throw err;

  // Step 1: Parse Data/Cast as numbers
   // ==============================
  censusData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.cannotPayDoctor = +data.cannotPayDoctor;
  });

  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(censusData, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(censusData, d => d.cannotPayDoctor)])
    .range([height, 0]);

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

   // Step 5: Create Circles
  // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
  .data(censusData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.cannotPayDoctor))
  .attr("r", "12")
  .attr("fill", "teal")
  .attr("opacity", ".5");
  
  chartGroup.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .style("font-family", "sans-serif")
		.style('fill', 'white')
        .selectAll("tspan")
        .data(censusData)
        .enter()
        .append("tspan")
            .attr("x", function(d) {
                return xLinearScale(d.poverty - 0);
            })
            .attr("y", function(d) {
                return yLinearScale(d.cannotPayDoctor - 0.2);
            })
            .text(function(d) {
                return d.abbr
            });

  // Step 6: Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>Cannot Pay Doctor: ${d.cannotPayDoctor}%`);
    });

  // Step 7: Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

  // Step 8: Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Cannot pay doctor appointment (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("People living below poverty line (%)");
});
