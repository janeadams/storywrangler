"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.contouring = contouring;
exports.hexbinning = hexbinning;
exports.heatmapping = heatmapping;
exports.trendlining = trendlining;
exports.shapeBounds = shapeBounds;

var React = _interopRequireWildcard(require("react"));

var _d3Contour = require("d3-contour");

var _d3Scale = require("d3-scale");

var _polylabel = _interopRequireDefault(require("@mapbox/polylabel"));

var _d3Hexbin = require("d3-hexbin");

var _regression = _interopRequireDefault(require("regression"));

var _d3Shape = require("d3-shape");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function contouring(_ref) {
  var summaryType = _ref.summaryType,
      data = _ref.data,
      finalXExtent = _ref.finalXExtent,
      finalYExtent = _ref.finalYExtent;
  var projectedSummaries = [];

  if (!summaryType.type) {
    summaryType = {
      type: summaryType
    };
  }

  var _summaryType = summaryType,
      _summaryType$resoluti = _summaryType.resolution,
      resolution = _summaryType$resoluti === void 0 ? 500 : _summaryType$resoluti,
      _summaryType$threshol = _summaryType.thresholds,
      thresholds = _summaryType$threshol === void 0 ? 10 : _summaryType$threshol,
      _summaryType$bandwidt = _summaryType.bandwidth,
      bandwidth = _summaryType$bandwidt === void 0 ? 20 : _summaryType$bandwidt,
      neighborhood = _summaryType.neighborhood;
  var xScale = (0, _d3Scale.scaleLinear)().domain(finalXExtent).rangeRound([0, resolution]).nice();
  var yScale = (0, _d3Scale.scaleLinear)().domain(finalYExtent).rangeRound([resolution, 0]).nice();
  data.forEach(function (contourData) {
    var contourProjectedSummaries = (0, _d3Contour.contourDensity)().size([resolution, resolution]).x(function (d) {
      return xScale(d[0]);
    }).y(function (d) {
      return yScale(d[1]);
    }).thresholds(thresholds).bandwidth(bandwidth)(contourData._xyfCoordinates);

    if (neighborhood) {
      contourProjectedSummaries = [contourProjectedSummaries[0]];
    }

    var max = Math.max.apply(Math, _toConsumableArray(contourProjectedSummaries.map(function (d) {
      return d.value;
    })));
    contourProjectedSummaries.forEach(function (summary) {
      summary.parentSummary = contourData;
      summary.bounds = [];
      summary.percent = summary.value / max;
      summary.coordinates.forEach(function (poly) {
        poly.forEach(function (subpoly, i) {
          poly[i] = subpoly.map(function (coordpair) {
            coordpair = [xScale.invert(coordpair[0]), yScale.invert(coordpair[1])];
            return coordpair;
          }); //Only push bounds for the main poly, not its interior rings, otherwise you end up labeling interior cutouts

          if (i === 0) {
            summary.bounds.push(shapeBounds(poly[i]));
          }
        });
      });
    });
    projectedSummaries = [].concat(_toConsumableArray(projectedSummaries), _toConsumableArray(contourProjectedSummaries));
  });
  return projectedSummaries;
}

