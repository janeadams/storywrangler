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
            // Set an ID for this ngram
            ngramIDs[n] = params['ngrams'].length
            ngramData[n] = data['ngramdata'][n]
            // Find the x- and y-range of this data set
            //ndata['xrange'] = d3.extent(data['dates'])
            //ndata['yrange'] = d3.extent(data[params['metric']])
            // Add the JSON data object to the array of ngram data
            console.log("Added data for " + n + " to data list; ngram data list length = " + params['ngrams'].length)
            addNgram(n, ngramIDs[n])
        })
        //updateURL()
    })
}


// When the list item is clicked for a particular word...
function removeNgram(value) {
    d3.select(".li-" + ngramIDs[value]).remove()
    // Delete the word from the list of queries
    params["ngrams"] = params["ngrams"].filter(ele =>
        // Filter the set to include every ngram except this one
        ele !== value
    )
    delete ngramIDs[value]
    console.log("removed ", value, " from params['ngrams']; length = " + params["ngrams"].length + " and data is " + params["ngrams"])
    // Delete the word from the list of ngram data
    delete ngramData[value]
    console.log("removed ", value, " from ngramData; length = " + ngramData.length + " and data is " + ngramData)
}

function dumpFirst() {
    console.log("Maximum of 10 searches allowed!")
    first = params['ngrams'][0]
    removeNgram(first)
}

// When a word is submitted via inputClick...
function addNgram(value) {
    // Add the word as a list item so the user knows it's been added and can delete later
    d3.select("#ngramList").append("li")
        .text(value)
        .attr("class", "li-" + ngramIDs[value])
        .style("color", colors.dark[ngramIDs[value]])
        .style("border-color", colors.main[ngramIDs[value]])
        .style("background-color", colors.light[ngramIDs[value]])
        .on("click", function(d, i) {
            // When the list item is clicked, remove the word from the ngram list and delete the data
            let n = this.text
            console.log('n: ' + n)
            removeNgram(n)
        })
}
