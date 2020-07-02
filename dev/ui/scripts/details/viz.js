function addGlyphs(chart){
    // Add lines
    Object.keys(ngramData).forEach(rt_state => {
        addLines(chart,rt_state)
    })
    // ADD DOTS
    Object.keys(ngramData).forEach(rt_state => {
        addDots(chart,rt_state)
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