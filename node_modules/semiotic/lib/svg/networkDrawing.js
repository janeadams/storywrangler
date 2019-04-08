"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.topologicalSort = topologicalSort;
exports.circularAreaLink = circularAreaLink;
exports.softStack = exports.areaLink = exports.ribbonLink = exports.drawEdges = exports.drawNodes = exports.hierarchicalRectNodeGenerator = exports.radialLabelGenerator = exports.radialRectNodeGenerator = exports.matrixNodeGenerator = exports.chordNodeGenerator = exports.sankeyNodeGenerator = exports.wordcloudNodeGenerator = exports.dagreEdgeGenerator = exports.chordEdgeGenerator = exports.arcEdgeGenerator = exports.matrixEdgeGenerator = exports.circleNodeGenerator = exports.radialCurveGenerator = void 0;

var React = _interopRequireWildcard(require("react"));

var _semioticMark = require("semiotic-mark");

var _d3Glyphedge = require("d3-glyphedge");

var _d3Shape = require("d3-shape");

var _SvgHelper = require("./SvgHelper");

var _d3Interpolate = require("d3-interpolate");

var _d3Scale = require("d3-scale");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var horizontalDagreLineGenerator = (0, _d3Shape.line)().curve(_d3Shape.curveMonotoneX).x(function (d) {
  return d.x;
}).y(function (d) {
  return d.y;
});
var verticalDagreLineGenerator = (0, _d3Shape.line)().curve(_d3Shape.curveMonotoneY).x(function (d) {
  return d.x;
}).y(function (d) {
  return d.y;
});

function sankeyEdgeSort(a, b, direction) {
  if (a.circular && !b.circular) return -1;
  if (b.circular && !a.circular) return 1;
  var first = direction === "down" ? "y" : "x";
  var second = direction === "down" ? "x" : "y";
  return a.source[first] === b.source[first] ? a.sankeyWidth === b.sankeyWidth ? a.source[second] - b.source[second] : b.sankeyWidth - a.sankeyWidth : a.source[first] - b.source[first];
}

var sigmoidLinks = {
  horizontal: (0, _d3Shape.linkHorizontal)().x(function (d) {
    return d.x;
  }).y(function (d) {
    return d.y;
  }),
  vertical: (0, _d3Shape.linkVertical)().x(function (d) {
    return d.x;
  }).y(function (d) {
    return d.y;
  }),
  radial: _d3Glyphedge.d.lineArc
};
var customEdgeHashD = {
  curve: function curve(d) {
    var projection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "vertical";
    return sigmoidLinks[projection](d);
  },
  linearc: function linearc(d) {
    return _d3Glyphedge.d.lineArc(d);
  },
  ribbon: function ribbon(d) {
    return _d3Glyphedge.d.ribbon(d, d.width);
  },
  arrowhead: function arrowhead(d) {
    return _d3Glyphedge.d.arrowHead(d, d.target.nodeSize, d.width, d.width * 1.5);
  },
  halfarrow: function halfarrow(d) {
    return _d3Glyphedge.d.halfArrow(d, d.target.nodeSize, d.width, d.width * 1.5);
  },
  nail: function nail(d) {
    return _d3Glyphedge.d.nail(d, d.source.nodeSize);
  },
  comet: function comet(d) {
    return _d3Glyphedge.d.comet(d, d.target.nodeSize);
  },
  taffy: function taffy(d) {
    return _d3Glyphedge.d.taffy(d, d.source.nodeSize / 2, d.target.nodeSize / 2, (d.source.nodeSize + d.target.nodeSize) / 4);
  }
};

var radialCurveGenerator = function radialCurveGenerator(size) {
  var radialCurve = (0, _d3Shape.linkRadial)().angle(function (d) {
    return d.x / size[0] * Math.PI * 2;
  }).radius(function (d) {
    return d.y;
  });
  return function (_ref) {
    var d = _ref.d,
        i = _ref.i,
        styleFn = _ref.styleFn,
        renderMode = _ref.renderMode,
        key = _ref.key,
        className = _ref.className,
        baseMarkProps = _ref.baseMarkProps;
    return React.createElement(_semioticMark.Mark, _extends({}, baseMarkProps, {
      key: key,
      transform: "translate(".concat(50, ",", size[1] / 2 - 50, ")"),
      markType: "path",
      d: radialCurve(d),
      style: styleFn(d, i),
      renderMode: renderMode ? renderMode(d, i) : undefined,
      className: className,
      "aria-label": "Node ".concat(d.id),
      tabIndex: -1
    }));
  };
};

exports.radialCurveGenerator = radialCurveGenerator;

