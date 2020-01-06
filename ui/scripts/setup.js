console.log("Loaded setup.js")

// Today's date
today = new Date()
// Extract year from today's date
thisyear = today.getFullYear()
// January 1st, this year
thisfirst = new Date(thisyear, 0, 1)

// Set default options
const defaultparams = {
    // queries : ["#MeToo","summer",emojis... etc], default: ["spring","summer","autumn","winter"]
    //"queries": ["#MeToo", "😊", "God", "New Year's", "2013", "@ArianaGrande"],
    "queries": ["#MeToo", "😊", "God", "2013", "@ArianaGrande"],
    // lang: ["en","es","ru",..."_all"], default: "en"
    "lang": "en",
    // metric: ["rank","counts","freq"], default: "rank"
    "metric": "rank",
    // scale: ["log","lin"], default: "log"
    "scale": "log",
    "xrange": [new Date(2009, 6, 31), today],
    "xviewrange": [new Date(2009, 6, 31), today],
    "yrange": [1, 100000],
    "sizing": [800, 600]
}
// Limit options for certain parameters
const paramoptions = {
    "lang": ["en"],
    "metric": ["rank", "counts", "freq"],
    "scale": ["log", "lin"]
}
// An object containing our parameters
var params = {
    "queries": []
}
// An array containing suggested searches:
//var querySuggestions = []
var querySuggestions = ["#DemDebate", "#HurricaneDorian", "#MeToo", "@realDonaldTrump"]
// An array of data objects
var querydata = []
// A list of our color names and hex values fortint, fill, & stroke
var colors = {
    'names': ["sky", "sage", "gold", "iris", "poppy", "lake", "sea", "rose", "shroom", "sun", "monarch"],
    'hue': ["#00B6CF", "#8BC862", "#F3B544", "#9577B5", "#EF3D25", "#3D59A8", "#3BA585", "#C73275", "#805752", "#D5D126", "#EE612F"],
    'dark': ["#0681A2", "#649946", "#F89921", "#8D51A0", "#A01D21", "#252E6C", "#197352", "#931E59", "#562F2C", "#8B8633", "#A23522"],
    'light': ["#B5E2EA", "#C8E099", "#FCD69A", "#DAC9E3", "#FAC1BE", "#C0CFEB", "#B9E1D3", "#F6B0CF", "#E1C4C2", "#F8F4A9", "#F9C0AF"]
}
// Simple function for finding the fill, stroke, or tint by the color group name
function colorMe(name, type) { return colors[type][colors["names"].indexOf(name)] }
//console.log(colorMe("sky", "fill"))

// Get the variables from the URL
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
        console.log("key = ", key, " value = ", value)
        // Parse arrays:
        value = value.replace("[", "").replace("/]", "").split(",")
        // If the parameter has a specified set of options:
        if (Object.keys(paramoptions).includes(key)) {
            //console.log("paramoptions includes ", key)
            //console.log("paramoptions[", key, "] = ", paramoptions[key])
            // And the value returned is incldued in those options:
            if (paramoptions[key].includes(String(value))) {
                // Accept the value from the url parameter
                //console.log("paramoptions for", key, " includes ", value)
                vars[key] = value
            } else {
                // If the value isn't one of the allowed options, set to default
                //console.log(value + " is an invalid option for the " + key + " parameter! Setting " + key + "to default:" + defaultparams[key])
                value = defaultparams[key]
            }
        }
        // Set the parameter to the value from the URL
        //console.log("Setting key:", key, " to value:", value)
        // If the parameter should be formatted as an array:
        if (typeof(params[key]) == "object" && typeof(value) == "string") {
            // Create an array
            vars[key] = []
            // Add the value to it
            vars[key].push(values)
        } else {
            vars[key] = value
        }
    })
    return vars;
}
// Get the parameters from the URL
function getUrlParam() {
    for (var p in params) {
        // If the parameter is in the URL
        if (window.location.href.indexOf(p) > -1) {
            // set the variable to the value in the url
            var urlvar = getUrlVars()[p]
            //console.log("Found ", p, " parameter in URL as ", urlvar)
            params[p] = urlvar
            //console.log("Changed params[", p, "] to ", params[p])
        }
    }
}

