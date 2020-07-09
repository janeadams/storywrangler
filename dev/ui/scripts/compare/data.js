let availableColors = [0,1,2,3,4,5]

function removeColor(n){
    const index = availableColors.indexOf(n);
    if (index > -1) {
        availableColors.splice(index, 1);
    }
}

function sendQuery(formatted_query, APIsource){
    showloadingpanel()
    let url = encodeURI(`${APIsource}/api/${formatted_query}?src=ui&language=${params["language"]}&metric=${params['metric']}&rt=${params['rt']}`)
    loadData(url)
    hideloadingpanel()
}

function loadData(url) {
    //console.log(`Querying API URL:`)
    //console.log(url)
    showloadingpanel()
    d3.json(url).then((data, error) => {
        //console.log(`Received API response:`)
        let debug = {}
        let debugvals = ['ngrams', 'database', 'metric', 'rt', 'language', 'errors']
        debugvals.forEach(v => (debug[v] = [data[v]]))
        //console.table(debug)
        //console.log(data)
        let foundNgrams = Object.keys(data['ngramdata'])
        console.log("foundNgrams")
        console.log(foundNgrams)
        if (data['errors'].length > 0){
            let notFound = []
            console.log("data['ngrams']")
            console.log(data['ngrams'])
            data['ngrams'].forEach(searched => {
                if (foundNgrams.includes(searched)){ console.log(`Found ${searched}`)}
                else {
                    notFound.push(searched)
                    try{Ngrams = Ngrams.filter(ele => ele !== searched)}
                    catch{}
                }
            })
            console.log('notFound')
            console.log(notFound)
            let alertMsg = `Sorry! ${data['errors']}`
            if (notFound.length > 1){
                let stringMissing = `<strong>${notFound[0]}</strong>`
                notFound.slice(0,(notFound.length-1)).forEach(missing => {
                    stringMissing = `${stringMissing} or <strong>${missing}</strong>`
                })
                alertMsg = `Sorry! We couldn't find ${stringMissing} in our ${codeLookup[params['language']]} Twitter phrase database. It's possible that these phrases are used on Twitter, but never reached our database's minimum rank of 1 millionth most-used-phrase.`
            }
            else {
                alertMsg = `Sorry! We couldn't find <strong>${notFound}</strong> in our ${codeLookup[params['language']]} Twitter phrase database. It's possible that this phrase is used on Twitter, but never reached our database's minimum rank of 1 millionth most-used-phrase.`
            }
            console.log(alertMsg)
            showAlert(alertMsg)
        }
        console.log('foundNgrams')
        console.log(foundNgrams)
        if (foundNgrams.length > 0){
            let newNgrams = findNew(foundNgrams)
            if (newNgrams.length > 0) {
                newNgrams.forEach(n => {
                    if (Ngrams.length > 5) {
                        removeNgram(Ngrams[0])
                    }
                    ngramData[n] = formatData(data['ngramdata'][n])
                    ngramData[n]['grams']=data['database']
                    ngramData[n]['colorid'] = availableColors[0]
                    removeColor(availableColors[0])
                    console.log(`Setting colorid for ${n} to ${ngramData[n]['colorid']}`)
                    addNgram(n)
                    resetPage()
                })
            }
        }
        hideloadingpanel()
    })
}

function reloadAllData() {
    //console.log("Reloading all data...")
    showloadingpanel()
    availableColors = [0,1,2,3,4,5]
    let datakeys = Object.keys(ngramData)
    datakeys.forEach(n => {
        let uuid = ngramData[n]['uuid']
        d3.selectAll(`.uuid-${uuid}`).remove()
    })
    clearData()
    initializeData()
}

