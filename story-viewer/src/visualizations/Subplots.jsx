import React, {useState, useEffect} from 'react';
import Plot from '../../node_modules/react-plotly.js/react-plotly';
import {formatURLParams, getAPIParams, getParams, getQuery, titleCase, parseDate, formatDate} from "./../utils"
import {languageOptions, pageMeta, metricOptions} from "../defaults"
import {colorsRGB, getLayout, buildTraces, getMetric, getYlabel} from "./timelineutils"
import Subplot from "./Subplot";

const Subplots = props => {

    console.log('Subplots reached. Data:')
    console.log(props.data)

    const buildSubplots = data => {
        let subPlots = []
        let i = 0
        if (data) {
            Object.entries(data).forEach(([key, value]) => {
                console.log('Adding subplot traces:')
                console.log({key})
                console.log({value})
                subPlots.push(<div className={'subplot'}><Subplot
                    tracename={key}
                    value={value}
                    metric={props.metric}
                    i={i}
                    viewer={props.viewer}
                    params={props.params}
                    metadata={props.metadata}
                    start={props.start}
                    end={props.end}
                /></div>)
                i+=1
            })
        }
        return subPlots
    }

    const [state, setState] = useState(buildSubplots(props.data));

    useEffect( () => {
        console.log('Subplots props.data useEffect triggered')
        setState(buildSubplots(props.data))
    }, [props.data])

    return props.data ? (
        <section className={'subplotHolder'}>
            {state}
        </section>
    ) : '';
}


export default Subplots