var circleNodeGenerator = function circleNodeGenerator(_ref2) {
  var d = _ref2.d,
      i = _ref2.i,
      styleFn = _ref2.styleFn,
      renderMode = _ref2.renderMode,
      key = _ref2.key,
      className = _ref2.className,
      transform = _ref2.transform,
      baseMarkProps = _ref2.baseMarkProps;
  //this is repetitious
  return React.createElement(_semioticMark.Mark, _extends({}, baseMarkProps, {
    key: key,
    transform: transform,
    markType: "rect",
    width: d.nodeSize * 2,
    height: d.nodeSize * 2,
    ry: d.nodeSize * 2,
    rx: d.nodeSize * 2,
    x: -d.nodeSize,
    y: -d.nodeSize,
    style: styleFn(d, i),
    renderMode: renderMode ? renderMode(d, i) : undefined,
    className: className,
    "aria-label": "Node ".concat(d.id),
    tabIndex: -1
  }));
};

exports.circleNodeGenerator = circleNodeGenerator;

var matrixEdgeGenerator = function matrixEdgeGenerator(size, nodes) {
  return function (_ref3) {
    var d = _ref3.d,
        i = _ref3.i,
        styleFn = _ref3.styleFn,
        renderMode = _ref3.renderMode,
        key = _ref3.key,
        className = _ref3.className,
        baseMarkProps = _ref3.baseMarkProps;
    var gridSize = Math.min.apply(Math, _toConsumableArray(size)) / nodes.length;
    return React.createElement("g", {
      key: key
    }, React.createElement(_semioticMark.Mark, _extends({}, baseMarkProps, {
      renderMode: renderMode ? renderMode(d, i) : undefined,
      key: key,
      className: className,
      simpleInterpolate: true,
      transform: "translate(".concat(d.source.y, ",").concat(d.target.y, ")"),
      markType: "rect",
      x: -gridSize / 2,
      y: -gridSize / 2,
      width: gridSize,
      height: gridSize,
      style: styleFn(d, i),
      "aria-label": "Connection from ".concat(d.source.id, " to ").concat(d.target.id),
      tabIndex: -1
    })), React.createElement(_semioticMark.Mark, _extends({}, baseMarkProps, {
      renderMode: renderMode ? renderMode(d, i) : undefined,
      key: "".concat(key, "-mirror"),
      className: className,
      simpleInterpolate: true,
      transform: "translate(".concat(d.target.y, ",").concat(d.source.y, ")"),
      markType: "rect",
      x: -gridSize / 2,
      y: -gridSize / 2,
      width: gridSize,
      height: gridSize,
      style: styleFn(d, i),
      "aria-label": "Connection from ".concat(d.source.id, " to ").concat(d.target.id),
      tabIndex: -1
    })));
  };
};

exports.matrixEdgeGenerator = matrixEdgeGenerator;

var arcEdgeGenerator = function arcEdgeGenerator(size) {
  var yAdjust = size[1] / size[0];

  function arcDiagramArc(d) {
    var draw = (0, _d3Shape.line)().curve(_d3Shape.curveBasis);
    var midX = (d.source.x + d.target.x) / 2;
    var midY = d.source.x - d.target.x;
    return draw([[d.source.x, 0], [midX, midY * yAdjust], [d.target.x, 0]]);
  }

  return function (_ref4) {
    var d = _ref4.d,
        i = _ref4.i,
        styleFn = _ref4.styleFn,
        renderMode = _ref4.renderMode,
        key = _ref4.key,
        className = _ref4.className,
        baseMarkProps = _ref4.baseMarkProps;
    return React.createElement(_semioticMark.Mark, _extends({}, baseMarkProps, {
      renderMode: renderMode ? renderMode(d, i) : undefined,
      key: key,
      className: className,
      simpleInterpolate: true,
      markType: "path",
      transform: "translate(0,".concat(size[1] / 2, ")"),
      d: arcDiagramArc(d),
      style: styleFn(d, i),
      "aria-label": "Connection from ".concat(d.source.id, " to ").concat(d.target.id),
      tabIndex: -1
    }));
  };
};

exports.arcEdgeGenerator = arcEdgeGenerator;

var chordEdgeGenerator = function chordEdgeGenerator(size) {
  return function (_ref5) {
    var d = _ref5.d,
        i = _ref5.i,
        styleFn = _ref5.styleFn,
        renderMode = _ref5.renderMode,
        key = _ref5.key,
        className = _ref5.className,
        baseMarkProps = _ref5.baseMarkProps;
    return React.createElement(_semioticMark.Mark, _extends({}, baseMarkProps, {
      renderMode: renderMode ? renderMode(d, i) : undefined,
      key: key,
      className: className,
      simpleInterpolate: true,
      transform: "translate(".concat(size[0] / 2, ",").concat(size[1] / 2, ")"),
      markType: "path",
      d: d.d,
      style: styleFn(d, i),
      "aria-label": "Connection from ".concat(d.source.id, " to ").concat(d.target.id),
      tabIndex: -1
    }));
  };
};

