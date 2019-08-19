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
        if (queries.includes(val) == false) {
            // Add the word to the list of queries
            queries.push(val);
            console.log("Added " + val + " to query list [" + queries + "]; query list length = " + queries.length);
            // Add the word as a list item so the user knows it's been added and can delete later
            d3.select("body").select("ul").append("li");
            // Fill that list item with the text of the word
            var p = d3.select("body").selectAll("li")
                .data(queries)
                .text(function(d, i) { return d; }).attr("id", function(d, i) { return d; });
            // Add an event listener to that list item, so we can delete it later if we need
            for (var i = 0; i < queries.length; i++) {
                document.getElementById(queries[i]).addEventListener("click", function(e, i) {
                    // When the list item is clicked, remove the word from the query list and delete the data
                    removeQuery(this.id)
                    // Delete the li for the deleted word
                    this.remove()
                })
            }
            // Add the data to the list of query data objects
            loadData(val);
        } else {
            console.log(val + " was already in queries array; queries = [" + queries + "]");
        }

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
    console.log("queries.length = " + queries.length)
    console.log("queries = [" + queries + "]")
    // Remove the data from the querydata list of objects
    querydata = querydata.filter(function(ele) {
        return ele.word != value
    })
    console.log("removed ", value, " from data array")
    console.log("querydata.length = " + querydata.length)
    /* Debugging:
    for (var i = 0; i < querydata.length; i++) {
        var currentquery = querydata[i]
        console.log(currentquery)
        console.log("i = " + i + " word = " + currentquery.word)
    }
    */
}