// When the form is submitted...
function querySubmission(event) {
    query = d3.select("#queryInput").property("value")
    if (query === '') {
        console.log("Nothing entered in the search box");
    } else {
        if (params['ngrams'].length > 9) { dumpFirst() }
        loadData(query)
    // Clear the search box
    document.getElementById('queryForm').reset();
    // Don't reload the page on submit
    return false
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
    console.log("params['RT'] = ",params['RT']);
    updateURL();
}

function updateURL() {
    var currentURL = String(window.location.href);
    console.log("currentURL = ", currentURL);
    var splitURL = currentURL.split("?");
    var customparams = {};
    /*
    for (var p of Object.keys(params)) {
        console.log("var p = ", p)
        console.log("params[p] = ", params[p], " defaultparams[p] = ", defaultparams[p])
        if (params[p] != defaultparams[p]) {
            customparams[p] = params[p]
        }
    }
    */
    for (var p of ['queries', 'metric', 'language', 'scale','RT']) {
        console.log("var p = ", p);
        console.log("params[p] = ", params[p], " defaultparams[p] = ", defaultparams[p]);
        if (params[p] !== defaultparams[p]) {
            customparams[p] = params[p]
        }
    }
    console.log("customparams = ", customparams);
    var paramlist = [];
    for (var [p, v] of Object.entries(customparams)) {
        paramlist.push(p + "=" + v)
    }
    var newURL = String(splitURL[0]) + "?" + paramlist.join("&");
    console.log("newURL = ", newURL);
    window.location.href = newURL;
}