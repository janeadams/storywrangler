"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linearRibbon = linearRibbon;
exports.groupBarMark = exports.hexToRgb = exports.wrap = exports.drawAreaConnector = exports.arcTweener = void 0;

var React = _interopRequireWildcard(require("react"));

var _d3Selection = require("d3-selection");

var _d3Shape = require("d3-shape");

var _semioticMark = require("semiotic-mark");

var _d3Interpolate = require("d3-interpolate");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var emptyObjectReturnFn = function emptyObjectReturnFn() {
  return {};
};

var twoPI = Math.PI * 2;

var dedupeRibbonPoints = function dedupeRibbonPoints() {
  var weight = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  return function (p, c) {
    var l = p[p.length - 1];

    if (!l || Math.round(l.x / weight) !== Math.round(c.x / weight) || Math.round(l.y / weight) !== Math.round(c.y / weight)) {
      p.push(c);
    }

    return p;
  };
};

var arcTweener = function arcTweener(oldProps, newProps) {
  var innerRadiusInterpolator = (0, _d3Interpolate.interpolateNumber)(oldProps.innerRadius, newProps.innerRadius);
  var outerRadiusInterpolator = (0, _d3Interpolate.interpolateNumber)(oldProps.outerRadius, newProps.outerRadius);
  var startAngleInterpolator = (0, _d3Interpolate.interpolateNumber)(oldProps.startAngle, newProps.startAngle);
  var endAngleInterpolator = (0, _d3Interpolate.interpolateNumber)(oldProps.endAngle, newProps.endAngle);
  return function (t) {
    var sliceGenerator = (0, _d3Shape.arc)().innerRadius(innerRadiusInterpolator(t)).outerRadius(outerRadiusInterpolator(t));
    return sliceGenerator({
      startAngle: startAngleInterpolator(t),
      endAngle: endAngleInterpolator(t)
    });
  };
};

exports.arcTweener = arcTweener;

var drawAreaConnector = function drawAreaConnector(_ref) {
  var x1 = _ref.x1,
      x2 = _ref.x2,
      y1 = _ref.y1,
      y2 = _ref.y2,
      sizeX1 = _ref.sizeX1,
      sizeY1 = _ref.sizeY1,
      sizeX2 = _ref.sizeX2,
      sizeY2 = _ref.sizeY2;
  return "M".concat(x1, ",").concat(y1, "L").concat(x2, ",").concat(y2, "L").concat(x2 + sizeX2, ",").concat(y2 + sizeY2, "L").concat(x1 + sizeX1, ",").concat(y1 + sizeY1, "Z");
};

exports.drawAreaConnector = drawAreaConnector;

var wrap = function wrap(text, width) {
  text.each(function () {
    var textNode = (0, _d3Selection.select)(this),
        words = textNode.text().split(/\s+/).reverse(),
        lineHeight = 1.1,
        // ems
    y = textNode.attr("y"),
        dy = parseFloat(textNode.attr("dy"));
    var word,
        wordline = [],
        lineNumber = 0,
        tspan = textNode.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", "".concat(dy, "em"));

    while (words.length > 0) {
      word = words.pop();
      wordline.push(word);
      tspan.text(wordline.join(" "));

      if (tspan.node().getComputedTextLength() > width) {
        wordline.pop();
        tspan.text(wordline.join(" "));
        wordline = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", "".concat(++lineNumber * lineHeight + dy, "em")).text(word);
      }
    }
  });
};

exports.wrap = wrap;

var hexToRgb = function hexToRgb(hex) {
  if (hex.substr(0, 2).toLowerCase() === "rg") {
    return hex.split("(")[1].split(")")[0].split(",");
  }

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0];
};

exports.hexToRgb = hexToRgb;

