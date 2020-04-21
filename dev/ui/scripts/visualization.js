console.log("loaded visualization.js")

let width = window.innerWidth
let height = window.innerHeight

class Chart {
    constructor(opts){
        this.element = opts.element
        this.draw()
    }

    createScales() {
        this.xScale = d3.scaleTime().domain(params.xrange).range([0, this.width])
        this.xViewScale = d3.scaleTime().domain(params.xviewrange).range([0, this.width])
        // Choose and set time scales (logarithmic or linear)
        if (params["scale"] === "log") {this.yScale = d3.scaleLog().domain(params["yrange"])}
        else {this.yScale = d3.scaleLinear().domain(params["yrange"])}
        // When showing ranks, put rank #1 at the top
        // When showing any other metric, put the highest number at the top and start at 0
        if (params["metric"] === "rank") {this.yScale.range([this.height-(this.margin.top+this.margin.bottom), 1])}
        else {this.yScale.range([0, this.height-(this.margin.top+this.margin.bottom)])}
    }

    addAxes() {

        const xAxis = d3.axisBottom()
            .scale(this.xScale)
            .ticks(d3.timeMonth)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)")

        const yAxis = d3.axisLeft()
            .scale(this.yScale)
            .ticks(10, "")

        // Add X Axis
        this.plot.append("g")
            .attr("class", "xaxis")
            .attr("transform", `translate(0, ${this.height-(this.margin.top+this.margin.bottom)})`)
            .call(xAxis);

        // Add Y Axis
        this.plot.append("g")
            .attr("class", "yaxis")
            .call(yAxis)
    }

    addLabels(){
        // Label xAxis with Metric
        this.plot.append("text")
            .attr("y", this.height / 2 + this.margin.top / 2)
            .attr("x", this.margin.left / 2)
            .attr("dy", "1em")
            .text(String(params['metric']).charAt(0).toUpperCase() + String(params['metric']).slice(1))
            .attr("class","axislabel")

        this.plot.append("text")
            .attr("y", 0 + this.margin.top + 10)
            .attr("x", this.margin.left / 2)
            .attr("dy", "0.5em")
            .text("Lexical Fame")
            .attr("class","axislabel")
            .attr("text-anchor", "middle")

        this.plot.append("text")
            .attr("y", height + margin.top)
            .attr("x", margin.left / 2)
            .attr("dy", "0.5em")
            .text("Lexical Abyss")
            .attr("class","axislabel")
            .attr("text-anchor", "middle")
    }

    addLine(ngram) {

        const ndata = ngramData[ngram]['data']
        const colorid = ngramData[ngram]['colorid']

        const line = d3.line()
            .x(d => this.xScale(d[0]))
            .y(d => this.yScale(d[1]));

        this.plot.append('path')
            // use data stored in `this`
            .datum(ndata)
            .classed('line',true)
            .attr('d',line)
            // set stroke to specified color, or default to red
            .style('stroke', colors.main[colorid] || 'red');
    }

    draw() {
        this.width = this.element.offsetWidth
        this.height = this.width/2
        this.margin = { top: 0.1 * this.height, right: 0.15 * this.width, bottom: 0.25 * this.height, left: 0.2 * this.width }
        // set up parent element and SVG
        this.element.innerHTML = '';
        const svg = d3.select(this.element).append('svg');
        svg.attr('width',  this.width);
        svg.attr('height', this.height);

        // we'll actually be appending to a <g> element
        this.plot = svg.append('g')
            .attr('transform',`translate(${this.margin.left},${this.margin.top})`);

        this.createScales()
        this.addAxes()
        this.addLabels()
        Object.keys(ngramData).forEach(n){
            this.addLine(n)
        }
    }
}