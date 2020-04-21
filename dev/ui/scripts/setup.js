console.log("Loading setup.js")
// Today's date
let today = new Date()
// Extract year from today's date
let thisyear = today.getFullYear()
// Get one year ago
let lastyeardate = new Date()
lastyeardate = lastyeardate.setFullYear( lastyeardate.getFullYear() - 1 );
// January 1st, this year
let thisfirst = new Date(thisyear, 0, 1)

const defaultNgrams = ["hahaha","one two three","🦠","#friday"]

// Set default options
const defaultparams = {
    "ngrams": [],
    "language": "en",
    "metric": "rank",
    "rt": false,
    "scale": "log",
    "xrange": [new Date(2009, 6, 31), today],
    "xviewrange": [lastyeardate, today],
    "yrange": [1, 100000],
    "sizing": [800, 600]
}
// Limit options for certain parameters
const paramoptions = {
    "language": ["en","es","ru","fr"],
    "metric": ["rank", "counts", "freq"],
    "scale": ["log", "lin"],
    "RT": [true,false]
}
// An object containing our parameters
let params = defaultparams
let i = 0
let ngramData = {}
let ngramIDs = {}
let xmins = []
let xmaxes = []
let ymaxes = []
let mainChart

const colors = {
    'names': ["sky", "sage", "gold", "iris", "poppy", "lake", "sea", "rose", "shroom", "sun", "monarch"],
    'main': ["#00B6CF", "#8BC862", "#F3B544", "#9577B5", "#EF3D25", "#3D59A8", "#3BA585", "#C73275", "#805752", "#D5D126", "#EE612F"],
    'dark': ["#0681A2", "#649946", "#F89921", "#8D51A0", "#A01D21", "#252E6C", "#197352", "#931E59", "#562F2C", "#8B8633", "#A23522"],
    'light': ["#B5E2EA", "#C8E099", "#FCD69A", "#DAC9E3", "#FAC1BE", "#C0CFEB", "#B9E1D3", "#F6B0CF", "#E1C4C2", "#F8F4A9", "#F9C0AF"]
}

// Simple function for finding the fill, stroke, or tint by the color group name
function colorMe(name, type='main') { return colors[type][colors["names"].indexOf(name)] }
//console.log(colorMe("sky"))

function setRanges() {
    //console.log("Setting ranges...")
    // Lists of all date and metric min/max:
    Object.keys(ngramData).forEach(ngram => {
        ndata = ngramData.ngram.data
        xmins.push(ndata.xrange[0])
        xmaxes.push(ndata.xrange[1])
        ymaxes.push(ndata.yrange[1])
    })
    if (d3.min(xmins) < thisfirst) {
        params.xrange = [d3.min(xmins), d3.max(xmaxes)]
    } else {
        params.xrange = [thisfirst, d3.max(xmaxes)]
    }
    params.yrange[0] = d3.max(ymaxes) * 1.2;
    if (params['metric'] === 'freq') {
        params.yrange[1] = 0
    } else {
        params.yrange[1] = 1
    }
}

function setupPage() {
    // Check the correct boxes in the filter form according to the parameters
    //setFilters()
    //setRanges()
    makeCharts()
    // Get parameters from the URL and update current parameters accordingly
    getUrlParams()
}