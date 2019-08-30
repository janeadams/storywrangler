// When the form is submitted...
function inputClick(event) {
    query = d3.select("#queryInput").property("value")
    if (query == '') {
        console.log("Nothing entered in the search box");
    } else {
        // If the query isn't already in our list
        if (queries.includes(query) == false) {
            // If this will bring us to ten queries, dump the first item in our list
            if (queries.length > 9) {
                dumpFirst()
            }
            // If this will bring us to 5 queries, start plotting in subplots
            if (queries.length > 4) {
                multi = true
            } else {
                multi = false
            }
            loadData(query)
        }
        // If the query was already in our list...
        else {
            console.log(query + " was already in queries array; queries = [" + queries + "]");
        }
    }
    // Clear the search box
    document.getElementById('queryForm').reset()
    // Don't reload the page on submit
    return false;
}

function dumpFirst() {
    console.log("Maximum of 10 queries allowed!")
    // Remove the li that corresponds to the first query
    d3.select("#" + queries[0]).remove()
    // Remove the first item from our query list, and remove its data from our data list
    removeWord(queries[0])
}

// When a word is submitted via inputClick...
function addQuery(val, err) {
    // Add the word to the list of queries
    queries.push(val);
    console.log("Added " + val + " to query list [" + queries + "]; query list length = " + queries.length);
    // Add the word as a list item so the user knows it's been added and can delete later
    d3.select("#queryList").append("li").text(val).attr("id", val).on("click", function(d, i) {
        // When the list item is clicked, remove the word from the query list and delete the data
        removeWord(this.id)
        // Delete the li for the deleted word
        this.remove()
    })
    console.log("Added " + val + " to UI buttons");
}

// When a new word is queried...
function loadData(word) {
    // Pull the JSON data
    formatted_word = word.replace("#", "%23")
    var url = encodeURI("http://hydra.uvm.edu:3001/api/" + formatted_word + "?src=ui&lang=" + params["lang"] + "&metric=[" + params["metric"] + "]")
    d3.json(url).then(function(data, error) {
        console.log('read url "' + url + '"')
        if (data["api_error_count"] > 0) {
            alert(data["errors"])
        } else {
            // Parse the dates into d3 date format
            var parsedDates = data["dates"].map(function(date) { return new Date(d3.timeParse(date)) })
            // Set the querydata dates to the parsed dates
            data['dates'] = parsedDates
            console.log("73")
            data['xrange'] = d3.extent(data["dates"])
            data['yrange'] = d3.extent(data[params["metric"]])
            // Add the JSON data object to the array of query data
            querydata.push(data)
            console.log("78")
            xmins.push(data.xrange[0])
            xmaxes.push(data.xrange[1])
            ymaxes.push(data.yrange[1])
            updateRanges()
            console.log("Added data for " + word + " to data list; querydata list length = " + querydata.length)
            console.log("querydata for " + word + " is: ")
            console.log(data)
            addQuery(word)
            drawAllTimeseries()
        }
    })
    /*.catch(function(error) {
               // Error handling
               //console.log(e);
               alert("Sorry! It looks like the database is down or overloaded -- please try again later")
           })*/
}

// When the list item is clicked for a particular word...
function removeWord(value) {
    // Delete the word from the list of queries
    queries = queries.filter(function(ele) {
        // Filter the set to include every query except this one
        return ele != value
    })
    console.log("removed ", value, " from queries; length = " + queries.length + " and data is " + queries)
    // Delete the word from the list of querydata
    querydata = querydata.filter(function(ele) {
        // Filter the set to include every query except this one
        return ele['word'] != value
    })
    console.log("removed ", value, " from querydata; length = " + querydata.length + " and data is " + querydata)
}