function setFilters() {
    // Check the boxes based on the parameters
    for (var filter of ['metric', 'lang', 'scale']) {
        console.log("Clearing all checkboxes for ", filter)
        // Clear all checked boxes
        d3.selectAll("input[name = " + filter + "]").property('checked', false)
        // Check only the correct box for this parameter value
        console.log("Checking box for", params[filter], "on filter", filter)
        d3.selectAll("input[value = " + params[filter] + "]").property('checked', true)
    }
    if (params['metric'] == 'freq') {
        // Remove the log toggle from the options list
        d3.select("#scaleFilter").style("display", "none")
        // If we're counting frequency, force scale to linear
        params["scale"] = "lin"
    } else {
        d3.select("#scaleFilter").style("display", "inline-block")
    }
}

function setSizing() {
    params.sizing[0] = 0.8 * (document.documentElement.clientWidth)
    //console.log("Updating width to...", params.sizing[0])
    params.sizing[1] = 0.6 * (document.documentElement.clientHeight)
    //console.log("Updating height to...", params.sizing[1])
}

function setRanges() {
    //console.log("Setting ranges...")
    // Lists of all date and metric min/max:
    var xmins = []
    var xmaxes = []
    var ymaxes = []
    querydata.forEach(data => {
        xmins.push(data.xrange[0])
        xmaxes.push(data.xrange[1])
        ymaxes.push(data.yrange[1])
    })
    if (d3.min(xmins) < thisfirst) {
        params.xrange = [d3.min(xmins), d3.max(xmaxes)]
    } else {
        params.xrange = [thisfirst, d3.max(xmaxes)]
    }
    params.yrange[0] = d3.max(ymaxes) * 1.2
    if (params['metric'] == 'freq') {
        params.yrange[1] = 0
    } else {
        params.yrange[1] = 1
    }
}

// When a new word is queried...
function loadData(word) {
    console.log("Loading data for ", word, "...")
    var message = ""
    // Pull the JSON data
    formatted_word = word.replace("#", "%23")
    console.log("Formatted word = ", formatted_word)
    var url = encodeURI("http://hydra.uvm.edu:3001/api/" + formatted_word + "?src=ui&lang=" + params["lang"] + "&metric=[" + params["metric"] + "]")
    console.log("Querying URL = ", url)
    d3.json(url).then((data, error) => {
        console.log('read url "' + url + '"')
        if (data["api_error_count"] > 0) {
            alert(data["errors"])
            message = data["errors"]
        } else {
            // Set a color for this timeseries
            data['colorid'] = queryCounter
            // Parse the dates into d3 date format
            var parsedDates = data["dates"].map(date => new Date(d3.timeParse(date)))
            data["dates"] = parsedDates
            // Find the x- and y-range of this data set
            data['xrange'] = d3.extent(data["dates"])
            data['yrange'] = d3.extent(data[params["metric"]])
            data['pairs'] = []
            parsedDates.forEach((date, i) => {
                var pair = {}
                pair.x = date
                pair.y = data[params["metric"]][i]
                data['pairs'].push(pair)
            })
            // Add the JSON data object to the array of query data
            querydata.push(data)
            console.log("Added data for " + word + " to data list; querydata list length = " + querydata.length)
            addQuery(word, data['colorid'])
            drawCharts()
            message = "success"
            queryCounter += 1
            if (queryCounter > 10) {
                queryCounter = 0
            }
        }
    })
    /*.catch(function(error) {
        // Error handling
        //console.log(e);
        alert("Sorry! It looks like the database is down or overloaded -- please try again later")
        message = "catch"
    })*/
    return console.log("loadData: " + message)
}

function setupPage() {
    // Set parameters to the default parameters
    for (var [p, v] of Object.entries(defaultparams)) {
        params[p] = v
    }
    // Get parameters from the URL and update current parameters accordingly
    getUrlParam()
    // Decode the URL queries (e.g. emojis)
    params['queries'] = params['queries'].map(q => decodeURI(q))
    // Check the correct boxes in the filter form according to the parameters
    setFilters()
    setSizing()
    setRanges()
    // Load the data queries from parameters
    for (var q of params['queries']) {
        loadData(q)
    }
}
setupPage()
