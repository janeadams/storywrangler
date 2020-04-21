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
            // Find the x- and y-range of this data set
            let thisdata = data['ngramdata'][n]
            ngramData[n] = thisdata
            ngramData[n]['colorid']=i
            i+=1
            xmins.push(dateParser(thisdata['min_date']))
            xmaxes.push(dateParser(thisdata['max_date']))
            ymins.push(thisdata[`min_${params.metric}`])
            ymaxes.push(thisdata[`max_${params.metric}`])
        })
        setRanges()
        newNgrams.forEach(n => {
            addNgram(n)
        })
    })
}


// When the list item is clicked for a particular word...
function removeNgram(n) {
    let uuid = ngramData[n]['uuid']
    console.log(`removing all elements with uuid ${uuid}`)
    d3.selectAll('path.uuid-'+uuid).remove()
    setRanges()
    // Filter the ngram list to include every ngram except this one
    params["ngrams"] = params["ngrams"].filter(ele => ele !== n)
    // Delete the word from the list of ngram data
    delete ngramData[n]
    console.log(`removed ${n} from ngramData; length = ${Object.keys(ngramData).length} and remaining ngrams are ${Object.keys(ngramData)}`)
}

function dumpFirst() {
    console.log("Maximum of 10 searches allowed!")
    removeNgram(params['ngrams'][0])
}

// When a word is submitted via inputClick...
function addNgram(n) {
    params['ngrams'].push(n)
    ndata = ngramData[n]
    console.log(`Added data for ${n} to data list; ngram data list length = ${params['ngrams'].length}`)
    // Add the word as a list item so the user knows it's been added and can delete later
    d3.select("#ngramList").append("li")
        .text(n)
        .attr("class", `uuid-${ndata['uuid']}`)
        .style("color", colors.dark[ndata['colorid']])
        .style("border-color", colors.main[ndata['colorid']])
        .style("background-color", colors.light[ndata['colorid']])
        .on("click", function (d, i) {
            console.log(`Clicked list item ${n}`)
            removeNgram(n)
        })
    mainChart.addLine(n)
}