exports.chordEdgeGenerator = chordEdgeGenerator;

var dagreEdgeGenerator = function dagreEdgeGenerator(direction) {
  var dagreLineGenerator = direction === "LR" || direction === "RL" ? horizontalDagreLineGenerator : verticalDagreLineGenerator;
  return function (_ref6) {
    var d = _ref6.d,
        i = _ref6.i,
        styleFn = _ref6.styleFn,
        renderMode = _ref6.renderMode,
        key = _ref6.key,
        className = _ref6.className,
        baseMarkProps = _ref6.baseMarkProps;

    if (d.ribbon || d.parallelEdges) {
      var ribbonGenerator = (0, _SvgHelper.linearRibbon)();
      ribbonGenerator.x(function (p) {
        return p.x;
      });
      ribbonGenerator.y(function (p) {
        return p.y;
      });
      ribbonGenerator.r(function () {
        return d.weight || 1;
      });

      if (d.parallelEdges) {
        var sortedParallelEdges = d.parallelEdges.sort(function (a, b) {
          return b.weight - a.weight;
        });
        return React.createElement("g", {
          key: "".concat(key)
        }, ribbonGenerator({
          points: d.points,
          multiple: d.parallelEdges
        }).map(function (ribbonD, ribbonI) {
          return React.createElement(_semioticMark.Mark, _extends({}, baseMarkProps, {
            renderMode: renderMode ? renderMode(d, i) : undefined,
            key: "".concat(key, "-").concat(ribbonI),
            className: className,
            simpleInterpolate: true,
            markType: "path",
            d: ribbonD,
            style: styleFn(sortedParallelEdges[ribbonI], i),
            "aria-label": "Connection from ".concat(d.source.id, " to ").concat(d.target.id),
            tabIndex: -1
          }));
        }));
      }

      return React.createElement(_semioticMark.Mark, _extends({}, baseMarkProps, {
        renderMode: renderMode ? renderMode(d, i) : undefined,
        key: key,
        className: className,
        simpleInterpolate: true,
        markType: "path",
        d: ribbonGenerator(d.points),
        style: styleFn(d, i),
        "aria-label": "Connection from ".concat(d.source.id, " to ").concat(d.target.id),
        tabIndex: -1
      }));
    }

    return React.createElement(_semioticMark.Mark, _extends({}, baseMarkProps, {
      renderMode: renderMode ? renderMode(d, i) : undefined,
      key: key,
      className: className,
      simpleInterpolate: true,
      markType: "path",
      d: dagreLineGenerator(d.points),
      style: styleFn(d, i),
      "aria-label": "Connection from ".concat(d.source.id, " to ").concat(d.target.id),
      tabIndex: -1
    }));
  };
};

exports.dagreEdgeGenerator = dagreEdgeGenerator;

var wordcloudNodeGenerator = function wordcloudNodeGenerator(_ref7) {
  var d = _ref7.d,
      i = _ref7.i,
      styleFn = _ref7.styleFn,
      key = _ref7.key,
      className = _ref7.className,
      transform = _ref7.transform;
  var textStyle = styleFn(d, i);
  textStyle.fontSize = "".concat(d.fontSize, "px");
  textStyle.fontWeight = d.fontWeight;
  textStyle.textAnchor = "middle";
  var textTransform, textY, textX;
  textTransform = "scale(".concat(d.scale, ")");

  if (!d.rotate) {
    textY = d.textHeight / 4;
    textTransform = "scale(".concat(d.scale, ")");
  } else {
    textTransform = "rotate(90) scale(".concat(d.scale, ")");
    textY = d.textHeight / 4;
  }

  return React.createElement("g", {
    key: key,
    transform: transform
  }, React.createElement("text", {
    style: textStyle,
    y: textY,
    x: textX,
    transform: textTransform,
    className: "".concat(className, " wordcloud"),
    "aria-label": d._NWFText,
    role: "img",
    tabIndex: -1
  }, d._NWFText));
};

exports.wordcloudNodeGenerator = wordcloudNodeGenerator;

