class Chart {
    constructor(opts){
        this.element = opts.element
        this.isSubplot = this.element.classList.contains('subplot')
        this.draw()
    }

    setScales() {
        setRanges()
        const m = this.margin
        this.xScale = d3.scaleTime()
            .domain(xRange)
            .range([0, this.width-m.left-10])
        //console.log('this.xScale')
        //console.log(this.xScale)
        this.xScaleFocused = d3.scaleTime()
            .domain([params['start'],params['end']])
            .range([0, this.width-m.left-10])
        //console.log(`set xScale.domain to ${this.xScale.domain()} and range to ${this.xScale.range()}`)
        // Choose and set time scales (logarithmic or linear) for the main plot
        if (params.metric === "rank") {
            // When showing ranks, put rank #1 at the top
            if (params.scale === "log") {
                this.yScale = d3.scaleLog().domain([yRange[1], yRange[0]]).nice().range([this.height-(m.top+m.bottom), 0])
                this.yScaleMini = d3.scaleLog().domain([yRange[1], yRange[0]]).nice().range([this.selectorPlotHeight, 0])
            }
            else {
                this.yScale = d3.scaleLinear().domain([yRange[1], yRange[0]]).nice().range([this.height-(m.top+m.bottom), 0])
                this.yScaleMini = d3.scaleLinear().domain([yRange[1], yRange[0]]).nice().range([this.selectorPlotHeight, 0])
            }
        }

        // When showing any other metric, put the highest number at the top and start at 0
        else {
            if (params.scale === "log") {
                this.yScale = d3.scaleLog().domain([yRange[1], yRange[0]]).nice().range([0, this.height - (m.top + m.bottom)])
                this.yScaleMini = d3.scaleLog().domain([yRange[1], yRange[0]]).nice().range([0, this.selectorPlotHeight])
            }
            else {
                this.yScale = d3.scaleLinear().domain([yRange[1], yRange[0]]).nice().range([0, this.height - (m.top + m.bottom)])
                this.yScaleMini = d3.scaleLinear().domain([yRange[1], yRange[0]]).nice().range([0, this.selectorPlotHeight])
            }
        }
    }

    addAxes() {

        const xAxisFocused = d3.axisBottom()
            .scale(this.xScaleFocused)
            .ticks(12)

        const xAxisAll = d3.axisBottom()
            .scale(this.xScale)
            .ticks(d3.timeYear)

        const yAxis = d3.axisLeft()
            .scale(this.yScale)
            .ticks(5, "")

        const yAxisMini = d3.axisLeft()
            .scale(this.yScaleMini)
            .ticks(2, "")

        if (params['metric']=='rank'){
            yAxis.tickFormat(d3.format(".00s"))
            yAxisMini.tickFormat(d3.format(".00s"))
        }
        else {
            yAxis.tickFormat(d3.format("~e"))
            yAxisMini.tickFormat(d3.format("~e"))
        }

        // Add X & Y Axes to main plot
        this.plot.append("g")
            .attr("class", "xaxis")
            .attr("transform", `translate(0, ${this.height-(this.margin.top+this.margin.bottom)})`)
            .call(xAxisFocused)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)")

        this.plot.append("g")
            .attr("class", "yaxis")
            .call(yAxis)

        // Add X & Y Axes to focus controls
        this.selectorPlot.append("g")
            .attr("class", "xaxis-small")
            .attr("transform", `translate(0, ${this.selectorPlotHeight})`)
            .call(xAxisAll)

