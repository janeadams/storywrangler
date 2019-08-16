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
    }
}