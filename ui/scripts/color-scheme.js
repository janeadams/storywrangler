// Color variable names
var colornames = ["sw-ltblue", "sw-orange", "sw-green", "sw-purple", "sw-red", ]
// Fill colors
var fillnames = []
for (let i = 0; i < colornames.length; i++) { fillnames.push(str(colornames[i] + "-fill")); }
console.log("fillnames = ", fillnames)
fillcolors = ["#F3B544", "#8BC862", "#00B6CF", "#9577B5", "#EF3D25", "#3D59A8"]
// Stroke colors
strokenames = []
for (let i = 0; i < colornames.length; i++) { strokenames.push(str(colornames[i] + "-stroke")); }
console.log("strokenames = ", strokenames)
strokecolors = ["#0681A2", "#F89921", "#649946", "#8D51A0", "#A01D21", "#252E6C"]
// Zip together colors
for (let i = 0; i < colornames.length; i++) {
    color = { colorname[i]: (fillcolors[i], strokecolors[i]) }
    colors.push(color)
    console.log("colors = " + colors)
}