function hexbinning(_ref2) {
  var _ref2$preprocess = _ref2.preprocess,
      preprocess = _ref2$preprocess === void 0 ? true : _ref2$preprocess,
      _ref2$processedData = _ref2.processedData,
      processedData = _ref2$processedData === void 0 ? false : _ref2$processedData,
      summaryType = _ref2.summaryType,
      baseData = _ref2.data,
      _ref2$finalXExtent = _ref2.finalXExtent,
      finalXExtent = _ref2$finalXExtent === void 0 ? [Math.min.apply(Math, _toConsumableArray(baseData.coordinates.map(function (d) {
    return d.x;
  }))), Math.max.apply(Math, _toConsumableArray(baseData.coordinates.map(function (d) {
    return d.x;
  })))] : _ref2$finalXExtent,
      _ref2$finalYExtent = _ref2.finalYExtent,
      finalYExtent = _ref2$finalYExtent === void 0 ? [Math.min.apply(Math, _toConsumableArray(baseData.coordinates.map(function (d) {
    return d.y;
  }))), Math.max.apply(Math, _toConsumableArray(baseData.coordinates.map(function (d) {
    return d.y;
  })))] : _ref2$finalYExtent,
      size = _ref2.size,
      _ref2$xScaleType = _ref2.xScaleType,
      xScaleType = _ref2$xScaleType === void 0 ? (0, _d3Scale.scaleLinear)() : _ref2$xScaleType,
      _ref2$yScaleType = _ref2.yScaleType,
      yScaleType = _ref2$yScaleType === void 0 ? (0, _d3Scale.scaleLinear)() : _ref2$yScaleType,
      margin = _ref2.margin,
      baseMarkProps = _ref2.baseMarkProps,
      styleFn = _ref2.styleFn,
      classFn = _ref2.classFn,
      renderFn = _ref2.renderFn,
      chartSize = _ref2.chartSize;

  if (processedData) {
    return baseData[0].coordinates;
  }

  var projectedSummaries = [];

  if (!summaryType.type) {
    summaryType = {
      type: summaryType
    };
  }

  var _summaryType2 = summaryType,
      _summaryType2$bins = _summaryType2.bins,
      bins = _summaryType2$bins === void 0 ? 0.05 : _summaryType2$bins,
      cellPx = _summaryType2.cellPx,
      _summaryType2$binValu = _summaryType2.binValue,
      binValue = _summaryType2$binValu === void 0 ? function (d) {
    return d.length;
  } : _summaryType2$binValu,
      binMax = _summaryType2.binMax,
      customMark = _summaryType2.customMark;

  if (baseData.coordinates && !baseData._xyfCoordinates) {
    baseData._xyfCoordinates = baseData.coordinates.map(function (d) {
      return [d.x, d.y];
    });
  }

  var data = Array.isArray(baseData) ? baseData : [baseData];
  var hexBinXScale = xScaleType.domain(finalXExtent).range([0, size[0]]);
  var hexBinYScale = yScaleType.domain(finalYExtent).range([0, size[1]]);
  var actualResolution = cellPx && cellPx / 2 || (bins > 1 ? 1 / bins : bins) * size[0] / 2;
  var hexbinner = (0, _d3Hexbin.hexbin)().x(function (d) {
    return hexBinXScale(d._xyfPoint[0]);
  }).y(function (d) {
    return hexBinYScale(d._xyfPoint[1]);
  }).radius(actualResolution).size(size);
  var hexMax;
  var allHexes = hexbinner.centers();
  data.forEach(function (hexbinData) {
    hexMax = 0;
    var hexes = hexbinner(hexbinData._xyfCoordinates.map(function (d, i) {
      return _objectSpread({
        _xyfPoint: d
      }, hexbinData.coordinates[i]);
    }));
    var centerHash = {};
    hexes.forEach(function (d) {
      centerHash["".concat(parseInt(d.x), "-").concat(parseInt(d.y))] = true;
    });
    allHexes.forEach(function (hexCenter) {
      if (!centerHash["".concat(parseInt(hexCenter[0]), "-").concat(parseInt(hexCenter[1]))]) {
        var newHex = [];
        newHex.x = hexCenter[0];
        newHex.y = hexCenter[1];
        hexes.push(newHex);
      }
    });
    hexMax = Math.max.apply(Math, _toConsumableArray(hexes.map(function (d) {
      return binValue(d);
    })));

    if (binMax) {
      binMax(hexMax);
    } //Option for blank hexe


    var hexBase = [[0, -1], [0.866, -0.5], [0.866, 0.5], [0, 1], [-0.866, 0.5], [-0.866, -0.5]];
    var hexWidth = hexBinXScale.invert(actualResolution) - finalXExtent[0];
    var hexHeight = hexBinYScale.invert(actualResolution) - finalYExtent[0];
    var hexacoordinates = hexBase.map(function (d) {
      return [d[0] * hexWidth, d[1] * hexHeight];
    });
    var hexbinProjectedSummaries = hexes.map(function (d) {
      var hexValue = binValue(d);
      var gx = d.x;
      var gy = d.y;
      d.x = hexBinXScale.invert(d.x);
      d.y = hexBinYScale.invert(d.y);
      var percent = hexValue / hexMax;
      return {
        customMark: customMark && React.createElement("g", {
          transform: "translate(".concat(gx, ",").concat(size[1] - gy, ")")
        }, customMark({
          d: _objectSpread({}, d, {
            binItems: d,
            percent: percent,
            value: hexValue,
            radius: actualResolution,
            hexCoordinates: hexBase.map(function (d) {
              return [d[0] * actualResolution, d[1] * actualResolution];
            })
          }),
          baseMarkProps: baseMarkProps,
          margin: margin,
          styleFn: styleFn,
          classFn: classFn,
          renderFn: renderFn,
          chartSize: chartSize,
          adjustedSize: size
        })),
        _xyfCoordinates: hexacoordinates.map(function (p) {
          return [p[0] + d.x, p[1] + d.y];
        }),
        value: hexValue,
        percent: percent,
        data: d,
        parentSummary: hexbinData,
        centroid: true
      };
    });
    projectedSummaries = [].concat(_toConsumableArray(projectedSummaries), _toConsumableArray(hexbinProjectedSummaries));
  });

  if (preprocess) {
    projectedSummaries.forEach(function (d) {
      d.x = d.data.x;
      d.y = d.data.y;
    });
    return {
      type: "hexbin",
      processedData: true,
      coordinates: projectedSummaries,
      binMax: hexMax
    };
  }

  return projectedSummaries;
} // ADD PRECALC AND EXPOSE PRECALC FUNCTION


