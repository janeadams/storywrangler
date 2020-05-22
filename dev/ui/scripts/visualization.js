class Chart {
    constructor(opts){
        this.element = opts.element
        this.draw()
    }

    createScales() {
        const m = this.margin
        this.xScale = d3.scaleTime()
            .domain(xRange)
            .range([0, this.width-m.left])
        //console.log(`set xScale.domain to ${this.xScale.domain()} and range to ${this.xScale.range()}`)
        // Choose and set time scales (logarithmic or linear) for the main plot
        if (params.metric === "rank") {
            // When showing ranks, put rank #1 at the top
            if (params.scale === "log") {
                this.yScale = d3.scaleLog().domain([yRange[1], yRange[0]]).nice().range([this.height-(m.top+m.bottom), 0])
            }
            else {
                this.yScale = d3.scaleLinear().domain([yRange[1], yRange[0]]).nice().range([this.height-(m.top+m.bottom), 0])
            }
        }

        // When showing any other metric, put the highest number at the top and start at 0
        else {
            if (params.scale === "log") {
                this.yScale = d3.scaleLog().domain([yRange[1], yRange[0]]).nice().range([0, this.height - (m.top + m.bottom)])
            }
            else {
                this.yScale = d3.scaleLinear().domain([yRange[1], yRange[0]]).nice().range([0, this.height - (m.top + m.bottom)])
            }
        }
    }

    addAxes() {
        const height = this.height
        const m = this.margin

        const xAxis = d3.axisBottom()
            .scale(this.xScale)
            .ticks(d3.timeYear)

        const yAxis = d3.axisLeft()
            .scale(this.yScale)
            .ticks(5, "")

        if (params['metric']=='rank'){
            yAxis.tickFormat(d3.format(".00s"))
        }
        else {
            yAxis.tickFormat(d3.format("~e"))
        }

        // Add X & Y Axes to main plot
        this.plot.append("g")
            .attr("class", "xaxis")
            .attr("transform", `translate(0, ${height-(m.top+m.bottom)})`)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)")

        this.plot.append("g")
            .attr("class", "yaxis")
            .call(yAxis)
    }

    addLabels(){
        // Label xAxis with Metric
        this.svg.append("text")
            .attr("text-anchor", "start")
            .attr("y", (this.height-this.margin.top) / 2)
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
            .text("Lexical")
            .append('svg:tspan')
            .attr('x', 10)
            .attr('dy', "1em")
            .text("Fame")


        this.svg.append("text")
            .attr("class","axislabel")
            .attr("text-anchor", "start")
            .attr("y", this.height - this.margin.top)
            .attr("x", 10)
            .attr("dy", "0.5em")
            .text("Lexical")
            .append('svg:tspan')
            .attr('x', 10)
            .attr('dy', "1em")
            .text("Abyss")
    }

    resetAxes(){
        d3.select(this.element).selectAll(".xaxis").remove()
        d3.select(this.element).selectAll(".yaxis").remove()
        this.addAxes()
    }

    addLine(ngram) {
        //console.log(`Adding line for ${ngram} to ${this.plot.attr('class')}`)
        const ndata = ngramData[ngram]['data']
        const colorid = ngramData[ngram]['colorid']
        const uuid = ngramData[ngram]['uuid']

        const line = d3.line()//.defined(d => d[1]!==null)
            .x(d => this.xScale(d[0]))
            .y(d => this.yScale(d[1]))

        this.clipgroup.append('path')
            // use data stored in `this`
            .datum(ndata)
            //.filter(function(d) { return d[1]!==null })
            .attr('class',`line uuid-${uuid} dataline`)
            // set stroke to specified color, or default to red
            .attr('stroke', colors.main[colorid] || 'gray')
            .attr('stroke-opacity', 0.3)
            .attr('d',line)
    }

    addDots(ngram) {
        //console.log(`Adding line for ${ngram} to ${this.plot.attr('class')}`)
        const ndata = ngramData[ngram]['data']
        const colorid = ngramData[ngram]['colorid']
        const uuid = ngramData[ngram]['uuid']


        // Define the div for the tooltip
        let div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)

        this.clipgroup.selectAll('.dot')
            .data(ndata)
            .attr('class',`uuid-${uuid} datadot`)
            .enter().append("circle")
            .attr('fill', colors.main[colorid])
            .attr("r", 1)
            .attr("cx", d => this.xScale(d[0]))
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
                let RTlabel
                if (params['rt']===true) { RTlabel = '(Includes retweets)'}
                else {RTlabel = '(Does not include retweets)'}
                div.html(`<span style="font-weight:bold; color:${colors.dark[colorid]};">${ngram}</span><br/><span style="font-weight:bold;">Date:</span> ${dateFormatter(d[0])}<br/><span style="font-weight:bold;">${sentenceCase(params['metric'])}:</span> ${formattedValue}<br/><span style="font-style:italic;">${RTlabel}</span>`)
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            }
            function handleMouseOut() {
                d3.select(this).style("r", 1).style("fill",colors.main[colorid])
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            }

    }

    draw() {
        this.width = this.element.offsetWidth
        this.height = this.element.offsetHeight
        this.margin = { top: 0.1 * this.height, right: 0.1 * this.width, bottom: 0.1 * this.height, left: d3.min([0.3 * this.width, 150]) }
        this.createScales()
        // set up parent element and SVG
        this.element.innerHTML = ''

        this.svg = d3.select(this.element).append('svg')
        this.svg.attr('width', this.width)
        this.svg.attr('height', this.margin.top + this.height + this.margin.bottom)

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
            .attr('class','plot')
            .attr('height',`${this.height - (this.margin.top + this.margin.bottom)}`)

        this.addAxes()
        this.addLabels()

        this.resetAxes()

        Object.keys(ngramData).forEach(n => {
            this.addLine(n)
        })
        Object.keys(ngramData).forEach(n => {
            this.addDots(n)
        })
    }
}

function makeCharts(){
    console.log("Making charts...")
    setRanges()
    mainChart = new Chart({element: document.querySelector('#mainplot')})
    /*Object.keys(ngramData).forEach(n => {
        d3.select('#subplot-list').append('div').attr('class', `subplot ${ngramData[n]['uuid']}`)
        const s = new Chart({element: document.querySelector('.subplot')})
        s.draw()
    })*/
    d3.select(window).on('resize', () => {
        mainChart.draw()
    })
}

function redrawCharts(){
    console.log("Redrawing charts...")
    setRanges()
    mainChart.draw()
    mainChart.draw()
}

function clearCharts(){
    console.log("Clearing all charts...")
    Ngrams.forEach(n => {
        removeNgram(n)
    })
}