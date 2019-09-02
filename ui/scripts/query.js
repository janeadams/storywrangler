var queryCounter = 0

// When the form is submitted...
function querySubmission(event) {
    query = d3.select("#queryInput").property("value")
    if (query == '') {
        console.log("Nothing entered in the search box");
    } else {
        // If the query isn't already in our list
        if (params["queries"].includes(query) == false) {
            // If this will bring us to ten queries, dump the first item in our list
            if (params["queries"].length > 9) {
                dumpFirst()
            }
            // If this will bring us to 5 queries, start plotting in subplots
            if (params["queries"].length > 4) {
                multi = true
            } else {
                multi = false
            }
            // Add the word to the list of queries
            params["queries"].push(query);
            console.log("Added " + query + " to query list [" + params["queries"] + "]; query list length = " + params["queries"].length);
            loadData(query)
        }
        // If the query was already in our list...
        else {
            console.log(query + " was already in queries array; params['queries'] = [" + params["queries"] + "]");
        }
    }
    // Clear the search box
    document.getElementById('queryForm').reset()
    // Don't reload the page on submit
    return false;
}

function dumpFirst() {
    console.log("Maximum of 10 queries allowed!")
    // Remove the li that corresponds to the first query
    d3.select("#" + params["queries"][0]).remove()
    // Remove the first item from our query list, and remove its data from our data list
    removeWord(params["queries"][0])
}

// When a word is submitted via inputClick...
function addQuery(val, colorid, err) {
    // Add the word as a list item so the user knows it's been added and can delete later
    d3.select("#queryList").append("li").text(val).attr("class", "li-" + val).style("color", colors.dark[colorid]).style("border-color", colors.hue[colorid]).style("background-color", colors.light[colorid]).on("click", function(d, i) {
        // When the list item is clicked, remove the word from the query list and delete the data
        q = this.className.replace("li-", "")
        removeWord(q)
        // Delete the li for the deleted word
        this.remove()
    })
    console.log("Added " + val + " to UI buttons");
}

// When a new word is queried...
function loadData(word) {
    console.log("Loading data for ", word, "...")
    var message = ""
    // Pull the JSON data
    formatted_word = word.replace("#", "%23").replace("'", "")
    console.log("Formatted word = ", formatted_word)
    var url = encodeURI("http://hydra.uvm.edu:3001/api/" + formatted_word + "?src=ui&lang=" + params["lang"] + "&metric=[" + params["metric"] + "]")
    console.log("Querying URL = ", url)
    d3.json(url).then(function(data, error) {
        console.log('read url "' + url + '"')
        if (data["api_error_count"] > 0) {
            alert(data["errors"])
            message = data["errors"]
        } else {
            // Set a color for this timeseries
            data['colorid'] = queryCounter
            // Parse the dates into d3 date format
            var parsedDates = data["dates"].map(function(date) { return new Date(d3.timeParse(date)) })
            data["dates"] = parsedDates
            // Find the x- and y-range of this data set
            data['xrange'] = d3.extent(data["dates"])
            data['yrange'] = d3.extent(data[params["metric"]])
            data['pairs'] = []
            parsedDates.forEach(function(date, i) {
                var pair = {}
                pair.x = date
                pair.y = data[params["metric"]][i]
                data['pairs'].push(pair)
            })
            // Add the JSON data object to the array of query data
            querydata.push(data)
            console.log("Added data for " + word + " to data list; querydata list length = " + querydata.length)
            addQuery(word, data['colorid'])
            drawTimeseries()
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

// When the list item is clicked for a particular word...
function removeWord(value) {
    // Delete the word from the list of queries
    params["queries"] = params["queries"].filter(function(ele) {
        // Filter the set to include every query except this one
        return ele != value
    })
    console.log("removed ", value, " from params['queries']; length = " + params["queries"].length + " and data is " + params["queries"])
    // Delete the word from the list of querydata
    querydata = querydata.filter(function(ele) {
        // Filter the set to include every query except this one
        return ele['word'] != value
    })
    console.log("removed ", value, " from querydata; length = " + querydata.length + " and data is " + querydata)
    // Clear the chart
    d3.select("#timeseries").selectAll().remove()
    drawTimeseries()
}

function filterSubmission() {
    console.log("filter selected!")
    // Check the boxes based on the parameters
    //for (var p of ['lang', 'metric']) {
    for (var p of ['metric', 'scale']) {
        // Get the selected language and metric, and update the parameters variable
        params[p] = d3.select("input[name = '" + p + "']:checked").property('value')
    }
    setFilters()
    updateURL()
}

function updateURL() {
    var currentURL = String(window.location.href)
    console.log("currentURL = ", currentURL)
    var splitURL = currentURL.split("?")
    var customparams = {}
    /*
    for (var p of Object.keys(params)) {
        console.log("var p = ", p)
        console.log("params[p] = ", params[p], " defaultparams[p] = ", defaultparams[p])
        if (params[p] != defaultparams[p]) {
            customparams[p] = params[p]
        }
    }
    */
    for (var p of ['queries', 'metric', 'lang', 'scale']) {
        console.log("var p = ", p)
        console.log("params[p] = ", params[p], " defaultparams[p] = ", defaultparams[p])
        if (params[p] != defaultparams[p]) {
            customparams[p] = params[p]
        }
    }
    console.log("customparams = ", customparams)
    var paramlist = []
    for (var [p, v] of Object.entries(customparams)) {
        paramlist.push(p + "=" + v)
    }
    var newURL = String(splitURL[0]) + "?" + paramlist.join("&")
    console.log("newURL = ", newURL)
    window.location.href = newURL
    drawTimeseries();
}