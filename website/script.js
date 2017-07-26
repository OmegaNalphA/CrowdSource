/* implementation heavily influenced by http://bl.ocks.org/1166403 */

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (xhttp.readyState == 4 && xhttp.status == 200) {
    var response = this.responseText;
    var json = JSON.parse(response);
    var data = json["data"].map(function(x) {
       return [x["Count"], x["Time_created"]];
    });

    console.log(data);

    plotData(data);
  }
};
xhttp.open("GET", "https://oneweek-api.herokuapp.com/data", true);
xhttp.send();

// define dimensions of graph
var m = [80, 80, 80, 80]; // margins
var w = 1000 - m[1] - m[3]; // width
var h = 400 - m[0] - m[2]; // height

/*
 * sample data to plot over time
 *    [Success, Failure]
 *    Start: 1335035400000
 *    End: 1335294600000
 *    Step: 300000ms
 */

function plotData(data) {
  var startTime = new Date(data[0][1].replace(' ', 'T'));
  var endTime = new Date(data[data.length - 1][1].replace(' ', 'T'));
  var timeStep = 300000;

  // X scale starts at epoch time 1335035400000, ends at 1335294600000 with 300s increments
  var x = d3.time.scale().domain([startTime, endTime]).range([0, w]);
  x.tickFormat(d3.time.format("%Y-%m-%d"));
  // Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
  var y = d3.scale.linear().domain([0, d3.max(data, function(d) {
      return d[0];
  })]).range([h, 0]);
  // create a line function that can convert data[] into x and y points
  var line1 = d3.svg.line()
      // assign the X function to plot our line as we wish
      .x(function(d, i) {
          // verbose logging to show what's actually being done
          //console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
          // return the X coordinate where we want to plot this datapoint
          return x(new Date(d[1].replace(' ', 'T')));
      })
      .y(function(d) {
          // verbose logging to show what's actually being done
          //console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
          // return the Y coordinate where we want to plot this datapoint
          return y(d[0]); // use the 1st index of data (for example, get 20 from [20,13])
      })

  // Add an SVG element with the desired dimensions and margin.
  var graph = d3.select("#graph").append("svg:svg")
      .attr("width", w + m[1] + m[3])
      .attr("height", h + m[0] + m[2])
      .append("svg:g")
      .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

  // create yAxis
  var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(1);

  // Add the x-axis.
  graph.append("svg:g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + h + ")")
      .call(xAxis);

  // create left yAxis
  var yAxisLeft = d3.svg.axis().scale(y).ticks(6).orient("left");

  // Add the y-axis to the left
  graph.append("svg:g")
      .attr("class", "y axis")
      .attr("transform", "translate(-10,0)")
      .call(yAxisLeft);

  // add lines
  // do this AFTER the axes above so that the line is above the tick-lines
  graph.append("svg:path").attr("d", line1(data)).attr("class", "data1");
}
