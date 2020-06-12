function getUrlNgrams() {
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
    console.log("checkDifferent: Ngrams")
    console.log(Ngrams)
    Ngrams.forEach(n => {
        if (n in defaultNgrams){}
        else {isDifferent = true}
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