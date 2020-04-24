console.log("loaded visualization.js")

class Chart {
    constructor(opts){
        this.element = opts.element
        this.draw()
    }

    createScales() {
        const m = this.margin
        this.xScale = d3.scaleTime().domain(params.xrange).range([0, this.width-m.left])
        console.log(`createScales( set xScale to ${this.xScale})`)
        this.xViewScale = d3.scaleTime().domain(params.xviewrange).range([0, this.width-m.left])
        console.log(`createScales( set xViewScale to ${this.xViewScale})`)
        // Choose and set time scales (logarithmic or linear) for the main plot *and* the viewfinder
        if (params["scale"] === "log") {
            this.yViewFinderScale = d3.scaleLog().domain(params["yrange"])
            this.yScale = d3.scaleLog().domain(params["yrange"])}
        else {
            this.yViewFinderScale = d3.scaleLinear().domain(params["yrange"])
            this.yScale = d3.scaleLinear().domain(params["yrange"])
        }
        // When showing ranks, put rank #1 at the top
        // When showing any other metric, put the highest number at the top and start at 0
        if (params["metric"] === "rank") {
            this.yScale.range([this.height-(m.top+m.bottom), 1])
            this.yViewFinderScale.range([this.viewFinderHeight, 1])
        }
        else {
            this.yScale.range([0, this.height-(m.top+m.bottom)])
            this.yViewFinderScale.range([0, this.viewFinderHeight])
        }
    }

    addAxes() {
        const height = this.height
        const viewFinderHeight = this.viewFinderHeight
        const m = this.margin

        const xAxis = d3.axisBottom()
            .scale(this.xViewScale)
            .ticks(d3.timeMonth)

        const xViewFinderAxis = d3.axisBottom()
            .scale(this.xScale)
            .ticks(d3.timeYear)

        const yAxis = d3.axisLeft()
            .scale(this.yScale)
            .ticks(10, "")

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

        // Add X Axis to viewfinder plot
        this.viewfinder.append("g")
            .attr("class", "xviewaxis")
            .attr("transform", `translate(0, ${viewFinderHeight})`)
            .call(xViewFinderAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
    }

    addLabels(){
        const height = this.height
        const m = this.margin
        // Label xAxis with Metric
        this.svg.append("text")
            .attr("y", height / 2 + m.top / 2)
            .attr("x", m.left / 2)
            .attr("dy", "1em")
            .text(String(params['metric']).charAt(0).toUpperCase() + String(params['metric']).slice(1))
            .attr("class","axislabel")

        this.svg.append("text")
            .attr("y", m.top + 10)
            .attr("x", m.left / 2)
            .attr("dy", "0.5em")
            .text("Lexical Fame")
            .attr("class","axislabel")
            .attr("text-anchor", "middle")

        this.svg.append("text")
            .attr("y", this.height + this.margin.top)
            .attr("x", this.margin.left / 2)
            .attr("dy", "0.5em")
            .text("Lexical Abyss")
            .attr("class","axislabel")
            .attr("text-anchor", "middle")
    }

    brushed(){
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        let s = d3.event.selection || this.xViewScale.range();
        console.log(`brushed( this.xScale = ${this.xScale} )`)
        console.log(this.xScale.domain)
        this.xScale.domain(s.map(this.xViewScale.invert, this.xViewScale))
        svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
            .scale(this.width / (s[1] - s[0]))
            .translate(-s[0], 0));
    }

    zoomed(){
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
        let t = d3.event.transform;
        this.xScale.domain(t.rescaleX(this.xViewScale).domain());
        this.clipgroup.select(".line").attr("d", line);
        this.plot.select(".xaxis").call(xAxis);
        this.viewfinder.select(".brush").call(brush.move, this.xScale.range().map(t.invertX, t));
    }

    addLine(ngram) {

        console.log(`Adding line for ${ngram} to ${this.plot.attr('class')}`)
        const ndata = ngramData[ngram]['data']
        const colorid = ngramData[ngram]['colorid']
        const uuid = ngramData[ngram]['uuid']

        const line = d3.line()
            .x(d => this.xViewScale(dateParser(d[0])))
            .y(d => this.yScale(d[1]));

        const viewerline = d3.line()
            .x(d => this.xScale(dateParser(d[0])))
            .y(d => this.yViewFinderScale(d[1]));

        this.clipgroup.append('path')
            // use data stored in `this`
            .datum(ndata)
            .attr('class',`line uuid-${uuid}`)
            // set stroke to specified color, or default to red
            .attr('stroke', colors.main[colorid] || 'gray')
            .attr('d',line)

        this.viewfinder.append('path')
            // use data stored in `this`
            .datum(ndata)
            .attr('class',`line uuid-${uuid}`)
            // set stroke to specified color, or default to red
            .attr('stroke', colors.main[colorid] || 'gray')
            .attr('d',viewerline)
    }

    removeLine(ngram){
        this.plot.select('.uuid-'+ngramData[ngram]['uuid']).remove()
        this.viewfinder.select('.uuid-'+ngramData[ngram]['uuid']).remove()
    }

    draw() {
        this.width = this.element.offsetWidth
        this.height = this.element.offsetHeight
        this.viewFinderHeight = 100
        this.margin = { top: 0.1 * this.height, right: 0.1 * this.width, bottom: 0.1 * this.height, left: 0.25 * this.width }
        this.plotHeight = this.height - (this.margin.top + this.margin.bottom)
        this.createScales()
        // set up parent element and SVG
        this.element.innerHTML = ''

        this.svg = d3.select(this.element).append('svg')
        this.svg.attr('width', this.width)
        this.svg.attr('height', this.margin.top + this.height + this.margin.bottom + this.viewFinderHeight)


        let zoom = d3.zoom()
            .scaleExtent([1, 5])
            .translateExtent([[0, 0], [this.width, this.height]])
            .extent([[0, 0], [this.width, this.height]])
            .on("zoom", zoomed)

        let brush = d3.brushX()
            .extent([[0, 0], [this.width, this.height/5]])
            .on("brush end", brushed)

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

        this.plot.append("rect")
            .attr("class", "zoom")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`)
            .attr("fill","none")
            .call(zoom);

        this.viewfinder = this.svg.append('g')
            .attr("class", "viewfinder")
            .attr("transform", `translate(${this.margin.left}, ${this.plotHeight + this.margin.top + this.margin.bottom})`)

        this.viewfinder.append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.move, this.xViewScale.range())

        this.addAxes()
        this.addLabels()

        Object.keys(ngramData).forEach(n => this.addLine(n))
    }
}

function makeCharts(){
    mainChart = new Chart({element: document.querySelector('#mainplot')})
    Object.keys(ngramData).forEach(n => {
        d3.select('#subplot-list').append('div').attr('class', `subplot ${ngramData[n]['uuid']}`)
        const s = new Chart({element: document.querySelector('.subplot')})
        subplots.push(s)
    })
    d3.select(window).on('resize', () => {
        mainChart.draw()
        subplots.forEach(subplot => subplot.draw())
    })
}