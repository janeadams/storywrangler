function inputClick(event) {
    addQuery(document.getElementById("queryInput").value)
    console.log("queries = " + queries)
    document.getElementById('queryForm').reset()
}

function addQuery(val, err) {
    try {
        d3.select("body").select("ul").append("li");
        queries.push(val);
        console.log("Added " + val + " to query list [" + queries + "]")
        var p = d3.select("body").selectAll("li")
            .data(queries)
            .text(function(d, i) { return i + ": " + d; }).attr("id", function(d, i) { return d; });
        for (var i = 0; i < queries.length; i++) {
            document.getElementById(queries[i]).addEventListener("click", function(e, i) {
                removeQuery(this.id)
                this.remove()
            })
        }
    } catch (e) {
        console.log(e);
    }
}


function removeQuery(value) {
    queries = queries.filter(function(ele) {
        return ele != value
    })
    console.log("removed ", value, " from query list")
    console.log("queries = [" + queries + "]  |  query.length = " + queries.length)

}