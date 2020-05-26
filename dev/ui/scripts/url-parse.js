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
                if (Ngrams.includes(v)){`Ngrams already included ${v}`}
                else {vars[key].push(decodeURIComponent(v))}
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
                    else {value = false}
                    // Set the parameter to the value from the URL
                    vars[key] = value
                    //console.log(`vars[${key}]:`)
                    //console.log(value)
                }
                else {
                    if (paramoptions[key].includes(value)) {
                        // Accept the value from the url parameter
                        //console.log(`paramoptions for ${key} includes ${value}`)
                        // Set the parameter to the value from the URL
                        vars[key] = value
                        //console.log(`vars[${key}]:`)
                        //console.log(value)
                    } else {
                        // If the value isn't one of the allowed options, set to default value
                        //console.log(`${value} is an invalid option for the ${key} parameter!`)
                        vars[key] = defaultparams[key]
                    }
                }
            }
        }
    })
    //console.log(`readURLvars() returns:`)
    //console.table(vars)
    return vars
}
// Get the parameters from the URL
function getUrlParams() {
    let newNgrams
    if (window.location.href.indexOf('ngrams') > -1) { // If ngrams are specified in the URL
        newNgrams = readUrlVars()["ngrams"] // Add the ngrams specified in the URL
    }
    else {
        newNgrams = Object.assign([],defaultNgrams) // Set to default ngrams
    }
    newNgrams.forEach(n => loadData(n, true))

    Object.keys(defaultparams).forEach(p => { // For all parameters
        // If the parameter is in the URL
        if (window.location.href.indexOf(p) > -1) {
            params[p] = readUrlVars()[p] // set the variable to the value in the url
            console.log(`Changed params[${p}] to ${params[p]}`)
        } else { // If the parameter is not specified in the URL
            params[p] = defaultparams[p]
            //console.log(`params[${p}] matches default params: ${params[p]} = ${defaultparams[p]}`)
        }
    })
}

function updateURL() {
    let currentURL = String(window.location.href)
    //console.log(`currentURL:`)
    //console.log(currentURL)
    let splitURL = currentURL.split("?")
    //console.log(`splitURL:`)
    //console.log(splitURL)
    let paramlist = []
    let isDifferent = false
    Ngrams.forEach(n => {
        if (n in defaultNgrams){}
        else {isDifferent = true}
    })
    if (isDifferent){
        let encoded = []
        Ngrams.forEach(n => encoded.push(encodeURIComponent(n)))
        paramlist.push("ngrams=" + encoded)
        Ngrams.forEach(n => loadData(n, false))
    }
    for (let p of Object.keys(defaultparams)) {
            if (params[p] !== defaultparams[p]) { // If the parameter doesn't match the defaults
                //console.log(`params[${p}]:`)
                //console.log(params[p])
                //console.log(`defaultparams[${p}]:`)
                //console.log(defaultparams[p])
                const dateVars = ['start', 'end']
                if (dateVars.includes(p)) {
                    paramlist.push(p + "=" + dateFormatter(params[p]))
                    console.log(`Added ${p}:${dateFormatter(params[p])} to paramlist. Paramlist:`)
                } else {
                    paramlist.push(p + "=" + params[p])
                    //console.log(`Added ${p}:${params[p]} to paramlist. Paramlist:`)
                }
                console.log(paramlist)
            }
    }
    if (paramlist.length > 0){
        let newURL = String(splitURL[0]) + "?" + paramlist.join("&")
        //console.log("newURL:")
        //console.log(newURL)
        history.pushState([],'', newURL)
    }
    else {
        let newURL = String(splitURL[0])
        //console.log("newURL:")
        //console.log(newURL)
        history.pushState([],'', newURL)
    }
}
