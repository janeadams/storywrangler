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
    //console.log('params.xrange =', params.xrange, '  params.yrange =', params.yrange)
    //console.log("Drawing all timeseries...")
    // Determine the chart area sizing based on the window size
    //console.log("Setting margins...")
    // Set the sizing and margins for the main chart
    var margin = { top: 0.1 * (params.sizing[1]), right: 0.1 * (params.sizing[0]), bottom: 0.25 * (params.sizing[1]), left: 0.1 * (params.sizing[0]) }
    var width = params.sizing[0] - margin.left - margin.right
    var height = params.sizing[1] - margin.top - margin.bottom

    // Set the sizing for the brushed navigation mini-chart
    var margin2 = { top: height + 100, right: margin.right, bottom: margin.bottom, left: margin.left }
    var height2 = params.sizing[1] - margin2.top - margin2.bottom

    // Clear any leftover charting stuff from before
    d3.select("#dataviz").selectAll("svg").remove()
    //console.log("Setting scales...")
    // Set the time scale for the main chart
    var xScale = d3.scaleTime()
        .domain(params.xrange) // input
        .range([0, width]) // output

    // Set the time scale for the navigation brush mini-chart
    var xScale2 = d3.scaleTime()
        .domain(params.xrange) // input
        .range([0, width]) // output

    // Choose and set time scales (logarithmic or linear)
    if (params["scale"] == "log") {
        // If 'logarithmic' option is chosen (by default:)
        var yScale = d3.scaleLog().domain(params.yrange)
        var yScale2 = d3.scaleLog().domain(params.yrange)
    } else {
        // If 'logarithmic' option deselected, use linear time scale:
        var yScale = d3.scaleLinear().domain(params.yrange)
        var yScale2 = d3.scaleLinear().domain(params.yrange)
    }

    // When showing ranks...
    if (params['metric'] == 'rank') {
        // Put rank #1 at the top
        yScale.range([height, 1])
        yScale2.range([height, 1])
    }
    // When showing any other metric...
    else {
        // Put the highest number at the top
        // and start at 0
        yScale.range([0, height])
        yScale2.range([0, height])
    }

    // Create a chart area and set the size
    //console.log("Creating chart area...")
    var chart = d3.select("#timeseries").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr('class', 'chart')

    // Add brushing
    //console.log("Adding brushing...")
    var brush = d3.brushX() // Add the brush feature using the d3.brush function
        .extent([
            [0, 0],
            [width, height]
        ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", brushChart)

    // Create the main chart area
    var focus = chart.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    // Create a mini-chart for brushed navigation
    var context = chart.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")")

    // Draw the main chart's xAxis
    //console.log("Drawing focus area...")
    focus.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)) // Create an axis component with d3.axisBottom

    // Draw the yAxis
    //console.log("Drawing yaxis...")
    focus.append("g")
        .attr("class", "yaxis")
        .call(d3.axisLeft(yScale).ticks(10, ""))

    var line = d3.line()
        .x(function(d) { return xScale(d.x) }) // set the x values for the line generator
        .y(function(d) { return yScale(d.y) }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line

    focus.attr("class", "brush")
        .call(brush)

    //console.log("Appending clipping path...")
    focus.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0)

    // Clip the data in the main chart to the brushed region
    var masked = focus.append("g").attr("clip-path", "url(#clip)")

    var lineOpacity = "1.0";
    var lineOpacityHover = "1.0";
    var otherLinesOpacityHover = "0.3";
    var lineStroke = "1.5px";
    var lineStrokeHover = "2.5px";

    //console.log("Adding timeseries lines...")

    function drawLines() {
        var storyGroup = masked.selectAll('.story-group')
            .data(querydata).enter()
            .append('g')
            .attr('class', 'story-group')
            .on("mouseover", function(d, i) {
                focus.append("h1")
                    .attr("class", "title-text")
                    .style("fill", colors.dark[d.colorid])
                    .text(d.word)
                    .attr("text-anchor", "middle")
                    .attr("x", width - margin)
                    .attr("y", 10)
                    .attr("id", d.word + "-group")
            })
            .on("mouseout", function(d) {
                focus.select(".title-text").remove();
            })
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


        /*var statGroup = masked.append("g").attr("class", "mouse-over-effects")

        statGroup.append("path") // this is the black vertical line to follow mouse
            .attr("class", "mouse-line")
            .style("stroke", "black")
            .style("stroke-width", "1px")
            .style("opacity", "0");

        var statItems = statGroup.selectAll('.stat-items')
            .data(querydata)
            .enter()
            .append("g")
            .attr("class", "stat-items")

        statItems.append("circle")
            .attr("r", 7)
            .style("stroke", function(d) {
                return colors.hue[d.colorid];
            })
            .style("fill", "none")
            .style("stroke-width", "1px")
            .style("opacity", "0");

        statItems.append("text")
            .attr("transform", "translate(10,3)");

        statGroup.append('svg:rect') // append a rect to catch mouse movements on canvas
            .attr('width', width) // can't catch mouse events on a g element
            .attr('height', height)
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
            .on('mouseout', function() { // on mouse out hide line, circles and text
                d3.select(".stat")
                    .style("opacity", "0");
                d3.selectAll(".statItems circle")
                    .style("opacity", "0");
                d3.selectAll(".statItems text")
                    .style("opacity", "0");
            })
            .on('mouseover', function() { // on mouse in show line, circles and text
                d3.select(".stat")
                    .style("opacity", "1");
                d3.selectAll(".statItems circle")
                    .style("opacity", "1");
                d3.selectAll(".statItems text")
                    .style("opacity", "1");
            })
            .on('mousemove', function() { // mouse moving over canvas
                var mouse = d3.mouse(this);
                d3.select(".stat")
                    .attr("d", function() {
                        var d = "M" + mouse[0] + "," + height;
                        d += " " + mouse[0] + "," + 0;
                        return d;
                    })
            });

        d3.selectAll(".statItems")
            .attr("transform", function(d, i) {
                console.log(width / mouse[0])
                var xDate = x.invert(mouse[0]),
                    bisect = d3.bisector(function(d) { return d.date; }).right;
                idx = bisect(d.values, xDate);

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
                    .text(y.invert(pos.y).toFixed(2));

                return "translate(" + mouse[0] + "," + pos.y + ")";
            });
            */
    }

    drawLines()


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