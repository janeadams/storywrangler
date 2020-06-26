function showloadingpanel(){
    //console.log('Showing loading panel...')
    d3.selectAll('.loadoverlay,.loader').style("display","block")
}

function hideloadingpanel(){
    //console.log('Hiding loading panel...')
    d3.selectAll('.loadoverlay,.loader').style("display","none")
}

function filterNull(data) {
    return data.filter(d => !isNaN(d[1]))
}

function fillMissing(data, value){
    let dates = []
    data.forEach(pair => dates.push(dateFormatter(pair[0])))
    let filled = Object.assign([], data)
    fullDateRange.forEach(date => {
        if (dates.includes(dateFormatter(date))) {
        } else {
            filled.push([date, value])
        }
    })
    let sorted = filled.sort(function(a, b) {
        if (a[0] < b[0]) {
            return -1;
        }
        if (a[0] > b[0]) {
            return 1;
        }
        return 0
    })
    return sorted
}

function replaceUndefined(data){
    let replacedMissing
    if (params['metric']==='rank'){replacedMissing = replaceValue(data,1000000) }
    else {
        if (params['scale']==='log') { replacedMissing = replaceValue(data, 0.00000001) }
        else { replacedMissing = replaceValue(data, 0) }
    }
    return replacedMissing
}



function replaceValue(data,replacement){
    let newData = []
    data.forEach(pair => {
        if(pair[1]===undefined){
            newData.push([pair[0],replacement])
        }
        else {
            newData.push(pair)
        }
    })
    return newData
}

function formatData(data){
    let loadedData = data
    let formattedData = {}
    // Parse all the dates
    let allPairs = loadedData['data'].map(tuple => [dateParser(tuple[0]), tuple[1]])
    // Remove zeroes from counts and frequency data sets
    let nonZero = []
    allPairs.forEach(pair => {
        if (pair[1] !== 0) { // If the value isn't 0
            if (params['metric']==='rank'){ // If we're measuring rank
                if (pair[1]<1000000){ nonZero.push(pair) } // Add if less than the max rank threshold of 1M
            }
            else { // If we're measuring frequency
                if (pair[1] > 0.00000001) { nonZero.push(pair) } // Add if greater than the min freq threshold of 1e-8
            }
        }
    })
    // Add missing dates and set to value to undefined
    // if (params['metric']==='rank'){ formattedData['data'] = fillMissing(nonZero, 1000000) }
    // else { formattedData['data'] = fillMissing(nonZero, undefined) }
    formattedData['data'] = fillMissing(nonZero, undefined)
    if (params['metric']==='rank') {
        formattedData['data_w-replacement'] = replaceUndefined(formattedData['data'])
    }
    // Find and format the x- and y-ranges of this data set
    formattedData['min_date'] = dateParser(loadedData['min_date'])
    formattedData['max_date'] = dateParser(loadedData['max_date'])
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