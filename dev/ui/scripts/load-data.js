function showloadingpanel(){
    //console.log('Showing loading panel...')
    d3.selectAll('.loadoverlay,.loader').style("display","block")
}

function hideloadingpanel(){
    //console.log('Hiding loading panel...')
    d3.selectAll('.loadoverlay,.loader').style("display","none")
}

function formatData(data){
    let loadedData = data
    let formattedData = {}
    // Parse all the dates
    let allPairs = loadedData['data'].map(tuple => [dateParser(tuple[0]), tuple[1]])
    // Remove zeroes from counts and frequency data sets
    let nonZero = []
    let dataDates = []
    allPairs.forEach(pair => {
        if (pair[1] !== 0) {
            nonZero.push(pair)
            dataDates.push(dateFormatter(pair[0]))
        }
    })
    // Find and format the x- and y-ranges of this data set
    formattedData['min_date'] = dateParser(loadedData['min_date'])
    formattedData['max_date'] = dateParser(loadedData['max_date'])
    // Add missing dates and set to value to undefined
    let withNulls = Object.assign([], nonZero)
    fullDateRange.forEach(date => {
        if (dataDates.includes(dateFormatter(date))) {
        } else {
            if (params['metric']=='rank'){
                withNulls.push([date, 1000000])
            }
            else {
                withNulls.push([date, undefined])
            }
        }
    })
    let sorted = withNulls.sort(function(a, b) {
        if (a[0] < b[0]) {
            return -1;
        }
        if (a[0] > b[0]) {
            return 1;
        }
        return 0
    })
    formattedData['data'] = sorted
    // Get the unique identifier (for labeling objects in-browser)
    formattedData['uuid'] = loadedData['uuid']
    formattedData[`min_${params.metric}`] = loadedData[`min_${params.metric}`]
    formattedData[`max_${params.metric}`] = loadedData[`max_${params.metric}`]
    xmins.push(formattedData['min_date'])
    xmaxes.push(formattedData['max_date'])
    ymins.push(formattedData[`min_${params.metric}`])
    ymaxes.push(formattedData[`max_${params.metric}`])
    return formattedData
}

function clearData(){
    ngramData = {}
    ymins = []
    ymaxes = []
    xmins = []
    xmaxes = []
}

function resetPage(){
    if (compare) {setButtons()}
    //setRanges()
    redrawCharts()
    updateURL()
}