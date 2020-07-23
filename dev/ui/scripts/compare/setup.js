//console.log("Loading setup.js")

const compare = true
defaultparams['rt']=true
paramoptions['rt']=[true,false]

let Ngrams = []
let defaultNgrams = []
let defaultDict = {}

d3.json('language_defaults.json').then((data) => {
    defaultDict = data
    console.log(defaultDict)
})