var sankeyNodeGenerator = function sankeyNodeGenerator(_ref8) {
  var d = _ref8.d,
      i = _ref8.i,
      styleFn = _ref8.styleFn,
      renderMode = _ref8.renderMode,
      key = _ref8.key,
      className = _ref8.className,
      transform = _ref8.transform,
      baseMarkProps = _ref8.baseMarkProps;
  var height = d.direction !== "down" ? d.height : d.width;
  var width = d.direction !== "down" ? d.width : d.height;
  return React.createElement(_semioticMark.Mark, _extends({}, baseMarkProps, {
    renderMode: renderMode ? renderMode(d, i) : undefined,
    key: key,
    className: className,
    transform: transform,
    markType: "rect",
    height: height,
    width: width,
    x: -width / 2,
    y: -height / 2,
    rx: 0,
    ry: 0,
    style: styleFn(d),
    "aria-label": "Node ".concat(d.id),
    tabIndex: -1
  }));
};

exports.sankeyNodeGenerator = sankeyNodeGenerator;

var chordNodeGenerator = function chordNodeGenerator(size) {
  return function (_ref9) {
    var d = _ref9.d,
        i = _ref9.i,
        styleFn = _ref9.styleFn,
        renderMode = _ref9.renderMode,
        key = _ref9.key,
        className = _ref9.className,
        baseMarkProps = _ref9.baseMarkProps;
    return React.createElement(_semioticMark.Mark, _extends({}, baseMarkProps, {
      renderMode: renderMode ? renderMode(d, i) : undefined,
      key: key,
      className: className,
      transform: "translate(".concat(size[0] / 2, ",").concat(size[1] / 2, ")"),
      markType: "path",
      d: d.d,
      style: styleFn(d, i),
      "aria-label": "Node ".concat(d.id),
      tabIndex: -1
    }));
  };
};

exports.chordNodeGenerator = chordNodeGenerator;

var matrixNodeGenerator = function matrixNodeGenerator(size, nodes) {
  var gridSize = Math.min.apply(Math, _toConsumableArray(size));
  var stepSize = gridSize / (nodes.length + 1);
  return function (_ref10) {
    var d = _ref10.d,
        i = _ref10.i,
        styleFn = _ref10.styleFn,
        renderMode = _ref10.renderMode,
        key = _ref10.key,
        className = _ref10.className,
        baseMarkProps = _ref10.baseMarkProps;
    var showText = stepSize > 6;
    var showLine = stepSize > 3;
    var showRect = stepSize > 0.5;
    var textProps = {
      textAnchor: "end",
      fontSize: "".concat(stepSize / 2, "px")
    };
    var style = styleFn(d, i);
    var renderModeValue = renderMode ? renderMode(d, i) : undefined;
    return React.createElement("g", {
      key: key,
      className: className
    }, showRect && React.createElement(_semioticMark.Mark, {
      markType: "rect",
      x: stepSize / 2,
      y: d.y - stepSize / 2,
      width: gridSize - stepSize,
      height: stepSize,
      style: _objectSpread({}, style, {
        stroke: "none"
      }),
      renderMode: renderModeValue,
      forceUpdate: true,
      baseMarkProps: baseMarkProps
    }), showRect && React.createElement(_semioticMark.Mark, {
      markType: "rect",
      y: stepSize / 2,
      x: d.y - stepSize / 2,
      height: gridSize - stepSize,
      width: stepSize,
      style: _objectSpread({}, style, {
        stroke: "none"
      }),
      renderMode: renderModeValue,
      forceUpdate: true,
      baseMarkProps: baseMarkProps
    }), showLine && React.createElement(_semioticMark.Mark, {
      markType: "line",
      stroke: "black",
      x1: 0,
      x2: gridSize - stepSize / 2,
      y1: d.y - stepSize / 2,
      y2: d.y - stepSize / 2,
      style: style,
      renderMode: renderModeValue,
      forceUpdate: true,
      baseMarkProps: baseMarkProps
    }), showLine && React.createElement(_semioticMark.Mark, {
      markType: "line",
      stroke: "black",
      y1: 0,
      y2: gridSize - stepSize / 2,
      x1: d.y - stepSize / 2,
      x2: d.y - stepSize / 2,
      style: style,
      renderMode: renderModeValue,
      forceUpdate: true,
      baseMarkProps: baseMarkProps
    }), showLine && i === nodes.length - 1 && React.createElement(_semioticMark.Mark, {
      markType: "line",
      stroke: "black",
      x1: 0,
      x2: gridSize - stepSize / 2,
      y1: d.y + stepSize / 2,
      y2: d.y + stepSize / 2,
      style: style,
      renderMode: renderModeValue,
      forceUpdate: true,
      baseMarkProps: baseMarkProps
    }), showLine && i === nodes.length - 1 && React.createElement(_semioticMark.Mark, {
      markType: "line",
      stroke: "black",
      y1: 0,
      y2: gridSize - stepSize / 2,
      x1: d.y + stepSize / 2,
      x2: d.y + stepSize / 2,
      style: style,
      renderMode: renderModeValue,
      forceUpdate: true,
      baseMarkProps: baseMarkProps
    }), showText && React.createElement("text", _extends({
      x: 0,
      y: d.y + stepSize / 5
    }, textProps), d.id), showText && React.createElement("text", _extends({
      transform: "translate(".concat(d.y, ") rotate(90) translate(0,").concat(stepSize / 5, ")")
    }, textProps, {
      y: 0
    }), d.id));
  };
};

