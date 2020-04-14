// When the form is submitted...
function querySubmission(event) {
    query = d3.select("#queryInput").property("value")
    if (query === '') {
        console.log("Nothing entered in the search box")
    } else {
        if (params['ngrams'].length > 9) { dumpFirst() }
        loadData(query)}
    // Clear the search box
    document.getElementById('queryForm').reset()
    // Don't reload the page on submit
    return false
}



// When the list item is clicked for a particular word...
function removeNgram(value, identifier) {
    d3.select("#" + identifier).remove()
    // Delete the word from the list of queries
    params["ngrams"] = params["ngrams"].filter(ele =>
        // Filter the set to include every ngram except this one
        ele !== value
    );
    console.log("removed ", value, " from params['ngrams']; length = " + params["ngrams"].length + " and data is " + params["ngrams"])
    // Delete the word from the list of ngram data
    ngramdata = ngramdata.filter(ele =>
        // Filter the set to include every ngram except this one
        ele['ngram'] !== value
    );
    console.log("removed ", value, " from ngramdata; length = " + ngramdata.length + " and data is " + ngramdata);
}

function filterSubmission() {
    console.log("filter selected!");
    // Check the boxes based on the parameters
    /*for (var p of ['metric', 'scale']) {
        // Get the selected language and metric, and update the parameters variable
        params[p] = d3.select("input[name = '" + p + "']").property('value')
    }*/
    params['RT']=d3.select("input[value ='RT']").property('checked');
    console.log("params['RT'] = ",params['RT'])
    updateURL()
}