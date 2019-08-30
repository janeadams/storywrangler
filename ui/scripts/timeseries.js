console.log("loaded timeseries.js")

function updateRanges() {
    console.log("Updating ranges...")
    params.xrange = [d3.min(xmins), d3.max(xmaxes)]
    params.yrange = [0, d3.max(ymaxes)]
    console.log('params.xrange =', params.xrange, '  params.yrange =', params.yrange)
}

function drawAllTimeseries() {
    console.log("Drawing all timeseries...")
    var optwidth = 0.8 * (document.documentElement.clientWidth)
    var optheight = 0.6 * (document.documentElement.clientHeight)
    console.log("optwidth = ", optwidth, " optheight = ", optheight)
    /* === Focus chart === */
    console.log("Setting margins...")
    var margin = { top: 0.1 * (optheight), right: 0.1 * (optwidth), bottom: 0.25 * (optheight), left: 0.1 * (optwidth) }
    var width = optwidth - margin.left - margin.right
    var height = optheight - margin.top - margin.bottom
    /* === Context chart === */
    var margin_context = { top: 0.85 * (optheight), right: 0.1 * (optwidth), bottom: 0.1 * (optheight), left: 0.1 * (optwidth) }
    var height_context = optheight - margin_context.top - margin_context.bottom

    console.log("22")

    function drawEachTimeseries(data) {
        // Get a list of all dates for which we have data
        var dates = data["dates"]
        console.log('dates = ', dates)
        // Get a list of all the values for our chosen metric
        var values = data[params['metric']]
        console.log('values = ', values)
        // Create a value/date pair list
        var pairs = []
        dates.forEach(function(date, i) {
            pairs[date] = values[i]
        })

        console.log('pairs = ', pairs)

        console.log("54")

        /// START HERE 


        // 5. X scale will use the index of our data
        var xScale = d3.scaleLinear()
            .domain(data.xrange) // input
            .range([0, width]); // output

        // 6. Y scale will use the randomly generate number 
        var yScale = d3.scaleLinear()
            .domain(data.yrange) // input 
            .range([height, 0]); // output 

        // 7. d3's line generator
        var line = d3.line()
            .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
            .y(function(d) { return yScale(d.y); }) // set the y values for the line generator 
            .curve(d3.curveMonotoneX) // apply smoothing to the line

        // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
        var dataset = pairs

        // 1. Add the SVG to the page and employ #2
        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // 3. Call the x axis in a group tag
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

        // 4. Call the y axis in a group tag
        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

        // 9. Append the path, bind the data, and call the line generator 
        svg.append("path")
            .datum(dataset) // 10. Binds data to the line 
            .attr("class", "line") // Assign a class for styling 
            .attr("d", line); // 11. Calls the line generator 

        // 12. Appends a circle for each datapoint 
        svg.selectAll(".dot")
            .data(dataset)
            .enter().append("circle") // Uses the enter().append() method
            .attr("class", "dot") // Assign a class for styling
            .attr("cx", function(d, i) { return xScale(i) })
            .attr("cy", function(d) { return yScale(d.y) })
            .attr("r", 5)
            .on("mouseover", function(a, b, c) {
                console.log(a)
                this.attr('class', 'focus')
            })
            .on("mouseout", function() {})
    }
    querydata.forEach(function(dataset) {
        drawEachTimeseries(dataset)
    })
}