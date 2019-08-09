import React, {Component} from 'react';
import reactDOM from 'react-dom';
import * as d3 from 'd3'


class BarChart extends Component {
    componentDidMount() {
        const data = [ 2, 4, 2, 6, 8 ]
        this.drawBarChart(data)
    }
    drawBarChart(data)  {}
    render() { return <div ref="canvas"></div> }
}

export default LineChart