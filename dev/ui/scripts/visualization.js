let dotsize = 2
let mobileScale = false
function adaptVisualScale() {
    if (viewport > 1000) { dotsize = 3 }
    else { dotsize = 2 }
    mobileScale = viewport <= 600;
    //console.log(dotsize)
}

function setScales(chart){
    setRanges()
    const m = chart.margin
    if (chart.type==='main') {
        chart.xScale = d3.scaleTime()
            .domain([params['start'], params['end']])
            .range([0, chart.width - m.left - 10])
        chart.xScaleNav = d3.scaleTime()
            .domain(xRange)
            .range([0, chart.width])
    }
    else {
        chart.xScale = d3.scaleTime()
            //.domain(xRange) // Set to full date range
            .domain([params['start'], params['end']]) // Set to selected date range
            .range([0, chart.width - m.left])
    }
    //console.log('chart.xScale')
    //console.log(chart.xScale)
    //console.log(`set xScale.domain to ${chart.xScale.domain()} and range to ${chart.xScale.range()}`)

    // Choose and set time scales (logarithmic or linear) for the main plot
    if (params['metric']==='rank') {
        //console.log(`yRange: ${yRange}`)
        if (params['scale']==='log') {
            // When showing ranks, put rank #1 at the top
            chart.yScale = d3.scaleLog().domain([yRange[1], yRange[0]]).nice().range([chart.height - (m.top + m.bottom), 0])
            chart.yScaleNav = d3.scaleLog().domain([yRange[1], yRange[0]]).nice().range([chart.navPlotHeight, 0])
        }
        else {
            chart.yScale = d3.scaleLinear().domain([yRange[1], yRange[0]]).nice().range([chart.height - (m.top + m.bottom), 0])
            chart.yScaleNav = d3.scaleLinear().domain([yRange[1], yRange[0]]).nice().range([chart.navPlotHeight, 0])
        }
    }

    // When showing any other metric, put the highest number at the top and start at 0
    else {
        if (params['scale']==='log') {
            chart.yScale = d3.scaleLog().domain([yRange[1], yRange[0]]).nice().range([0, chart.height - (m.top + m.bottom)])
            chart.yScaleNav = d3.scaleLog().domain([yRange[1], yRange[0]]).nice().range([0, chart.navPlotHeight])
        }
        else {
            chart.yScale = d3.scaleLinear().domain([yRange[1], yRange[0]]).nice().range([0, chart.height - (m.top + m.bottom)])
            chart.yScaleNav = d3.scaleLinear().domain([yRange[1], yRange[0]]).nice().range([0, chart.navPlotHeight])
        }
    }
}

function addAxes(chart) {

    const xAxis = d3.axisBottom()
        .scale(chart.xScale)

    if (chart.type==='main') {
        xAxis.ticks(12)
    }
    else {
        xAxis.ticks(3)
    }

    const xAxisNav = d3.axisBottom()
        .scale(chart.xScaleNav)
        .ticks(d3.timeYear)

    const yAxis = d3.axisLeft().scale(chart.yScale)

    if (chart.type==='main') {
        if (params['scale'] === 'log') {
            yAxis.ticks(3, "")
        }
        else {
            yAxis.ticks(2, "")
        }
    }
    else {
        yAxis.ticks(2, "")
    }

    const yAxisNav = d3.axisLeft()
            .scale(chart.yScaleNav)
            .ticks(2, "")

    if (params['metric'] === 'rank') {
        yAxis.tickFormat(d3.format(".00s"))
        yAxisNav.tickFormat(d3.format(".00s"))
    } else {
        yAxis.tickFormat(d3.format("~e"))
        yAxisNav.tickFormat(d3.format("~e"))
    }

    // Remove any existing axes, just in case
    d3.select(chart.element).selectAll(".xaxis,.yaxis,.xaxis-nav,.yaxis-nav").remove()

    // Add X & Y Axes to main plot
    chart.xAxisGroup = chart.plot.append("g")
        .attr("class", "xaxis")
        .attr("transform", `translate(0, ${chart.height - (chart.margin.top + chart.margin.bottom)})`)

    chart.xAxisGroup.call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)")

    chart.yAxisGroup = chart.plot.append("g")
        .attr("class", "yaxis")
        .call(yAxis)

    if (chart.type==='main') {
        // Add X & Y Axes to focus controls
        chart.navPlot.append("g")
            .attr("class", "xaxis-nav")
            .attr("transform", `translate(0, ${chart.navPlotHeight})`)
            .call(xAxisNav)

        /*chart.navPlot.append("g")
            .attr("class", "yaxis-nav")
            .call(yAxisNav)*/
    }
}