function heatmapping(_ref3) {
  var _ref3$preprocess = _ref3.preprocess,
      preprocess = _ref3$preprocess === void 0 ? true : _ref3$preprocess,
      _ref3$processedData = _ref3.processedData,
      processedData = _ref3$processedData === void 0 ? false : _ref3$processedData,
      summaryType = _ref3.summaryType,
      baseData = _ref3.data,
      _ref3$finalXExtent = _ref3.finalXExtent,
      finalXExtent = _ref3$finalXExtent === void 0 ? [Math.min.apply(Math, _toConsumableArray(baseData.coordinates.map(function (d) {
    return d.x;
  }))), Math.max.apply(Math, _toConsumableArray(baseData.coordinates.map(function (d) {
    return d.x;
  })))] : _ref3$finalXExtent,
      _ref3$finalYExtent = _ref3.finalYExtent,
      finalYExtent = _ref3$finalYExtent === void 0 ? [Math.min.apply(Math, _toConsumableArray(baseData.coordinates.map(function (d) {
    return d.y;
  }))), Math.max.apply(Math, _toConsumableArray(baseData.coordinates.map(function (d) {
    return d.y;
  })))] : _ref3$finalYExtent,
      size = _ref3.size,
      _ref3$xScaleType = _ref3.xScaleType,
      xScaleType = _ref3$xScaleType === void 0 ? (0, _d3Scale.scaleLinear)() : _ref3$xScaleType,
      _ref3$yScaleType = _ref3.yScaleType,
      yScaleType = _ref3$yScaleType === void 0 ? (0, _d3Scale.scaleLinear)() : _ref3$yScaleType,
      margin = _ref3.margin,
      baseMarkProps = _ref3.baseMarkProps,
      styleFn = _ref3.styleFn,
      classFn = _ref3.classFn,
      renderFn = _ref3.renderFn,
      chartSize = _ref3.chartSize;

  if (processedData) {
    return baseData[0].coordinates;
  }

  if (baseData.coordinates && !baseData._xyfCoordinates) {
    baseData._xyfCoordinates = baseData.coordinates.map(function (d) {
      return [d.x, d.y];
    });
  }

  var data = Array.isArray(baseData) ? baseData : [baseData];
  var projectedSummaries = [];

  if (!summaryType.type) {
    summaryType = {
      type: summaryType
    };
  }

  var _summaryType3 = summaryType,
      _summaryType3$binValu = _summaryType3.binValue,
      binValue = _summaryType3$binValu === void 0 ? function (d) {
    return d.length;
  } : _summaryType3$binValu,
      _summaryType3$xBins = _summaryType3.xBins,
      xBins = _summaryType3$xBins === void 0 ? summaryType.yBins || 0.05 : _summaryType3$xBins,
      _summaryType3$yBins = _summaryType3.yBins,
      yBins = _summaryType3$yBins === void 0 ? xBins : _summaryType3$yBins,
      _summaryType3$xCellPx = _summaryType3.xCellPx,
      xCellPx = _summaryType3$xCellPx === void 0 ? !summaryType.xBins && summaryType.yCellPx : _summaryType3$xCellPx,
      _summaryType3$yCellPx = _summaryType3.yCellPx,
      yCellPx = _summaryType3$yCellPx === void 0 ? !summaryType.yBins && xCellPx : _summaryType3$yCellPx,
      customMark = _summaryType3.customMark,
      binMax = _summaryType3.binMax;
  var xBinPercent = xBins < 1 ? xBins : 1 / xBins;
  var yBinPercent = yBins < 1 ? yBins : 1 / yBins;
  var heatmapBinXScale = xScaleType.domain(finalXExtent).range([0, size[0]]);
  var heatmapBinYScale = yScaleType.domain(finalYExtent).range([size[1], 0]);
  var actualResolution = [Math.ceil((xCellPx && xCellPx / size[0] || xBinPercent) * size[0] * 10) / 10, Math.ceil((yCellPx && yCellPx / size[1] || yBinPercent) * size[1] * 10) / 10];
  var maxValue = -Infinity;
  data.forEach(function (heatmapData) {
    var grid = [];
    var flatGrid = [];
    var cell;
    var gridColumn;

    for (var i = 0; i < size[0]; i += actualResolution[0]) {
      var _x = heatmapBinXScale.invert(i);

      var x1 = heatmapBinXScale.invert(i + actualResolution[0]);
      gridColumn = [];
      grid.push(gridColumn);

      for (var j = 0; j < size[1]; j += actualResolution[1]) {
        var _y = heatmapBinYScale.invert(j);

        var y1 = heatmapBinYScale.invert(j + actualResolution[1]);
        cell = {
          gx: i,
          gy: j,
          gw: actualResolution[0],
          gh: actualResolution[1],
          x: (_x + x1) / 2,
          y: (_y + y1) / 2,
          binItems: [],
          value: 0,
          _xyfCoordinates: [[_x, _y], [x1, _y], [x1, y1], [_x, y1]],
          parentSummary: heatmapData
        };
        gridColumn.push(cell);
        flatGrid.push(cell);
      }

      gridColumn.push(cell);
    }

    grid.push(gridColumn);

    heatmapData._xyfCoordinates.forEach(function (d, di) {
      var xCoordinate = Math.floor(heatmapBinXScale(d[0]) / actualResolution[0]);
      var yCoordinate = Math.floor(heatmapBinYScale(d[1]) / actualResolution[1]);
      grid[xCoordinate][yCoordinate].binItems.push(heatmapData.coordinates[di]);
    });

    flatGrid.forEach(function (d) {
      d.value = binValue(d.binItems);
      maxValue = Math.max(maxValue, d.value);
    });
    flatGrid.forEach(function (d) {
      d.percent = d.value / maxValue;
      d.customMark = customMark && React.createElement("g", {
        transform: "translate(".concat(d.gx, ",").concat(d.gy, ")")
      }, customMark({
        d: d,
        baseMarkProps: baseMarkProps,
        margin: margin,
        styleFn: styleFn,
        classFn: classFn,
        renderFn: renderFn,
        chartSize: chartSize,
        adjustedSize: size
      }));
    });
    projectedSummaries = [].concat(_toConsumableArray(projectedSummaries), flatGrid);
  });

  if (binMax) {
    binMax(maxValue);
  }

  if (preprocess) {
    return {
      type: "heatmap",
      processedData: true,
      coordinates: projectedSummaries,
      binMax: maxValue
    };
  }

  return projectedSummaries;
}

