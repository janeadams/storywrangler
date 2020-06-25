let dotsize = 3
function updateDotSize() {
    if (viewport > 1000) {
        dotsize = 5
    }
    else { dotsize = 3 }
    console.log(dotsize)
}

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
        this.xScaleSelector = d3.scaleTime()
            .domain(xRange)
            .range([0, this.width])
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

        const xAxisSelector = d3.axisBottom()
            .scale(this.xScaleSelector)
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
            .call(xAxisSelector)

        /*this.selectorPlot.append("g")
            .attr("class", "yaxis-small")
            .call(yAxisMini)*/
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
        d3.select(this.element).selectAll(".xaxis-small").remove()
        d3.select(this.element).selectAll(".yaxis-small").remove()
        this.addAxes()
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
            .extent([[0, 0], [this.width, this.selectorPlotHeight]])
            .on("brush", function(){
                console.log("brushed!")
                let s = d3.event.selection || xScaleSelector.range()
                let newView = s.map(parent.xScaleSelector.invert, parent.xScaleSelector)
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

        this.selectorPlot = this.svg.append('g')
            .attr("viewBox", [0, 0, this.width, this.selectorPlotHeight])
            .attr('class','selectorPlot')
            .attr("width", this.width)
            .attr("height", this.selectorPlotHeight)
            .attr('transform',`translate(0,${this.height-this.selectorPlotHeight})`)
            .style("display", "block")
            .call(brush)

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
}

function redrawCharts(){
    //console.log("Redrawing charts...")
    setRanges()
    mainChart.draw()
}