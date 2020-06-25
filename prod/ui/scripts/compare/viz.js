function addGlyphs(chart){
    // Add lines
    Object.keys(ngramData).forEach(ngram => {
        const ndata = ngramData[ngram]['data']
        //console.log('ndata:')
        //console.log(ndata)
        const colorid = ngramData[ngram]['colorid']
        const uuid = ngramData[ngram]['uuid']
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
            .attr('class',`line uuid-${uuid} missingline`)
            .attr('stroke', colors.light[colorid])
            .attr('d',dataline)

        /* MAIN DATA LINE */
        chart.clipgroup.append('path')
            .datum(ndata)
            .attr('class',`line uuid-${uuid} dataline`)
            .attr('stroke', colors.light[colorid])
            .attr('d',dataline)

        /* TIMELINE NAVIGATION LINE */
        chart.selectorPlot.append('path')
            .datum(filterNull(ndata))
            .attr('class',`line uuid-${uuid} selectorline`)
            .attr('stroke', colors.main[colorid])
            .attr('d',selectorline)

    })
    // Add dots
    Object.keys(ngramData).forEach(ngram => {
        const ndata = ngramData[ngram]['data']
        const colorid = ngramData[ngram]['colorid']
        const uuid = ngramData[ngram]['uuid']
        let RTlabel
        if (params['rt']===true) { RTlabel = '(Includes retweets)'}
        else {RTlabel = '(Does not include retweets)'}
        // Define the div for the tooltip
        let div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)

        chart.clipgroup.selectAll('.dot')
            .data(filterNull(ndata))
            .enter().append("circle")
            .attr('class',`uuid-${uuid} datadot`)
            .attr('fill', colors.main[colorid])
            .attr("r", dotsize)
            .attr("cx", d => chart.xScaleFocused(d[0]))
            .attr("cy", d => chart.yScale(d[1]))
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)

        // Create Event Handlers for mouse
        function handleMouseOver(d) {
            d3.select(this).style("r", dotsize+2).style("fill",colors.dark[colorid])
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

            div.html(`<span style="font-weight:bold; color:${colors.dark[colorid]};" class="ngram">"${ngram}"</span><br/><span style="font-weight:bold;">Date:</span> ${dateFormatter(d[0])}<br/><span style="font-weight:bold;">${sentenceCase(params['metric'])}:</span> ${formattedValue}<br/><span style="font-style:italic;">${RTlabel}</span>`)
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        }
        function handleMouseOut() {
            d3.select(this).style("r", dotsize).style("fill",colors.main[colorid])
            div.transition()
                .duration(0)
                .style("opacity", 0);
            div.style("left", "0px")
                .style("top", "0px")
        }
    })
}