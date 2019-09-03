console.log("loaded timeseries.js")

function setSizing() {
    params.sizing[0] = 0.8 * (document.documentElement.clientWidth)
    //console.log("Updating width to...", params.sizing[0])
    params.sizing[1] = 0.6 * (document.documentElement.clientHeight)
    //console.log("Updating height to...", params.sizing[1])
}

function setRanges() {
    //console.log("Setting ranges...")
    // Lists of all date and metric min/max:
    var xmins = []
    var xmaxes = []
    var ymaxes = []
    querydata.forEach(function(data) {
        xmins.push(data.xrange[0])
        xmaxes.push(data.xrange[1])
        ymaxes.push(data.yrange[1])
    })
    params.xrange = [d3.min(xmins), d3.max(xmaxes)]
    params.yrange[0] = d3.max(ymaxes) * 1.2
    if (params['metric'] == 'freq') {
        params.yrange[1] = 0
    } else {
        params.yrange[1] = 1
    }
}

function drawTimeseries() {
    setRanges()
    var lineOpacity = "1.0";
    var lineOpacityHover = "1.0";
    var otherLinesOpacityHover = "0.3";
    var lineStroke = "1.5px";
    var lineStrokeHover = "2.5px";

    //console.log('params.xrange =', params.xrange, '  params.yrange =', params.yrange)
    //console.log("Drawing all timeseries...")
    // Determine the chart area sizing based on the window size
    //console.log("Setting margins...")
    // Set the sizing and margins for the main chart

    // Clear any leftover charting stuff from before
    d3.select("#dataviz").selectAll("svg").remove()
    //console.log("Setting scales...")
    // Set the time scale for the main chart

    console.log("Adding timeseries lines...")

    function drawTimeseries() {

        var margin = { top: 0.1 * (params.sizing[1]), right: 0.15 * (params.sizing[0]), bottom: 0.25 * (params.sizing[1]), left: 0.2 * (params.sizing[0]) }
        var width = params.sizing[0] - margin.left - margin.right
        var height = params.sizing[1] - margin.top - margin.bottom

        var xScale = d3.scaleTime()
            .domain(params.xrange).range([0, width])

        // Choose and set time scales (logarithmic or linear)
        if (params["scale"] == "log") {
            // If 'logarithmic' option is chosen (by default:)
            var yScale = d3.scaleLog().domain(params.yrange)
        } else {
            // If 'logarithmic' option deselected, use linear time scale:
            var yScale = d3.scaleLinear().domain(params.yrange)
        }

        // When showing ranks...
        if (params['metric'] == 'rank') {
            // Put rank #1 at the top
            yScale.range([height, 1])
        }
        // When showing any other metric...
        else {
            // Put the highest number at the top
            // and start at 0
            yScale.range([0, height])
        }

        // Add brushing
        //console.log("Adding brushing...")
        var brush = d3.brushX().extent([
            [0, 0],
            [width, height]
        ]).on("end", brushChart)


        var line = d3.line()
            .x(function(d) { return xScale(d.x) }) // set the x values for the line generator
            .y(function(d) { return yScale(d.y) }) // set the y values for the line generator 
            .curve(d3.curveMonotoneX) // apply smoothing to the line

        // Create a chart area and set the size
        console.log("Creating chart area...")
        var chart = d3.select("#timeseries").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr('class', 'chart')

        // Create the main chart area
        var focus = chart.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")



        console.log("Appending clipping path...")
        chart.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0)

        // Draw the main chart's xAxis
        console.log("Drawing xaxis...")
        focus.append("g")
            .attr("class", "xaxis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale)) // Create an axis component with d3.axisBottom

        chart.append("text")
            .attr("transform",
                "translate(" + ((width / 2) + margin.left) + " ," +
                (height + margin.bottom) + ")")
            .style("text-anchor", "middle")
            .text("Date")
            .style('fill', "darkgrey")

        // Draw the yAxis
        console.log("Drawing yaxis...")
        focus.append("g")
            .attr("class", "yaxis")
            .call(d3.axisLeft(yScale).ticks(10, ""))

        // Label yAxis with Metric
        chart.append("text")
            .attr("y", height / 2 + margin.top / 2)
            .attr("x", margin.left / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(String(params['metric']).charAt(0).toUpperCase() + String(params['metric']).slice(1))
            .style('fill', "darkgrey")


        var topY = "Lexical Fame"
        var bottomY = "Lexical Abyss"

        chart.append("text")
            .attr("y", 0 + margin.top + 10)
            .attr("x", margin.left / 2)
            .attr("dy", "0.5em")
            .style("text-anchor", "middle")
            .text(topY)
            .style('font-size', '10px')
            .style('fill', "darkgrey")

        chart.append("text")
            .attr("y", height + margin.top)
            .attr("x", margin.left / 2)
            .attr("dy", "0.5em")
            .style("text-anchor", "middle")
            .text(bottomY)
            .style('font-size', '10px')
            .style('fill', "darkgrey")

        // Clip the data in the main chart to the brushed region
        var masked = focus.append("g").attr("clip-path", "url(#clip)")

        console.log("Drawing storyGroup...")
        var storyGroup = masked.selectAll('.story-group')
            .data(querydata).enter()
            .append('g')
            .attr('class', 'story-group')
            .on("mouseover", function(d, i) {
                focus.append("text")
                    .attr("class", "title-text")
                    .style("fill", colors.dark[d.colorid])
                    .text(d.word)
                    .attr("text-anchor", "right")
                    .attr("x", 30)
                    .attr("y", 10)
                    .attr("id", d.word + "-group")
                    .style("font-weight", "bold")
            })
            .on("mouseout", function(d) {
                focus.select(".title-text").remove();
            })

        console.log("Drawing storyLine...")
        var storyLine = storyGroup.append('path')
            .attr('class', 'line')
            .attr('d', function(d) { return line(d.pairs) })
            .style('stroke', function(d, i) { return colors.hue[d.colorid] })
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

        /*
        console.log("Drawing dayDots...")
        var dayDots = storyGroup.selectAll(".dot").data(querydata).enter().append("circle").attr("class", "dot")
            .attr("cx", function(d, i) { return xScale(d.x) })
            .attr("cy", function(d) { return yScale(d.y) })
            .attr("r", 2)
            .style("fill", function(d, i) { return colors.light[d.colorid] })
            .style("stroke", function(d, i) { return colors.dark[d.colorid] })
            .on("mouseover", function(a, b, c) {
                d3.select(this).classed('dot', false).classed('focus', true)
            })
            .on("mouseout", function() {
                d3.select(this).classed('focus', false).classed('dot', true)
            })
            */

        focus.attr("class", "brush")
            .call(brush)

        // A function that set idleTimeOut to null
        var idleTimeout

        function idled() { idleTimeout = null; }

        function updateAxis() {
            // Update axis
            d3.select(".xaxis").transition().duration(1000).call(d3.axisBottom(xScale))
            focus
                .selectAll(".line")
                .transition().duration(1000)
                .attr('d', function(d) { return line(d.pairs) })
        }

        // A function that update the chart for given boundaries
        function brushChart() {

            //console.log(d3.event)
            var ext = d3.event.selection
            //console.log("Updating axis to ext ", ext)

            // If no selection, back to initial coordinate. Otherwise, update X axis domain
            if (!ext) {
                if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
                setRanges()
                xScale.domain(params.xrange)
                //console.log("params.xrange = ", params.xrange)
            } else {
                params.xrange = [xScale.invert(ext[0]), xScale.invert(ext[1])]
                //console.log("params.xrange = ", params.xrange)
                xScale.domain(params.xrange)
                //masked.selectAll('.story-group').select(".brush").call(brush.move, null)
                // This remove the grey brush area as soon as the selection has been done
                chart.select(".brush").call(brush.move, null)
            }

            updateAxis();

        }

    }

    drawTimeseries()

    /*

    function drawSubplot(data) {

        var width = 300;
        var height = 100;
        var margin = { top: 10, right: 10, bottom: 10, left: 10 }

        var xScale = d3.scaleTime()
            .domain(params.xrange).range([0, width])

        xScale.range([0, width])

        // Choose and set time scales (logarithmic or linear)
        if (params["scale"] == "log") {
            // If 'logarithmic' option is chosen (by default:)
            var yScale = d3.scaleLog().domain(params.yrange)
        } else {
            // If 'logarithmic' option deselected, use linear time scale:
            var yScale = d3.scaleLinear().domain(params.yrange)
        }

        // When showing ranks...
        if (params['metric'] == 'rank') {
            // Put rank #1 at the top
            yScale.range([height, 1])
        }
        // When showing any other metric...
        else {
            // Put the highest number at the top
            // and start at 0
            yScale.range([0, height])
        }

        // Create a chart area and set the size
        console.log("Creating subplot chart svg...")
        var subPlot = d3.select("#subplot-list").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr('class', 'sub-plot')
            .style('float', 'left')
            .style('display', 'inline-block')

        var subFocus = subPlot.append("g").attr("class", "sub-focus")

        subFocus.append("g")
            .attr("class", "xaxis")
            .call(d3.axisBottom(xScale)) // Create an axis component with d3.axisBottom

        subFocus.append("g")
            .attr("class", "yaxis")
            .call(d3.axisLeft(yScale)) // Create an axis component with d3.axisBottom

        console.log("Drawing subGroups...")
        var subGroup = subFocus.selectAll('.sub-group')
            .datum(data).enter()
            .append('g')
            .attr('class', 'sub-group')
            .attr('class', String(data))

        console.log("Drawing subLines...")
        var subLine = subGroup.append('path')
            .attr('class', 'line')
            .attr('d', function(d) { return line(d.pairs) })
    }

    params['queries'].forEach(function(d) {
        drawSubplot(d)
    })

    */

}