function addLabels(chart){

    if (chart.type === 'main') {
        // Label yAxis with Metric
        if (mobileScale) {
            /*
            chart.svg.append("text")
                .attr("text-anchor", "start")
                .attr("y", 0)
                .attr("x", -(chart.height - chart.margin.bottom)/2)
                .attr("dy", "1em")
                .text(String(params['metric']).charAt(0).toUpperCase() + String(params['metric']).slice(1))
                .attr("class", "axislabel-large")
                .attr("font-family", "sans-serif")
             */
        }
        else {
            chart.svg.append("text")
                .attr("text-anchor", "start")
                .attr("y", ((chart.height - chart.margin.bottom) / 2))
                .attr("x", 10)
                .attr("dy", "1em")
                .text(String(params['metric']).charAt(0).toUpperCase() + String(params['metric']).slice(1))
                .attr("class", "axislabel-large")
                .attr("font-family", "sans-serif")

            chart.svg.append("text")
                .attr("class", "axislabel")
                .attr("text-anchor", "start")
                .attr("y", chart.margin.top + 10)
                .attr("x", 10)
                .attr("dy", "0.5em")
                .text("Famous")
                .attr("font-family", "sans-serif")

            chart.svg.append("text")
                .attr("class", "axislabel")
                .attr("text-anchor", "start")
                .attr("y", chart.height - chart.margin.bottom)
                .attr("x", 10)
                .attr("dy", "0.5em")
                .text("Obscure")
                .attr("font-family", "sans-serif")
        }
    }
    else {
        /*
        chart.svg.append("text")
            .attr("text-anchor", "start")
            .attr("y", ((chart.height - chart.margin.bottom) / 2))
            .attr("x", 10)
            .attr("dy", "1em")
            .text(`"${chart.ngram}"`)
            .attr("class", "axislabel-large")
            .attr("font-family", "sans-serif")
            .style("fill", `colors.main${ngramData[chart.ngram]['colorid']}`)
         */
    }
}

function addLines(chart,dataKey){

    //console.log(`adding lines for ${dataKey}`)

    const ndata = ngramData[dataKey]['data']

    let colorSet, uuid

    if (compare){
        colorSet = [colors.light[ngramData[dataKey]['colorid']], colors.main[ngramData[dataKey]['colorid']], colors.dark[ngramData[dataKey]['colorid']]]
        uuid = ngramData[dataKey]['uuid']
    }
    else {
        if (dataKey === 'w_rt'){
            colorSet = ['lightgrey','gray','darkgray']
        }
        else {
            colorSet = [colors.light[0], colors.main[0], colors.dark[0]]
        }
        uuid = dataKey
    }

    const dataline = d3.line().defined(d => !isNaN(d[1]))
        .x(d => chart.xScale(d[0]))
        .y(d => chart.yScale(d[1]))

    const navline = d3.line().defined(d => !isNaN(d[1]))
        .x(d => chart.xScaleNav(d[0]))
        .y(d => chart.yScaleNav(d[1]))

    chart.clipgroup.attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")

    if (chart.type==='main') {
        if (params['metric']==='rank') {
            try{
                const ndataReplaced = replaceUndefined(ngramData[dataKey]['data'])
                /* MISSING (DOTTED) LINE */
                chart.clipgroup.append('path')
                    .datum(ndataReplaced)
                    .attr('class', `line uuid-${uuid} missingline`)
                    .attr('stroke', colorSet[0])
                    .attr('d', dataline)
            }
            catch{}
        }
        /* DRAW MAIN DATA LINE */
        chart.clipgroup.append('path')
            .datum(ndata)
            .attr('class',`line uuid-${uuid} dataline`)
            .attr('d',dataline)
            .attr('stroke', colorSet[0])
        /* TIMELINE NAVIGATION LINE */
        chart.navPlot.append('path')
            .datum(ndata)
            .attr('class', `line uuid-${uuid} navline`)
            .attr('stroke', colorSet[1])
            .attr('d', navline)
    }
    else {
        /* DRAW MAIN DATA LINE */
        chart.clipgroup.append('path')
            .datum(ndata)
            .attr('class',`line uuid-${uuid} sparkline`)
            .attr('d',dataline)
            .attr('stroke', colorSet[1])
    }
}

