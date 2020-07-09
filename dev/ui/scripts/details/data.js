function sendQuery(formatted_query, APIsource){
    let urls = []
    showloadingpanel()
    urls.push(encodeURI(`${APIsource}/api/${formatted_query}?src=ui&language=${params["language"]}&metric=${params['metric']}&rt=true`))
    urls.push(encodeURI(`${APIsource}/api/${formatted_query}?src=ui&language=${params["language"]}&metric=${params['metric']}&rt=false`))
    urls.forEach(url => loadData(url))
    hideloadingpanel()
}

function loadData(url) {
    //console.log(`Querying API URL:`)
    //console.log(url)
    d3.json(url).then((data, error) => {
        //console.log(`Received API response:`)
        let debug = {}
        let debugvals = ['ngrams', 'database', 'metric', 'rt', 'language', 'errors']
        debugvals.forEach(v => (debug[v] = [data[v]]))
        //console.table(debug)
        let returnedNgrams = data['ngrams']
        //console.log(`returnedNgrams = ${returnedNgrams}`)
        //console.log('data:')
        //console.log(data)
        if (data['errors'].length > 0){
            let alertMsg = `Sorry! ${data['errors']} in our ${codeLookup[params['language']]} phrase Twitter database. It's possible that this phrase is used on Twitter, but never reached our database's minimum rank of 1 millionth most-used-phrase.`
            console.log(alertMsg)
            showAlert(alertMsg)
        }
        else {
            if (returnedNgrams.length > 0) {
                // just select the first one
                Ngram = returnedNgrams[0]
                //console.log(`Ngram = ${Ngram}`)
                let rt_state
                if (data['rt'] === true) {
                    rt_state = 'w_rt'
                } else {
                    rt_state = 'no_rt'
                }
                ngramData[rt_state] = formatData(data['ngramdata'][Ngram])
                resetPage()
                Document.getElementById("compare-link").setAttribute("href", `https://storywrangling.org/index.html?ngrams=${Ngram}`)
            }
        }
    })
}

function formatDataForDownload(button){
    showloadingpanel()
    let allData
    if(Object.keys(ngramData).length > 0) {
        let downloadData = {}
        Object.keys(ngramData).forEach(n => {
            downloadData[n] = ngramData[n]['data'].map(tuple => [dateParser(tuple[0]), tuple[1]])
        })
        let metaData = {}
        metaData['Ngram'] = Ngram
        let metrics = ['metric','language']
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
    hideloadingpanel()
}

function clearAll(){
    d3.select('#mainplot').selectAll('svg').remove()
    clearData()
}

function reloadAllData() {
    //console.log("Reloading all data...")
    showloadingpanel()
    clearAll()
    initializeData()
    hideloadingpanel()
}

function initializeData(){
    parseQuery(Ngram, true)
}

