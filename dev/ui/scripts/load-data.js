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
        errors = data['errors']
        console.log(`Received API response:`)
        let debug = {}
        let debugvals = ['ngrams','database','metric','rt','language','errors']
        debugvals.forEach(v => (debug[v]=[data[v]]))
        console.table(debug)
        let newNgrams = []
        data['ngrams'].forEach(n => {
            // If the new ngram is not already in our ngram data: parse the data, draw charts, etc.
            if (!(Object.keys(ngramData).includes(n))){
                newNgrams.push(n)
            }
            else {console.log(`${n} was already added to the ngram data`)}
        })
        newNgrams.forEach(n => {
            // Find the x- and y-range of this data set
            let thisdata = data['ngramdata'][n]
            ngramData[n] = thisdata
            ngramData[n]['colorid']=i
            i+=1
            if (i > 10){i=1}
            xmins.push(dateParser(thisdata['min_date']))
            xmaxes.push(dateParser(thisdata['max_date']))
            ymins.push(thisdata[`min_${params.metric}`])
            ymaxes.push(thisdata[`max_${params.metric}`])
        })
        newNgrams.forEach(n => {
            addNgram(n)
        })
        if (newNgrams.length > 0) {
            setRanges()
            redrawCharts()
        }
    })
}


// When the list item is clicked for a particular word...
function removeNgram(n) {
    const thisdata = ngramData[n]
    let uuid = thisdata['uuid']
    console.log(`removing all elements with uuid ${uuid}`)
    d3.selectAll('.uuid-'+uuid).remove()
    // Filter the ngram list to include every ngram except this one
    params["ngrams"] = params["ngrams"].filter(ele => ele !== n)
    // Remove these mins and maxes
    xmins = xmins.filter(ele => ele !== dateParser(thisdata['min_date']))
    console.log(`Removed ${dateParser(thisdata['min_date'])} from xmins`)
    xmaxes = xmins.filter(ele => ele !== dateParser(thisdata['max_date']))
    console.log(`Removed ${dateParser(thisdata['max_date'])} from xmaxes`)
    ymins = ymins.filter(ele => ele !== thisdata[`min_${params.metric}`])
    console.log(`Removed ${thisdata['min_'+params.metric]} from ymins`)
    ymaxes = ymaxes.filter(ele => ele !== thisdata[`max_${params.metric}`])
    console.log(`Removed ${thisdata['max_'+params.metric]} from ymaxes`)
    // Delete the word from the list of ngram data
    delete ngramData[n]
    console.log(`removed ${n} from ngramData; length = ${Object.keys(ngramData).length} and remaining ngrams are ${Object.keys(ngramData)}`)
    setRanges()
    redrawCharts()
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
}
