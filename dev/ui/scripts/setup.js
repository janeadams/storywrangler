console.log("Loaded setup.js")

// Today's date
today = new Date()
// Extract year from today's date
thisyear = today.getFullYear()
// Get one year ago
lastyeardate = new Date()
lastyeardate = lastyeardate.setFullYear( lastyeardate.getFullYear() - 1 );
// January 1st, this year
thisfirst = new Date(thisyear, 0, 1)

// Set default options
const defaultparams = {
    "queries": ["#COVID19","#coronavirus","pandemic","🦠","have symptoms","can't get tested","tested positive","😷","toilet paper"],
    "language": "en",
    "metric": "rank",
    "RT": false,
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
let params = {
    "queries": []
}

let querydata = []

const colors = {
    'names': ["sky", "sage", "gold", "iris", "poppy", "lake", "sea", "rose", "shroom", "sun", "monarch"],
    'main': ["#00B6CF", "#8BC862", "#F3B544", "#9577B5", "#EF3D25", "#3D59A8", "#3BA585", "#C73275", "#805752", "#D5D126", "#EE612F"],
    'dark': ["#0681A2", "#649946", "#F89921", "#8D51A0", "#A01D21", "#252E6C", "#197352", "#931E59", "#562F2C", "#8B8633", "#A23522"],
    'light': ["#B5E2EA", "#C8E099", "#FCD69A", "#DAC9E3", "#FAC1BE", "#C0CFEB", "#B9E1D3", "#F6B0CF", "#E1C4C2", "#F8F4A9", "#F9C0AF"]
}

// Simple function for finding the fill, stroke, or tint by the color group name
function colorMe(name, type='main') { return colors[type][colors["names"].indexOf(name)] }
//console.log(colorMe("sky"))

function setSizing() {
    params.sizing[0] = 0.8 * (document.documentElement.clientWidth)
    //console.log("Updating width to...", params.sizing[0])
    params.sizing[1] = 0.6 * (document.documentElement.clientHeight)
    //console.log("Updating height to...", params.sizing[1])
}

function setRanges() {
    //console.log("Setting ranges...")
    // Lists of all date and metric min/max:
    let xmins = [];
    let xmaxes = [];
    let ymaxes = [];
    querydata.forEach(data => {
        xmins.push(data.xrange[0]);
        xmaxes.push(data.xrange[1]);
        ymaxes.push(data.yrange[1]);
    });
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
    // Get parameters from the URL and update current parameters accordingly
    getUrlParams()
    // Decode the URL ngrams (e.g. emojis)
    params['ngrams'] = params['ngrams'].map(n => decodeURI(n))
    // Check the correct boxes in the filter form according to the parameters
    setFilters()
    // Load the ngram data from parameters
    for (var n of params['ngrams']) {
        loadData(n)
    }
    setSizing()
    setRanges()
}