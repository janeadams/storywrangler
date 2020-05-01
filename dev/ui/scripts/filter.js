function setFilters() {

    // Check the boxes based on the parameters
    for (var filter of ['metric', 'scale']) {
        console.log(`Clearing all checkboxes for  ${filter}`)
        // Clear all checked boxes
        d3.selectAll(`input[name = ${filter}]`).property('checked', false)
        // Check only the correct box for this parameter value
        console.log(`Checking box for ${params[filter]} on filter ${filter}`)
        d3.selectAll(`input[value =${params[filter]}]`).property('checked', true)
    }


    if (params['metric'] == 'freq') {
        // Remove the log toggle from the options list
        d3.select("#scaleFilter").style("display", "none")
        // If we're counting frequency, force scale to linear
        params["scale"] = "lin"
    } else {
        d3.select("#scaleFilter").style("display", "inline-block")
    }

}

function filterSubmission() {
    console.log("filter selected!")
    // Check the boxes based on the parameters
    for (var p of ['metric', 'scale']) {
        // Get the selected language and metric, and update the parameters variable
        //params[p] = d3.select(`input[name = '${p}']`).property('checked',true).property('value')
        console.log(`Params[${p}] = ${params[p]}`)
    }
    params['RT']=d3.select("input[value ='RT']:checked")
    console.log(`Set params['RT'] to ${params['RT']}`)
}