function findNew(ngrams){
    let newNgrams = []
    //console.log("seeing if these are new:")
    //console.log(ngrams)
    ngrams.forEach(n => {
        if (n === '"') {
            let alertMsg = `Sorry! We don't support searches for the double quotation mark at this time`
            console.log(alertMsg)
            showAlert(alertMsg)
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
    //console.log("new Ngrams:")
    //console.log(newNgrams)
    return newNgrams
}

// When a word is submitted via inputClick...
function addNgram(n) {
    let currentNgrams = Object.assign([], Ngrams)
    if (!currentNgrams.includes(n)) { // If this ngram isn't already in the params ngrams list
        currentNgrams.push(n)
        Ngrams = currentNgrams // add the ngram
        //console.log(`Ngrams: ${Ngrams}`)
        //console.log(`Added data for ${n} to data list; ngram data list length = ${Ngrams.length}`)
        setButtons()
    }
    // Add the word as a list item so the user knows it's been added and can delete later
    d3.select("#ngramList").append("li")
        .text(n)
        .attr("class", `uuid-${ngramData[n]['uuid']} nitem`)
        .style("color", colors.dark[ngramData[n]['colorid']])
        .style("border-color", colors.main[ngramData[n]['colorid']])
        .style("background-color", colors.light[ngramData[n]['colorid']])
        .on("click", function () {
            //console.log(`Clicked list item ${n}`)
            removeNgram(n)
        })
    addSuplot(n)
    //console.log(`Added "${n}" to Ngrams:`)
    //console.log(Ngrams)
}

// When the list item is clicked for a particular word...
function removeNgram(n) {
    setTimeout(() => showloadingpanel(), 1000)
    // Filter the ngram list to include every ngram except this one
    Ngrams = Ngrams.filter(ele => ele !== n)
    try {
        const thisdata = ngramData[n]
        let uuid = thisdata['uuid']
        availableColors.push(thisdata['colorid'])
        //console.log(`removing all elements with uuid ${uuid}`)
        d3.selectAll('.uuid-' + uuid).remove()
        // Remove these mins and maxes
        xmins = xmins.filter(ele => ele !== thisdata['min_date'])
        //console.log(`Removed ${thisdata['min_date']} from xmins`)
        xmaxes = xmaxes.filter(ele => ele !== thisdata['max_date'])
        //console.log(`Removed ${thisdata['max_date']} from xmaxes`)
        ymins = ymins.filter(ele => ele !== thisdata[`min_${params.metric}`])
        //console.log(`Removed ${thisdata['min_' + params.metric]} from ymins`)
        ymaxes = ymaxes.filter(ele => ele !== thisdata[`max_${params.metric}`])
        //console.log(`Removed ${thisdata['max_' + params.metric]} from ymaxes`)
        // Delete the word from the list of ngram data
        delete ngramData[n]
    }
    catch{}
    updateURL()
    //console.log(`removed ${n} from ngramData; length = ${Object.keys(ngramData).length} and remaining ngrams are ${Object.keys(ngramData)}`)
    setTimeout(() => hideloadingpanel(), 1000)
}

function setButtons(){
    if (Ngrams.length < 1){
        d3.selectAll(".button").style("display","none")
    }
    else {
        d3.selectAll(".button").style("display","inline-block")
    }
}

function formatDataForDownload(button){
    setTimeout(() => showloadingpanel(), 1000)
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
        //console.log(allData)
    }
    else {
        allData = {'metadata': "Sorry! Something went wrong; we weren't able to return any data. Our servers may be overloaded at this time."}
    }

    button.setAttribute("href", ("data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allData))))
    button.setAttribute("download", "storywrangler_data.json")
    setTimeout(() => hideloadingpanel(), 1000)
}

function clearAll(){
    Ngrams.forEach(n => {
        try{removeNgram(n)}
        catch{}
    })
    clearData()
}

function initializeData(){
    Ngrams.forEach(n => parseQuery(n,true))
    setTimeout(() => hideloadingpanel(), 1000)
}

function alreadyExists(query){
    if (Object.keys(ngramData).includes(query)){ return true }
}

function eraseRecord(query){
    removeNgram(query)
}