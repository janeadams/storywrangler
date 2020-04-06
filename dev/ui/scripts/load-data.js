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
        newNgrams = data['ngrams']
        newNgrams.forEach(n => {
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
            //drawCharts()
            })
        updateURL()
        })

}

function dumpFirst() {
    console.log("Maximum of 10 searches allowed!")
    removeNgram(params['ngrams'][0])
}

// When a word is submitted via inputClick...
function addNgram(value, identifier, err) {
    // Add the word as a list item so the user knows it's been added and can delete later
    d3.select("#ngramList").append("li")
        .text(value)
        .attr("class", "li-" + identifier)
        .style("color", colors.dark[identifier])
        .style("border-color", colors.main[identifier])
        .style("background-color", colors.light[identifier])
        .on("click", function(d, i) {
            // When the list item is clicked, remove the word from the ngram list and delete the data
            n = this.text
            ID = this.className.replace("li-", "")
            removeNgram(n, ID)
            // Delete the li for the deleted word
            this.remove()
        });
    console.log("Added " + value + " to UI buttons");
}

