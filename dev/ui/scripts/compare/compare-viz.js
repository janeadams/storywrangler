function addGlyphs(chart){
    // Add lines
    Object.keys(ngramData).forEach(ngram => {
        const ndata = ngramData[ngram]['data']
        const colorid = ngramData[ngram]['colorid']
        const uuid = ngramData[ngram]['uuid']
        chart.addLine(ndata,colorid,uuid)
    })
    // Add dots
    Object.keys(ngramData).forEach(ngram => {
        const ndata = ngramData[ngram]['data']
        const colorid = ngramData[ngram]['colorid']
        const uuid = ngramData[ngram]['uuid']
        let RTlabel
        if (params['rt']===true) { RTlabel = '(Includes retweets)'}
        else {RTlabel = '(Does not include retweets)'}
        chart.addDots(ngram, ndata,colorid,uuid,RTlabel)
    })
}