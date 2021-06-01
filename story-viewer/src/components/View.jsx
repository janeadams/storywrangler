import React, {useState, useEffect} from 'react';
import {withRouter} from "react-router";
import { useHistory, useLocation } from 'react-router-dom'
import Dropdown from "./../options/dropdown"
import Search from "./../options/search"
import Toggle from "./../options/toggle"
import Calendar from "./../options/calendar"
import Timeline from "../visualizations/Timeline"
import EnhancedTable from "../visualizations/Table";
import { usePromiseTracker, trackPromise } from 'react-promise-tracker';
import { css } from "@emotion/react";
import GridLoader from "react-spinners/GridLoader";
import {formatURLParams, parseArray, getData, getAPIcall, getParams, getQuery, getAPIParams} from "../utils"
import {defaults, metricOptions, languageOptions, languageValueOptions, pageMeta} from "../defaults"
import Subplot from "../visualizations/Subplot";

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
    const [queryDate, setDate] = useState( urlParams.get('queryDate') ? urlParams.get('queryDate') : defaults(viewer).queryDate)
    const [rt, setRT] = useState(urlParams.get('rt')=='false'? false : true)
    const [scale, setScale] = useState(urlParams.get('scale') || defaults(viewer).scale)
    const [metric, setMetric] = useState(urlParams.get('metric') || defaults(viewer).metric)
    const [n, setN] = useState(urlParams.get('n') || defaults(viewer).n)
    const [start, setStart] = useState(urlParams.get('start') || defaults(viewer).start)
    const [end, setEnd] = useState(urlParams.get('end') || defaults(viewer).end)
    const [punctuation, setPunctuation] = useState(urlParams.get('punctuation')=='false'? false : true)

    const allParams = {
        'ngrams': ngrams,
        'language': language,
        'languages': languages ? languages : language,
        'rt': rt,
        'scale': scale,
        'metric': metric,
        'punctuation': punctuation,
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
    }, [viewer,ngrams,rt,scale,metric,n,language,languages,punctuation,queryDate]);

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
            console.log({APIparams})
            return getData(viewer, query, APIparams)
        }
        trackPromise(updateData()).then(function(result) {
            let metaDataToSet = result.meta
            if (viewer==='ngrams'){metaDataToSet['ngrams']=result.meta.query}
            setMetadata(metaDataToSet)
            if (['rtd','zipf'].includes(viewer) && ('top_5' in result.meta)){
                setTop5(result.meta['top_5'])
                console.log({top5})
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
                start={start}
                end={end}
                setStart={setStart}
                setEnd={setEnd}
            />
        }
        else if (['rtd','zipf'].includes(viewer)) {
            let featureParams = {...params, ...{'metric': 'rank'}}
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
        if (['ngrams', 'potus', 'realtime', 'languages'].includes(viewer)) {
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
                        metric={metric}
                        i={i}
                        viewer={viewer}
                        params={params}
                        metadata={metadata}
                        start={start}
                        end={end}
                        setStart={setStart}
                        setEnd={setEnd}
                    />{['ngrams', 'realtime'].includes(viewer) && <div className={"twitter-search"}><a
                        href={`https://twitter.com/search?q=%22${key}%22%20until%3A${end}%20since%3A${start}&src=typed_query&f=top`}
                        target={"_blank"}>{`Search Twitter for "${key}" in this date range`}</a></div>}</div>)
                    i += 1
                })
            }
            return (<div className="subplotHolder" className="flexcontainer">{subPlots}</div>)
        } else if (['rtd', 'zipf'].includes(viewer)) {
            let subPlots = []
            let i = 0
            if (top5data) {
                let featureParams = {...params, ...{'metric': 'rank'}}
                Object.entries(top5data).forEach(([key, value]) => {
                    console.log('Adding subplot traces:')
                    console.log({key})
                    console.log({value})
                    subPlots.push(<div className={'subplot'}><Subplot
                        tracename={key}
                        value={value}
                        metric={'rank'}
                        i={i}
                        viewer={viewer}
                        params={featureParams}
                        metadata={metadata}
                        start={start}
                        end={end}
                        setStart={setStart}
                        setEnd={setEnd}
                    />{<div className={"twitter-search"}><a
                        href={`https://twitter.com/search?q=%22${key}%22%20until%3A${end}%20since%3A${start}&src=typed_query&f=top`}
                        target={"_blank"}>{`Search Twitter for "${key}" in this date range`}</a></div>}</div>)
                    i += 1
                })
                let details = (<div><EnhancedTable viewer={viewer} params={params} data={data}/>
                    <div className="subplotHolder" className="flexcontainer">{subPlots}</div>
                </div>)
                return data ? details : ''
            }
        } else {
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
                prompt={"Language:"}
                options={languageOptions(viewer)}
                />,
            'languages': <Search
                param='languages'
                state={languages}
                setState={setLanguages}
                prompt={"Select languages:"}
                options={languageValueOptions(viewer)}
                />,
            'rt': <Toggle
                param='rt'
                state={rt}
                setState={setRT}
                prompt={'With retweets? '}/>,
            'punctuation': <Toggle
                param='punctuation'
                state={punctuation}
                setState={setPunctuation}
                prompt={'Include punctuation? '}/>,
            'scale': <Dropdown
                param='scale'
                state={scale}
                setState={setScale}
                prompt={"Scale:"}
                options={{'log':'Logarithmic', 'lin':"Linear"}}
                />,
            'metric': <Dropdown
                param='metric'
                state={metric}
                setState={setMetric}
                prompt={"Metric:"}
                options={metricOptions(viewer, n)}
                />,
            'n': <Dropdown
                param='n'
                state={n}
                setState={setN}
                prompt={"Number of Ngrams:"}
                options={{1:'1-grams', 2:"2-grams",3:"3-grams"}}/>,
            'queryDate': <Calendar
                date={queryDate}
                setDate={setDate}
                prompt={"Date:"}/>
        }
        Object.keys(params).forEach(param => {
            if (['zipf','rtd'].includes(viewer)) {
             if (param !== 'metric'){elements.push(paramElements[param])}
            }
            else {
                if (param !== 'punctuation'){ elements.push(paramElements[param])}}
        })
        let downloadURL = getAPIcall(viewer,query,APIparams)
        let downloadButton = <p><a href={`${downloadURL}&response=csv&gapped=false`} target='_blank'>Download CSV</a> or <a href={`${downloadURL}&gapped=false`} target='_blank'>JSON</a></p>
        elements.push(downloadButton)
        return elements
    }
    const { promiseInProgress } = usePromiseTracker();
      
      return (
          <main>
              <div className="row" className="flexcontainer">
                <section className="options">
                    <h1>{pageMeta(viewer).title}</h1>
                    <p>{pageMeta(viewer).desc}</p>
                    <form>
                        {form()}
                    </form>
              </section>
                  <section className="feature">
                    {promiseInProgress ? <GridLoader loading={promiseInProgress} css={override} /> : feature()}
                </section>
            </div>
              <div className="row">
                  <section className="details">
                      {promiseInProgress ? <GridLoader loading={promiseInProgress} css={override} /> : details()}
                  </section>
              </div>
              <p className="bug">&#x1F41B; <em>Found a bug? <a href="https://github.com/janeadams/storywrangler/issues"
                                                               target="_blank">Submit an issue on GitHub here</a>.</em>
              </p>
        </main>
      )
}

export default withRouter(View);