import * as d3 from "d3"

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
export const lastweek = dateParser(new Date(today)).addDays(-10)
export const  mostrecent = dateParser(new Date(today)).addDays(-3)
// Extract year from today's date
export const  thisyear = today.getFullYear()
// Get one year ago
export const  lastyeardate = dateParser(formatDate(new Date(mostrecent).setFullYear(thisyear - 1)))
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

export const sigFigMe = ((num, figs) => {
    return Number.parseFloat(num).toPrecision(figs)
})

export const formatMe = ((num, metric) => {
    switch (metric){
        case("rd_contribution"):
        case("freq"):
            return Number.parseFloat(num).toPrecision(3)
        case("normed_rd"): return Number.parseFloat((num*100000).toString()).toPrecision(3)
        default: return parseFloat(num.toString())
    }
})

export const stripHashtags = (value => {
    return (typeof value === 'string' || value instanceof String) ? value.replaceAll("#","%23") : value
})

export const getAPIcall = (v, q, p) => {
    const endpoint = `http://hydra.uvm.edu:3000/api/${v}/`
    let apicall = endpoint+stripHashtags(q.toString())
    if (p){
        let formattedAPIparams = []
        for (const [key, value] of Object.entries(p)) {
            formattedAPIparams.push(key+"="+stripHashtags(value))
        }
        apicall = apicall.concat('?'+formattedAPIparams.join('&'))
    }
    return apicall
}

export const getData = (async (v, q, p) => {
    console.log('Getting data for params:')
    console.log({p})
    const response = await fetch(getAPIcall(v, q, p));
    const json = await response.json();
    if (json) { return json }
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
            return filterParams(['ngrams','language','rt','scale','metric','start','end'],allP)
        case ('languages'):
            return filterParams(['languages','rt','scale','metric','start','end'],allP)
        case ('rtd'):
        case ('zipf' ):
            return filterParams(['queryDate','language','rt','scale','metric','n','start','end'],allP)
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
    let APIparams = {}
    switch (v) {
        case ('ngrams'):
        case ('realtime'):
        case ('potus'):
            return {...APIparams, ...filterParams(['language'], allP)}
        case ('languages'):
            return APIparams
        case ('rtd'):
        case ('zipf' ):
            return {...APIparams, ...filterParams(['language','n','metric','rt'], allP)}
    }
}