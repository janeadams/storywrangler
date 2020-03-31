function loadData(query) {
    console.log("Loading data for ", query, "...");
    var message = ""
    // Pull the JSON data
    formatted_word = query.replace("#", "%23");
    console.log("Formatted query = ", formatted_query);
    var url = encodeURI("https://hydra.uvm.edu:3000/api/" + formatted_query + "?src=ui&language=" + params["language"] + "&metric=[" + params['metric'] + "]")
    console.log("Querying URL = ", url)
    d3.json(url).then((data, error) => {
        console.log('read url "' + url + '"')
        if (data["api_error_count"] > 0) {
            alert(data["errors"])
            message = data["errors"]
        } else {
            // Set a color for this timeseries
            data['colorid'] = params["ngrams"].length
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
            // Add the JSON data object to the array of ngram data
            ngramdata.push(data)
            console.log("Added data for " + ngram + " to data list; ngram data list length = " + ngramdata.length)
            addQuery(query, data['colorid'])
            drawCharts()
            message = "success"
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


