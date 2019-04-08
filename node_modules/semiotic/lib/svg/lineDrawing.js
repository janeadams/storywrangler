"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.funnelize = funnelize;
exports.relativeY = relativeY;
exports.relativeX = relativeX;
exports.findPointByID = findPointByID;
exports.dividedLine = exports.bumpChart = exports.cumulativeLine = exports.lineChart = exports.stackedArea = exports.differenceLine = exports.projectLineData = exports.projectSummaryData = void 0;

var _react = _interopRequireDefault(require("react"));

var _d3Array = require("d3-array");

var _multiAccessorUtils = require("../data/multiAccessorUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var datesForUnique = function datesForUnique(d) {
  return d instanceof Date ? d.getTime() : d;
};

var projectSummaryData = function projectSummaryData(_ref) {
  var data = _ref.data,
      summaryDataAccessor = _ref.summaryDataAccessor,
      xAccessor = _ref.xAccessor,
      yAccessor = _ref.yAccessor;
  var projectedData = [];
  summaryDataAccessor.forEach(function (actualSummaryAccessor) {
    xAccessor.forEach(function (actualXAccessor) {
      yAccessor.forEach(function (actualYAccessor) {
        var projection = function projection(d) {
          return actualSummaryAccessor(d).map(function (p, q) {
            return [actualXAccessor(p, q), actualYAccessor(p, q)];
          });
        };

        data.forEach(function (d) {
          projectedData.push(_objectSpread({}, d, {
            _baseData: actualSummaryAccessor(d),
            _xyfCoordinates: projection(d)
          }));
        });
      });
    });
  });
  return projectedData;
};

exports.projectSummaryData = projectSummaryData;

var projectLineData = function projectLineData(_ref2) {
  var data = _ref2.data,
      lineDataAccessor = _ref2.lineDataAccessor,
      xProp = _ref2.xProp,
      yProp = _ref2.yProp,
      yPropTop = _ref2.yPropTop,
      yPropBottom = _ref2.yPropBottom,
      xAccessor = _ref2.xAccessor,
      yAccessor = _ref2.yAccessor;

  if (!Array.isArray(data)) {
    data = [data];
  }

  var projectedLine = [];
  lineDataAccessor.forEach(function (actualLineAccessor, lineIndex) {
    xAccessor.forEach(function (actualXAccessor, xIndex) {
      yAccessor.forEach(function (actualYAccessor, yIndex) {
        data.forEach(function (d) {
          var originalLineData = _objectSpread({}, d, {
            xIndex: xIndex,
            yIndex: yIndex,
            lineIndex: lineIndex
          });

          originalLineData.data = actualLineAccessor(d).map(function (p, q) {
            var originalCoords = {
              data: p
            };
            originalCoords[xProp] = actualXAccessor(p, q);
            originalCoords[yProp] = actualYAccessor(p, q);
            originalCoords[yPropTop] = originalCoords[yProp];
            originalCoords[yPropBottom] = originalCoords[yProp];
            return originalCoords;
          });
          originalLineData.key = originalLineData.key || projectedLine.length;
          projectedLine.push(originalLineData);
        });
      });
    });
  });
  return projectedLine;
};

exports.projectLineData = projectLineData;

var differenceLine = function differenceLine(_ref3) {
  var data = _ref3.data,
      yProp = _ref3.yProp,
      yPropTop = _ref3.yPropTop,
      yPropBottom = _ref3.yPropBottom;
  data.forEach(function (l, i) {
    l.data.forEach(function (point, q) {
      var otherLine = i === 0 ? 1 : 0;

      if (point[yProp] > data[otherLine].data[q][yProp]) {
        point[yPropBottom] = data[otherLine].data[q][yProp];
        point[yPropTop] = point[yProp];
      } else {
        point[yPropTop] = point[yProp];
        point[yPropBottom] = point[yProp];
      }
    });
  });
  return data;
};

exports.differenceLine = differenceLine;

