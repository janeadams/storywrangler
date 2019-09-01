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

    var xScale = d3.scaleTime()
        .domain(params.xrange) // input
        .range([0, width]) // output

    if (params.options.log) {
        var yScale = d3.scaleLog()
            .domain(params.yrange) // input 
            .range([height, 1]) // output
    } else {
        var yScale = d3.scaleLinear()
            .domain(params.yrange) // input 
            .range([height, 1]) // output 
    }

    var chart = d3.select("#timeseries").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr('class', 'chart')

    // Draw the xAxis
    chart.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)) // Create an axis component with d3.axisBottom

    // Draw the yAxis
    chart.append("g")
        .attr("class", "yaxis")
        .call(d3.axisLeft(yScale).ticks(10, ""))

    var line = d3.line()
        .x(function(d) { return xScale(d.x) }) // set the x values for the line generator
        .y(function(d) { return yScale(d.y) }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line

    var lines = chart.append('g').attr('class', 'lines')

    var lineOpacity = "0.6";
    var lineOpacityHover = "0.8";
    var otherLinesOpacityHover = "0.1";
    var lineStroke = "1.5px";
    var lineStrokeHover = "2.5px";

    lines.selectAll('.line-group')
        .data(querydata).enter()
        .append('g')
        .attr('class', 'line-group')
        .on("mouseover", function(d, i) {
            chart.append("text")
                .attr("class", "title-text")
                .style("fill", colors.dark[i])
                .text(d.word)
                .attr("text-anchor", "middle")
                .attr("x", (width - margin) / 2)
                .attr("y", 5)
                .attr("id", d.word + "-line")
        })
        .on("mouseout", function(d) {
            chart.select(".title-text").remove();
        })
        .append('path')
        .attr('class', 'line')
        .attr('d', function(d) { return line(d.pairs) })
        .style('stroke', function(d, i) { return colors.hue[i] })
        .style('opacity', lineOpacity)
        .on("mouseover", function(d) {
            d3.selectAll('.line')
                .style('opacity', otherLinesOpacityHover)
            d3.select(this)
                .style('opacity', lineOpacityHover)
                .style("stroke-width", lineStrokeHover)
                .style("cursor", "pointer")
        })
        .on("mouseout", function(d) {
            d3.selectAll(".line")
                .style('opacity', lineOpacity)
            d3.select(this)
                .style("stroke-width", lineStroke)
                .style("cursor", "none")
        })

}