var groupBarMark = function groupBarMark(_ref2) {
  var bins = _ref2.bins,
      binMax = _ref2.binMax,
      relativeBuckets = _ref2.relativeBuckets,
      columnWidth = _ref2.columnWidth,
      projection = _ref2.projection,
      adjustedSize = _ref2.adjustedSize,
      summaryI = _ref2.summaryI,
      summary = _ref2.summary,
      renderValue = _ref2.renderValue,
      summaryStyle = _ref2.summaryStyle,
      type = _ref2.type,
      baseMarkProps = _ref2.baseMarkProps;
  var mappedBins = [];
  var mappedPoints = [];
  var actualMax = relativeBuckets && relativeBuckets[summary.name] || binMax;
  var summaryElementStylingFn = type.elementStyleFn || emptyObjectReturnFn;
  var barPadding = type.padding || 0;
  bins.forEach(function (d, i) {
    var opacity = d.value / actualMax;
    var additionalStyle = summaryElementStylingFn(d.value, opacity, d.pieces);
    var finalStyle = type.type === "heatmap" ? _objectSpread({
      opacity: opacity,
      fill: summaryStyle.fill
    }, additionalStyle) : _objectSpread({}, summaryStyle, additionalStyle);
    var thickness = Math.max(1, d.y1 - barPadding * 2);
    var finalColumnWidth = type.type === "heatmap" ? columnWidth : columnWidth * opacity;
    var yProp = d.y + barPadding;
    var xProp = type.type === "heatmap" || type.flip ? -columnWidth / 2 : columnWidth / 2 - finalColumnWidth;
    var height = thickness;
    var width = finalColumnWidth;
    var xOffset = type.type === "heatmap" ? finalColumnWidth / 2 : finalColumnWidth;
    var yOffset = d.y1 / 2;

    if (projection === "horizontal") {
      yProp = type.type === "heatmap" ? -columnWidth / 2 : type.flip ? -columnWidth / 2 : columnWidth / 2 - finalColumnWidth;
      xProp = d.y - d.y1 + barPadding;
      height = finalColumnWidth;
      width = thickness;
      yOffset = type.type === "heatmap" ? finalColumnWidth / 2 : finalColumnWidth;
      xOffset = d.y1 / 2;
    } else if (projection === "radial") {
      var arcGenerator = (0, _d3Shape.arc)().innerRadius(d.y / 2).outerRadius((d.y + d.y1) / 2);
      var angle = summary.pct - summary.pct_padding;
      var startAngle = summary.pct_middle - summary.pct_padding;
      var endAngle = type.type === "heatmap" ? startAngle + angle : startAngle + angle * opacity;
      startAngle *= twoPI;
      endAngle *= twoPI;
      var arcAdjustX = adjustedSize[0] / 2;
      var arcAdjustY = adjustedSize[1] / 2;
      var arcTranslate = "translate(".concat(arcAdjustX, ",").concat(arcAdjustY, ")");
      var arcCenter = arcGenerator.centroid({
        startAngle: startAngle,
        endAngle: endAngle
      });
      mappedPoints.push({
        key: summary.name,
        value: d.value,
        pieces: d.pieces.map(function (p) {
          return p.piece;
        }),
        label: "Heatmap",
        x: arcCenter[0] + arcAdjustX,
        y: arcCenter[1] + arcAdjustY
      });
      mappedBins.push(React.createElement(_semioticMark.Mark, _extends({}, baseMarkProps, {
        markType: "path",
        transform: arcTranslate,
        renderMode: renderValue,
        key: "groupIcon-".concat(summaryI, "-").concat(i),
        d: arcGenerator({
          startAngle: startAngle,
          endAngle: endAngle
        }),
        style: finalStyle
      })));
    }

    if (projection !== "radial") {
      mappedPoints.push({
        key: summary.name,
        value: d.value,
        pieces: d.pieces.map(function (p) {
          return p.piece;
        }),
        label: "Heatmap",
        x: xProp + xOffset,
        y: yProp + yOffset
      });
      mappedBins.push(React.createElement(_semioticMark.Mark, _extends({}, baseMarkProps, {
        markType: "rect",
        renderMode: renderValue,
        key: "groupIcon-".concat(summaryI, "-").concat(i),
        x: xProp,
        y: yProp,
        height: height,
        width: width,
        style: finalStyle
      })));
    }
  });
  return {
    marks: mappedBins,
    points: mappedPoints
  };
}; // FROM d3-svg-ribbon


exports.groupBarMark = groupBarMark;

