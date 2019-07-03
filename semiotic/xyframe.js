import XYFrame from "semiotic/lib/XYFrame"
const theme = ["#ac58e5","#E0488B","#9fd0cb","#e0d33a","#7566ff","#533f82","#7a255d","#365350","#a19a11","#3f4482"]

var val = "christmas"
var url = "http://hydra.uvm.edu:3001/api/onegrams/"+val
var worddata = JSON.parse(url)

const frameProps = {   lines: worddata,
  size: [700,400],
  margin: { left: 80, bottom: 90, right: 10, top: 40 },
  xAccessor: "week",
  yAccessor: "theaterCount",
  yExtent: [0],
  lineStyle: (d, i) => ({
    stroke: theme[i],
    strokeWidth: 2,
    fill: "none"
  }),
  title: (
    <text textAnchor="middle">
      Theaters showing <tspan fill={"#ac58e5"}>Ex Machina</tspan> vs{" "}
      <tspan fill={"#E0488B"}>Far from the Madding Crowd</tspan>
    </text>
  ),
  axes: [{ orient: "left", label: "Number of Theaters", tickFormat: function(e){return e/1e3+"k"} },
    { orient: "bottom", label: { name: "Weeks from Opening Day", locationDistance: 55 } }]
}

export default () => {
  return <XYFrame {...frameProps} />
}