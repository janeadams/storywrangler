function setFilters() {
    // Check the boxes based on the parameters
    /*for (var filter of ['metric', 'language', 'scale']) {
        console.log("Clearing all checkboxes for ", filter)
        // Clear all checked boxes
        d3.selectAll("input[name = " + filter + "]").property('checked', false)
        // Check only the correct box for this parameter value
        console.log("Checking box for", params[filter], "on filter", filter)
        d3.selectAll("input[value = " + params[filter] + "]").property('checked', true)
    }
    */
    d3.selectAll("input[value ='RT']").property('checked', params['RT'])

    /*
    d3.select("#filterForm").select("li").addEventListener("click", function(e, i) {
        // When the list item is clicked, remove the word from the query list and delete the data
        if (this.checked == false) {
            currentParams[this.name] = this.value
            this.setAttribute("checked", "checked")
            this.checked = true
        } else {
            return false
        }

    })


    if (params['metric'] == 'freq') {
        // Remove the log toggle from the options list
        d3.select("#scaleFilter").style("display", "none")
        // If we're counting frequency, force scale to linear
        params["scale"] = "lin"
    } else {
        d3.select("#scaleFilter").style("display", "inline-block")
    }
    */
}