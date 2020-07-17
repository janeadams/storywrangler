function addGlyphs(chart){
    try {
    // Add lines
    addLines(chart,'w_rt')
    addLines(chart,'no_rt')
    // ADD DOTS
    addDots(chart,'w_rt')
    addDots(chart,'no_rt')
    chart.svg.append("text")
            .attr("text-anchor", "start")
            .attr("y", chart.margin.top)
            .attr("x", chart.margin.left+20)
            .attr("dy", "0.5em")
            .text(`"${Ngram}"`)
            .attr("class","ngram-name")
    }
    catch {}
}