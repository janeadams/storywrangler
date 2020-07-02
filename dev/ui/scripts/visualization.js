let dotsize = 3
function updateDotSize() {
    if (viewport > 1000) {
        dotsize = 5
    }
    else { dotsize = 3 }
    //console.log(dotsize)
}

function setScales(chart){
    setRanges()
    const m = chart.margin
    chart.xScale = d3.scaleTime()
        .domain([params['start'],params['end']])
        .range([0, this.width-m.left-10])
    //console.log('this.xScale')
    //console.log(this.xScale)
    //console.log(`set xScale.domain to ${this.xScale.domain()} and range to ${this.xScale.range()}`)
    chart.xScaleNav = d3.scaleTime()
        .domain(xRange)
        .range([0, this.width])
    // Choose and set time scales (logarithmic or linear) for the main plot
    if (params['metric']==='rank') {
        //console.log(`yRange: ${yRange}`)
        if (params['scale']==='log') {
            // When showing ranks, put rank #1 at the top
            chart.yScale = d3.scaleLog().domain([yRange[1], yRange[0]]).nice().range([chart.height - (m.top + m.bottom), 0])
            chart.yScaleNav = d3.scaleLog().domain([yRange[1], yRange[0]]).nice().range([chart.navPlotHeight, 0])
        }
        else {
            // When showing ranks, put rank #1 at the top
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

    const xAxisFocused = d3.axisBottom()
        .scale(chart.xScale)
        .ticks(12)

    const xAxisNav = d3.axisBottom()
        .scale(chart.xScaleNav)
        .ticks(d3.timeYear)

    const yAxis = d3.axisLeft()
        .scale(chart.yScale)
        .ticks(5, "")

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

    // Add X & Y Axes to main plot
    chart.plot.append("g")
        .attr("class", "xaxis")
        .attr("transform", `translate(0, ${chart.height - (chart.margin.top + chart.margin.bottom)})`)
        .call(xAxisFocused)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)")

    chart.plot.append("g")
        .attr("class", "yaxis")
        .call(yAxis)

    // Add X & Y Axes to focus controls
    chart.navPlot.append("g")
        .attr("class", "xaxis-nav")
        .attr("transform", `translate(0, ${chart.navPlotHeight})`)
        .call(xAxisNav)

    /*chart.navPlot.append("g")
        .attr("class", "yaxis-nav")
        .call(yAxisNav)*/
}

function addLabels(chart){
    // Label yAxis with Metric
    chart.svg.append("text")
        .attr("text-anchor", "start")
        .attr("y", ((chart.height-chart.margin.bottom) / 2) )
        .attr("x", 10)
        .attr("dy", "1em")
        .text(String(params['metric']).charAt(0).toUpperCase() + String(params['metric']).slice(1))
        .attr("class","axislabel-large")
        .attr("font-family","sans-serif")

    chart.svg.append("text")
        .attr("class","axislabel")
        .attr("text-anchor", "start")
        .attr("y", chart.margin.top + 10)
        .attr("x", 10)
        .attr("dy", "0.5em")
        .text("Famous")
        .attr("font-family","sans-serif")

    chart.svg.append("text")
        .attr("class","axislabel")
        .attr("text-anchor", "start")
        .attr("y", chart.height - chart.margin.bottom)
        .attr("x", 10)
        .attr("dy", "0.5em")
        .text("Obscure")
        .attr("font-family","sans-serif")
}

function resetAxes(chart){
    d3.select(chart.element).selectAll(".xaxis,.yaxis,.xaxis-nav,.yaxis-nav").remove()
    chart.addAxes()
}

class Chart {
    constructor(opts){
        this.element = opts.element
        this.type = opts.type
        this.draw()
    }

    brushed(){
        this.setScales()
        this.resetAxes()
        this.svg.selectAll('.line').remove()
        this.svg.selectAll('circle').remove()
        addGlyphs(this)
    }

    draw() {
        this.width = this.element.offsetWidth
        this.height = this.element.offsetHeight
        this.navPlotHeight = 50
        this.margin = { top: 0.1 * this.height, right: 0.1 * this.width, bottom: (0.2 * this.height) + this.navPlotHeight, left: d3.min([0.3 * this.width, 150]) }
        setScales(this)
        // set up parent element and SVG
        this.element.innerHTML = ''

        this.svg = d3.select(this.element).append('svg').style("background-color","white")
        this.svg.attr('width', this.width)
        this.svg.attr('height', this.height)

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

        let parent = this
        const brush = d3.brushX()
            .extent([[0, 0], [this.width, this.navPlotHeight]])
            .on("brush", function(){
                //console.log("brushed!")
                let s = d3.event.selection || xScaleNav.range()
                let newView = s.map(parent.xScaleNav.invert, parent.xScaleNav)
                if (newView !== [params['start'],params['end']]){
                    params['start'] = newView[0]
                    params['end'] = newView[1]
                    updateURL()
                    console.table({
                        "params.start formatted": dateFormatter(params['start']),
                        "params.end formatted": dateFormatter(params['end'])
                    })
                }
                parent.brushed()
            })
            //.on("end", this.extent([parent.xScale(params['start']),parent.xScale(params['end'])]))

        this.navPlot = this.svg.append('g')
            .attr("viewBox", [0, 0, this.width, this.navPlotHeight+20])
            .attr('class','navPlot')
            .attr("width", this.width)
            .attr("height", this.navPlotHeight)
            .attr('transform',`translate(0,${this.height-(this.navPlotHeight+20)})`)
            .style("display", "block")
            .call(brush)

        addAxes(this)
        addLabels(this)
        resetAxes(this)
        addGlyphs(this)
    }
}

function makeCharts(){
    //console.log("Making charts...")
    showloadingpanel()
    setRanges()
    mainChart = new Chart({element: document.querySelector('#mainplot'), type: 'main'})
    hideloadingpanel()
}

function redrawCharts(){
    //console.log("Redrawing charts...")
    showloadingpanel()
    setRanges()
    mainChart.draw()
    hideloadingpanel()
}