function readUrlVars() {
    let vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
        console.log("key = ", key, " value = ", value)
        // Parse arrays:
        value = value.replace("[", "").replace("/]", "")
        value = value.split(",")
        // If the parameter has a specified set of options:
        if (Object.keys(paramoptions).includes(key)) {
            //console.log("paramoptions includes ", key)
            //console.log("paramoptions[", key, "] = ", paramoptions[key])
            // And the value returned is incldued in those options:
            if (key = 'RT'){
                if (value === 'true'){value = true}
                if (value === 'false'){value = false}
                vars[key] = value
            }
            else {
                if (paramoptions[key].includes(value)) {
                    // Accept the value from the url parameter
                    console.log("paramoptions for", key, " includes ", value)
                    vars[key] = value
                } else {
                    // If the value isn't one of the allowed options, set to default
                    //console.log(value + " is an invalid option for the " + key + " parameter! Setting " + key + "to default:" + defaultparams[key])
                    value = defaultparams[key]
                }
            }
        }
        // Set the parameter to the value from the URL
        //console.log("Setting key:", key, " to value:", value)
        // If the parameter should be formatted as an array:
        if (typeof(params[key]) == "object" && typeof(value) == "string") {
            // Create an array
            vars[key] = []
            // Add the value to it
            value.forEach(v => vars[key].push(decodeURIComponent(v)))
        } else {
            vars[key] = decodeURIComponent(value)
        }
    })
    return vars;
}
// Get the parameters from the URL
function getUrlParams() {
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
        }
    }
}

function updateURL() {
    let currentURL = String(window.location.href);
    console.log("currentURL = ", currentURL);
    let splitURL = currentURL.split("?");
    let customparams = {};
    for (let p of ['ngrams', 'metric', 'language', 'scale','RT']) {
        console.log("var p = ", p);
        console.log("params[p] = ", params[p], " defaultparams[p] = ", defaultparams[p]);
        if (params[p] !== defaultparams[p]) {
            customparams[p] = params[p]
        }
        else {
            customparams[p] = defaultparams[p]
        }
    }
    console.log("customparams = ", customparams);
    let paramlist = [];
    for (let [p, v] of Object.entries(customparams)) {
        paramlist.push(p + "=" + v)
    }
    let newURL = String(splitURL[0]) + "?" + paramlist.join("&");
    console.log("newURL = ", newURL);
    window.location.href = newURL;
}