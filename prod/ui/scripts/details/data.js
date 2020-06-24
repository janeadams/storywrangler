function sendQuery(formatted_query, APIsource){
    let urls = []
    urls.push(encodeURI(`${APIsource}/api/${formatted_query}?src=ui&language=${params["language"]}&metric=${params['metric']}&rt=true`))
    urls.push(encodeURI(`${APIsource}/api/${formatted_query}?src=ui&language=${params["language"]}&metric=${params['metric']}&rt=false`))
    urls.forEach(url => loadData(url))
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
        let returnedNgrams = data['ngrams']
        console.log(`returnedNgrams = ${returnedNgrams}`)
        console.log('data:')
        console.log(data)
        if (returnedNgrams.length > 0) {
            // just select the first one
            Ngram = returnedNgrams[0]
            console.log(`Ngram = ${Ngram}`)
            let rt_state
            if (data['rt']===true){
                rt_state = 'w_rt'
            }
            else {
                rt_state = 'no_rt'
            }
            ngramData[rt_state] = formatData(data['ngramdata'][Ngram])
            resetPage()
        }
        setTimeout(() => hideloadingpanel(), 3000)
    })
}

function clearAll(){
    d3.select('#mainplot').selectAll('svg').remove()
    clearData()
}

function reloadAllData() {
    console.log("Reloading all data...")
    showloadingpanel()
    clearAll()
    initializeData()
    setTimeout(() => hideloadingpanel(), 1000)
}

function initializeData(){
    parseQuery(Ngram, true)
}

