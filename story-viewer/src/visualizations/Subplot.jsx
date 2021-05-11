import React, {useState, useEffect} from 'react';
import Plot from '../../node_modules/react-plotly.js/react-plotly';
import {formatURLParams, getAPIParams, getParams, getQuery, titleCase, parseDate, formatDate} from "./../utils"
import {languageOptions, pageMeta, metricOptions} from "../defaults"
import {colorsRGB, getLayout, buildTrace, buildSubplots, getYlabel} from "./timelineutils"

const Subplot = ( props ) => {

    let config = {
        "displaylogo": false,
        'modeBarButtonsToRemove': ['pan2d','lasso2d','sendDataToCloud', 'select2d']
    }

    const [state, setState] = useState({data: buildTrace(props.viewer, props.ngram, props.value, props.metric, props.i), layout: getLayout(props.viewer, props.metadata, props.params), config: config});


    useEffect( () => {
        setState({...state, ...{'data': buildTrace(props.viewer, props.ngram, props.value, props.metric, props.i)}})
    }, [props.value])

    console.log('Subplot data:')
    console.log(props.ngram)
    console.log(props.value)

    return (
        <Plot
            data={state.data}
            useResizeHandler
            style={{ width: "50%", height: "100%" }}
            layout={state.layout}
            scrollZoom={true}
            config={state.config}
            displayModeBar={true}
            onInitialized={(figure) => setState(figure)}
            onUpdate={(figure) => setState(figure)}
        />
    );
}


export default Subplot