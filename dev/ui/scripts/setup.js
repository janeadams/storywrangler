console.log("Loading setup.js")
const dateParser = date => new Date(d3.timeParse(date))
const dateFormatter = d3.timeFormat("%Y-%m-%d")

// Today's date
let today = new Date()
// Extract year from today's date
let thisyear = today.getFullYear()
// Get one year ago
let lastyeardate = new Date()
lastyeardate.setFullYear(lastyeardate.getFullYear() - 1 );
// January 1st, this year
let thisfirst = new Date(thisyear, 0, 1)

// Set default options
const defaultparams = {
    "ngrams": ["hahaha","one two three","#friday","🦠"],
    "language": "en",
    "metric": "rank",
    "rt": false,
    "scale": "log",
    "xviewrange": [lastyeardate, today],
    "xrange": [lastyeardate, today],
    "yrange": [10000, 1],
}

// Limit options for certain parameters
const paramoptions = {
    "language": ["en","es","ru","fr"],
    "metric": ["rank", "counts", "freq"],
    "scale": ["log", "lin"],
    "rt": [true,false]
}
// An object containing our parameters
let params = {}
let i = 0 // For counting which color to choose for the ngram
let ngramData = {}
let xmins = []
let xmaxes = []
let ymins = []
let ymaxes = []
let mainChart
let subplots = []

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
    if (Object.keys(ngramData).length > 0 ){ // If there is ngram data...
        console.log("Setting ranges...")
        // Get the minimum and maximum values for all ngrams
        params.xrange = [d3.min(xmins), d3.max(xmaxes)]
        console.log(`Setting params[xrange] to ${params.xrange}`)
        // If the metric is rank, go from highest to lowest
        if (params['metric'] === 'rank') {params.yrange = [Math.ceil(d3.max(ymaxes) * 1.2), 1]}
        // Otherwise, go from lowest to highest
        else {params.yrange = [0, Math.ceil(d3.max(ymaxes) * 1.2)]}
        // Note above: Math.ceil() and * 1.2 pads the range a little
        console.log(`Setting params[yrange] to ${params.yrange}`)
    }
    else { // Otherwise, set to the default ranges
        params.xrange = defaultparams.xrange
        params.yrange = defaultparams.yrange
    }
}

function setupPage() {
    d3.select('body').classed('busy-cursor',true)
    params = Object.assign({}, defaultparams) // Make a copy of the default parameters
    Object.freeze(defaultparams) // Freeze the defaults, since they shouldn't ever change
    getUrlParams() // Get parameters from the URL and update current parameters accordingly
    //setFilters() // Check the correct boxes in the filter form according to the parameters
    makeCharts() // Make all the charts
    params['ngrams'].forEach(n => loadData(n)) // Load data for all the ngrams
    setTimeout(() => {d3.select('body').classed('busy-cursor',false)})
}