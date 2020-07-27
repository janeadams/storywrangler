let params = {}
let ngramData = {}

let xmins = []
let xmaxes = []
let ymins = []
let ymaxes = []
let mainChart
let subPlots = {}
let xRange = []
let yRange = []
let languageCodes = {}
let codeLookup = {}
let viewport = 1000

const suggestions = ["haha", "happy new year", "#throwbackthursday", "😊"]

// Limit options for certain parameters
const paramoptions = {
    "language": ['af', 'sq', 'ar', 'an', 'hy', 'ast', 'az', 'eu', 'be', 'bn', 'bs', 'br', 'bg', 'ca', 'ceb', 'ckb', 'cbk', 'hr', 'cs', 'da', 'nl', 'en', 'eo', 'et', 'fi', 'fr', 'fy', 'gl', 'ka', 'de', 'el', 'gu', 'he', 'hi', 'hu', 'is', 'io', 'ilo', 'id', 'ia', 'ie', 'ga', 'it', 'kn', 'kk', 'ko', 'ku', 'la', 'lv', 'lt', 'jbo', 'lb', 'mk', 'mg', 'ml', 'mr', 'mzn', 'min', 'mn', 'ne', 'no', 'nn', 'oc', 'fa', 'pl', 'pt', 'ps', 'qu', 'ro', 'ru', 'nds', 'sr', 'sh', 'sd', 'si', 'sk', 'sl', 'azb', 'es', 'sw', 'sv', 'tl', 'ta', 'te', 'tr', 'uk', 'ur', 'uz', 'vi', 'war', 'cy', 'pnb'],
    "metric": ["rank", "freq"], //["rank", "counts", "freq"],
    "scale": ["log", "lin"]
}

const dateParser = date => new Date(d3.timeParse(date))
const dateFormatter = d3.timeFormat("%Y-%m-%d")
Date.prototype.addDays = function(days) {
    let date = new Date(this.valueOf())
    date.setDate(date.getDate() + days)
    return date;
}

// Today's date
let today = new Date()
let mostrecent = dateParser(new Date(today)).addDays(-2)
// Extract year from today's date
let thisyear = today.getFullYear()
// Get one year ago
let lastyeardate = dateParser(dateFormatter(new Date().setFullYear(thisyear - 1)))
// January 1st, this year
let thisfirst = new Date(thisyear, 1, 1)
let firstDate = new Date(2009,9,1)

// Set default options
const defaultparams = {
    "language": "en",
    "metric": "rank",
    "scale": "log",
    "start": firstDate,
    "end": today
}

const colors = {
    'names': ["blue", "cyan", "green", "yellow", "pink", "purple"],
    'main': ["#4477AA", "#66CCEE", "#228833", "#CCBB43", "#ED6677", "#AB3278"],
    'dark': ["#215680", "#287B89", "#286C3A", "#938431", "#CE324D", "#891F60"],
    'light': ["#A2C4DD", "#B8E4F0", "#9BD3A0", "#EFE2A3", "#EFA5B1", "#DB95C4"]
}

// Simple function for finding the fill, stroke, or tint by the color group name
function colorMe(name, type='main') { return colors[type][colors["names"].indexOf(name)] }
//console.log(colorMe("sky"))

function sentenceCase (str) {
    if ((str===null) || (str===''))
        return false;
    else
        str = str.toString().replace('freq','frequency')

    return str.replace(/\w\S*/g,
        function(txt){return txt.charAt(0).toUpperCase() +
            txt.substr(1).toLowerCase();});
}

function getSignificantDigitCount(n) {
    n = Math.abs(String(n).replace(".", "")); //remove decimal and make positive
    if (n === 0) return 0;
    while (n !== 0 && n % 10 === 0) n /= 10; //kill the 0s at the end of n
    return Math.floor(Math.log(n) / Math.log(10)) + 1; //get number of digits
}

function precise(x,s) {
    return Number.parseFloat(x).toPrecision(s);
}

function roundUpToSig(max){
    let up = 1.2 * max
    return parseFloat(precise(up,getSignificantDigitCount(max)))
}

function roundDownToSig(min){
    if (min===0){
        return parseFloat(0.0000001)
    }
    else {
        let down = 0.8 * min
        return parseFloat(precise(down, getSignificantDigitCount(min)))
    }
}

function getDates(startDate, stopDate) {
    let dateArray = []
    let currentDate = startDate
    while (currentDate <= stopDate) {
        dateArray.push(new Date (currentDate))
        currentDate = currentDate.addDays(1)
    }
    return dateArray;
}

const fullDateRange = getDates(firstDate, mostrecent)