function addDots(chart, dataKey){

    //console.log(`adding dots for ${dataKey}`)

    const ndata = ngramData[dataKey]['data']

    let ngram, colorSet, uuid, RTlabel

    if (compare){
        ngram = dataKey
        colorSet = [colors.light[ngramData[dataKey]['colorid']], colors.main[ngramData[dataKey]['colorid']], colors.dark[ngramData[dataKey]['colorid']]]
        uuid = ngramData[dataKey]['uuid']
        if (params['rt']) { RTlabel = '(Includes retweets)'}
        else {RTlabel = '(Does not include retweets)'}
    }
    else {
        ngram = Ngram
        if (dataKey === 'w_rt'){
            colorSet = ['#999999','#666666','#333333']
            RTlabel = '(Includes retweets)'
        }
        else {
            colorSet = [colors.light[0], colors.main[0], colors.dark[0]]
            RTlabel = '(Does not include retweets)'
        }
        uuid = dataKey
    }

    // DRAW DOTS //
    chart.clipgroup.selectAll('.dot')
        .data(filterNull(ndata))
        .enter()
        .append("circle")
        .attr('class',`uuid-${uuid} datadot`)
        .attr('fill', colorSet[1])
        .attr("r", dotsize)
        .attr("cx", d => chart.xScale(d[0]))
        .attr("cy", d => chart.yScale(d[1]))
        .on("mouseenter", drawTooltip)
        .on("touchstart", drawTooltip)
        .on("mouseleave", removeTooltip)
        .on("mouseup", removeTooltip)
        .on("click", d => {
            window.open(getTwitterURL(ngram, d, params['rt']), '_blank')
        })

    // Create Event Handlers for mouse
    function drawTooltip(d) {
        d3.select(this).style("r", dotsize+2).style("fill",colorSet[1])

        let formattedValue
        if (params['metric']==='rank'){
            formattedValue = d3.format(",")(d[1])
        }
        else {
            formattedValue = d3.format(",.0")(d[1])
        }

        d3.select("body").append("div")
            .attr("class", `uuid-${uuid} tooltip`)
            .style('border-color', colorSet[1])
            .style('background-color', colorSet[0])
            .style("opacity", .9)
            .html(`<span style="font-weight:bold; color:${colorSet[2]};" class="ngram">"${ngram}"</span><br/><span style="font-weight:bold;">Date:</span> ${dateFormatter(d[0])}<br/><span style="font-weight:bold;">${sentenceCase(params['metric'])}:</span> ${formattedValue}<br/><span style="font-style:italic;">${RTlabel}</span>`)
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 28) + "px")

    }
    function removeTooltip() {
        d3.select(this).style("r", dotsize).style("fill",colorSet[1])
        d3.select("body").selectAll(".tooltip").remove()
    }
}

function updateChart(chart){
    chart.xScale.domain([params['start'], params['end']])
    chart.xAxisGroup.call(d3.axisBottom().scale(chart.xScale)).selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)")
    const dataline = d3.line().defined(d => !isNaN(d[1]))
        .x(d => chart.xScale(d[0]))
        .y(d => chart.yScale(d[1]))
    chart.clipgroup.selectAll('.dataline, .missingline, .sparkline')
        .transition().duration(500)
        .attr('d',dataline)
    chart.clipgroup.selectAll('circle')
        .transition().duration(500)
        .attr("cx", d => chart.xScale(d[0]))
}