        this.selectorPlot.append("g")
            .attr("class", "yaxis-small")
            .call(yAxisMini)
    }

    addLabels(){
        // Label yAxis with Metric
        this.svg.append("text")
            .attr("text-anchor", "start")
            .attr("y", ((this.height-this.margin.bottom) / 2) )
            .attr("x", 10)
            .attr("dy", "1em")
            .text(String(params['metric']).charAt(0).toUpperCase() + String(params['metric']).slice(1))
            .attr("class","axislabel-large")

        this.svg.append("text")
            .attr("class","axislabel")
            .attr("text-anchor", "start")
            .attr("y", this.margin.top + 10)
            .attr("x", 10)
            .attr("dy", "0.5em")
            .text("Famous")
            /*
            .append('svg:tspan')
            .attr('x', 10)
            .attr('dy', "1em")
            .text("talked")
            .append('svg:tspan')
            .attr('x', 10)
            .attr('dy', "1.2em")
            .text("about")
            */


        this.svg.append("text")
            .attr("class","axislabel")
            .attr("text-anchor", "start")
            .attr("y", this.height - this.margin.bottom)
            .attr("x", 10)
            .attr("dy", "0.5em")
            .text("Obscure")
            /*.append('svg:tspan')
            .attr('x', 10)
            .attr('dy', "1.2em")
            .text("talked")
            .append('svg:tspan')
            .attr('x', 10)
            .attr('dy', "1.2em")
            .text("about")*/
    }

    resetAxes(){
        d3.select(this.element).selectAll(".xaxis").remove()
        d3.select(this.element).selectAll(".yaxis").remove()
        this.addAxes()
    }

    addLine(ndata, colorid, uuid) {

        const dataline = d3.line().defined(d => !isNaN(d[1]))
            .x(d => this.xScaleFocused(d[0]))
            .y(d => this.yScale(d[1]))

        const focusline = d3.line().defined(d => !isNaN(d[1]))
            .x(d => this.xScale(d[0]))
            .y(d => this.yScaleMini(d[1]))

        this.clipgroup.attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")

        this.clipgroup.append('path')
            .datum(ndata)
            .attr('class',`line uuid-${uuid} dataline`)
            .attr('stroke', colors.main[colorid])
            .attr('stroke-opacity', 0.3)
            .attr('d',dataline)

        this.selectorPlot.append('path')
            .datum(ndata)
            .attr('class',`line uuid-${uuid} selectorline`)
            .attr('stroke', colors.main[colorid])
            .attr('stroke-opacity', 1)
            .attr('d',focusline)
    }

    addDots(ngram, ndata, colorid, uuid, RTlabel) {

        // Define the div for the tooltip
        let div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)

        this.clipgroup.selectAll('.dot')
            .data(ndata.filter(d => !isNaN(d[1])))
            .enter().append("circle")
            .attr('class',`uuid-${uuid} datadot`)
            .attr('fill', colors.main[colorid])
            .attr("r", 2)
            .attr("cx", d => this.xScaleFocused(d[0]))
            .attr("cy", d => this.yScale(d[1]))
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)

            // Create Event Handlers for mouse
            function handleMouseOver(d) {
                d3.select(this).style("r", 7).style("fill",colors.dark[colorid])
                div.style('border-color', colors.main[colorid])
                div.style('background-color', colors.light[colorid])
                div.transition()
                    .duration(200)
                    .style("opacity", .9)
                let formattedValue
                if (params['metric']=='freq'){
                    formattedValue = d3.format(",.0")(d[1])
                }
                else {
                    formattedValue = d3.format(",")(d[1])
                }

                div.html(`<span style="font-weight:bold; color:${colors.dark[colorid]};">${ngram}</span><br/><span style="font-weight:bold;">Date:</span> ${dateFormatter(d[0])}<br/><span style="font-weight:bold;">${sentenceCase(params['metric'])}:</span> ${formattedValue}<br/><span style="font-style:italic;">${RTlabel}</span>`)
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            }
            function handleMouseOut() {
                d3.select(this).style("r", 2).style("fill",colors.main[colorid])
                div.transition()
                    .duration(0)
                    .style("opacity", 0);
                div.style("left", "0px")
                    .style("top", "0px")
            }

    }

    brushed(){
        this.setScales()
        this.resetAxes()
        this.svg.selectAll('.line').remove()
        this.svg.selectAll('circle').remove()
        addGlyphs(this)
    }

    draw() {
        showloadingpanel()
        this.width = this.element.offsetWidth
        this.height = this.element.offsetHeight
        this.selectorPlotHeight = 100
        this.margin = { top: 0.1 * this.height, right: 0.1 * this.width, bottom: (0.2 * this.height) + this.selectorPlotHeight, left: d3.min([0.3 * this.width, 150]) }
        this.setScales()
        // set up parent element and SVG
        this.element.innerHTML = ''

        this.svg = d3.select(this.element).append('svg')
        this.svg.attr('width', this.width)
        this.svg.attr('height', `${this.margin.top + this.height + this.margin.bottom}`)

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
            .extent([[0, 0], [this.width-(this.margin.left), this.selectorPlotHeight]])
            .on("brush", function(){
                console.log("brushed!")
                let s = d3.event.selection || xScaleFocused.range()
                let newView = s.map(parent.xScale.invert, parent.xScale)
                if (newView !== [params['start'],params['end']]){
                    params['start'] = newView[0]
                    params['end'] = newView[1]
                    updateURL()
                    console.table({
                        "params.start formatted": dateFormatter(params['start']),
                        "params.end formatted": dateFormatter(params['end'])
                    })
                    parent.brushed()
                }
            })
            //.on("end", this.extent([parent.xScale(params['start']),parent.xScale(params['end'])]))

        this.selectorPlot = this.svg.append('g')
            .attr("viewBox", [0, 0, this.width, this.selectorPlotHeight])
            .attr('class','selectorPlot')
            .attr("width", this.width)
            .attr("height", this.selectorPlotHeight)
            .attr('transform',`translate(${this.margin.left},${this.height-this.selectorPlotHeight})`)
            .style("display", "block")
            .call(brush)
            //.call(brush.move, parent.xScaleFocused.range())

        this.addAxes()
        this.addLabels()
        this.resetAxes()
        addGlyphs(this)

        setTimeout(() => hideloadingpanel(), 1000)
    }
}

function makeCharts(){
    console.log("Making charts...")
    setRanges()
    mainChart = new Chart({element: document.querySelector('#mainplot')})
    d3.select(window).on('resize', () => {
        mainChart.draw()
    })
}

function redrawCharts(){
    //console.log("Redrawing charts...")
    setRanges()
    mainChart.draw()
}