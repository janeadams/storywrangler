//console.log("Loading setup.js")

const compare = true
defaultparams['rt']=true
paramoptions['rt']=[true,false]

let Ngrams = []
let defaultNgrams = ["🦠","hahaha","Black Lives Matter","#MeToo"]
let defaultDict = {}

d3.json('language_defaults.json').then((data) => {
    defaultDict = data
    console.log(defaultDict)
    translateDefaults()
})