// When the form is submitted...
function querySubmission(event) {
    query = d3.select("#queryInput").property("value")
    if (query === '') {
        console.log("Nothing entered in the search box")
    } else {
        loadData(query, false)}
    // Clear the search box
    document.getElementById('queryForm').reset()
    // Don't reload the page on submit
    return false
}