function trendlining(_ref4) {
  var _ref4$preprocess = _ref4.preprocess,
      preprocess = _ref4$preprocess === void 0 ? true : _ref4$preprocess,
      _ref4$processedData = _ref4.processedData,
      processedData = _ref4$processedData === void 0 ? false : _ref4$processedData,
      summaryType = _ref4.summaryType,
      baseData = _ref4.data,
      _ref4$finalXExtent = _ref4.finalXExtent,
      finalXExtent = _ref4$finalXExtent === void 0 ? [Math.min.apply(Math, _toConsumableArray(baseData.coordinates.map(function (d) {
    return d.x;
  }))), Math.max.apply(Math, _toConsumableArray(baseData.coordinates.map(function (d) {
    return d.x;
  })))] : _ref4$finalXExtent,
      _ref4$finalYExtent = _ref4.finalYExtent,
      finalYExtent = _ref4$finalYExtent === void 0 ? [Math.min.apply(Math, _toConsumableArray(baseData.coordinates.map(function (d) {
    return d.y;
  }))), Math.max.apply(Math, _toConsumableArray(baseData.coordinates.map(function (d) {
    return d.y;
  })))] : _ref4$finalYExtent,
      size = _ref4.size,
      _ref4$xScaleType = _ref4.xScaleType,
      xScaleType = _ref4$xScaleType === void 0 ? (0, _d3Scale.scaleLinear)() : _ref4$xScaleType,
      _ref4$yScaleType = _ref4.yScaleType,
      yScaleType = _ref4$yScaleType === void 0 ? (0, _d3Scale.scaleLinear)() : _ref4$yScaleType,
      margin = _ref4.margin,
      baseMarkProps = _ref4.baseMarkProps,
      styleFn = _ref4.styleFn,
      classFn = _ref4.classFn,
      renderFn = _ref4.renderFn,
      chartSize = _ref4.chartSize;

  if (processedData) {
    return baseData[0].coordinates;
  }

  var projectedSummaries = [];

  if (!summaryType.type) {
    summaryType = {
      type: summaryType
    };
  }

  var _summaryType4 = summaryType,
      _summaryType4$regress = _summaryType4.regressionType,
      baseRegressionType = _summaryType4$regress === void 0 ? "linear" : _summaryType4$regress,
      _summaryType4$order = _summaryType4.order,
      order = _summaryType4$order === void 0 ? 2 : _summaryType4$order,
      _summaryType4$precisi = _summaryType4.precision,
      precision = _summaryType4$precisi === void 0 ? 4 : _summaryType4$precisi,
      _summaryType4$control = _summaryType4.controlPoints,
      controlPoints = _summaryType4$control === void 0 ? 20 : _summaryType4$control,
      _summaryType4$curve = _summaryType4.curve,
      curve = _summaryType4$curve === void 0 ? _d3Shape.curveCardinal : _summaryType4$curve;
  var regressionType = baseRegressionType;

  if (finalXExtent[0] < 0 && (baseRegressionType === "logarithmic" || baseRegressionType === "power" || baseRegressionType === "exponential")) {
    console.error("Cannot use this ".concat(baseRegressionType, " regressionType type with value range that goes below 0, defaulting to linear"));
    regressionType = "linear";
  }

  if (baseData.coordinates && !baseData._xyfCoordinates) {
    baseData._xyfCoordinates = baseData.coordinates.map(function (d) {
      return [d.x, d.y];
    });
  }

  var data = Array.isArray(baseData) ? baseData : [baseData];
  var xScale = xScaleType.domain([0, 1]).range(finalXExtent);
  projectedSummaries = [];
  data.forEach(function (bdata) {
    var regressionLine = _regression.default[regressionType](bdata._xyfCoordinates.map(function (d) {
      return [d[0].getTime ? d[0].getTime() : d[0], d[1].getTime ? d[1].getTime() : d[1]];
    }), {
      order: order,
      precision: precision
    });

    var controlStep = 1 / controlPoints;
    var steps = [0, 1];

    if (regressionType !== "linear") {
      steps = [];

      for (var step = 0; step < 1 + controlStep; step += controlStep) {
        steps.push(step);
      }
    }

    var controlPointArray = [];
    steps.forEach(function (controlPoint) {
      controlPointArray.push(regressionLine.predict(xScale(controlPoint)));
    });
    projectedSummaries.push({
      centroid: false,
      customMark: undefined,
      data: bdata,
      parentSummary: bdata,
      value: regressionLine.string,
      r2: regressionLine.r2,
      curve: curve,
      _xyfCoordinates: controlPointArray
    });
  });
  return projectedSummaries;
}

function shapeBounds(coordinates) {
  var left = [Infinity, 0];
  var right = [-Infinity, 0];
  var top = [0, Infinity];
  var bottom = [0, -Infinity];
  coordinates.forEach(function (d) {
    left = d[0] < left[0] ? d : left;
    right = d[0] > right[0] ? d : right;
    bottom = d[1] > bottom[1] ? d : bottom;
    top = d[1] < top[1] ? d : top;
  });
  return {
    center: (0, _polylabel.default)([coordinates]),
    top: top,
    left: left,
    right: right,
    bottom: bottom
  };
}