console.log("load data script loaded")
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
            // Add the JSON data object to the array of ngram data
            addNgram(n)
        })
    })
}


// When the list item is clicked for a particular word...
function removeNgram(n) {
    d3.select(".li-" + ngramIDs[n]).remove()
    // Delete the word from the list of queries
    params["ngrams"] = params["ngrams"].filter(ele =>
        // Filter the set to include every ngram except this one
        ele !== n
    )
    delete ngramIDs[n]
    console.log("removed ", n, " from params['ngrams']; length = " + params["ngrams"].length + " and data is " + params["ngrams"])
    // Delete the word from the list of ngram data
    delete ngramData[n]
    console.log("removed ", n, " from ngramData; length = " + Object.keys(ngramData).length + " and remaining ngrams are " + Object.keys(ngramData))
}

function dumpFirst() {
    console.log("Maximum of 10 searches allowed!")
    removeNgram(params['ngrams'][0])
}

// When a word is submitted via inputClick...
function addNgram(n) {
    // Find the x- and y-range of this data set
    let ndata = ngramData[n]
    ngramData[n]['colorid']=i
    i+=1
    xmins.push(ndata['min_date'])
    xmaxes.push(ndata['max_date'])
    ymaxes.push(ndata['min_%{params.metric}'])
    ngramData[n]['xrange'] = d3.extent([ndata['min_date'], ndata['max_date']])
    ngramData[n]['yrange'] = d3.extent([ndata['min_%{params.metric}'],ndata['max_%{params.metric}']])
    params['ngrams'].push(n)
    console.log("Added data for " + n + " to data list; ngram data list length = " + params['ngrams'].length)
    // Add the word as a list item so the user knows it's been added and can delete later
    d3.select("#ngramList").append("li")
        .text(value)
        .attr("class", "li-" + ngramData[n]['uuid'])
        .style("color", colors.dark[ngramData[n]['colorid']])
        .style("border-color", colors.main[ngramData[n]['colorid']])
        .style("background-color", colors.light[ngramData[n]['colorid']])
        .on("click", function (d, i) {
            removeNgram(n)
        })
    mainChart.addLine(n)
}