exports.matrixNodeGenerator = matrixNodeGenerator;

var radialRectNodeGenerator = function radialRectNodeGenerator(size, center, type) {
  var radialArc = (0, _d3Shape.arc)();
  var _type$angleRange = type.angleRange,
      angleRange = _type$angleRange === void 0 ? [0, 360] : _type$angleRange;
  var rangePct = angleRange.map(function (d) {
    return d / 360;
  });
  var rangeMod = rangePct[1] - rangePct[0];
  var adjustedPct = rangeMod < 1 ? (0, _d3Scale.scaleLinear)().domain([0, 1]).range(rangePct) : function (d) {
    return d;
  };
  return function (_ref11) {
    var d = _ref11.d,
        i = _ref11.i,
        styleFn = _ref11.styleFn,
        renderMode = _ref11.renderMode,
        key = _ref11.key,
        className = _ref11.className,
        baseMarkProps = _ref11.baseMarkProps;
    radialArc.innerRadius(d.y0 / 2).outerRadius(d.y1 / 2);
    return React.createElement(_semioticMark.Mark, _extends({}, baseMarkProps, {
      key: key,
      transform: "translate(".concat(center, ")"),
      markType: "path",
      d: radialArc({
        startAngle: adjustedPct(d.x0 / size[0]) * Math.PI * 2,
        endAngle: adjustedPct(d.x1 / size[0]) * Math.PI * 2
      }),
      customTween: {
        fn: _SvgHelper.arcTweener,
        props: {
          startAngle: adjustedPct(d.x0 / size[0]) * Math.PI * 2,
          endAngle: adjustedPct(d.x1 / size[0]) * Math.PI * 2,
          innerRadius: d.y0 / 2,
          outerRadius: d.y1 / 2
        }
      },
      style: styleFn(d, i),
      renderMode: renderMode ? renderMode(d, i) : undefined,
      className: className,
      "aria-label": "Node ".concat(d.id),
      tabIndex: -1
    }));
  };
};

exports.radialRectNodeGenerator = radialRectNodeGenerator;

var radialLabelGenerator = function radialLabelGenerator(node, nodei, nodeIDAccessor, size) {
  var anglePct = (node.x1 + node.x0) / 2 / size[0];
  var nodeLabel = nodeIDAccessor(node, nodei);
  var labelRotate = anglePct > 0.5 ? anglePct * 360 + 90 : anglePct * 360 - 90;
  return React.createElement("g", {
    transform: "rotate(".concat(labelRotate, ")")
  }, typeof nodeLabel === "string" ? React.createElement("text", {
    textAnchor: "middle",
    y: 5
  }, nodeLabel) : nodeLabel);
};

exports.radialLabelGenerator = radialLabelGenerator;

var hierarchicalRectNodeGenerator = function hierarchicalRectNodeGenerator(_ref12) {
  var d = _ref12.d,
      i = _ref12.i,
      styleFn = _ref12.styleFn,
      renderMode = _ref12.renderMode,
      key = _ref12.key,
      className = _ref12.className,
      baseMarkProps = _ref12.baseMarkProps;
  //this is repetitious
  return React.createElement(_semioticMark.Mark, _extends({}, baseMarkProps, {
    key: key,
    transform: "translate(0,0)",
    markType: "rect",
    width: d.x1 - d.x0,
    height: d.y1 - d.y0,
    x: d.x0,
    y: d.y0,
    rx: 0,
    ry: 0,
    style: styleFn(d, i),
    renderMode: renderMode ? renderMode(d, i) : undefined,
    className: className,
    "aria-label": "Node ".concat(d.id),
    tabIndex: -1
  }));
};

exports.hierarchicalRectNodeGenerator = hierarchicalRectNodeGenerator;

var genericLineGenerator = function genericLineGenerator(d) {
  return "M".concat(d.source.x, ",").concat(d.source.y, "L").concat(d.target.x, ",").concat(d.target.y);
};

