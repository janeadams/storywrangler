// A list of word strings
var queries = []

// When the form is submitted...
function inputClick(event) {
    // Add the query to the queries list, and import the data
    addQuery(document.getElementById("queryInput").value)
    console.log("queries = " + queries)
    // Clear the search box
    document.getElementById('queryForm').reset()
    // Don't reload the page on submit
    return false;
}

// When a word is submitted via inputClick...
function addQuery(val, err) {
    try {
        // Add the word as a list item so the user knows it's been added and can delete later
        d3.select("body").select("ul").append("li");
        // Fill that list item with the text of the word
        var p = d3.select("body").selectAll("li")
            .data(queries)
            .text(function(d, i) { return d; }).attr("id", function(d, i) { return d; });
        // Add an event listener to that list item, so we can delete it later if we need
        for (var i = 0; i < queries.length; i++) {
            document.getElementById(queries[i]).addEventListener("click", function(e, i) {
                // When the list item is clicked, remove the li, the word from the query list, and the data
                removeQuery(this.id)
                this.remove()
            })
        }
        // Add the word to the list of queries
        queries.push(val);
        console.log("Added " + val + " to query list [" + queries + "]");
        // Add the data to the list of query data objects
        loadData(val);

        // Error handling:
    } catch (e) {
        console.log(e);
    }
}

// When the list item is clicked for a particular word...
function removeQuery(value) {
    // Delete the word from the list of queries
    queries = queries.filter(function(ele) {
        // Set the queries list to every query except this one
        return ele != value
    })
    console.log("removed ", value, " from query list")
    console.log("queries = [" + queries + "]  |  query.length = " + queries.length)
}