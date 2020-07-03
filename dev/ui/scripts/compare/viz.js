function addGlyphs(chart){

    if (chart.type==='main') {
        // Add lines
        Object.keys(ngramData).forEach(ngram => {
            addLines(chart, ngram)
        })
        // Add dots
        Object.keys(ngramData).forEach(ngram => {
            addDots(chart, ngram)
        })
    }
    else {
        addLines(chart, chart.ngram)
    }
}