var drawNodes = function drawNodes(_ref13) {
  var data = _ref13.data,
      renderKeyFn = _ref13.renderKeyFn,
      customMark = _ref13.customMark,
      styleFn = _ref13.styleFn,
      classFn = _ref13.classFn,
      renderMode = _ref13.renderMode,
      canvasDrawing = _ref13.canvasDrawing,
      canvasRenderFn = _ref13.canvasRenderFn,
      baseMarkProps = _ref13.baseMarkProps;
  var markGenerator = customMark;
  var renderedData = [];

  if (customMark && canvasRenderFn) {
    console.error("canvas rendering currently only supports generic circle nodes based on nodeSize");
  }

  data.forEach(function (d, i) {
    if (canvasRenderFn && canvasRenderFn(d, i) === true) {
      var canvasNode = {
        baseClass: "frame-piece",
        tx: d.x,
        ty: d.y,
        d: d,
        i: i,
        markProps: {
          markType: "circle",
          r: d.nodeSize
        },
        styleFn: styleFn,
        renderFn: renderMode,
        classFn: classFn
      };
      canvasDrawing.push(canvasNode);
    } else {
      // CUSTOM MARK IMPLEMENTATION
      renderedData.push(markGenerator({
        d: d,
        i: i,
        renderKeyFn: renderKeyFn,
        styleFn: styleFn,
        classFn: classFn,
        renderMode: renderMode,
        key: renderKeyFn ? renderKeyFn(d, i) : d.id || "node-".concat(i),
        className: "node ".concat(classFn(d, i)),
        transform: "translate(".concat(d.x, ",").concat(d.y, ")"),
        baseMarkProps: baseMarkProps
      }));
    }
  });
  return renderedData;
};

exports.drawNodes = drawNodes;

var drawEdges = function drawEdges(_ref14) {
  var baseData = _ref14.data,
      renderKeyFn = _ref14.renderKeyFn,
      customMark = _ref14.customMark,
      styleFn = _ref14.styleFn,
      classFn = _ref14.classFn,
      renderMode = _ref14.renderMode,
      canvasRenderFn = _ref14.canvasRenderFn,
      canvasDrawing = _ref14.canvasDrawing,
      type = _ref14.type,
      baseMarkProps = _ref14.baseMarkProps,
      networkType = _ref14.networkType,
      direction = _ref14.direction,
      projection = _ref14.projection;
  var data = networkType === "sankey" ? baseData.sort(function (a, b) {
    return sankeyEdgeSort(a, b, direction);
  }) : baseData;
  var dGenerator = genericLineGenerator;
  var renderedData = [];

  if (customMark) {
    // CUSTOM MARK IMPLEMENTATION
    data.forEach(function (d, i) {
      var renderedCustomMark = customMark({
        d: d,
        i: i,
        renderKeyFn: renderKeyFn,
        styleFn: styleFn,
        classFn: classFn,
        renderMode: renderMode,
        key: renderKeyFn ? renderKeyFn(d, i) : "edge-".concat(i),
        className: "".concat(classFn(d, i), " edge"),
        transform: "translate(".concat(d.x, ",").concat(d.y, ")"),
        baseMarkProps: baseMarkProps
      });

      if (renderedCustomMark && renderedCustomMark.props && (renderedCustomMark.props.markType !== "path" || renderedCustomMark.props.d)) {
        renderedData.push(renderedCustomMark);
      }
    });
  } else {
    if (type) {
      if (typeof type === "function") {
        dGenerator = type;
      } else if (customEdgeHashD[type]) {
        dGenerator = function dGenerator(d) {
          return customEdgeHashD[type](d, projection);
        };
      }
    }

    data.forEach(function (d, i) {
      var renderedD = dGenerator(d);

      if (renderedD && canvasRenderFn && canvasRenderFn(d, i) === true) {
        var canvasEdge = {
          baseClass: "frame-piece",
          tx: d.x,
          ty: d.y,
          d: d,
          i: i,
          markProps: {
            markType: "path",
            d: renderedD
          },
          styleFn: styleFn,
          renderFn: renderMode,
          classFn: classFn
        };
        canvasDrawing.push(canvasEdge);
      } else if (renderedD) {
        renderedData.push(React.createElement(_semioticMark.Mark, _extends({}, baseMarkProps, {
          key: renderKeyFn ? renderKeyFn(d, i) : "edge-".concat(i),
          markType: "path",
          renderMode: renderMode ? renderMode(d, i) : undefined,
          className: "".concat(classFn(d), " edge"),
          d: renderedD,
          style: styleFn(d, i),
          tabIndex: -1,
          role: "img",
          "aria-label": "connection from ".concat(d.source.id, " to ").concat(d.target.id)
        })));
      }
    });
  }

  return renderedData;
};

exports.drawEdges = drawEdges;

