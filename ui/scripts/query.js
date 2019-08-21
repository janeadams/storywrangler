// When the form is submitted...
function inputClick(event) {
    // Add the query to the queries list, and import the data
    addQuery(d3.select("#queryInput").property("value"))
    console.log("queries = [" + queries + "]")
    // Clear the search box
    document.getElementById('queryForm').reset()
    // Don't reload the page on submit
    drawTimeseries()
    return false;
}

// When a word is submitted via inputClick...
function addQuery(val, err) {
    try {
        if (val == '') {
            console.log("Nothing entered in the search box");
        } else {
            // If the query isn't already in our list
            if (queries.includes(val) == false) {
                // If we have less than 10 queries
                if (queries.length > 10) {
                    console.log("Maximum of 10 queries allowed!")
                    // Remove the li that corresponds to the first query
                    d3.select("#" + queries[0]).remove()
                    // Remove the first item from our query list, and remove its data from our data list
                    removeQuery(queries[0])
                }
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
                // When a new word is queried...
                function loadData(word) {
                    try {
                        // Pull the JSON data
                        d3.json("data/" + word + ".json").then(function(data, error) {
                            console.log('read');
                            // Add the JSON data object to the array of query data
                            querydata.push(data);
                            console.log("Added data for " + word + " to data list; querydata list length = " + querydata.length)
                        });
                    } catch (e) {
                        // Error handling
                        console.log(e);
                        alert("Couldn't find data for " + word + "!")
                    }
                }
                // Add the data to the list of query data objects
                loadData(val)
            }
            // If the query was already in our list...
            else {
                console.log(val + " was already in queries array; queries = [" + queries + "]");
            }
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
    console.log("removed ", value, " from query list | queries.length = " + queries.length + " queries = [" + queries + "]")
    // Remove the data from the querydata list of objects
    querydata = querydata.filter(function(ele) {
        return ele.word != value
    })
    console.log("removed ", value, " from data array | querydata.length = " + querydata.length)
    /* Debugging:
    for (var i = 0; i < querydata.length; i++) {
        var currentquery = querydata[i]
        console.log(currentquery)
        console.log("i = " + i + " word = " + currentquery.word)
    }
    */
}