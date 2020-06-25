function addGlyphs(chart){
    // Add lines
    Object.keys(ngramData).forEach(rt_state => {
        let lightColor = colors.light[0]
        let darkColor = colors.dark[0]
        if (rt_state==='w_rt') {
            lightColor = 'lightgrey'
            darkColor = 'darkgrey'
        }
        let ndata = ngramData[rt_state]['data']
        const dataline = d3.line().defined(d => !isNaN(d[1]))
            .x(d => chart.xScaleFocused(d[0]))
            .y(d => chart.yScale(d[1]))

        const selectorline = d3.line().defined(d => !isNaN(d[1]))
            .x(d => chart.xScaleSelector(d[0]))
            .y(d => chart.yScaleMini(d[1]))

        chart.clipgroup.attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")

        let replacedMissing
        if (isRank()){ replacedMissing = replaceValue(ndata,undefined,1000000) }
        else {
            if (params['scale']==='log') { replacedMissing = replaceValue(ndata, undefined, 0.00000001) }
            else { replacedMissing = replaceValue(ndata, undefined, 0) }
        }

        /* MISSING (DOTTED) LINE */
        chart.clipgroup.append('path')
            .datum(replacedMissing)
            .attr('class',`line ${rt_state} missingline`)
            .attr('stroke', lightColor)
            .attr('d',dataline)

        /* MAIN DATA LINE */
        chart.clipgroup.append('path')
            .datum(ndata)
            .attr('class',`line ${rt_state} dataline`)
            .attr('stroke', lightColor)
            .attr('d',dataline)

        /* TIMELINE NAVIGATION LINE */
        chart.selectorPlot.append('path')
            .datum(filterNull(ndata))
            .attr('class',`line ${rt_state} selectorline`)
            .attr('stroke', darkColor)
            .attr('d',selectorline)
    })
    // ADD DOTS
    Object.keys(ngramData).forEach(rt_state => {
        const ndata = ngramData[rt_state]['data']
        let lightColor = colors.light[0]
        let mainColor = colors.main[0]
        let darkColor = colors.dark[0]
        let RTlabel = '(Does not include retweets)'
        if (rt_state==='w_rt') {
            RTlabel = '(Includes retweets)'
            lightColor = 'lightgrey'
            mainColor = 'darkgrey'
            darkColor = '#333333'
        }
        // Define the div for the tooltip
        let div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
        chart.clipgroup.selectAll('.dot')
            .data(filterNull(ndata))
            .enter().append("circle")
            .attr('class',`${rt_state} datadot`)
            .attr('fill', mainColor)
            .attr("r", dotsize)
            .attr("cx", d => chart.xScaleFocused(d[0]))
            .attr("cy", d => chart.yScale(d[1]))
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)

        // Create Event Handlers for mouse
        function handleMouseOver(d) {
            d3.select(this).style("r", dotsize+2).style("fill",darkColor)
            div.style('border-color', mainColor)
            div.style('background-color', lightColor)
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

            div.html(`<span style="font-weight:bold; color:${darkColor};" class="ngram">"${Ngram}"</span><br/><span style="font-weight:bold;">Date:</span> ${dateFormatter(d[0])}<br/><span style="font-weight:bold;">${sentenceCase(params['metric'])}:</span> ${formattedValue}<br/><span style="font-style:italic;">${RTlabel}</span>`)
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        }
        function handleMouseOut() {
            d3.select(this).style("r", dotsize).style("fill",mainColor)
            div.transition()
                .duration(0)
                .style("opacity", 0);
            div.style("left", "0px")
                .style("top", "0px")
        }
    })
    if (Ngram) {
        chart.svg.append("text")
            .attr("text-anchor", "start")
            .attr("y", chart.margin.top)
            .attr("x", chart.margin.left+20)
            .attr("dy", "0.5em")
            .text(`"${Ngram}"`)
            .attr("class","ngram-name")
    }
}