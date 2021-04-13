import React from 'react';
import Plot from 'react-plotly.js';
import { toTitleCase } from "./utils"

const PlotlyTimeline = ( props ) => {

    if (props.data) {
        console.log("PlotlyTimeline data:")
        console.log(props.data)
        let traces = []
        let metric = (props.rt) ? props.metric : props.metric+"_no_rt"
        Object.entries(props.data).forEach(([key, value]) => {
            let trace = {
                x: value['date'],
                y: value[metric],
                type: 'scatter',
                mode: 'lines+markers',
                name: key
            }
            traces.push(trace)
        })

        return (
            <Plot
                data={traces}
                useResizeHandler
                style={{ width: "100%", height: "100%" }}
                layout={{
                    autosize: true,
                    xaxis: {
                        autorange: true ,
                        title: {text: 'date'.toTitleCase()}
                    },
                    yaxis: {
                        type: props.scale,
                        fixedrange: true,
                        autorange: (props.metric==='rank') ? 'reversed' : true,
                        title: {text: (props.rt) ? props.metric.toTitleCase() : props.metric.toTitleCase()+" (no Retweets)"}
                    }
                }}
                scrollZoom={true}
                config={{
                    "displaylogo": false,
                    'modeBarButtonsToRemove': ['pan2d','lasso2d','sendDataToCloud', 'select2d']
                }}
            />
        );
    }
    else return null;
}


export default PlotlyTimeline