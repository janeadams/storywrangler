function setFilters() {

    // Check the boxes based on the parameters
    for (let p of ['metric', 'scale']) {
        console.log(`Clearing all checkboxes for ${p} filter`)
        // Clear all checked boxes
        d3.selectAll(`input[name = ${p}]`).attr('checked', false)
        // Check only the correct box for this parameter value
        console.log(`Checking box for ${params[p]} = ${p}`)
        d3.selectAll(`input[value =${params[p]}]`).property('checked', true)
    }

    d3.select("input[value ='rt']").property('checked', params['rt'])

}

function filterSubmission() {
    console.log("filter selected!")
    let isUpdated = false
    // Check the boxes based on the parameters
    for (let p of ['metric', 'scale']) {
        // Get the selected language and metric, and update the parameters variable
        let newParam = d3.selectAll(`input[name = '${p}']:checked`).property('value')
        if (params[p] !== newParam){
            params[p] = newParam
            console.log(`Changed params[${p}] to ${params[p]}`)
            isUpdated = true
            console.log(`isUpdated = ${isUpdated}`)
        }
    }
    let newRTparam = d3.select("input[value ='rt']").property('checked')
    if ( params['rt'] !== newRTparam) {
        params['rt'] = newRTparam
        console.log(`Changed params['rt'] to ${params['rt']}`)
        isUpdated = true
        console.log(`isUpdated = ${isUpdated}`)
    }
    if (isUpdated) {
        triggerUpdates()
    }
}

function triggerUpdates(){
    console.log(`There was an update to the parameters`)
    setFilters()
    updateURL()
    reloadAllData()
    redrawCharts()
}