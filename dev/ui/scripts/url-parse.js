function readUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
        console.log("key = ", key, " value = ", value)
        // Parse arrays:
        value = value.replace("[", "").replace("/]", "").split(",")
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
            vars[key].push(values)
        } else {
            vars[key] = value
        }
    })
    return vars;
}
// Get the parameters from the URL
function getUrlParams() {
    for (var p in params) {
        // If the parameter is in the URL
        if (window.location.href.indexOf(p) > -1) {
            // set the variable to the value in the url
            var urlvar = readUrlVars()[p]
            //console.log("Found ", p, " parameter in URL as ", urlvar)
            params[p] = urlvar
            console.log("Changed params[", p, "] to ", params[p])
        }
        else {
            // If not specified, set to default values
            params[p] = defaultparams[p]
            if (params['ngrams'].length < 1) {
                defaultNgrams.forEach(n => loadData(n))
            }
        }
    }
}

function updateURL() {
    var currentURL = String(window.location.href);
    console.log("currentURL = ", currentURL);
    var splitURL = currentURL.split("?");
    var customparams = {};
    for (var p of ['ngrams', 'metric', 'language', 'scale','RT']) {
        console.log("var p = ", p);
        console.log("params[p] = ", params[p], " defaultparams[p] = ", defaultparams[p]);
        if (params[p] !== defaultparams[p]) {
            customparams[p] = params[p]
        }
    }
    console.log("customparams = ", customparams);
    var paramlist = [];
    for (var [p, v] of Object.entries(customparams)) {
        paramlist.push(p + "=" + v)
    }
    var newURL = String(splitURL[0]) + "?" + paramlist.join("&");
    console.log("newURL = ", newURL);
    window.location.href = newURL;
}