function readUrlVars() {
    let vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
        console.log(`4: received key = ${key} / value = ${value}`)
        // Parse arrays:
        value = value.replace("[", "").replace("/]", "")

        // If the parameter has a specified set of options:
        if (Object.keys(paramoptions).includes(key)) {
            //console.log("paramoptions includes ", key)
            console.log(`paramoptions[${key}] = ${paramoptions[key]}`)
            // And the value returned is incldued in those options:
            if (key === 'rt'){
                if (value === 'true'){value = true}
                if (value === 'false'){value = false}
                vars[key] = value
                console.log(`16: set vars[${key}] to ${value}`)
            }
            else {
                if (paramoptions[key].includes(value)) {
                    // Accept the value from the url parameter
                    console.log(`paramoptions for ${key} includes ${value}`)
                    vars[key] = value
                    console.log(`24: set vars[${key}] to ${value}`)
                } else {
                    // If the value isn't one of the allowed options, set to default
                    console.log(`${value} is an invalid option for the ${key} parameter! Setting ${key} to default: ${defaultparams[key]}`)
                    vars[key] = defaultparams[key]
                    console.log(`29: set vars[${key}] to ${value}`)
                }
            }
        }
        // Set the parameter to the value from the URL
        //console.log("Setting key:", key, " to value:", value)
        // If the parameter should be formatted as an array:
        if (key==="ngrams") {
            // Create an array
            vars[key] = []
            let values = value.split(",")
            console.log(`Line 36 in url parse: key ${key} / values ${values}`)
            // Add the value to it
            values.forEach(v => {
                if (params['ngrams'].includes(v)){`params[ngrams] already included ${v}`}
                else {loadData(decodeURIComponent(v))}
            })
        } else {
            vars[key] = value
            console.log(`45: set vars[${key}] to ${value}`)
        }
    })
    console.log(`readURLvars() returns:`)
    console.table(vars)
    return vars;
}
// Get the parameters from the URL
function getUrlParams() {
    if (window.location.href.indexOf('ngrams') > -1) {
        params['ngrams'] = readUrlVars()["ngrams"]
    }
    else {
        params['ngrams'] = defaultparams['ngrams']
    }
    /*
    for (let p in params) {
        // If the parameter is in the URL
        if (window.location.href.indexOf(p) > -1) {
            // set the variable to the value in the url
            //console.log("Found ", p, " parameter in URL as ", urlvar)
            params[p] = readUrlVars()[p]
            console.log("Changed params[", p, "] to ", params[p])
        }
        else {
            // If not specified, set to default values
            params[p] = defaultparams[p]
            if (p === 'ngrams'){
                params['ngrams'].forEach(n => loadData(n))
            }
        }
    }*/
}

function updateURL() {
    let currentURL = String(window.location.href)
    console.log("currentURL = ", currentURL)
    let splitURL = currentURL.split("?")
    let newURL = String(splitURL[0]) + "?ngrams=" + params['ngrams']
    history.pushState({},null, newURL)
    /*
    let customparams = {};
    for (let p of ['ngrams', 'metric', 'language', 'scale','rt']) {
        console.log("var p = ", p);
        console.log("params[p] = ", params[p], " defaultparams[p] = ", defaultparams[p]);
        if (params[p] !== defaultparams[p]) {
            customparams[p] = params[p]
        }
        else {
        }
    }
    console.log("customparams = ", customparams);
    let paramlist = [];
    for (let [p, v] of Object.entries(customparams)) {
        paramlist.push(p + "=" + v)
    }
    let newURL = String(splitURL[0]) + "?" + paramlist.join("&");
    console.log("newURL = ", newURL);
    history.pushState({},null, newURL)
    */

}