function topologicalSort(nodesArray, edgesArray) {
  // adapted from https://simplapi.wordpress.com/2015/08/19/detect-graph-cycle-in-javascript/
  var nodes = [];
  var nodeHash = {};
  edgesArray.forEach(function (edge) {
    if (!edge.source.id || !edge.target.id) {
      return false;
    }

    if (!nodeHash[edge.source.id]) {
      nodeHash[edge.source.id] = {
        _id: edge.source.id,
        links: []
      };
      nodes.push(nodeHash[edge.source.id]);
    }

    if (!nodeHash[edge.target.id]) {
      nodeHash[edge.target.id] = {
        _id: edge.target.id,
        links: []
      };
      nodes.push(nodeHash[edge.target.id]);
    }

    nodeHash[edge.source.id].links.push(edge.target.id);
  }); // Test if a node got any icoming edge

  function hasIncomingEdge(list, node) {
    for (var i = 0, l = list.length; i < l; ++i) {
      if (list[i].links.indexOf(node._id) !== -1) {
        return true;
      }
    }

    return false;
  } // Kahn Algorithm


  var L = [],
      S = nodes.filter(function (node) {
    return !hasIncomingEdge(nodes, node);
  });
  var n = null;

  while (S.length) {
    // Remove a node n from S
    n = S.pop(); // Add n to tail of L

    L.push(n);
    var i = n.links.length;

    while (i--) {
      // Getting the node associated to the current stored id in links
      var m = nodes[nodes.map(function (d) {
        return d._id;
      }).indexOf(n.links[i])]; // Remove edge e from the graph

      n.links.pop();

      if (!hasIncomingEdge(nodes, m)) {
        S.push(m);
      }
    }
  } // If any of them still got links, there is cycle somewhere


  var nodeWithEdge = nodes.find(function (node) {
    return node.links.length !== 0;
  });
  return nodeWithEdge ? null : L;
}

var curvature = 0.5;

var ribbonLink = function ribbonLink(d) {
  var diff = d.direction === "down" ? Math.abs(d.target.y - d.source.y) : Math.abs(d.source.x - d.target.x); // const halfWidth = d.width / 2

  var testCoordinates = d.direction === "down" ? [{
    x: d.y0,
    y: d.source.y
  }, {
    x: d.y0,
    y: d.source.y + diff / 3
  }, {
    x: d.y1,
    y: d.target.y - diff / 3
  }, {
    x: d.y1,
    y: d.target.y
  }] : [{
    x: d.source.x0,
    y: d.y0
  }, {
    x: d.source.x0 + diff / 3,
    y: d.y0
  }, {
    x: d.target.x0 - diff / 3,
    y: d.y1
  }, {
    x: d.target.x0,
    y: d.y1
  }];
  var linkGenerator = (0, _SvgHelper.linearRibbon)();
  linkGenerator.x(function (d) {
    return d.x;
  });
  linkGenerator.y(function (d) {
    return d.y;
  });
  linkGenerator.r(function () {
    return d.sankeyWidth / 2;
  });
  return linkGenerator(testCoordinates);
};

exports.ribbonLink = ribbonLink;

var areaLink = function areaLink(d) {
  var x0, x1, x2, x3, y0, y1, xi, y2, y3;

  if (d.direction === "down") {
    x0 = d.y0 - d.sankeyWidth / 2;
    x1 = d.y1 - d.sankeyWidth / 2;
    x2 = d.y1 + d.sankeyWidth / 2;
    x3 = d.y0 + d.sankeyWidth / 2;
    y0 = d.source.y1;
    y1 = d.target.y0;
    xi = (0, _d3Interpolate.interpolateNumber)(y0, y1);
    y2 = xi(curvature);
    y3 = xi(1 - curvature);
    return "M".concat(x0, ",").concat(y0, "C").concat(x0, ",").concat(y2, " ").concat(x1, ",").concat(y3, " ").concat(x1, ",").concat(y1, "L").concat(x2, ",").concat(y1, "C").concat(x2, ",").concat(y3, " ").concat(x3, ",").concat(y2, " ").concat(x3, ",").concat(y0, "Z");
  }

  ;
  x0 = d.source.x1, // eslint-disable-line no-sequences
  x1 = d.target.x0, xi = (0, _d3Interpolate.interpolateNumber)(x0, x1), x2 = xi(curvature), x3 = xi(1 - curvature), y0 = d.y0 - d.sankeyWidth / 2, y1 = d.y1 - d.sankeyWidth / 2, y2 = d.y1 + d.sankeyWidth / 2, y3 = d.y0 + d.sankeyWidth / 2;
  return "M".concat(x0, ",").concat(y0, "C").concat(x2, ",").concat(y0, " ").concat(x3, ",").concat(y1, " ").concat(x1, ",").concat(y1, "L").concat(x1, ",").concat(y2, "C").concat(x3, ",").concat(y2, " ").concat(x2, ",").concat(y3, " ").concat(x0, ",").concat(y3, "Z");
};

exports.areaLink = areaLink;

