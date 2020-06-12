function addGlyphs(chart){
    // Add lines
    Object.keys(ngramData).forEach(rt_state => {
        let colorid
        if (rt_state==='w_rt') {
            colorid = 0
        }
        else {
            colorid = 1
        }
        chart.addLine(ngramData[rt_state]['data'],colorid,rt_state)
    })
    // Add dots
    Object.keys(ngramData).forEach(rt_state => {
        let RTlabel
        let colorid
        if (rt_state==='w_rt') {
            RTlabel = '(Includes retweets)'
            colorid = 0
        }
        else {
            RTlabel = '(Does not include retweets)'
            colorid = 1
        }
        chart.addDots(Ngram,ngramData[rt_state]['data'],colorid,rt_state,RTlabel)
    })
}