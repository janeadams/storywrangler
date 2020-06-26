// When the form is submitted...
function querySubmission(event) {
    query = d3.select("#queryInput").property("value")
    if (query === '') {
        //console.log("Nothing entered in the search box")
    } else {
        parseQuery(query, false)}
    // Clear the search box
    document.getElementById('queryForm').reset()
    // Don't reload the page on submit
    return false
}

function parseQuery(query, reload){

    //console.log(`Loading data for ${query}. Force a reload? ${reload}`)

    if (query==='"'){
        //console.log("Sorry, we don't support searches for the double quotation mark at this time")
        //alert("Sorry, we don't support searches for the double quotation mark at this time")
        return
    }

    if (alreadyExists(query)){
        if (reload) { eraseRecord(query) }
        else { return }
    }
    query.replace('"','')
    // Pull the JSON data
    let formatted_query = encodeURIComponent(query)
    //console.log(`Formatted query: ${formatted_query}`)
    let currentURL = String(window.location.href)
    let splitURL = currentURL.split("?")
    let APIsource = "https://storywrangling.org"
    if (splitURL[0].includes(":8051")){
        APIsource = "http://hydra.uvm.edu:3000"
    }
    sendQuery(formatted_query, APIsource)
}

function getTwitterURL(ngram, data, rt){
    if (ngram[0]==="#"){
        if (rt) {
            return `https://twitter.com/search?q=(${ngram.replace("#", "%23")})%20until%3A${dateFormatter(data[0].addDays(1))}%20since%3A${dateFormatter(data[0].addDays(-1))}&src=typed_query`
        }
        else {
            return `https://twitter.com/search?q=(${ngram.replace("#","%23")})%20until%3A${dateFormatter(data[0].addDays(1))}%20since%3A${dateFormatter(data[0].addDays(-1))}%20-filter%3Areplies&src=typed_query`
        }
    }
    else {
        if (rt) {
            return `https://twitter.com/search?q=${ngram}%20until%3A${dateFormatter(data[0].addDays(1))}%20since%3A${dateFormatter(data[0].addDays(-1))}&src=typed_query`
        }
        else {
            return `https://twitter.com/search?q=${ngram}%20until%3A${dateFormatter(data[0].addDays(1))}%20since%3A${dateFormatter(data[0].addDays(-1))}%20-filter%3Areplies&src=typed_query`
        }
    }
}