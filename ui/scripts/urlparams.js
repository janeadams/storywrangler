function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
    });
    console.log(vars)
    return vars;
}

function getUrlParam(parameter, defaultvalue) {
    var urlparameter = defaultvalue;
    if (window.location.href.indexOf(parameter) > -1) {
        urlparameter = getUrlVars()[parameter];
    }
    return urlparameter;
}

const defaults = { "range": "year", "metric": "rank", "options": ["case-sensitive", "log", "details"] }

for (var entry in Object.entries(defaults)) {
    getUrlParam(entry[0], entry[1])
}

var range = getUrlVars()["range"];
var metric = getUrlVars()["metric"];
var options = getUrlVars()["options"];

console.log("Range is ", range)
console.log("Metric is ", metric)
console.log("Options are ", options)