function setFilters() {
    //console.log('Setting Filters')
    // Check the boxes based on the parameters
    for (let p of ['metric', 'scale']) {
        //console.log(`Clearing all checkboxes for ${p} filter`)
        // Clear all checked boxes
        d3.selectAll(`input[name = ${p}]`).attr('checked', false)
        // Check only the correct box for this parameter value
        //console.log(`Checking box for ${params[p]} = ${p}`)
        d3.selectAll(`input[value =${params[p]}]`).property('checked', true)
    }
    d3.select("input[value ='rt']").property('checked', params['rt'])

    Object.keys(languageCodes).forEach(language => {
        let code = languageCodes[language]['db_code']
        if (code === params['language']){
            d3.select("#langFilter").select(`option[value=${code}]`).property('selected', true)
        }
        else {
            d3.select("#langFilter").select(`option[value=${code}]`).property('selected', false)
        }

    })
}

function filterSubmission() {
    //console.log("filter selected!")
    let isUpdated = false
    // Check the boxes based on the parameters
    for (let p of ['metric', 'scale']){
        //console.log(`checking filter for parameter ${p}`)
        // Get the selected language and metric, and update the parameters variable
        let newParam = d3.selectAll(`input[name = '${p}']:checked`).property('value')
        if (params[p] !== newParam) {
            params[p] = newParam
            //console.log(`Changed params[${p}] to ${params[p]}`)
            isUpdated = true
            //console.log(`isUpdated = ${isUpdated}`)
            }
        }
    let langChoice = d3.select("#langDropdown").property('value')
    //console.log(`langChoice: ${langChoice}`)
    if (langChoice !== params['language']){
        if (paramoptions['language'].includes(languageCodes[langChoice]['db_code'])){
            params['language'] = languageCodes[langChoice]['db_code']
            console.log(`Changed params['language'] to ${params['language']}`)
            if(compare){translateDefaults()}
            isUpdated = true
        }
    }
    if (Object.keys(paramoptions).includes('rt')) {
        let newRTparam = d3.select("input[value ='rt']").property('checked')
        if ( params['rt'] !== newRTparam) {
            params['rt'] = newRTparam
            //console.log(`Changed params['rt'] to ${params['rt']}`)
            isUpdated = true
        }
    }
    if (isUpdated) {
        triggerUpdates()
    }
}

function triggerUpdates(){
    //console.log(`There was an update to the parameters`)
    setFilters()
    updateURL()
    reloadAllData()
    redrawCharts()
}