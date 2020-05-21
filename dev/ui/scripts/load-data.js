function showloadingpanel(){
    console.log('Showing loading panel...')
    d3.selectAll('.loadoverlay,.loader').style("display","block")
}

function hideloadingpanel(){
    console.log('Hiding loading panel...')
    d3.selectAll('.loadoverlay,.loader').style("display","none")
}

function loadData(query, reload) {

    showloadingpanel()

    console.log(`Loading data for ${query}. Force a reload? ${reload}`)

    if (query==='"'){
        console.log("Sorry, we don't support searches for the double quotation mark at this time")
        //alert("Sorry, we don't support searches for the double quotation mark at this time")
        return
    }


    if (reload===false) {
        if (Object.keys(ngramData).includes(query)) {
            console.log(`${query} is already in the ngram data`)
            return
        }
    }
    else {
        if (Object.keys(ngramData).includes(query)) {
            removeNgram(query)
        }
    }
    showloadingpanel()
    // Pull the JSON data
    let formatted_query = encodeURIComponent(query.replace('"',''))
    //console.log(`Formatted query: ${formatted_query}`)
    let currentURL = String(window.location.href)
    let splitURL = currentURL.split("?")
    let APIsource = "https://storywrangling.org"
    if (splitURL[0].includes(":8051")){
        APIsource = "http://hydra.uvm.edu:3000"
    }
    let url = encodeURI(`${APIsource}/api/${formatted_query}?src=ui&language=${params["language"]}&metric=${params['metric']}&rt=${params['rt']}`)
    console.log(`Querying API URL:`)
    console.log(url)
    d3.json(url).then((data, error) => {
        //errors.append(data['errors'])
        console.log(`Received API response:`)
        let debug = {}
        let debugvals = ['ngrams','database','metric','rt','language','errors']
        debugvals.forEach(v => (debug[v]=[data[v]]))
        console.table(debug)
        let newNgrams = []
        data['ngrams'].forEach(n => {
            if (n==='"'){
                console.log("Sorry, we don't support searches for the double quotation mark at this time")
                //alert("Sorry, we don't support searches for the double quotation mark at this time")
            }
            else {
                // If the new ngram is not already in our ngram data: parse the data, draw charts, etc.
                if (Object.keys(ngramData).includes(n)) {
                    if (reload===false){
                        console.log(`${n} was already added to the ngram data`)
                    }
                    else {
                        delete ngramData[n]
                        newNgrams.push(n)
                    }
                }
                else if (data['ngramdata'][n] == null) {
                    console.log(`No data available for ${n}`)
                    alert(`Sorry! We couldn't find any ${data['metric']} data for ${n} in the ${data['language']} ${data['database']}grams database`)
                }
                else {
                    newNgrams.push(n)
                }
            }
        })
        newNgrams.forEach(n => {
            ngramData[n] = {}
            let loadedData = data['ngramdata'][n]
            // Parse all the dates
            let allPairs = loadedData['data'].map(tuple => [dateParser(tuple[0]),tuple[1]])
            // Remove zeroes from counts and frequency data sets
            let nonZero = []
            let dataDates = []
            allPairs.forEach(pair => {
                if (pair[1] !== 0){
                    nonZero.push(pair)
                    dataDates.push(pair[0])
                }
            })
            let newData = Object.assign([], nonZero)
            let minDate = dateParser(loadedData['min_date'])
            let maxDate = dateParser(loadedData['max_date'])
            /* // Add missing dates and set to value of null
            let fullDateRange = getDates(minDate, maxDate)
            fullDateRange.forEach(date => {
                if (dataDates.includes(date)){}
                else {newData.push([date, null])}
            })*/
            ngramData[n]['data'] = newData
            // Get the unique identifier (for labeling objects in-browser)
            ngramData[n]['uuid'] = loadedData['uuid']
            // Find and format the x- and y-ranges of this data set
            ngramData[n]['min_date'] = minDate
            ngramData[n]['max_date'] = maxDate
            ngramData[n][`min_${params.metric}`] = loadedData[`min_${params.metric}`]
            ngramData[n][`max_${params.metric}`] = loadedData[`max_${params.metric}`]
            // Set the color identifier for this set, & cycle through
            ngramData[n]['colorid']=i
            i+=1
            if (i > 10){i=0}
            xmins.push(ngramData[n]['min_date'])
            xmaxes.push(ngramData[n]['max_date'])
            ymins.push(ngramData[n][`min_${params.metric}`])
            ymaxes.push(ngramData[n][`max_${params.metric}`])

        })
        let currentNgrams = Object.assign([], Ngrams)
        newNgrams.forEach(n => {
            // If this ngram is already in the params ngrams list
            if (currentNgrams.includes(n)){} // do nothing
            else {
                currentNgrams.push(n)
                Ngrams = currentNgrams } // otherwise, add it
            addNgram(n)
        })
        if (newNgrams.length > 0) { // If new ngrams have been added...
            redrawCharts()
            updateURL()
        }
    })
    setTimeout(() => hideloadingpanel(), 3000)
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


// When the list item is clicked for a particular word...
function removeNgram(n) {
    const thisdata = ngramData[n]
    let uuid = thisdata['uuid']
    //console.log(`removing all elements with uuid ${uuid}`)
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

    //console.log(`removed ${n} from ngramData; length = ${Object.keys(ngramData).length} and remaining ngrams are ${Object.keys(ngramData)}`)
    setButtons()
    redrawCharts()
    updateURL()
    setTimeout(() => hideloadingpanel(), 1000)
}

// When a word is submitted via inputClick...
function addNgram(n) {

    ndata = ngramData[n] // create a shortcut for accessing this specific ngram's data
    console.log(`Added data for ${n} to data list; ngram data list length = ${Ngrams.length}`)
    // Add the word as a list item so the user knows it's been added and can delete later
    d3.select("#ngramList").append("li")
        .text(n)
        .attr("class", `uuid-${ndata['uuid']} nitem`)
        .style("color", colors.dark[ndata['colorid']])
        .style("border-color", colors.main[ndata['colorid']])
        .style("background-color", colors.light[ndata['colorid']])
        .on("click", function (d, i) {
            console.log(`Clicked list item ${n}`)
            removeNgram(n)
        })

    setButtons()
}


function formatDataForDownload(){
    let allData
    if(Object.keys(ngramData).length > 0) {
        let downloadData = {}
        Object.keys(ngramData).forEach(n => {
            downloadData[n] = ngramData[n]['data'].map(tuple => [dateParser(tuple[0]), tuple[1]])
        })
        let metaData = {}
        metaData['ngrams'] = Ngrams
        let metrics = ['metric','language','rt']
        metrics.forEach(m => {
            metaData[m] = params[m]
        })
        allData = {'metadata': metaData, 'data': downloadData}
    }
    else {
        allData = {'metadata': "Error! No data"}
    }
    return "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allData))
}

function reloadAllData() {
    console.log("Reloading all data...")
    let currentNgrams = Object.assign([], Ngrams)
    clearCharts()
    Ngrams = []
    ngramData = {}
    ymins = []
    ymaxes = []
    xmins = []
    xmaxes = []
    currentNgrams.forEach(n => loadData(n, true))
    setTimeout(() => hideloadingpanel(), 1000)
}

function clearAll(){
    Ngrams.forEach(n => removeNgram(n))
}