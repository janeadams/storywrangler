import React, {Component} from 'react';
import reactDOM from 'react-dom';
import XYFrame from "semiotic/lib/XYFrame"
const theme = ["#ac58e5","#E0488B","#9fd0cb","#e0d33a","#7566ff","#533f82","#7a255d","#365350","#a19a11","#3f4482"]
// Enable cross-origin request service
var cors = require('cors');
var val = "christmas";
var worddata = [{"_id":"5c440ec97ad7ce043465a89f","word":"christmas","counts":13658,"rank":2339,"time":"2019-01-08T00:00:00.000Z"},{"_id":"5c440edc7ad7ce04346e52ad","word":"christmas","counts":12427,"rank":2576,"time":"2019-01-09T00:00:00.000Z"},{"_id":"5c440eef7ad7ce0434771fac","word":"christmas","counts":7507,"rank":4344,"time":"2019-01-12T00:00:00.000Z"},{"_id":"5c440f037ad7ce04347fd735","word":"christmas","counts":7671,"rank":4314,"time":"2019-01-13T00:00:00.000Z"},{"_id":"5c440f167ad7ce043488c3c9","word":"christmas","counts":6804,"rank":4767,"time":"2019-01-14T00:00:00.000Z"},{"_id":"5c440f2a7ad7ce043491957a","word":"christmas","counts":6484,"rank":5375,"time":"2019-01-15T00:00:00.000Z"},{"_id":"5c440f3e7ad7ce04349ab733","word":"christmas","counts":97273,"rank":300,"time":"2018-12-09T00:00:00.000Z"},{"_id":"5c440f527ad7ce0434a35531","word":"christmas","counts":107624,"rank":281,"time":"2018-12-10T00:00:00.000Z"},{"_id":"5c440f667ad7ce0434abd5c3","word":"christmas","counts":121156,"rank":254,"time":"2018-12-11T00:00:00.000Z"},{"_id":"5c440f7b7ad7ce0434b45a04","word":"christmas","counts":122123,"rank":276,"time":"2018-12-12T00:00:00.000Z"},{"_id":"5c440f907ad7ce0434bd373f","word":"christmas","counts":130232,"rank":229,"time":"2018-12-13T00:00:00.000Z"},{"_id":"5c440fa47ad7ce0434c5a09a","word":"christmas","counts":131745,"rank":255,"time":"2018-12-14T00:00:00.000Z"},{"_id":"5c440fb97ad7ce0434ce79d1","word":"christmas","counts":122010,"rank":238,"time":"2018-12-15T00:00:00.000Z"},{"_id":"5c440fcd7ad7ce0434d6e398","word":"christmas","counts":134359,"rank":225,"time":"2018-12-16T00:00:00.000Z"},{"_id":"5c440fe17ad7ce0434df873d","word":"christmas","counts":150833,"rank":187,"time":"2018-12-17T00:00:00.000Z"},{"_id":"5c440ff67ad7ce0434e7dde7","word":"christmas","counts":163673,"rank":169,"time":"2018-12-18T00:00:00.000Z"},{"_id":"5c44100a7ad7ce0434f02bbe","word":"christmas","counts":173508,"rank":160,"time":"2018-12-19T00:00:00.000Z"},{"_id":"5c44101e7ad7ce0434f8864a","word":"christmas","counts":209333,"rank":131,"time":"2018-12-20T00:00:00.000Z"},{"_id":"5c4410337ad7ce043400f6fb","word":"christmas","counts":239263,"rank":115,"time":"2018-12-21T00:00:00.000Z"}];
//var worddata = JSON.parse(d)

export default class lineChart extends React.Component {
render() {
return (<div>
<h1>Line Chart</h1>
<XYFrame
  size={[ 700,500 ]}
  lines={worddata}
  xAccessor={worddata.time}
  yAccessor={worddata.rank}
  />
</div>)
  } // End of the render function
} // End of the component