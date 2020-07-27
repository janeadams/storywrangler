//console.log("Loading setup.js")

const compare = true
defaultparams['rt']=true
paramoptions['rt']=[true,false]

let Ngrams = []
let defaultNgrams = []
let defaultDict = {}

function setDefaults() {
    d3.json('language_defaults.json').then((data) => {
        defaultDict = data
        //console.log(defaultDict)
        if (Object.keys(defaultDict).includes(params['language'])){
            console.log(`Alternative defaults detected for ${params['language']}`)
            defaultNgrams = Object.assign([], defaultDict[params['language']])
            translateDefaults()
        }
        else {
            defaultNgrams = Object.assign([], ["🦠","hahaha","Black Lives Matter","#MeToo"])
        }
        console.log(`defaultNgrams: ${defaultNgrams}`)
    })
}