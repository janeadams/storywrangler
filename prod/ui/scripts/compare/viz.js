function addGlyphs(chart){
    // Add lines
    Object.keys(ngramData).forEach(ngram => {
        const ndata = ngramData[ngram]['data']
        //console.log('ndata:')
        //console.log(ndata)
        const colorid = ngramData[ngram]['colorid']
        const uuid = ngramData[ngram]['uuid']
        const dataline = d3.line().defined(d => !isNaN(d[1]))
            .x(d => chart.xScale(d[0]))
            .y(d => chart.yScale(d[1]))

        const navline = d3.line().defined(d => !isNaN(d[1]))
            .x(d => chart.xScaleNav(d[0]))
            .y(d => chart.yScaleNav(d[1]))

        chart.clipgroup.attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")

        if (params['metric']==='rank') {
            try{
            const ndataReplaced = ngramData[ngram]['data_w-replacement']
            /* MISSING (DOTTED) LINE */
            chart.clipgroup.append('path')
                .datum(ndataReplaced)
                .attr('class', `line uuid-${uuid} missingline`)
                .attr('stroke', colors.light[colorid])
                .attr('d', dataline)
            }
            catch{}
        }

        /* MAIN DATA LINE */
        chart.clipgroup.append('path')
            .datum(ndata)
            .attr('class',`line uuid-${uuid} dataline`)
            .attr('stroke', colors.light[colorid])
            .attr('d',dataline)

        /* TIMELINE NAVIGATION LINE */
        chart.navPlot.append('path')
            .datum(ndata)
            .attr('class',`line uuid-${uuid} navline`)
            .attr('stroke', colors.main[colorid])
            .attr('d',navline)

    })
    // Add dots
    Object.keys(ngramData).forEach(ngram => {
        const ndata = ngramData[ngram]['data']
        const colorid = ngramData[ngram]['colorid']
        const uuid = ngramData[ngram]['uuid']
        let RTlabel
        if (params['rt']) { RTlabel = '(Includes retweets)'}
        else {RTlabel = '(Does not include retweets)'}
        // Define the div for the tooltip
        let div = d3.select("body").append("div")
            .attr("class", `uuid-${uuid} tooltip`)
            .style("opacity", 0)
            .on("mouseover", d3.selectAll(".tooltip").style("opacity", 0))

        // DRAW DOTS //
        chart.clipgroup.selectAll('.dot')
            .data(filterNull(ndata))
            .enter()
            //.append('a').attr('target','_blank').attr('href', d => getTwitterURL(ngram, d, params['rt']))
            .append("circle")
            .attr('class',`uuid-${uuid} datadot`)
            .attr('fill', colors.main[colorid])
            .attr("r", dotsize)
            .attr("cx", d => chart.xScale(d[0]))
            .attr("cy", d => chart.yScale(d[1]))
            .on("mouseover", drawTooltip)
            .on("mouseout", removeTooltip)
            .on("click", d => {
                window.open(getTwitterURL(ngram, d, params['rt']), '_blank')
            })

        // Create Event Handlers for mouse
        function drawTooltip(d) {
            d3.select(this).style("r", dotsize+2).style("fill",colors.dark[colorid])
            div.style('border-color', colors.main[colorid])
            div.style('background-color', colors.light[colorid])
            div.transition()
                .duration(200)
                .style("opacity", .9)
            let formattedValue
            if (params['metric']==='rank'){
                formattedValue = d3.format(",")(d[1])
            }
            else {
                formattedValue = d3.format(",.0")(d[1])
            }

            div.html(`<span style="font-weight:bold; color:${colors.dark[colorid]};" class="ngram">"${ngram}"</span><br/><span style="font-weight:bold;">Date:</span> ${dateFormatter(d[0])}<br/><span style="font-weight:bold;">${sentenceCase(params['metric'])}:</span> ${formattedValue}<br/><span style="font-style:italic;">${RTlabel}</span>`)
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        }
        function removeTooltip() {
            d3.select(this).style("r", dotsize).style("fill",colors.main[colorid])
            div.transition()
                .duration(0)
                .style("opacity", 0);
            div.style("left", "0px")
                .style("top", "0px")
        }
    })
}