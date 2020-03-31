function loadData(query) {
    console.log("Loading data for ", query, "...");
    let errors = ""
    // Pull the JSON data
    formatted_query = query.replace("#", "%23");
    console.log("Formatted query = ", formatted_query);
    var url = encodeURI("http://hydra.uvm.edu:3000/api/" + formatted_query + "?src=ui&language=" + params["language"] + "&metric=" + params['metric'])
    console.log("Querying URL = ", url)
    d3.json(url).then((data, error) => {
        console.log('read url "' + url + '"')
        errors = data['errors']
        data['ngrams'].forEach((n) => {
            params['ngrams'].push(n)
            ndata = data['ngramdata'][n]['data']
            // Set a color for this timeseries
            ndata['ID']=params['ngrams'].length
            // Find the x- and y-range of this data set
            //ndata['xrange'] = d3.extent(data['dates'])
            //ndata['yrange'] = d3.extent(data[params['metric']])
            // Add the JSON data object to the array of ngram data
            ngramdata.push(ndata)
            console.log("Added data for " + n + " to data list; ngram data list length = " + params['ngrams'].length)
            addNgram(n, ndata['ID'])
            drawCharts()
            })
        updateURL()
        })

}


