function drawTimeseries() {
    querydata.forEach(function(data) {
        var times = []
        data["times"].forEach(function(date) {
            times.append(d3.time.format("%Y-%m-%d").parse(date))
        })
        console.log("dates = ", times)
        var values = data[params['metric']]
        console.log("values = ", values)
    })
}