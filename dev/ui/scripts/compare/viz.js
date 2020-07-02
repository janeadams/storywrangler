function addGlyphs(chart){
    // Add lines
    Object.keys(ngramData).forEach(ngram => {
        addLines(chart,ngram)
    })
    // Add dots
    Object.keys(ngramData).forEach(ngram => {
        addDots(chart,ngram)
    })
}