class Chart {
    constructor(opts){
        this.element = opts.element
        this.type = opts.type
        if (this.type==='subplot'){
            this.ngram = opts.ngram
        }
        this.setup()
    }

    brushed(){
        if (d3.event.selection) {
            updateChart(this)
            if (compare) {
                Ngrams.forEach(n => updateChart(subPlots[n]))
            }
        }
    }

    setup() {
        //console.log(`Running setup() for chart type ${this.type} on element ${this.element}`)
        // Clear existing chart if it's persisting
        d3.select(this.element).html("")
        // Set sizing
        this.width = this.element.offsetWidth
        this.height = this.element.offsetHeight
        this.navPlotHeight = 50
        if (this.type === 'main') {
            if (mobileScale) {
                this.margin = {
                    top: 0.1 * this.height,
                    bottom: (0.3 * this.height) + this.navPlotHeight,
                    left: 50,
                    right: 0.1 * this.width
                }
            } else {
                this.margin = {
                    top: 0.1 * this.height,
                    bottom: (0.2 * this.height) + this.navPlotHeight,
                    left: d3.min([0.3 * this.width, 150]),
                    right: 0.1 * this.width
                }
            }
        } else { // is a subplot
            if (mobileScale) {
                this.margin = {
                    top: 0.1 * this.height,
                    bottom: (0.3 * this.height),
                    left: 50,
                    right: 0
                }
            } else {
                this.margin = {
                    top: 0.1 * this.height,
                    bottom: (0.3 * this.height),
                    left: 0.2 * this.width,
                    right: 0
                }
            }
        }
        setScales(this)
        let parent = this
        // set up parent element and SVG
        this.element.innerHTML = ''

        this.svg = d3.select(this.element).append('svg').style("background-color", "white")
            .on("dblclick", function () {
                params['start'] = defaultparams['start']
                params['end'] = defaultparams['end']
                updateChart(parent)
                if (compare) {
                    Ngrams.forEach(n => updateChart(subPlots[n]))
                }
                parent.navPlot.call(parent.brush.move, [parent.xScaleNav(params['start']), parent.xScaleNav(params['end'])])
            })
        this.svg.attr('width', this.width)
        this.svg.attr('height', this.height)
        //console.log(`${this.type}: width: ${this.width}, height: ${this.height}`)

        this.clip = this.svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("x", 0)
            .attr("y", 0)

        this.clipgroup = this.svg.append('g')
            .attr('transform',`translate(${this.margin.left},${this.margin.top})`)
            .attr('class','plot')
            .attr("clip-path", "url(#clip)")

        this.plot = this.svg.append('g')
            .attr('transform',`translate(${this.margin.left},${this.margin.top})`)
            .attr('class','plot feature')
            .attr('height',`${this.height - (this.margin.top + this.margin.bottom)}`)


        if (this.type==='main') {
            this.brush = d3.brushX()
                .extent([[0, 0], [this.width, this.navPlotHeight]])
                .on("end", function () {
                    let s = d3.event.selection
                    let newView = s.map(parent.xScaleNav.invert, parent.xScaleNav)
                    console.log(`newView: ${newView}`)
                    params['start'] = newView[0]
                    params['end'] = newView[1]
                    updateURL()

                    console.table({
                        "params.start formatted": dateFormatter(params['start']),
                        "params.end formatted": dateFormatter(params['end'])
                    })

                    parent.brushed()
                })

            this.navPlot = this.svg.append('g')
                .attr("viewBox", [0, 0, this.width, this.navPlotHeight+20])
                .attr('class','navPlot')
                .attr("width", this.width)
                .attr("height", this.navPlotHeight)
                .attr('transform',`translate(0,${this.height - (this.navPlotHeight+20)})`)
                .style("display", "block")
                .call(this.brush)

            let zoom = d3.zoom()
                .scaleExtent([1, 8])
                .on('zoom', function() {
                    console.log('zoomed called')
                    if (d3.event) {
                        console.log('d3 event triggered')
                        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
                        let t = d3.event.transform;
                        console.log('Zoomed. Event transform:')
                        console.log(t)
                        console.log('this:')
                        console.log(this)
                        console.log('parent:')
                        console.log(parent)
                        let newView = t.rescaleX(parent.xScale).domain
                        console.log(`newView: ${newView}`)
                        /*params['start'] = newView[0]
                        params['end'] = newView[1]
                        console.table({
                            "params.start formatted": dateFormatter(params['start']),
                            "params.end formatted": dateFormatter(params['end'])
                        })
                        updateChart(parent)
                        if (compare) {
                            Ngrams.forEach(n => updateChart(subPlots[n]))
                        }
                        parent.navPlot.call(parent.brush.move, [parent.xScaleNav(params['start']), parent.xScaleNav(params['end'])])

                         */
                    }
                })

            this.svg.call(zoom)
        }

        this.draw()
    }

