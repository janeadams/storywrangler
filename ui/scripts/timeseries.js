function drawTimeseries() {
    querydata.forEach(function(dataset) {
        var values = dataset[params['metric']]
        var svgcontainer = d3.select("#timeseries").append('svg').attr("width", 400).attr('height', 200)
        var points = svgcontainer.selectAll("circle").data(values / 100).enter().append('circle');
    })
}