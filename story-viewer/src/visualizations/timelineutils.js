import {languageOptions, metricOptions, pageMeta} from "../defaults";
import {titleCase} from "../utils";
import React from "react";
import DataFrame, { Row } from 'dataframe-js';

export const colorsRGB = ["rgb(228,26,28)",
    "rgb(55,126,184)",
    "rgb(77,175,74)",
    "rgb(152,78,163)",
    "rgb(255,127,0)",
    "rgb(255,255,51)",
    "rgb(166,86,40)",
    "rgb(247,129,191)",
    "rgb(153,153,153)"]

export const colorsLightRGB = ["rgb(251,180,174)",
    "rgb(179,205,227)",
    "rgb(204,235,197)",
    "rgb(222,203,228)",
    "rgb(254,217,166)",
    "rgb(255,255,204)",
    "rgb(229,216,189)",
    "rgb(253,218,236)",
    "rgb(242,242,242)"]

export const getYlabel = (viewer,params) => {
    let Ylabel = params.rt ? metricOptions(viewer, 1)[params.metric] : metricOptions(viewer, 1)[params.metric] + " (no Retweets)"
    Ylabel = Object.keys(metricOptions(viewer, 1)).includes(params.metric) ? Ylabel : titleCase(params.metric);

    if (['num', 'unique'].includes(params.metric)) {
        Ylabel = Ylabel + " " + params.n + "-grams"
    }
    if (params.metric === 'odds') {
        Ylabel = Ylabel + " (1 in X N-grams)"
    }
    return Ylabel
}

export const getMetric = (params) => {
    let formattedMetric = params.metric
    if (['num', 'unique'].includes(params.metric)) {
        formattedMetric = params.metric + "_" + params.n + "grams"
    }
    formattedMetric = params.rt ? formattedMetric : formattedMetric + "_no_rt"
    return formattedMetric
}

export const getXaxisLayout = (viewer, metadata, params, subplot) => {
    let xaxisLayout = {
        range: [params.start, params.end],
        rangeslider: {
            visible: false
        },
        fixedrange: false,
        type: "date",
        rangeselector: subplot ? false : {
            buttons: [
                {label: "Show All Time", step: 'all'}
            ]}
    }
    if (['rtd'].includes(viewer)) {
        xaxisLayout['autorange'] = false
        if (metadata['time_1'] & metadata['time_2']) {
            xaxisLayout['range'] = [metadata['time_1'], metadata['time_2']]
        }
    }
    return xaxisLayout
}

export const getYaxisLayout = (viewer, params) => {
    let yaxisLayout = {
        type: params.scale,
        fixedrange: true,
        autorange: ['rank', 'odds'].includes(params.metric) ? 'reversed' : true,
        title: {text: getYlabel(viewer, params)}
    }
    //console.log(yaxisLayout)
    return yaxisLayout
}

export const getLayout = (viewer, metadata, params, subplot) => {
    let layout = {
        autosize: true,
        xaxis: getXaxisLayout(viewer, metadata, params, subplot),
        yaxis: getYaxisLayout(viewer, params),
        title: subplot ? subplot : getYlabel(viewer, params) + " of " + pageMeta(viewer)['title'] + " by Date",
        showlegend: subplot ? false : true,
        legend: {
            orientation:"h",
            yanchor:"bottom",
            y:1.02,
            xanchor:"right",
            x:1,
            itemwidth: 5
        },
        margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 100,
            pad: 10
        },
        hovermode:'x unified'
    }
    if (['rtd'].includes(viewer)) {
        console.log(metadata)
        let square = {
            type: 'rect',
            xref: 'x',
            x0: metadata['time_1'],
            y0: 0,
            x1: metadata['time_2'],
            yref: 'paper',
            y1: 1,
            fillcolor: 'lightgrey',
            opacity: 0.1
        }
        layout.shapes = [square]
    }
    return layout
}

export const buildTrace = (viewer, key, value, metric, i, subplot, gapped) => {
    let languageMap = languageOptions(viewer)
    let name = viewer === "languages" ? languageMap[key] : key;

    let data = value

    let df = new DataFrame(data, Object.keys(data))


    let trace = {
        x: data['date'],
        y: data[metric],
        type: 'scatter',
        mode: gapped ? 'lines+markers' : 'lines',
        line: {
            color: gapped ? colorsRGB[i] : colorsLightRGB[i],
            width: gapped ? (subplot ? 2 : 3) : (subplot ? 1 : 2),
            dash: gapped ? false : 'dot'
        },
        marker: {
            color: gapped ? colorsRGB[i] : colorsLightRGB[i],
            size: subplot ? 4 : 2
        },
        name: gapped ? name : name+" (interpolated)",
        connectgaps: gapped ? false : true,
        showlegend: gapped ? true : false,
        hoverinfo: gapped ? "all" : 'skip'
    }
    //console.log(trace)
    return trace
}

export const buildTraces = (data, viewer, metric, subplot) => {
    if (data) {
        console.log('Building traces...')
        let traces = []
        console.log({metric})
        let i = 0
        Object.entries(data).forEach(([key, value]) => {
            let ungappedTrace = buildTrace(viewer, key, value, metric, i, subplot, false)
            traces.push(ungappedTrace)
            let gappedTrace = buildTrace(viewer, key, value, metric, i, subplot, true)
            traces.push(gappedTrace)
            if (i < (colorsRGB.length - 1)) {
                i += 1
            } else {
                i = 0
            }
        })
        return traces
    }
    else {console.log('no data')}
}