import React, {useState, useEffect} from 'react';
import Plot from '../../node_modules/react-plotly.js/react-plotly';
import {languageOptions} from "../defaults"
import {getLayout, buildTrace} from "./timelineutils"
import {is_touch_enabled} from "./../utils"

const Subplot = ( props ) => {

    let config = {
        "displaylogo": false,
        "showlegend": false,
        'modeBarButtonsToRemove': ['pan2d','lasso2d','sendDataToCloud', 'select2d'],
        'toImageButtonOptions': {
            'format': 'png',
            'filename': `${props.viewer}_${props.tracename}_${props.start}_${props.end}`,
                'height': 800,
                'width': 1500,
                'scale': 2
        }
    }

    if (is_touch_enabled){
        config.displayModeBar = false;
    }

    let languageMap = languageOptions(props.viewer)
    let getTitle = (tracename) => {return props.viewer === "languages" ? languageMap[tracename] : `"${tracename}"`}

    const [state, setState] = useState({
        data: [buildTrace(props.viewer, props.tracename, props.value, props.metric, props.i, true)],
        layout: getLayout(props.viewer, props.metadata, props.params, getTitle(props.tracename)),
        config: config});

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
        setState({...state, ...{'data': [buildTrace(props.viewer, props.tracename, props.value, props.metric, props.i, true)]}})
    }, [props.value])

    useEffect( () => {
        let newLayout = getLayout(props.viewer, props.metadata, props.params, getTitle(props.tracename))
        newLayout.xaxis.range = [props.start, props.end]
        setState({...state, ...{layout: newLayout}})
    }, [props.start, props.end, props.tracename])

    return (
        <Plot
            data={state.data}
            useResizeHandler
            style={{ width: "100%"}}
            layout={state.layout}
            scrollZoom={true}
            config={state.config}
            onInitialized={(figure) => setState(figure)}
            onUpdate={(figure) => setState(figure)}
        />
    );
}


export default Subplot