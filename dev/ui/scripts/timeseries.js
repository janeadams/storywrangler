console.log("loaded timeseries.js")

let xScale = []
let yScale = []
let xViewScale = []
let width = window.innerWidth
let height = window.innerHeight
const margin = { top: 0.1 * window.innerHeight, right: 0.15 * window.innerWidth, bottom: 0.25 * window.innerHeight, left: 0.2 * window.innerWidth }


const xAccessor = d => d.data
const yAccessor = d => d.data

function setupCharts(){

    xScale = d3.scaleTime().domain(params.xrange).range([0, width])
    xViewScale = d3.scaleTime().domain(params.xviewrange).range([0, width])

    // Choose and set time scales (logarithmic or linear)
    if (params["scale"] == "log") {
        // If 'logarithmic' option is chosen (by default:)
        yScale = d3.scaleLog().domain(params.yrange)
    } else {
        // If 'logarithmic' option deselected, use linear time scale:
        yScale = d3.scaleLinear().domain(params.yrange)
    }

    // When showing ranks...
    if (params.metric.includes('rank')) {
        // Put rank #1 at the top
        yScale.range([height, 1])
    }
    // When showing any other metric...
    else {
        // Put the highest number at the top
        // and start at 0
        yScale.range([0, height])
    }

    var line = d3.line()
        .x(d => xScale(d.x)) // set the x values for the line generator
        .y(d => yScale(d.y)) // set the y values for the line generator
        .defined(function (d) { return d[1] !== null; })
    //.curve(d3.curveMonotoneX) // apply smoothing to the line

    drawMain()
}

function zoomAndBrush(){

    function zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
        var t = d3.event.transform;
        params.xviewrange = t.rescaleX(x2Scale).domain()
        xScale.domain(params.xviewrange)
        context.select(".brush").call(brush.move, xScale.range().map(t.invertX, t))
        updateAxis()
    }

    const zoom = d3.zoom()
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

    // A function that update the chart for given boundaries
    function brushChart() {

        //console.log(d3.event)
        var ext = d3.event.selection
        //console.log("Updating axis to ext ", ext)

        // If no selection, back to initial coordinate. Otherwise, update X axis domain
        if (!ext) {
            //if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
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

    }

    //console.log("Adding brushing...")
    const brush = d3.brushX().extent([
        [0, 0],
        [width, 60]
    ]).on("end", brushChart)

}

function clearCharts(){
    // Clear any leftover charting stuff from before
    d3.select("#dataviz").selectAll("svg").remove()
}

function drawMain() {
    //console.log("Setting scales...")
    // Set the time scale for the main chart
    console.log("Adding timeseries lines...")

    const margin = { top: 0.1 * (params.sizing[1]), right: 0.15 * (params.sizing[0]), bottom: 0.25 * (params.sizing[1]), left: 0.2 * (params.sizing[0]) }
    const width = params.sizing[0] - margin.left - margin.right
    const height = params.sizing[1] - margin.top - margin.bottom

    console.log('params.xrange = ${params.xrange}')
    console.log('params.xviewrange = ${params.xviewrange}')

    // Create a chart area and set the size
    console.log("Creating chart area...")
    let chart = d3.select("#timeseries").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr('class', 'chart')

    // Create the main chart area
    let focus = chart.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(${margin.left}, ${margin.top})")

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


    const topY = "Lexical Fame"
    const bottomY = "Lexical Abyss"

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

    zoomAndBrush()

    // Clip the data in the main chart to the brushed region
    let masked = focus.append("g").attr("clip-path", "url(#clip)")

    drawContext(chart)
    drawLineGroup(focus)
}

function drawContext(chart){

    let margin2 = { top: height + (2 * margin.top), right: margin.right, bottom: margin.bottom, left: margin.left }

    let x2Scale = d3.scaleTime()
        .domain(params.xrange).range([0, width])

    let context = chart.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    console.log("Drawing context xaxis...")
    context.append("g")
        .attr("class", "xaxis2")
        .attr("transform", "translate(0," + 20 + ")")
        .call(d3.axisBottom(x2Scale))

    //context.append("g").attr("class", "brush").call(brush)
    context.append("g").attr("clip-path", "url(#clip)")

}

function drawLineGroup(focus) {
    console.log("Drawing lineGroup...")
    var lineGroup = masked.selectAll('.story-group')
        .data(ngramData).enter()
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
    for (ngram in ngramData.keys()){
        addLine(ngram)
    }
}

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

function addLine(ngram, lineGroup){
    console.log('adding line for ${ngram}')
    console.log("Drawing storyLine...")
    let storyLine = lineGroup.append('path')
        .attr('class', 'line')
        .attr('d', d => line(d.pairs))
        .style('stroke', (d, i) => colors.main[d.colorid])
        .style('opacity', lineOpacity)
        .on("mouseover", function(d, i) {
            var xDate = xScale.invert(d3.mouse(this)[0]),
                bisect = d3.bisector(function(d) { return d.date; }).right;
            console.log('storyline d = ', d)
            d3.selectAll('.line')
                .attr('class', 'unfocus')
            d3.select(this)
                .attr('class', 'hoverline')
                .append("g").text(bisect)
        })
        .on("mouseout", function(d) {
            d3.selectAll(".line")
                .style('opacity', lineOpacity)
            d3.select(this)
                .style("stroke-width", lineStroke)
                .style("cursor", "none")
        })
    //updateAxis()
}

function addSubplot(ngram){
    console.log('adding subplot for ${ngram}')
}

function drawCharts() {

    drawLines()




}