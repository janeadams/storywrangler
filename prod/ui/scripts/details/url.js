function readUrlNgrams(value){
    return decodeURIComponent(value)
}

function getUrlNgrams(){
    console.log("Getting URL ngram")
    if (window.location.href.indexOf('ngram') > -1) { // If ngrams are specified in the URL
        Ngram = readUrlVars()["ngram"] // Add the ngrams specified in the URL
    }
    else {
        Ngram = defaultNgram
    }
    console.log(`Ngram: ${Ngram}`)
}

function checkDifferent(){
    let isDifferent = false
    if (Ngram !== defaultNgram){isDifferent = true}
    return isDifferent
}

function getUrlNgramParams(){
    return ("ngram=" + encodeURIComponent(Ngram))
}

function alreadyExists(query){
    if (Ngram === query){ return true }
}

function eraseRecord(query){
    Ngram = undefined
}

function translateDefaults(){
    let newDefault = 'hahaha'
    if (params['language']==='es'){
        newDefault = 'jajaja'
        console.log(`newDefault: ${newDefault}`)
        if (defaultNgram===Ngram) {
            console.log(`Ngram is default`)
            Ngram = newDefault
        }
        defaultNgram = newDefault.slice()
        console.log(`defaultNgram is now ${defaultNgram}`)
    }
    else {
        newDefault = 'hahaha'
        console.log(`newDefault: ${newDefault}`)
        if (defaultNgram===Ngram) {
            console.log(`Ngram is default`)
            Ngram = newDefault
        }
        defaultNgram = newDefault.slice()
        console.log(`defaultNgram is now ${defaultNgram}`)
    }
}