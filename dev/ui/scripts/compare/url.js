function getUrlNgrams() {
    //console.log("Getting URL ngrams")
    let newNgrams
    if (window.location.href.indexOf('ngrams') > -1) { // If ngrams are specified in the URL
        newNgrams = readUrlVars()["ngrams"] // Add the ngrams specified in the URL
    }
    else {
        newNgrams = Object.assign([],defaultNgrams) // Set to default ngrams
    }
    newNgrams.forEach(n => parseQuery(n, true))
}

function readUrlNgrams(value){
    // Create an array
    URLngrams = []
    //console.log(`Found ${value} for ${key}`)
    let values = value.split(",")
    //console.log(`Split ${value} into ${values}`)
    // Add the value to it
    values.forEach(v => {
        if (Ngrams.includes(v)){`Ngrams already included ${v}`}
        else {URLngrams.push(decodeURIComponent(v))}
    })
    return URLngrams
}

function checkDifferent(){
    let isDifferent = false
    //console.log(Ngrams)
    Ngrams.forEach(n => {
        if (defaultNgrams.includes(n)){}
        else {
            //console.log(`${n} is not in ${defaultNgrams}`)
            isDifferent = true
        }
    })
    return isDifferent
}

function getUrlNgramParams(){
    let encoded = []
    Ngrams.forEach(n => {
        encoded.push(encodeURIComponent(n))
    })
    return ("ngrams=" + encoded)
}

function translateDefaults(){
    let newDefaults = ["🦠","hahaha","Black Lives Matter","#MeToo"]
    if (Object.keys(defaultDict).includes(params['language'])){
        newDefaults = defaultDict[params['language']]
        //console.log(`newDefaults: ${newDefaults}`)
        if (JSON.stringify(Ngrams)===JSON.stringify(defaultNgrams)){
            //console.log(`Ngrams are default`)
            Ngrams = Object.assign([], newDefaults)
            //console.log(`Ngrams are now ${Ngrams}`)
        }
        defaultNgrams = Object.assign([], newDefaults)
        //console.log(`defaultNgrams are now ${defaultNgrams}`)
    }
    else {
        newDefaults = ["🦠","hahaha","Black Lives Matter","#MeToo"]
        //console.log(`newDefaults: ${newDefaults}`)
        if (JSON.stringify(Ngrams)===JSON.stringify(defaultNgrams)){
            //console.log(`Ngrams are default`)
            Ngrams = Object.assign([], newDefaults)
            //console.log(`Ngrams are now ${Ngrams}`)
        }
        defaultNgrams = Object.assign([], newDefaults)
        //console.log(`defaultNgrams are now ${defaultNgrams}`)
    }
}