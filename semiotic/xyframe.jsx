import react from "React";
import reactDOM from "ReactDOM";
const { XYFrame } = Semiotic;
const theme = ["#ac58e5","#E0488B","#9fd0cb","#e0d33a","#7566ff","#533f82","#7a255d","#365350","#a19a11","#3f4482"]
// Enable cross-origin request service
var cors = require('cors');
var val = "christmas";
var url = `http://hydra.uvm.edu:3001/api/onegrams/${val}`;
console.log(url)
var worddata = JSON.parse(url)



export default class DivergingStackedBar extends React.Component {
render() {
return (<div>
<h1>Line Chart</h1>
<XYFrame
  size={[ 700,500 ]}
  lines={worddata}
  xAccessor={"time"}
  yAccessor={"rank"}
  margin={{ top: 30, bottom: 0, left: 80, right: 50 }}
  />
</div>)
  }
}