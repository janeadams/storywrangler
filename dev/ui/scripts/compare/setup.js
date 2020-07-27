//console.log("Loading setup.js")

const compare = true
defaultparams['rt']=true
paramoptions['rt']=[true,false]

let Ngrams = []
let defaultNgrams = []
let defaultDict = {}

function setDefaults() {
    if (Object.keys(defaultDict).includes(params['language'])){
        console.log(`Alternative defaults detected for ${codeLookup[params['language']]}`)
        defaultNgrams = Object.assign([], defaultDict[params['language']])
    }
    else {
        defaultNgrams = Object.assign([], ["🦠","hahaha","Black Lives Matter","#MeToo"])
    }
    console.log(`defaultNgrams: ${defaultNgrams}`)
}