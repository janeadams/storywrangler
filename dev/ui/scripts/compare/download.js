function formatDataForDownload(){
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
    }
    else {
        allData = {'metadata': "Error! No data"}
    }
    setTimeout(() => hideloadingpanel(), 1000)
    return "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allData))
}