function setRanges() {
    if (Object.keys(ngramData).length > 0 ){ // If there is ngram data...
        //console.log("Setting ranges...")
        // Get the minimum and maximum values for all ngrams
        xRange = Object.assign([], [d3.min(xmins), d3.max(xmaxes)])
        //console.log(`Setting xRange to ${xRange}`)
        if (params['metric']==='rank'){
            yRange = [1, d3.min([roundUpToSig(d3.max(ymaxes)), 1000000])]
        }
        else {
            yRange[0] = roundDownToSig(d3.min(ymins))
            yRange[1] = roundUpToSig(d3.max(ymaxes))
        }

        //console.log(`Setting yRange to ${yRange}`)
    }
}

function deepFreeze(o) {
    Object.freeze(o)
    Object.getOwnPropertyNames(o).forEach(function(prop) {
        if (o.hasOwnProperty(prop)
            && o[prop] !== null
            && (typeof o[prop] === "object" || typeof o[prop] === "function")
            && !Object.isFrozen(o[prop])) {
            deepFreeze(o[prop])
        }
    })
    return o
}

function buildLanguageDropdown(){
    d3.json('language_dropdown.json').then((data) => {
        languageCodes = data
        //console.log(data)
        const codes = []
        Object.keys(data).forEach(language => {
            codes.push(data[language]['db_code'])
            codeLookup[data[language]['db_code']]=language
            if (data[language]['db_code']===params['language']){
                //console.log(`${data[language]['db_code']} = ${params['language']}; setting language to ${language}`)
                d3.select("#langDropdown").append("option").text(language).attr("value",language).property('selected',true)
            }
            else {
                d3.select("#langDropdown").append("option").text(language).attr("value",language).property('selected',false)
            }
        })
        paramoptions['language'] = codes
    })
}

function loadDefaultDict(){
    /*d3.json('language_defaults.json').then((data) => {
        defaultDict = data
        console.log(`Language ngram defaults loaded`)
    })*/
    defaultDict = {"af": ["kun je dit", "#RWC2019", "hallo", "\ud83c\uddff\ud83c\udde6"], "sq": ["nat\u00ebn e mir\u00eb", "#kosova", "p\u00ebrsh\u00ebndetje", "\ud83c\udde6\ud83c\uddf1"], "ar": ["\u0635\u0628\u0627\u062d \u0627\u0644\u062e\u064a\u0631", "#love", "\u0647\u0647\u0647\u0647\u0647", "\ud83d\udc9b"], "an": ["bueno", "#viernes", "\u0647\u0647\u0647\u0647\u0647", "\ud83d\ude02"], "hy": ["\u057d\u056b\u0580\u0578\u0582\u0574 \u0565\u0574 \u0584\u0565\u0566", "#armenia", "\u0540\u0561\u0575\u0561\u057d\u057f\u0561\u0576\u056b", "\ud83c\udde6\ud83c\uddf2"], "ast": ["asturias", "#Oviedo", "hola", "\ud83c\uddea\ud83c\uddf8"], "az": ["ad g\u00fcn\u00fcn m\u00fcbar\u0259k", "#baku", "t\u0259brikl\u0259r", "\ud83c\udde6\ud83c\uddff"], "eu": ["maitasun", "#Enkarterri", "kaixo", "\ud83c\udf1e"], "be": ["\u042f \u0446\u044f\u0431\u0435 \u043a\u0430\u0445\u0430\u044e", "#Minsk", "\u043a\u0430\u0445\u0430\u043d\u043d\u0435", "\ud83c\udde7\ud83c\uddfe"], "bn": ["Abdul Hamid", "#dhaka", "hahaha", "\ud83c\udde7\ud83c\udde9"], "bs": ["Valentin Inzko", "#sarajevo", "zdravo", "\ud83c\udde7\ud83c\udde6"], "br": ["Breizh", "#breton", "hahaha", "\ud83c\udf84"], "bg": ["\u0427\u0435\u0440\u043d\u043e \u043c\u043e\u0440\u0435", "#Sofia", "\u0411\u043b\u0430\u0433\u043e\u0434\u0430\u0440\u044f", "\ud83c\udde7\ud83c\uddec"], "ca": ["bon any nou", "#catalonia", "divendres", "\ud83c\uddea\ud83c\uddf8"], "en": ["Black Lives Matter", "#friday", "hahaha", "\ud83e\udda0"], "fr": ["Emmanuel Macron", "#vendredi", "h\u00e9h\u00e9h\u00e9", "\ud83c\udf84"], "de": ["hahaha", "#freitag", "Herzlichen Gl\u00fcckwunsch", "\ud83c\udde9\ud83c\uddea"], "id": ["Joko Widodo", "#jumat", "wkwkwkwk", "\ud83c\uddee\ud83c\udde9"], "it": ["Serie A", "#venerd\u00ec", "hahaha", "\ud83c\uddee\ud83c\uddf9"], "jbo": ["co'o", "#lojban", "coi", "\ud83d\ude0a"], "pt": ["sexta feira", "#futebol", "kkkkk", "\ud83c\udde7\ud83c\uddf7"], "es": ["buenas noches", "#viernes", "jajaja", "\ud83c\uddf5\ud83c\uddf7"], "sv": ["Stefan L\u00f6fven", "#fredag", "hahaha", "\ud83c\uddf8\ud83c\uddea"], "tr": ["Tayyip Erdo\u011fan", "#cuma", "hahaha", "\ud83c\uddf9\ud83c\uddf7"], "uk": ["\u0404\u0432\u0440\u043e\u043c\u0430\u0439\u0434\u0430\u043d", "#\u043f\u2019\u044f\u0442\u043d\u0438\u0446\u044f", "xaxaxa", "\ud83c\uddfa\ud83c\udde6"], "vi": ["Nguy\u1ec5n Xu\u00e2n Ph\u00fac", "#hanoi", "hahaha", "\ud83c\uddfb\ud83c\uddf3"]}
    //console.log(`Language ngram defaults loaded`)
}

