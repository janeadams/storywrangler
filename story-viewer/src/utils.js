import * as d3 from "d3"
import {trackPromise} from "react-promise-tracker";

export const viewerOptions = ['ngrams', 'languages', 'realtime', 'rtd', 'zipf']

export const dateParser = date => new Date(d3.timeParse(date))

Date.prototype.addDays = function(days) {
    let date = new Date(this.valueOf())
    date.setDate(date.getDate() + days)
    return date;
}

export const parseDate = d3.timeParse("%Y-%m-%d")
export const parseRealtime = d3.timeParse("%Y-%m-%d %H:%M")
export const formatDate = d3.timeFormat("%Y-%m-%d")
export const formatRealtime = d3.timeFormat("%Y-%m-%d %H:%M")

// Today's date
export const  today = new Date()
export const  mostrecent = dateParser(new Date(today)).addDays(-3)
// Extract year from today's date
export const  thisyear = today.getFullYear()
// Get one year ago
export const  lastyeardate = dateParser(formatDate(new Date().setFullYear(thisyear - 1)))
// January 1st, this year
export const  thisfirst = new Date(thisyear, 1, 1)
export const  firstDate = new Date(2009,9,1)

export const titleCase = (title => {
    return title.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
})

export const formatURLParams = (params => {
    let paramlist = []
    for (let p of Object.keys(params)) {
        paramlist.push(p + "=" + params[p])
    }
    if (paramlist.length > 0){
        return String("?" + paramlist.join("&"))
    }
    else {
        return ''
    }
})

export const parseArray = (strarr => {
    return strarr ? strarr.split(',') : null
})

export const getData = (async (v, q, p) => {
    const endpoint = `http://hydra.uvm.edu:3000/api/${v}/`
    let apicall = endpoint+q
    if (p){
        let formattedAPIparams = []
        for (const [key, value] of Object.entries(p)) {
            formattedAPIparams.push(key+"="+value)
        }
        apicall = apicall.concat('?'+formattedAPIparams.join('&'))
    }
    console.log('Formatted API call as:')
    console.log(apicall)
    const response = await fetch(apicall);
    const json = await response.json();
    console.log(json)
    if (json) { return json.data }
    else { return {} }
})

const filterParams = ((accepted, allP) => {
    const result = {};
    for (let p in allP)
        if (accepted.indexOf(p) > -1)
            result[p] = allP[p];
    return result;})

export const getParams = (v, allP) => {
    switch (v) {
        case ('ngrams'):
        case ('realtime'):
        case ('potus'):
            return filterParams(['ngrams','language','rt','scale','metric'],allP)
        case ('languages'):
            return filterParams(['languages','rt','scale','metric'],allP)
        case ('rtd'):
        case ('zipf' ):
            return filterParams(['queryDate','language','rt','scale','metric','n'],allP)
    }
}

export const getQuery = (v, allP) => {
    switch (v) {
        case ('ngrams'):
        case ('realtime'):
        case ('potus'):
            return allP['ngrams']
        case 'languages':
            return allP['languages']
        case ('rtd'):
        case ('zipf' ):
            return allP['queryDate']
    }
}

export const getAPIParams = (v, allP) => {
    switch (v) {
        case ('ngrams'):
        case ('realtime'):
        case ('potus'):
            return filterParams(['language'], allP)
        case ('languages'):
            return null
        case ('rtd'):
        case ('zipf' ):
            return filterParams(['language','n','metric','rt'],allP)
    }
}