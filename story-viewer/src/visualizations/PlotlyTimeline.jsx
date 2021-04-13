import React from 'react';
import Plot from '../../node_modules/react-plotly.js/react-plotly';
import { titleCase, parseDate, parseRealtime } from "./../utils"

const PlotlyTimeline = ( props ) => {

    if (props.data) {
        console.log("PlotlyTimeline data:")
        console.log(props.data)
        let traces = []
        let metric = props.metric
        let Ylabel = (props.rt) ? titleCase(props.metric) : titleCase(props.metric)+" (no Retweets)"
        if (['num','unique'].includes(props.metric)){
            metric = props.metric+"_"+props.n+"grams"
            Ylabel = Ylabel + " " + props.n +"-grams"
        }
        if (props.metric=='odds'){
            Ylabel = Ylabel + " (1 in X N-grams)"
        }
        metric = (props.rt) ? metric : metric+"_no_rt"
        Ylabel = (props.rt) ? Ylabel : Ylabel+" (no Retweets)"
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
                        title: {text: titleCase('date')}
                    },
                    yaxis: {
                        type: props.scale,
                        fixedrange: true,
                        autorange: ['rank','odds'].includes(props.metric) ? 'reversed' : true,
                        title: {text: Ylabel}
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