function sendQuery(formatted_query, APIsource){
    let url = encodeURI(`${APIsource}/api/${formatted_query}?src=ui&language=${params["language"]}&metric=${params['metric']}&rt=${params['rt']}`)
        loadData(url)
}

function loadData(url) {
    console.log(`Querying API URL:`)
    console.log(url)
    d3.json(url).then((data, error) => {
        showloadingpanel()
        //errors.append(data['errors'])
        console.log(`Received API response:`)
        let debug = {}
        let debugvals = ['ngrams', 'database', 'metric', 'rt', 'language', 'errors']
        debugvals.forEach(v => (debug[v] = [data[v]]))
        console.table(debug)
        console.log(data)
        let newNgrams = findNew(data['ngrams'])
        if (newNgrams.length > 0) {
            newNgrams.forEach(n => {
                ngramData[n] = formatData(data['ngramdata'][n])
                i += 1
                if (i > 10) {
                    i = 0
                }
                ngramData[n]['colorid']=i
                addNgram(n)
                resetPage()
            })
        }
        setTimeout(() => hideloadingpanel(), 3000)
    })
}

function reloadAllData() {
    console.log("Reloading all data...")
    showloadingpanel()
    clearData()
    initializeData()
    setTimeout(() => hideloadingpanel(), 1000)
}

function findNew(ngrams){
    let newNgrams = []
    console.log("seeing if these are new:")
    console.log(ngrams)
    ngrams.forEach(n => {
        if (n === '"') {
            console.log("Sorry, we don't support searches for the double quotation mark at this time")
            //alert("Sorry, we don't support searches for the double quotation mark at this time")
        } else {
            // If the new ngram is not already in our ngram data: parse the data, draw charts, etc.
            if (Object.keys(ngramData).includes(n)) {
                delete ngramData[n]
                newNgrams.push(n)
            } else {
                newNgrams.push(n)
            }
        }
    })
    console.log("new Ngrams:")
    console.log(newNgrams)
    return newNgrams
}

// When a word is submitted via inputClick...
function addNgram(n) {
    console.log(`addNgrams() - Ngrams: ${Ngrams}`)
    let currentNgrams = Object.assign([], Ngrams)
    if (!currentNgrams.includes(n)) { // If this ngram isn't already in the params ngrams list
        console.log(`addNgrams() - Adding ${n} to Ngrams`)
        currentNgrams.push(n)
        Ngrams = currentNgrams // add the ngram
        console.log(`addNgrams() - Ngrams: ${Ngrams}`)
        console.log(`Added data for ${n} to data list; ngram data list length = ${Ngrams.length}`)
        // Add the word as a list item so the user knows it's been added and can delete later
        d3.select("#ngramList").append("li")
            .text(n)
            .attr("class", `uuid-${ngramData[n]['uuid']} nitem`)
            .style("color", colors.dark[ngramData[n]['colorid']])
            .style("border-color", colors.main[ngramData[n]['colorid']])
            .style("background-color", colors.light[ngramData[n]['colorid']])
            .on("click", function () {
                console.log(`Clicked list item ${n}`)
                removeNgram(n)
            })
        setButtons()
    }
}

// When the list item is clicked for a particular word...
function removeNgram(n) {
    setTimeout(() => showloadingpanel(), 1000)
    const thisdata = ngramData[n]
    let uuid = thisdata['uuid']
    console.log(`removing all elements with uuid ${uuid}`)
    d3.selectAll('.uuid-'+uuid).remove()
    // Filter the ngram list to include every ngram except this one
    Ngrams = Ngrams.filter(ele => ele !== n)
    // Remove these mins and maxes
    xmins = xmins.filter(ele => ele !== thisdata['min_date'])
    console.log(`Removed ${thisdata['min_date']} from xmins`)
    xmaxes = xmaxes.filter(ele => ele !== thisdata['max_date'])
    console.log(`Removed ${thisdata['max_date']} from xmaxes`)
    ymins = ymins.filter(ele => ele !== thisdata[`min_${params.metric}`])
    console.log(`Removed ${thisdata['min_'+params.metric]} from ymins`)
    ymaxes = ymaxes.filter(ele => ele !== thisdata[`max_${params.metric}`])
    console.log(`Removed ${thisdata['max_'+params.metric]} from ymaxes`)
    // Delete the word from the list of ngram data
    delete ngramData[n]
    updateURL()
    //console.log(`removed ${n} from ngramData; length = ${Object.keys(ngramData).length} and remaining ngrams are ${Object.keys(ngramData)}`)
    setTimeout(() => hideloadingpanel(), 1000)
}

function setButtons(){
    if (Ngrams.length < 1){
        d3.selectAll(".mgmt").style("display","none")
    }
    else {
        d3.select("#download").select('a').attr("href", formatDataForDownload()).attr("download","storywrangler_data.json")
        d3.selectAll(".mgmt").style("display","inline-block")
    }
}

function clearAll(){
    Ngrams.forEach(n => removeNgram(n))
    clearData()
}

function initializeData(){
    Ngrams.forEach(n => parseQuery(n,true))
}

function alreadyExists(query){
    if (Object.keys(ngramData).includes(query)){ return true }
}

function eraseRecord(query){
    removeNgram(query)
}