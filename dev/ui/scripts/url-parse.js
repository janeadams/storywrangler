function readUrlVars() {
    let vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
        console.log(`Read URL key = ${key} / value = ${value}`)
        // Parse arrays:
        value = value.replace("[", "").replace("/]", "")

        // If the parameter should be formatted as an array:
        if (key==="ngrams") {
            // Create an array
            vars[key] = []
            console.log(`Found ${value} for ${key}`)
            let values = value.split(",")
            console.log(`Split ${value} into ${values}`)
            // Add the value to it
            values.forEach(v => {
                if (params['ngrams'].includes(v)){`params[ngrams] already included ${v}`}
                else {vars[key].push(v)}
            })
        }
        else {
            // If the parameter has a specified set of options:
            if (Object.keys(paramoptions).includes(key)) {
                //console.log("paramoptions includes ", key)
                console.log(`paramoptions[${key}]:`)
                console.log(paramoptions[key])
                // And the value returned is incldued in those options:
                if (key === 'rt'){
                    if (value === 'true'){value = true}
                    if (value === 'false'){value = false}
                    // Set the parameter to the value from the URL
                    vars[key] = value
                    console.log(`vars[${key}]:`)
                    console.log(value)
                }
                else {
                    if (paramoptions[key].includes(value)) {
                        // Accept the value from the url parameter
                        console.log(`paramoptions for ${key} includes ${value}`)
                        // Set the parameter to the value from the URL
                        vars[key] = value
                        console.log(`vars[${key}]:`)
                        console.log(value)
                    } else {
                        // If the value isn't one of the allowed options, set to default value
                        console.log(`${value} is an invalid option for the ${key} parameter!`)
                    }
                }
            }
            else {
                let arrayVars = ['xrange','xviewrange','yrange','yviewrange']
                if (arrayVars.includes(key)){
                    let dateValues = value.split(",")
                    dateValues.forEach(d => d)
                    vars[key] = dateValues
                }
            }
        }
    })
    console.log(`readURLvars() returns:`)
    console.table(vars)
    return vars
}
// Get the parameters from the URL
function getUrlParams() {
    if (window.location.href.indexOf('ngrams') > -1) {
        params['ngrams'] = [] // Clear any existing ngrams
        params['ngrams'].push(readUrlVars()["ngrams"]) // Add the ngrams specified in the URL
    }
    else {
        params['ngrams'] = defaultparams['ngrams'] // Set to default keywords
    }
    for (let p in params) {
        // If the parameter is in the URL
        if (window.location.href.indexOf(p) > -1) {
            // set the variable to the value in the url
            //console.log("Found ", p, " parameter in URL as ", urlvar)
            params[p] = readUrlVars()[p]
            console.log(`Changed params[${p}] to ${params[p]}`)
        }
    }
}

function updateURL() {
    let currentURL = String(window.location.href)
    console.log(`currentURL:`)
    console.log(currentURL)
    let splitURL = currentURL.split("?")
    console.log(`splitURL:`)
    console.log(splitURL)
    let paramlist = [];
    for (let [p, v] of Object.entries(defaultparams)) {
        if (params[p] !== v) {
            console.log(`params[${p}]:`)
            console.log(params[p])
            console.log(`defaultparams[${p}]:`)
            console.log(defaultparams[p])
            const dateVars = ['xrange', 'xviewrange']
            if (dateVars.includes(p)){
                let formattedDates = []
                v.forEach(d => {
                    let f = dateFormatter(d)
                    console.log(`Formatted ${d} as ${f}`)
                    formattedDates.push(f)
                })
                paramlist.push(p + "=" + formattedDates)
                console.log(`Added ${p}:${formattedDates} to paramlist. Paramlist:`)
            }
            else {
                const autoranges = ["xrange","yrange"]
                if (autoranges.includes(p)){
                    // Don't include x- and y-ranges in customizable parameters; this is set automatically
                    console.log(`${p} is set automatically`)
                }
                else {
                    paramlist.push(p + "=" + params[p])
                    console.log(`Added ${p}:${params[p]} to paramlist. Paramlist:`)
                }
            }
            console.log(paramlist)
        }
    }
    if (paramlist.length > 0){
        let newURL = String(splitURL[0]) + "?" + paramlist.join("&")
        console.log("newURL:")
        console.log(newURL)
        history.pushState(paramlist,'', newURL)
    }
}

