import * as d3 from "d3"

export const viewerOptions = ['ngrams', 'languages', 'realtime', 'rtd', 'zipf','potus']

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