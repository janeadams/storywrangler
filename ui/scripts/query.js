// When the form is submitted...
function inputClick(event) {
    query = d3.select("#queryInput").property("value")
    if (query == '') {
        console.log("Nothing entered in the search box");
    } else {
        // If the query isn't already in our list
        if (queries.includes(query) == false) {
            // If we have less than 10 queries
            if (queries.length > 10) {
                dumpFirst()
            }
            // Import the data and add to the list of query data objects
            loadData(query)
        }
        // If the query was already in our list...
        else {
            console.log(query + " was already in queries array; queries = [" + queries + "]");
        }
    }
    // Clear the search box
    document.getElementById('queryForm').reset()
    // Draw our timeseries!
    //drawTimeseries()
    // Don't reload the page on submit
    return false;
}

function dumpFirst() {
    console.log("Maximum of 10 queries allowed!")
    // Remove the li that corresponds to the first query
    d3.select("#" + queries[0]).remove()
    // Remove the first item from our query list, and remove its data from our data list
    removeWord(queries[0], queries)
    removeWord(queries[0], querydata)
}

// When a word is submitted via inputClick...
function addQuery(val, err) {
    // Add the word to the list of queries
    queries.push(val);
    console.log("Added " + val + " to query list [" + queries + "]; query list length = " + queries.length);
    // Add the word as a list item so the user knows it's been added and can delete later
    d3.select("#queryList").append("li").text(val).attr("id", val).on("click", function(d, i) {
        // When the list item is clicked, remove the word from the query list and delete the data
        removeQuery(this.id)
        // Delete the li for the deleted word
        this.remove()
    })
    // Draw the timeseries
}

// When a new word is queried...
function loadData(word) {
    try {
        // Pull the JSON data
        var url = "http://hydra.uvm.edu:3001/api/" + word
        d3.json(url).then(function(data, error) {
            console.log('read url "' + url + '"')
            if (data["api_error_count"] > 0) {
                alert(data["errors"])
            } else {
                // Parse the dates into d3 date format
                var parsedDates = data["dates"].map(function(date) { return d3.timeParse(date) })
                // Set the querydata dates to the parsed dates
                data["dates"] = parsedDates
                // Add the JSON data object to the array of query data
                querydata.push(data);
                console.log("Added data for " + word + " to data list; querydata list length = " + querydata.length)
                console.log("querydata for " + word + " is: ")
                console.log(data)
                addQuery(word)
            }
        });
    } catch (e) {
        // Error handling
        console.log(e);
    }
}

// When the list item is clicked for a particular word...
function removeWord(value, set) {
    // Delete the word from the [query, querydata, etc.]
    set = set.filter(function(ele) {
        // Filter the set to include every query except this one
        return ele != value
    })
    console.log("removed ", value, " from set; length = " + set.length + " and data is " + set)
}