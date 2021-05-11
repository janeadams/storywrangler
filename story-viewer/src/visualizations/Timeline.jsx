import React, {useState, useEffect} from 'react';
import Plot from '../../node_modules/react-plotly.js/react-plotly';
import {formatURLParams, getAPIParams, getParams, getQuery, titleCase, parseDate, formatDate} from "./../utils"
import {languageOptions, pageMeta, metricOptions} from "../defaults"
import {colorsRGB, getLayout, buildTraces, getMetric, getYlabel} from "./timelineutils"

const Timeline = ( props ) => {

    let config = {
            "displaylogo": false,
            'modeBarButtonsToRemove': ['pan2d','lasso2d','sendDataToCloud', 'select2d']
        }
    const [state, setState] = useState({data: buildTraces(props.data, props.viewer, props.metric), layout: getLayout(props.viewer, props.metadata, props.params), config: config});

    useEffect(  () => {
        console.log('Timeline state useEffect triggered')
        if (state.layout.xaxis) {
            let range = state.layout.xaxis.range
            if (typeof range[0]==='string' || range[0] instanceof String){
                let s = range[0].substring(0, 10)
                console.log(`Start: ${s}`)
                props.setStart(s)
            }
            if (typeof range[1]==='string' || range[1] instanceof String){
                let e = range[1].substring(0, 10)
                console.log(`End: ${e}`)
                props.setEnd(e)
            }
        }
    }, [state]);

    useEffect( () => {
        setState({...state, ...{'data': buildTraces(props.data, props.viewer, props.metric)}})
    }, [props.data])

    return (
        <Plot
            data={state.data}
            useResizeHandler
            style={{ width: "100%", height: "100%" }}
            layout={state.layout}
            scrollZoom={true}
            config={state.config}
            displayModeBar={true}
            onInitialized={(figure) => setState(figure)}
            onUpdate={(figure) => setState(figure)}
        />
    );
}


export default Timeline