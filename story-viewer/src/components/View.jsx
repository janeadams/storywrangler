import React, {useState, useEffect} from 'react';
import {withRouter} from "react-router";
import { useHistory, useLocation } from 'react-router-dom'
import Dropdown from "./../options/dropdown"
import Search from "./../options/search"
import Toggle from "./../options/toggle"
import Calendar from "./../options/calendar"
import Timeline from "../visualizations/Timeline"
import Barchart from "../visualizations/Barchart"
import EnhancedTable from "../visualizations/Table";
import LoadingIndicator from "./LoadingIndicator"
import { usePromiseTracker, trackPromise, promiseInProgress } from 'react-promise-tracker';
import { css } from "@emotion/react";
import GridLoader from "react-spinners/GridLoader";
import {formatURLParams, parseArray, getData, getParams, getQuery, getAPIParams} from "../utils"
import {defaults, metricOptions, languageOptions, languageValueOptions, pageMeta} from "../defaults"
import {getLayout, getMetric} from '../visualizations/timelineutils'

const override = css`
  display: block;
  margin: 100px auto;
  vertical-align:middle;
  align: center;
`;

const View = ({viewer}) => {

    const location = useLocation();
    const urlParams = new URLSearchParams(useLocation().search)

    const [loading, setLoading] = useState(false)

    const [ngrams, setNgrams] = useState(parseArray(urlParams.get('ngrams')) || defaults(viewer).ngrams)
    const [language, setLanguage] = useState(urlParams.get('language') || defaults(viewer).language)
    const [languages, setLanguages] = useState(parseArray(urlParams.get('languages')) || defaults(viewer).languages)
    const [queryDate, setDate] = useState( defaults(viewer).queryDate)
    const [rt, setRT] = useState(urlParams.get('rt')=='false'? false : true)
    const [scale, setScale] = useState(urlParams.get('scale') || defaults(viewer).scale)
    const [metric, setMetric] = useState(urlParams.get('metric') || defaults(viewer).metric)
    const [n, setN] = useState(defaults(viewer).n)
    const [start, setStart] = useState(urlParams.get('start') || defaults(viewer).start)
    const [end, setEnd] = useState(urlParams.get('end') || defaults(viewer).end)

    const allParams = {
        'ngrams': ngrams,
        'language': language,
        'languages': languages ? languages : language,
        'rt': rt,
        'scale': scale,
        'metric': metric,
        'n': n,
        'queryDate': queryDate,
        'start': start,
        'end': end
    }
    const [data, setData] = useState()
    const [top5, setTop5] = useState()
    const [top5data, setTop5Data] = useState()
    const [query, setQuery] = useState(getQuery(viewer, allParams))
    const [APIparams, setAPIparams] = useState(getAPIParams(viewer))

    const [params, setParams] = useState(getParams(viewer,allParams))
    const [metadata, setMetadata] = useState({'time_1': defaults(viewer).start, 'time_2': defaults(viewer).end})

    useEffect(() => {async function updateSettings() {
        console.log(`param change triggered updateSettings`)
        setParams(getParams(viewer, allParams))
        setAPIparams(getAPIParams(viewer, allParams))
        setQuery(getQuery(viewer, allParams))
        console.log({params})}
        updateSettings();
    }, [viewer,ngrams,rt,scale,metric,n,language,languages,queryDate]);

    const history = useHistory();

    useEffect(  () => { async function updateURL() {
        console.log('history updateURL useEffect triggered')
        params['start'] = start
        params['end'] = end
        if (params) {
            history.push({'search': formatURLParams(params)})
        }}
        updateURL()
    }, [params, history, start, end]);

    useEffect( () => {
        console.log('Data fetch useEffect triggered')
        async function updateData() {
            return getData(viewer, query, APIparams)
        }
        trackPromise(updateData()).then(function(result) {
            let metaDataToSet = result.metadata
            if (viewer==='ngrams'){metaDataToSet['ngrams']=result.metadata.query}
            setMetadata(metaDataToSet)
            if (['rtd','zipf'].includes(viewer) && ('top_5' in result.metadata)){
                setTop5(result.metadata['top_5'])
            }
            setData(result.data)
        })
    }, [viewer, query, APIparams]);

    useEffect(() => {
        async function updateTop5(ngram_list) {
            return getData('ngrams', ngram_list, {'ngrams':ngram_list,'language':language})
        }
        console.log(`top5 useeffect triggered`)
        console.log({top5})
        if (top5){
            trackPromise(updateTop5(top5)).then(function(result) {
                setTop5Data(result.data)
            })
        }
    }, [top5])

    let feature = () => {
        if (['ngrams','potus','realtime','languages'].includes(viewer)){
            return <Timeline
                viewer={viewer}
                params={params}
                data={data}
                metric={getMetric(params)}
                start={start}
                end={end}
                setStart={setStart}
                setEnd={setEnd}
            />
        }
        else if (['rtd','zipf'].includes(viewer)) {
            let featureParams = Object.assign({}, params)
            featureParams['metric']='rank'
            return <Timeline
                viewer={viewer}
                params={featureParams}
                data={top5data}
                metadata={metadata}
                start={start}
                end={end}
                setStart={setStart}
                setEnd={setEnd}
            />
        }
        else {
            return {viewer}
        }
    }

    let details = () => {
        if (['ngrams','potus','realtime','languages'].includes(viewer)){
            return <p>Subplots here</p>
        }
        else if (['rtd','zipf'].includes(viewer)) {
            return data ? <EnhancedTable viewer={viewer} params={params} data={data}/> : 'no data'
        }
        else {
            return {viewer}
        }
    }

    let form = () => {
        let elements = []

        const paramElements = {
            'ngrams': <Search
                param='ngrams'
                state={ngrams}
                setState={setNgrams}
                prompt={"Search for 1, 2, or 3-word phrases:"}/>,
            'language': <Dropdown
                param='language'
                state={language}
                setState={setLanguage}
                options={languageOptions(viewer)}
                prompt={"Language:"}/>,
            'languages': <Search
                param='languages'
                state={languages}
                setState={setLanguages}
                options={languageValueOptions(viewer)}
                prompt={"Select languages:"}/>,
            'rt': <Toggle
                param='rt'
                state={rt}
                setState={setRT}
                prompt={'With retweets?'}/>,
            'scale': <Dropdown
                param='scale'
                state={scale}
                setState={setScale}
                options={{'log':'Logarithmic', 'lin':"Linear"}}
                prompt={"Scale:"}/>,
            'metric': <Dropdown
                param='metric'
                state={metric}
                setState={setMetric}
                options={metricOptions(viewer, n)}
                prompt={"Metric:"}/>,
            'n': <Dropdown
                param='n'
                state={n}
                setState={setN}
                options={{1:'1-grams', 2:"2-grams",3:"3-grams"}}/>,
            'queryDate': <Calendar
                date={queryDate}
                setDate={setDate}
                prompt={"Date:"}/>
        }

        Object.keys(params).forEach(param => {
            elements.push(paramElements[param])
        })

        return elements
    }
    const { promiseInProgress } = usePromiseTracker();
      
      return (
          <main>
              <div className="row">
                <section className="options">
                    <h1>{pageMeta(viewer).title}</h1>
                    <p>{pageMeta(viewer).desc}</p>
                    <form>
                        {form()}
                    </form>
              </section>
                  <section className="feature">
                    {/*<p>Data: {JSON.stringify(data)}</p>*/}
                    {promiseInProgress ? <GridLoader loading={promiseInProgress} css={override} /> : feature()}
                </section>
            </div>
              <div className="row">
                  <section className="details">
                      {promiseInProgress && <GridLoader loading={promiseInProgress} css={override} />}
                      {details()}
                  </section>
              </div>
        </main>
      )
}

export default withRouter(View);