    draw() {
        setScales(this)
        addAxes(this)
        addLabels(this)
        addGlyphs(this)
    }
}

function makeCharts(){
    //console.log("Making charts...")
    adaptVisualScale()
    setRanges()
    mainChart = new Chart({element: document.querySelector('#mainplot'), type: 'main'})
    //mainChart.navPlot.call(mainChart.brush.move,[mainChart.xScaleNav(params['start']),mainChart.xScaleNav(params['end'])])
    if (compare && Ngrams){
        Object.keys(ngramData).forEach(ngram => {
            addSuplot(ngram)
        })
    }
}

function addSuplot(ngram){
    let subplotSection = document.querySelector("#subplots");
    let subplotClass = `uuid-${ngramData[ngram]['uuid']}`
    let colorid = ngramData[ngram]['colorid']
    //console.log(`subplotClass = ${subplotClass}`)
    //console.log(colors.main[ngramData[ngram]['colorid']])
    let min = ngramData[ngram][`min_${params['metric']}`]
    let max = ngramData[ngram][`max_${params['metric']}`]
    let parsed_min = `${min}`
    let parsed_max = `${max}`
    if (params['metric']==='freq'){ // Round out the digits of the min/max values for frequency
        //parsed_min = `~${parseFloat(precise(min,3))}`
        //parsed_max = `~${parseFloat(precise(max,3))}`
        parsed_min = `about 1 in ${parseFloat(precise(1/min, 3)).toLocaleString()}`
        parsed_max = `about 1 in ${parseFloat(precise(1/max, 3)).toLocaleString()}`
    }
    else {
        parsed_min = max.toLocaleString() // NOTE: For rank, we've reversed min and max here
        parsed_max = min.toLocaleString()
    }

    d3.select('#subplots').append('div').attr("class", `subplot-container ${subplotClass}`)
        .append('div').attr("class", "subplot-details")
        .html(`<h3 style="color:${colors.dark[colorid]}">"${ngram}"</h3>
                <p><strong>Best ${sentenceCase(params['metric'])}:</strong> ${parsed_max}</p>
                <p><strong>Worst ${sentenceCase(params['metric'])}:</strong> ${parsed_min}</p>
                <a href='details.html?ngram=${ngram}' style="color:${colors.main[colorid]}">Show details &gt;</a>`)
    let container = subplotSection.querySelector(`.subplot-container.${subplotClass}`)
    d3.select(`.subplot-container.${subplotClass}`).append('div').attr("class", "subplot-chart")
    subPlots[ngram] = new Chart({element: container.querySelector(".subplot-chart"), type: 'subplot', ngram: `${ngram}`})
}

function redrawCharts(){
    //console.log("Redrawing charts...")
    setRanges()
    mainChart.setup()
    if (compare && Ngrams){
        (Object.keys(ngramData)).forEach(ngram => {
            try {subPlots[ngram].setup()}
            catch {/*console.log(`Error re-drawing subplot for ${ngram}`)*/}
        })
    }
}