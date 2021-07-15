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
export const lastweek = dateParser(new Date(today)).addDays(-7)
export const  mostrecent = dateParser(new Date(today)).addDays(-1)
// Extract year from today's date
export const  thisyear = today.getFullYear()
// Get one year ago
export const  lastyeardate = dateParser(formatDate(new Date(mostrecent).setFullYear(thisyear - 1)))
// January 1st, this year
export const  thisfirst = new Date(thisyear, 1, 1)
export const  firstDate = new Date(2009,9,1)

function getDates(startDate, stopDate) {
    let dateArray = []
    let currentDate = startDate
    while (currentDate <= stopDate) {
        dateArray.push(new Date (currentDate))
        currentDate = currentDate.addDays(1)
    }
    return dateArray;
}

function getTimes(startDateTime, stopDateTime) {
    let timeArray = []
    let currentTime = startDateTime
    while (currentTime <= stopDateTime) {
        timeArray.push(currentTime)
        currentTime = new Date(currentTime.getTime() + 15 * 60000)
    }
}

export const fillMissingTimes = (data) => {
    return data
}

export const fillMissingDates = (data) => {
    console.log('Reached fillMissing()')
    let metrics = Object.keys(data)
    metrics = metrics.filter(item => item !== 'date')
    console.log({metrics})
    let dates = Object.assign([], data['date'])
    let newdates = []
    let newundefs = []
    let fullDateRange = getDates(parseDate(dates[0]), parseDate(dates[dates.length - 1]))
    fullDateRange.forEach(date => {
        if (dates.includes(formatDate(date))) {
        } else {
            newdates.push(formatDate(date))
            newundefs.push(undefined)
        }
    })
    console.log({newdates})
    console.log({newundefs})
    let filled = {}
    metrics.forEach(metric => {
        let values = data[metric]
        values.push.apply(values, newundefs)
        filled[metric] = values
    })
    dates.push.apply(dates, newdates)
    filled['date'] = dates
    console.log({filled})
    return filled
}

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
    const endpoint = `https://storywrangling.org/api/${v}/`
    // Pull the JSON data
    let formatted_query = encodeURIComponent(q)
    let apicall = endpoint+formatted_query
    if (p){
        let formattedAPIparams = []
        for (const [key, value] of Object.entries(p)) {
            formattedAPIparams.push(key+"="+stripHashtags(value))
        }
        formattedAPIparams.push('gapped=true')
        apicall = apicall.concat('?'+formattedAPIparams.join('&'))
    }
    return apicall
}

export const getData = (async (v, q, p) => {
    console.log('Getting data for params:')
    console.log({p})
    const response = await fetch(getAPIcall(v, q, p));
    let status = response.status
    const json = await response.json();
    if (status !== 200){
        if (status === 401) {
            switch (v) {
                case('ngrams'):
                case ('realtime'):
                    alert(`Error ${response.status}: ${q} was not found in the database. It's possible that this query doesn't exist in the database, or that there is an error on the API side of things. If this problem persists, please let us know by filing an issue on GitHub.`)
                case('rtd'):
                case('zipf'):
                    alert(`Error ${response.status}: ${q} was not found in the database. It's possible that our ingest hasn't caught up with your specified query time, or that your search doesn't exist in the database. If you're searching a very recent date, give us another day or two to write to the database.`)
            }
        }
    }
    if (json) {
        return json
    }
    else {
        alert(`DB error ${response.status}`)
        return {}
    }
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
            return filterParams(['queryDate','language','rt','scale','metric','n','punctuation','start','end'],allP)
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
            return {...APIparams, ...filterParams(['language','n','metric','rt','punctuation'], allP)}
    }
}