function downloadChart(){
    let mainChartSVG = d3.select('#mainplot').select('svg')
    //console.log('mainChartSVG.style("width"):')
    //console.log(mainChartSVG.style("width"))
    //console.log('mainChartSVG.style("height"):')
    //console.log(mainChartSVG.style("height"))
    let svgString = getSVGString(mainChartSVG.node());
    let svgWidth = parseFloat(mainChartSVG.style("width"))
    let svgHeight = parseFloat(mainChartSVG.style("height"))
    svgString2Image( svgString, svgWidth*2, svgHeight*2, 'jpg', save ); // passes Blob and filesize String to the callback
    function save( dataBlob, filesize ){
        saveAs( dataBlob, 'storywrangler_chart.jpg' ); // FileSaver.js function
    }
}

function setupPage() {
    hideloadingpanel()
    hideAlert()
    console.log(
        "   _____ _                __          __                    _           \n" +
        "  / ____| |               \\ \\        / /                   | |          \n" +
        " | (___ | |_ ___  _ __ _   \\ \\  /\\  / / __ __ _ _ __   __ _| | ___ _ __ \n" +
        "  \\___ \\| __/ _ \\| '__| | | \\ \\/  \\/ / '__/ _` | '_ \\ / _` | |/ _ \\ '__|\n" +
        "  ____) | || (_) | |  | |_| |\\  /\\  /| | | (_| | | | | (_| | |  __/ |   \n" +
        " |_____/ \\__\\___/|_|   \\__, | \\/  \\/ |_|  \\__,_|_| |_|\\__, |_|\\___|_|   \n" +
        "                        __/ |                          __/ |            \n" +
        "                       |___/                          |___/             \n\n" +
        "by @compstorylab\n\n"+
        "UI & API by Jane Adams, Data Visualization Artist\n"+
        "Interested in the code? Get in touch on Twitter @artistjaneadams\n" +
        "or check out the GitHub here: https://github.com/janeadams/storywrangler\n\n"
    )
    params['start']=defaultparams['start']
    params['end']=defaultparams['end']
    viewport = window.innerWidth
    adaptVisualScale()
    //console.log(`viewport: ${viewport}`)
    buildLanguageDropdown()
    loadDefaultDict()
    d3.select("#queryInput").attr("placeholder",`Enter a query like: ${suggestions[Math.floor(Math.random()*suggestions.length)]}`)
    getUrlParams() // Get parameters from the URL and update current parameters accordingly
    getUrlNgrams()
    initializeData()
    setFilters() // Check the correct boxes in the filter form according to the parameters
    makeCharts()
}

d3.select(window).on('resize', () => {
    viewport = window.innerWidth
    adaptVisualScale()
    redrawCharts()
})

function showloadingpanel(){
    //console.log('Showing loading panel...')
    d3.select('.loadingOverlay').attr('class','loadingOverlay shown')
        .classed('hidden',false)
    d3.select('.loadingOverlay').append('div').attr('class','loader')
}

function hideloadingpanel(){
    //console.log('Hiding loading panel...')
    d3.select('.loadingOverlay').attr('class','loadingOverlay hidden')
        .classed('shown',false)
    d3.selectAll('.loader').remove()
}

document.addEventListener('loadstart', function() {
    showloadingpanel()
})
document.addEventListener('load', function() {
    hideloadingpanel()
})

function showAlert(msg){
    console.log('Showing alert message')
    d3.selectAll('.alert').remove()
    //hideAlert()
    d3.select('.alertOverlay').attr('class','alertOverlay shown')
        .classed('hidden',false)
        .append('div').attr('class','alert').html('<p>'+msg+'</p>')
}

function hideAlert(){
    d3.select('.alertOverlay').attr('class','alertOverlay hidden')
        .classed('shown',false)
    d3.selectAll('.alert').remove()
}