function circularAreaLink(link) {
  var linkGenerator = (0, _SvgHelper.linearRibbon)();
  linkGenerator.x(function (d) {
    return d.x;
  });
  linkGenerator.y(function (d) {
    return d.y;
  });
  linkGenerator.r(function () {
    return link.sankeyWidth / 2;
  });
  var xyForLink = link.direction === "down" ? [{
    x: link.circularPathData.sourceY,
    y: link.circularPathData.sourceX
  }, {
    x: link.circularPathData.sourceY,
    y: link.circularPathData.leftFullExtent
  }, {
    x: link.circularPathData.verticalFullExtent,
    y: link.circularPathData.leftFullExtent
  }, {
    x: link.circularPathData.verticalFullExtent,
    y: link.circularPathData.rightFullExtent
  }, {
    x: link.circularPathData.targetY,
    y: link.circularPathData.rightFullExtent
  }, {
    x: link.circularPathData.targetY,
    y: link.circularPathData.targetX
  }] : [{
    x: link.circularPathData.sourceX,
    y: link.circularPathData.sourceY
  }, {
    x: link.circularPathData.leftFullExtent,
    y: link.circularPathData.sourceY
  }, {
    x: link.circularPathData.leftFullExtent,
    y: link.circularPathData.verticalFullExtent
  }, {
    x: link.circularPathData.rightFullExtent,
    y: link.circularPathData.verticalFullExtent
  }, {
    x: link.circularPathData.rightFullExtent,
    y: link.circularPathData.targetY
  }, {
    x: link.circularPathData.targetX,
    y: link.circularPathData.targetY
  }];
  return linkGenerator(xyForLink);
}

var hierarchyDecorator = function hierarchyDecorator(hierarchy, hashEntries, nodeIDAccessor, nodes) {
  if (hierarchy.children) {
    hierarchy.children.forEach(function (child) {
      var theseEntries = hashEntries.filter(function (entry) {
        return entry[1] === child.id;
      });
      theseEntries.forEach(function (entry) {
        var idNode = nodes.find(function (node) {
          return nodeIDAccessor(node) === entry[0];
        }) || {};
        child.childHash[entry[0]] = _objectSpread({
          id: entry[0],
          children: [],
          childHash: {}
        }, idNode);
        child.children.push(child.childHash[entry[0]]);
      });

      if (child.children.length > 0) {
        hierarchyDecorator(child, hashEntries, nodeIDAccessor, nodes);
      }
    });
  }
};

var softStack = function softStack(edges, nodes, sourceAccessor, targetAccessor, nodeIDAccessor) {
  var hierarchy = {
    id: "root-generated",
    children: [],
    childHash: {}
  };
  var discoveredHierarchyHash = {};
  var targetToSourceHash = {};
  var hasLogicalRoot = true;
  var isHierarchical = true;

  for (var i = 0; i < edges.length; i++) {
    var edge = edges[i];
    var source = sourceAccessor(edge);
    var target = targetAccessor(edge);
    var sourceID = _typeof(source) === "object" ? nodeIDAccessor(source) : source;
    var targetID = _typeof(target) === "object" ? nodeIDAccessor(target) : target;
    targetToSourceHash[targetID] = sourceID;

    if (!discoveredHierarchyHash[sourceID]) {
      discoveredHierarchyHash[sourceID] = targetID;
    } else {
      isHierarchical = false;
      break;
    }
  }

  if (isHierarchical) {
    var hashEntries = Object.values(discoveredHierarchyHash);
    hashEntries.forEach(function (entry) {
      var target = entry;

      if (!discoveredHierarchyHash[target]) {
        discoveredHierarchyHash[target] = "root-generated";
        var idNode = nodes.find(function (node) {
          return nodeIDAccessor(node) === target;
        }) || {};
        hierarchy.childHash[target] = _objectSpread({
          id: target,
          children: [],
          childHash: {}
        }, idNode);
        hierarchy.children.push(hierarchy.childHash[target]);
      }
    });
    hierarchyDecorator(hierarchy, hashEntries, nodeIDAccessor, nodes);
    nodes.forEach(function (node) {
      var nodeID = nodeIDAccessor(node);

      if (!discoveredHierarchyHash[nodeID] && !targetToSourceHash[nodeID]) {
        hierarchy.children.push(_objectSpread({
          id: nodeID,
          children: [],
          childHash: {}
        }, node));
      }
    });

    if (hierarchy.children.length === 1) {
      hierarchy = hierarchy.children[0];
      hasLogicalRoot = false;
    }

    return {
      hierarchy: hierarchy,
      isHierarchical: true,
      hasLogicalRoot: hasLogicalRoot
    };
  }

  return {
    hierarchy: {},
    isHierarchical: false,
    hasLogicalRoot: false
  };
};

exports.softStack = softStack;