console.log("loaded timeseries.js")

function drawCharts() {
    setRanges()
    var lineOpacity = "1.0";
    var lineOpacityHover = "1.0";
    var otherLinesOpacityHover = "0.3";
    var lineStroke = "1px";
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

    var margin = { top: 0.1 * (params.sizing[1]), right: 0.15 * (params.sizing[0]), bottom: 0.25 * (params.sizing[1]), left: 0.2 * (params.sizing[0]) }
    var width = params.sizing[0] - margin.left - margin.right
    var height = params.sizing[1] - margin.top - margin.bottom

    var margin2 = { top: height + (2 * margin.top), right: margin.right, bottom: margin.bottom, left: margin.left }
    var xScale = d3.scaleTime()
        .domain(params.xviewrange).range([0, width])

    var x2Scale = d3.scaleTime()
        .domain(params.xrange).range([0, width])

    console.log('params.xrange = ', params.xrange)

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
        [width, 60]
    ]).on("end", brushChart)

    var zoom = d3.zoom()
        .scaleExtent([1, 5])
        .translateExtent([
            [0, 0],
            [width, height]
        ])
        .extent([
            [0, 0],
            [width, height]
        ])
        .on("zoom", zoomed);


    var line = d3.line()
        .x(d => xScale(d.x)) // set the x values for the line generator
        .y(d => yScale(d.y)) // set the y values for the line generator 
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

    var context = chart.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    console.log("Appending clipping path...")
    chart.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0)


    // Draw the main chart's xAxis
    console.log("Drawing focus xaxis...")
    focus.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)).selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)") // Create an axis component with d3.axisBottom

    console.log("Drawing context xaxis...")
    context.append("g")
        .attr("class", "xaxis2")
        .attr("transform", "translate(0," + 20 + ")")
        .call(d3.axisBottom(x2Scale))

    /*
    chart.append("text")
        .attr("transform",
            "translate(" + ((width / 2) + margin.left) + " ," +
            (height + margin.bottom) + ")")
        .style("text-anchor", "middle")
        .text("Date")
        .style('fill', "darkgrey")
    */

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

    context.append("g").attr("clip-path", "url(#clip)")

    console.log("Drawing storyGroup...")
    var storyGroup = masked.selectAll('.story-group')
        .data(querydata).enter()
        .append('g')
        .attr('class', 'story-group')
        .on("mouseover", (d, i) => {
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
        .on("mouseout", d => {
            focus.select(".title-text").remove();
        })

    console.log("Drawing storyLine...")
    var storyLine = storyGroup.append('path')
        .attr('class', 'line')
        .attr('d', d => line(d.pairs))
        .style('stroke', (d, i) => colors.hue[d.colorid])
        .style('opacity', lineOpacity)
        .on("mouseover", function(d, i) {
            var xDate = xScale.invert(d3.mouse(this)[0]),
                bisect = d3.bisector(function(d) { return d.date; }).right;
            console.log('storyline d = ', d)
            d3.selectAll('.line')
                .style('opacity', otherLinesOpacityHover)
            d3.select(this)
                .style('opacity', lineOpacityHover)
                .style("stroke-width", lineStrokeHover)
                .style("cursor", "pointer")
                .append("g").text(bisect)
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
    var dayDots = storyGroup.selectAll(".dot")
        .data(d.pairs).enter().append("circle").attr("class", "dot")
        .attr("cx", (d, i) => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 2)
        .style("fill", (d, i) => colors.light[d.colorid])
        .style("stroke", (d, i) => colors.dark[d.colorid])
        .on("mouseover", function(a, b, c) {
            d3.select(this).classed('dot', false).classed('focus', true)
        })
        .on("mouseout", function() {
            d3.select(this).classed('focus', false).classed('dot', true)
        })
    */

    context.append("g").attr("class", "brush").call(brush)

    //chart.attr("class", "zoom")
    //.call(zoom)

    // A function that set idleTimeOut to null
    var idleTimeout

    function idled() { idleTimeout = null; }

    function updateAxis() {
        // Update axis
        d3.select(".xaxis").transition().duration(1000).call(d3.axisBottom(xScale)).selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)")
        console.log('xScale = ', +xScale)
        focus.selectAll(".line")
            .transition().duration(1000)
            .attr('d', d => line(d.pairs))
    }

    function zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
        var t = d3.event.transform;
        params.xviewrange = t.rescaleX(x2Scale).domain()
        xScale.domain(params.xviewrange)
        context.select(".brush").call(brush.move, xScale.range().map(t.invertX, t))
        updateAxis()
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
            xScale.domain(params.xviewrange)
            console.log("params.xrange = ", params.xrange)
        } else {
            params.xviewrange = [x2Scale.invert(ext[0]), x2Scale.invert(ext[1])]
            console.log("params.xviewrange = ", params.xviewrange)
            xScale.domain(params.xviewrange)
            //masked.selectAll('.story-group').select(".brush").call(brush.move, null)
            // This remove the grey brush area as soon as the selection has been done
            //context.select(".brush").call(brush.move, null)
        }

        updateAxis()

    }

    /*

    var mouseG = focus.append("g")
        .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
        .attr("class", "mouse-line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    var lines = document.getElementsByClassName('line');

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
        .data(querydata)
        .enter()
        .append("g")
        .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
        .attr("r", 7)
        .style('stroke', (d, i) => colors.hue[d.colorid])
        .style("fill", "none")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    mousePerLine.append("text")
        .attr("transform", "translate(10,3)");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
        .attr('width', width) // can't catch mouse events on a g element
        .attr('height', height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function() { // on mouse out hide line, circles and text
            d3.select(".mouse-line")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line circle")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line text")
                .style("opacity", "0");
        })
        .on('mouseover', function() { // on mouse in show line, circles and text
            d3.select(".mouse-line")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line circle")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line text")
                .style("opacity", "1");
        })
        .on('mousemove', function() { // mouse moving over canvas
            var mouse = d3.mouse(this);
            d3.select(".mouse-line")
                .attr("d", function() {
                    var d = "M" + mouse[0] + "," + height;
                    d += " " + mouse[0] + "," + 0;
                    return d;
                });

            d3.selectAll(".mouse-per-line")
                .attr("transform", function(d, i) {
                    //console.log("width / mouse[0] = ", width / mouse[0])
                    //console.log("xScale.invert(mouse[0]) = ", xScale.invert(mouse[0]))
                    var xDate = xScale.invert(mouse[0]),
                        bisect = d3.bisector(function(d) { return d.date; }).right;
                    //console.log("xDate = ", xDate)
                    //console.log("bisect = ", bisect)
                    idx = bisect(d.rank, xDate);

                    var beginning = 0,
                        end = lines[i].getTotalLength(),
                        target = null;

                    while (true) {
                        target = Math.floor((beginning + end) / 2);
                        pos = lines[i].getPointAtLength(target);
                        if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                            break;
                        }
                        if (pos.x > mouse[0]) end = target;
                        else if (pos.x < mouse[0]) beginning = target;
                        else break; //position found
                    }

                    d3.select(this).select('text')
                        .text(yScale.invert(pos.y).toFixed(2));

                    return "translate(" + mouse[0] + "," + pos.y + ")";
                });
        })

    

    function drawSubplot(data) {

        var width = 300;
        var height = 100;
        var margin = { top: 10, right: 10, bottom: 10, left: 10 }

        var xScale = d3.scaleTime()
            .domain(params.xviewrange).range([0, width])

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
            .call(d3.axisBottom(xScale)).selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)") // Create an axis component with d3.axisBottom

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