// Create an array of data objects
querydata = []

// When a new word is queried...
function loadData(word) {
    // Pull the JSON data
    d3.json("data/" + word + ".json").then(function(data, error) {
        console.log('read');
        // Error handling
        if (error)
            return console.log(error);
        // Add the JSON data object to the array of query data
        querydata.push(JSON.stringify(data));
        console.log("Added data for " + word + " to data list [" + querydata + "]");
    });
}