var stackedArea = function stackedArea(_ref4) {
  var _ref4$type = _ref4.type,
      type = _ref4$type === void 0 ? "stackedarea" : _ref4$type,
      data = _ref4.data,
      xProp = _ref4.xProp,
      yProp = _ref4.yProp,
      yPropMiddle = _ref4.yPropMiddle,
      sort = _ref4.sort,
      yPropTop = _ref4.yPropTop,
      yPropBottom = _ref4.yPropBottom;
  var uniqXValues = data.map(function (d) {
    return d.data.map(function (p) {
      return datesForUnique(p[xProp]);
    });
  }).reduce(function (a, b) {
    return a.concat(b);
  }, []).reduce(function (p, c) {
    if (p.indexOf(c) === -1) {
      p.push(c);
    }

    return p;
  }, []);

  var stackSort = function stackSort(a, b) {
    return (0, _d3Array.sum)(b.data.map(function (p) {
      return p[yProp];
    })) - (0, _d3Array.sum)(a.data.map(function (p) {
      return p[yProp];
    }));
  };

  if (type === "stackedpercent-invert" || type === "stackedarea-invert") {
    stackSort = function stackSort(a, b) {
      return (0, _d3Array.sum)(a.data.map(function (p) {
        return p[yProp];
      })) - (0, _d3Array.sum)(b.data.map(function (p) {
        return p[yProp];
      }));
    };
  }

  sort = sort === undefined ? stackSort : sort;

  if (sort !== null) {
    data = data.sort(sort);
  }

  uniqXValues.forEach(function (xValue) {
    var negativeOffset = 0;
    var positiveOffset = 0;
    var stepValues = data.map(function (d) {
      return d.data.filter(function (p) {
        return datesForUnique(p[xProp]) === xValue;
      });
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []);
    var positiveStepTotal = (0, _d3Array.sum)(stepValues.map(function (d) {
      return d[yProp] > 0 ? d[yProp] : 0;
    }));
    var negativeStepTotal = (0, _d3Array.sum)(stepValues.map(function (d) {
      return d[yProp] < 0 ? d[yProp] : 0;
    }));
    stepValues.forEach(function (l) {
      if (l[yProp] < 0) {
        if (type === "linepercent" || type === "stackedpercent" || type === "stackedpercent-invert") {
          var percent = l[yProp] / negativeStepTotal;
          l.percent = percent;

          if (type === "linepercent") {
            l[yPropBottom] = l[yPropBottom] = l[yPropTop] = l[yPropMiddle] = percent;
          } else {
            var adjustment = negativeStepTotal >= 0 ? 0 : percent;
            l[yPropBottom] = negativeStepTotal === 0 ? 0 : -(negativeOffset / negativeStepTotal);
            l[yPropTop] = l[yPropBottom] - adjustment;
            l[yPropMiddle] = l[yPropBottom] - adjustment / 2;
          }
        } else {
          l[yPropBottom] = negativeOffset;
          l[yPropTop] = negativeOffset + l[yProp];
          l[yPropMiddle] = negativeOffset + l[yProp] / 2;
        }

        negativeOffset += l[yProp];
      } else {
        if (type === "linepercent" || type === "stackedpercent" || type === "stackedpercent-invert") {
          var _percent = l[yProp] / positiveStepTotal;

          l.percent = _percent;

          if (type === "linepercent") {
            l[yPropBottom] = l[yPropTop] = l[yPropMiddle] = _percent;
          } else {
            var _adjustment = positiveStepTotal <= 0 ? 0 : _percent;

            l[yPropBottom] = positiveStepTotal === 0 ? 0 : positiveOffset / positiveStepTotal;
            l[yPropTop] = l[yPropBottom] + _adjustment;
            l[yPropMiddle] = l[yPropBottom] + _adjustment / 2;
          }
        } else {
          l[yPropBottom] = positiveOffset;
          l[yPropTop] = positiveOffset + l[yProp];
          l[yPropMiddle] = positiveOffset + l[yProp] / 2;
        }

        positiveOffset += l[yProp];
      }
    });
  });
  return data;
};

exports.stackedArea = stackedArea;

var lineChart = function lineChart(_ref5) {
  var data = _ref5.data,
      y1 = _ref5.y1,
      yPropTop = _ref5.yPropTop,
      yPropMiddle = _ref5.yPropMiddle,
      yPropBottom = _ref5.yPropBottom;

  if (y1) {
    data.forEach(function (d) {
      d.data.forEach(function (p) {
        p[yPropBottom] = y1(p);
        p[yPropMiddle] = p[yPropBottom] + p[yPropTop] / 2;
      });
    });
  }

  return data;
};

exports.lineChart = lineChart;

var cumulativeLine = function cumulativeLine(_ref6) {
  var data = _ref6.data,
      yPropTop = _ref6.yPropTop,
      yPropMiddle = _ref6.yPropMiddle,
      yPropBottom = _ref6.yPropBottom,
      _ref6$type = _ref6.type,
      type = _ref6$type === void 0 ? "cumulative" : _ref6$type;
  data.forEach(function (d) {
    var cumulativeValue = 0;
    var dataArray = type === "cumulative-reverse" ? d.data.reverse() : d.data;
    dataArray.forEach(function (p) {
      cumulativeValue += p[yPropTop];
      p[yPropBottom] = p[yPropTop] = p[yPropMiddle] = cumulativeValue;
    });
  });
  return data;
};

exports.cumulativeLine = cumulativeLine;

var bumpChart = function bumpChart(_ref7) {
  var _ref7$type = _ref7.type,
      type = _ref7$type === void 0 ? "bumpline" : _ref7$type,
      data = _ref7.data,
      xProp = _ref7.xProp,
      yProp = _ref7.yProp,
      yPropMiddle = _ref7.yPropMiddle,
      yPropTop = _ref7.yPropTop,
      yPropBottom = _ref7.yPropBottom;
  var uniqXValues = data.map(function (d) {
    return d.data.map(function (p) {
      return datesForUnique(p[xProp]);
    });
  }).reduce(function (a, b) {
    return a.concat(b);
  }, []).reduce(function (p, c) {
    if (p.indexOf(c) === -1) {
      p.push(c);
    }

    return p;
  }, []);

  var bumpSort = function bumpSort(a, b) {
    if (a[yProp] > b[yProp]) {
      return 1;
    }

    if (a[yProp] < b[yProp]) {
      return -1;
    }

    return -1;
  };

  if (type === "bumparea-invert" || type === "bumpline-invert") {
    bumpSort = function bumpSort(a, b) {
      if (a[yProp] < b[yProp]) {
        return 1;
      }

      if (a[yProp] > b[yProp]) {
        return -1;
      }

      return -1;
    };
  }

  uniqXValues.forEach(function (xValue) {
    var negativeOffset = 0;
    var positiveOffset = 0;
    data.map(function (d) {
      return d.data.filter(function (p) {
        return datesForUnique(p[xProp]) === xValue;
      });
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []).sort(bumpSort).forEach(function (l, rank) {
      //determine ranking and offset by the number of less than this one at each step
      l._XYFrameRank = rank + 1;

      if (type === "bumparea" || type === "bumparea-invert") {
        if (l[yProp] < 0) {
          l[yPropTop] = negativeOffset + l[yProp];
          l[yPropMiddle] = negativeOffset + l[yProp] / 2;
          l[yPropBottom] = negativeOffset;
          negativeOffset += l[yProp];
        } else {
          l[yPropTop] = positiveOffset + l[yProp];
          l[yPropMiddle] = positiveOffset + l[yProp] / 2;
          l[yPropBottom] = positiveOffset;
          positiveOffset += l[yProp];
        }
      } else {
        l[yProp] = rank + 1;
        l[yPropTop] = rank + 1;
        l[yPropBottom] = rank + 1;
      }
    });
  });
  return data;
};

exports.bumpChart = bumpChart;

var dividedLine = function dividedLine(parameters, points) {
  var searchIterations = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  var currentParameters = parameters(points[0], 0);
  var currentPointsArray = [];
  var dividedLinesData = [{
    key: currentParameters,
    points: currentPointsArray
  }];
  points.forEach(function (point, pointI) {
    var newParameters = parameters(point, pointI);
    var matchingParams = newParameters === currentParameters;
    var stringNewParams = JSON.stringify(newParameters);
    var stringCurrentParams = JSON.stringify(currentParameters);

    if (_typeof(currentParameters) === "object") {
      matchingParams = stringNewParams === stringCurrentParams;
    }

    if (matchingParams) {
      currentPointsArray.push(point);
    } else {
      var lastPoint = currentPointsArray[currentPointsArray.length - 1];
      var pointA = lastPoint;
      var pointB = point;
      var stringBParams = stringNewParams;
      var x = 0;

      while (x < searchIterations && stringNewParams === stringBParams) {
        var keys = Object.keys(pointA);
        var findPoints = simpleSearchFunction({
          pointA: pointA,
          pointB: pointB,
          currentParameters: currentParameters,
          parameters: parameters,
          keys: keys
        });
        pointA = findPoints[0];
        pointB = findPoints[1];
        stringBParams = JSON.stringify(parameters(pointB));
        x++;
      }

      currentPointsArray.push(pointB);
      currentPointsArray = [pointB, point];
      dividedLinesData.push({
        key: newParameters,
        points: currentPointsArray
      });
      currentParameters = newParameters;
    }
  });
  return dividedLinesData;
};

exports.dividedLine = dividedLine;

function simpleSearchFunction(_ref8) {
  var pointA = _ref8.pointA,
      pointB = _ref8.pointB,
      currentParameters = _ref8.currentParameters,
      parameters = _ref8.parameters,
      keys = _ref8.keys;
  var betweenPoint = {};
  keys.forEach(function (key) {
    betweenPoint[key] = typeof pointA[key] === "number" ? (pointA[key] + pointB[key]) / 2 : undefined;
  });
  var stringBetween = JSON.stringify(parameters(betweenPoint));
  var stringCurrent = JSON.stringify(currentParameters);

  if (stringBetween === stringCurrent) {
    return [betweenPoint, pointB];
  }

  return [pointA, betweenPoint];
}

function funnelize(_ref9) {
  var data = _ref9.data,
      steps = _ref9.steps,
      key = _ref9.key;
  var funnelData = [];

  if (!Array.isArray(data)) {
    data = [data];
  }

  if (!steps) {
    steps = data.map(function (d) {
      return Object.keys(d);
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []);
  }

  data.forEach(function (datum, i) {
    var datumKey = key ? datum[key] : i;
    steps.forEach(function (step) {
      var funnelDatum = {
        funnelKey: datumKey,
        stepName: "",
        stepValue: 0
      };
      funnelDatum.stepName = step;
      funnelDatum.stepValue = datum[step] ? datum[step] : 0;
      funnelData.push(funnelDatum);
    });
  });
  return funnelData;
}

var whichPoint = {
  bottom: "yBottom",
  top: "yTop"
};

function relativeY(_ref10) {
  var point = _ref10.point,
      projectedY = _ref10.projectedY,
      yAccessor = _ref10.yAccessor,
      yScale = _ref10.yScale,
      showLinePoints = _ref10.showLinePoints;
  var baseData = point && (showLinePoints && showLinePoints !== true && point[whichPoint[showLinePoints]] !== undefined ? point[whichPoint[showLinePoints]] : point.yMiddle !== undefined ? point.yMiddle : point[projectedY] !== undefined ? point[projectedY] : (0, _multiAccessorUtils.findFirstAccessorValue)(yAccessor, point));

  if (Array.isArray(baseData)) {
    return baseData.map(function (d) {
      return yScale(d);
    });
  }

  return baseData !== undefined ? yScale(baseData) : 0;
}

function relativeX(_ref11) {
  var point = _ref11.point,
      projectedXMiddle = _ref11.projectedXMiddle,
      projectedX = _ref11.projectedX,
      xAccessor = _ref11.xAccessor,
      xScale = _ref11.xScale;
  var baseData = point && (point[projectedXMiddle] !== undefined ? point[projectedXMiddle] : point[projectedX] !== undefined ? point[projectedX] : (0, _multiAccessorUtils.findFirstAccessorValue)(xAccessor, point));

  if (Array.isArray(baseData)) {
    return baseData.map(function (d) {
      return xScale(d);
    });
  }

  return baseData !== undefined ? xScale(baseData) : 0;
}

function findPointByID(_ref12) {
  var point = _ref12.point,
      idAccessor = _ref12.idAccessor,
      lines = _ref12.lines,
      xScale = _ref12.xScale,
      projectedX = _ref12.projectedX,
      xAccessor = _ref12.xAccessor;
  var pointID = idAccessor(point.parentLine || point);

  if (pointID) {
    var thisLine = lines.data.find(function (l) {
      return idAccessor(l) === pointID;
    });

    if (!thisLine) {
      return null;
    }

    var pointX = xScale((0, _multiAccessorUtils.findFirstAccessorValue)(xAccessor, point));
    var thisPoint = thisLine.data.find(function (p) {
      return xScale(p[projectedX]) === pointX;
    });

    if (!thisPoint) {
      return null;
    }

    var newPoint = _objectSpread({}, point, thisPoint, thisPoint.data, {
      parentLine: thisLine
    });

    var reactAnnotationProps = ["type", "label", "note", "connector", "disabled", "color", "subject"];
    reactAnnotationProps.forEach(function (prop) {
      if (point[prop]) newPoint[prop] = point[prop];
    });
    return newPoint;
  }

  return point;
}