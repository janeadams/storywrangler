import React, {Component} from 'react';
import reactDOM from 'react-dom';
import XYFrame from "semiotic/lib/XYFrame"
const theme = ["#ac58e5","#E0488B","#9fd0cb","#e0d33a","#7566ff","#533f82","#7a255d","#365350","#a19a11","#3f4482"]
// Enable cross-origin request service
var cors = require('cors');
var val = "christmas";
var url = `d3demo/json/${val}`;
console.log(url)
d3.json(url, function(error, data) {
    data.forEach(function(d) {
		var parseTime = d3.timeParse("%Y-%m-%d");
		d.date = parseTime(d.time.substr(0,9));
        d.rank = +d.rank;
    });

export default class lineChart extends React.Component {
render() {
return (<div>
<h1>Line Chart</h1>
<XYFrame
  size={[ 700,500 ]}
  data={d}
  xAccessor={d.date}
  yAccessor={d.rank}
  style={d => ({ fill: d.color })}
  margin={{ top: 30, bottom: 0, left: 80, right: 50 }}
  />
</div>)
  } // End of the render function
} // End of the component