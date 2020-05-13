console.log("loaded visualization.js")

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
                this.yScale = d3.scaleLog().domain([yRange[1], yRange[0]]).range([this.height-(m.top+m.bottom), 0])
            }
            else {
                this.yScale = d3.scaleLinear().domain([yRange[1], yRange[0]]).range([this.height-(m.top+m.bottom), 0])
            }
        }

        // When showing any other metric, put the highest number at the top and start at 0
        else {
            if (params.scale === "log") {
                this.yScale = d3.scaleLog().domain([yRange[1], yRange[0]]).range([0, this.height - (m.top + m.bottom)])
            }
            else {
                this.yScale = d3.scaleLinear().domain([yRange[1], yRange[0]]).range([0, this.height - (m.top + m.bottom)])
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
            .tickFormat(d3.format(".00s"))

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
        this.resetAxes()
        //console.log(`Adding line for ${ngram} to ${this.plot.attr('class')}`)
        const ndata = ngramData[ngram]['data']
        const colorid = ngramData[ngram]['colorid']
        const uuid = ngramData[ngram]['uuid']

        const line = d3.line()
            .x(d => this.xScale(d[0]))
            .y(d => this.yScale(d[1]))

        this.clipgroup.append('path')
            // use data stored in `this`
            .datum(ndata)
            .attr('class',`line uuid-${uuid} dataline`)
            // set stroke to specified color, or default to red
            .attr('stroke', colors.main[colorid] || 'gray')
            .attr('d',line)
    }

    draw() {
        this.width = this.element.offsetWidth
        this.height = this.element.offsetHeight
        this.margin = { top: 0.1 * this.height, right: 0.1 * this.width, bottom: 0.1 * this.height, left: d3.min([0.2 * this.width, 100]) }
        this.createScales()
        // set up parent element and SVG
        this.element.innerHTML = ''

        this.svg = d3.select(this.element).append('svg')
        this.svg.attr('width', this.width)
        this.svg.attr('height', this.margin.top + this.height + this.margin.bottom)
        d3.select(this.element).append('a').attr("id","download").text("Download this data!").attr("href", formatDataForDownload()).attr("target","_blank").attr("download","storywrangler_data.json")

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

        Object.keys(ngramData).forEach(n => this.addLine(n))
    }
}

function makeCharts(){
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
    setRanges()
    mainChart.draw()
}

function clearCharts(){
    Ngrams.forEach(n => {
        removeNgram(n)
    })
}