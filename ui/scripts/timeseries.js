console.log("loaded timeseries.js")

function updateRanges() {
    console.log("Updating ranges...")
    params.xrange = [d3.min(xmins), d3.max(xmaxes)]
    params.yrange = [d3.max(ymaxes), 1]
    console.log('params.xrange =', params.xrange, '  params.yrange =', params.yrange)
}

function drawAllTimeseries() {
    console.log("Drawing all timeseries...")
    var optwidth = 0.8 * (document.documentElement.clientWidth)
    var optheight = 0.6 * (document.documentElement.clientHeight)
    console.log("optwidth = ", optwidth, " optheight = ", optheight)
    /* === Focus chart === */
    console.log("Setting margins...")
    var margin = { top: 0.1 * (optheight), right: 0.1 * (optwidth), bottom: 0.25 * (optheight), left: 0.1 * (optwidth) }
    var width = optwidth - margin.left - margin.right
    var height = optheight - margin.top - margin.bottom
    /* === Context chart === */
    var margin_context = { top: 0.85 * (optheight), right: 0.1 * (optwidth), bottom: 0.1 * (optheight), left: 0.1 * (optwidth) }
    var height_context = optheight - margin_context.top - margin_context.bottom

    console.log("22")

    d3.select("#dataviz").selectAll("svg").remove()

    var xScale = d3.scaleLinear()
        .domain(params.xrange) // input
        .range([0, width]); // output
    if (params.options.log) {
        var yScale = d3.scaleLog()
            .domain(params.yrange) // input 
            .range([height, 1]) // output
    } else {
        var yScale = d3.scaleLinear()
            .domain(params.yrange) // input 
            .range([height, 1]) // output 
    }



    var line = d3.line()
        .x(function(d) { return xScale(d.x); }) // set the x values for the line generator
        .y(function(d) { return yScale(d.y); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line

    var chart = d3.select("#timeseries").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

    chart.append("g")
        .attr("class", "y axis")
        //.call(d3.axisLeft(yScale).tickFormat(d3.format("")))
        .call(d3.axisLeft(yScale).ticks(10, ""))

    function drawEachTimeseries(data, i) {
        var id = data["word"] + "-timeseries"
        console.log("data['word'] = ", data["word"])
        console.log("id =", id)
        // Get a list of all dates for which we have data
        var dates = data["dates"]
        console.log('dates = ', dates)
        // Get a list of all the values for our chosen metric
        var values = data[params['metric']]
        console.log('values = ', values)

        dataset = []

        dates.forEach(function(date, i) {
            var pair = {}
            pair.x = date
            pair.y = values[i]
            dataset.push(pair)
        })
        console.log(dataset)

        // Draw the timeseries line
        chart.append("path")
            .datum(dataset)
            .attr("class", "line")
            .attr("d", line)
            .attr("id", id)
            .style("stroke", colors.hue[i])

        // Add a point to every date 
        chart.selectAll(".dot")
            .data(dataset)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", function(d, i) { return xScale(d.x) })
            .attr("cy", function(d) { return yScale(d.y) })
            .attr("r", 2)
            .style("fill", colors.light[i])
            .style("stroke", colors.dark[i])
            .on("mouseover", function(a, b, c) {
                console.log(a)
                d3.select(this).classed('dot', false).classed('focus', true)
            })
            .on("mouseout", function() {
                d3.select(this).classed('focus', false).classed('dot', true)
            })
    }
    querydata.forEach(function(dataset, i) {
        drawEachTimeseries(dataset, i)
    })
}