function linearRibbon() {
  var _lineConstructor = (0, _d3Shape.line)();

  var _xAccessor = function _xAccessor(d) {
    return d.x;
  };

  var _yAccessor = function _yAccessor(d) {
    return d.y;
  };

  var _rAccessor = function _rAccessor(d) {
    return d.r;
  };

  var _interpolator = _d3Shape.curveLinearClosed;

  function _ribbon(pathData) {
    if (pathData.multiple) {
      var original_r = _rAccessor;
      var parallelTotal = pathData.multiple.reduce(function (p, c) {
        return p + c.weight;
      }, 0);

      _rAccessor = function _rAccessor() {
        return parallelTotal;
      };

      var totalPoints = buildRibbon(pathData.points);
      var currentPoints = totalPoints.filter(function (d) {
        return d.direction === "forward";
      }).reduce(dedupeRibbonPoints(), []);
      var allRibbons = [];
      pathData.multiple.forEach(function (siblingPath, siblingI) {
        _rAccessor = function _rAccessor() {
          return siblingPath.weight;
        };

        var currentRibbon = buildRibbon(currentPoints);
        allRibbons.push(currentRibbon);
        var nextSibling = pathData.multiple[siblingI + 1];

        if (nextSibling) {
          var currentLeftSide = currentRibbon.reverse().filter(function (d) {
            return d.direction === "back";
          }).reduce(dedupeRibbonPoints(), []);

          _rAccessor = function _rAccessor() {
            return nextSibling.weight;
          };

          var leftHandInflatedRibbon = buildRibbon(currentLeftSide);
          currentPoints = leftHandInflatedRibbon.reverse().filter(function (d) {
            return d.direction === "back";
          }).reduce(dedupeRibbonPoints(), []);
        }
      });
      _rAccessor = original_r;
      return allRibbons.map(function (d) {
        return _lineConstructor.x(_xAccessor).y(_yAccessor).curve(_interpolator)(d);
      });
    }

    var bothPoints = buildRibbon(pathData).reduce(dedupeRibbonPoints(), []);
    return _lineConstructor.x(_xAccessor).y(_yAccessor).curve(_interpolator)(bothPoints);
  }

  _ribbon.x = function (_value) {
    if (!arguments.length) return _xAccessor;
    _xAccessor = _value;
    return _ribbon;
  };

  _ribbon.y = function (_value) {
    if (!arguments.length) return _yAccessor;
    _yAccessor = _value;
    return _ribbon;
  };

  _ribbon.r = function (_value) {
    if (!arguments.length) return _rAccessor;
    _rAccessor = _value;
    return _ribbon;
  };

  _ribbon.interpolate = function (_value) {
    if (!arguments.length) return _interpolator;
    _interpolator = _value;
    return _ribbon;
  };

  return _ribbon;

  function offsetEdge(d) {
    var diffX = _yAccessor(d.target) - _yAccessor(d.source);

    var diffY = _xAccessor(d.target) - _xAccessor(d.source);

    var angle0 = Math.atan2(diffY, diffX) + Math.PI / 2;
    var angle1 = angle0 + Math.PI * 0.5;
    var angle2 = angle0 + Math.PI * 0.5;
    var x1 = _xAccessor(d.source) + _rAccessor(d.source) * Math.cos(angle1);
    var y1 = _yAccessor(d.source) - _rAccessor(d.source) * Math.sin(angle1);
    var x2 = _xAccessor(d.target) + _rAccessor(d.target) * Math.cos(angle2);
    var y2 = _yAccessor(d.target) - _rAccessor(d.target) * Math.sin(angle2);
    return {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2
    };
  }

  function buildRibbon(points) {
    var bothCode = [];
    var x = 0;
    var transformedPoints = {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0
    };

    while (x < points.length) {
      if (x !== points.length - 1) {
        transformedPoints = offsetEdge({
          source: points[x],
          target: points[x + 1]
        });
        var p1 = {
          x: transformedPoints.x1,
          y: transformedPoints.y1,
          direction: "forward"
        };
        var p2 = {
          x: transformedPoints.x2,
          y: transformedPoints.y2,
          direction: "forward"
        };
        bothCode.push(p1, p2);

        if (bothCode.length > 3) {
          var l = bothCode.length - 1;
          var lineA = {
            a: bothCode[l - 3],
            b: bothCode[l - 2]
          };
          var lineB = {
            a: bothCode[l - 1],
            b: bothCode[l]
          };
          var intersect = findIntersect(lineA.a.x, lineA.a.y, lineA.b.x, lineA.b.y, lineB.a.x, lineB.a.y, lineB.b.x, lineB.b.y);

          if (intersect.found === true) {
            lineA.b.x = intersect.x;
            lineA.b.y = intersect.y;
            lineB.a.x = intersect.x;
            lineB.a.y = intersect.y;
          }
        }
      }

      x++;
    }

    x--; //Back

    while (x >= 0) {
      if (x !== 0) {
        transformedPoints = offsetEdge({
          source: points[x],
          target: points[x - 1]
        });
        var _p = {
          x: transformedPoints.x1,
          y: transformedPoints.y1,
          direction: "back"
        };
        var _p2 = {
          x: transformedPoints.x2,
          y: transformedPoints.y2,
          direction: "back"
        };
        bothCode.push(_p, _p2);

        if (bothCode.length > 3) {
          var _l = bothCode.length - 1;

          var _lineA = {
            a: bothCode[_l - 3],
            b: bothCode[_l - 2]
          };
          var _lineB = {
            a: bothCode[_l - 1],
            b: bothCode[_l]
          };

          var _intersect = findIntersect(_lineA.a.x, _lineA.a.y, _lineA.b.x, _lineA.b.y, _lineB.a.x, _lineB.a.y, _lineB.b.x, _lineB.b.y);

          if (_intersect.found === true) {
            _lineA.b.x = _intersect.x;
            _lineA.b.y = _intersect.y;
            _lineB.a.x = _intersect.x;
            _lineB.a.y = _intersect.y;
          }
        }
      }

      x--;
    }

    return bothCode;
  }

  function findIntersect(l1x1, l1y1, l1x2, l1y2, l2x1, l2y1, l2x2, l2y2) {
    var a, b;
    var result = {
      x: null,
      y: null,
      found: false
    };
    var d = (l2y2 - l2y1) * (l1x2 - l1x1) - (l2x2 - l2x1) * (l1y2 - l1y1);

    if (d === 0) {
      return result;
    }

    a = l1y1 - l2y1;
    b = l1x1 - l2x1;
    var n1 = (l2x2 - l2x1) * a - (l2y2 - l2y1) * b;
    var n2 = (l1x2 - l1x1) * a - (l1y2 - l1y1) * b;
    a = n1 / d;
    b = n2 / d;
    result.x = l1x1 + a * (l1x2 - l1x1);
    result.y = l1y1 + a * (l1y2 - l1y1);

    if (a > 0 && a < 1 && b > 0 && b < 1) {
      result.found = true;
    }

    return result;
  }
}