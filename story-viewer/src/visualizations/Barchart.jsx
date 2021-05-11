import React from 'react';
import Plot from '../../node_modules/react-plotly.js/react-plotly';
import { titleCase, parseDate, parseRealtime } from "./../utils"
import {languageOptions} from "../defaults"

const Barchart = ( props ) => {

    if (props.data) {
        let metric = props.rt===true ? props.params.metric : props.params.metric+"_no_rt"
        console.log(`metric: ${metric}`)
        const data = {
            y: props.data['ngrams'],
            x: props.data[metric],
            type: 'bar',
            orientation: 'h'
        }
        console.log('Barchart data:')
        console.log(data)
        return (
            <Plot
                data={[data]}
                useResizeHandler
                style={{ width: "100%", height: "100%" }}
                layout={{
                    autosize: true,
                    title : titleCase(props.viewer),
                    xaxis: {
                        type: 'lin',
                        autorange: true ,
                        title: {text: titleCase(metric)},
                        categoryorder: props.params.metric === 'rank' ? 'total_descending' : 'total_ascending',
                    },
                    yaxis: {
                        autorange: 'reversed',
                        title: {text: 'Ngrams'},
                        categoryorder: props.params.metric === 'rank' ? 'total_descending' : 'total_ascending',
                    }
                }}
                config={{
                    "displaylogo": false,
                    'modeBarButtonsToRemove': ['pan2d','lasso2d','sendDataToCloud', 'select2d']
                }}
            />
        );
    }
    else return null;
}


export default Barchart