"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.desaturationLayer = exports.hullEnclosure = exports.rectangleEnclosure = exports.circleEnclosure = void 0;

var React = _interopRequireWildcard(require("react"));

var _AnnotationCalloutCircle = _interopRequireDefault(require("react-annotation/lib/Types/AnnotationCalloutCircle"));

var _AnnotationCalloutRect = _interopRequireDefault(require("react-annotation/lib/Types/AnnotationCalloutRect"));

var _AnnotationCalloutCustom = _interopRequireDefault(require("react-annotation/lib/Types/AnnotationCalloutCustom"));

var _Annotation = _interopRequireDefault(require("../Annotation"));

var _d3Polygon = require("d3-polygon");

var _polygonOffset = _interopRequireDefault(require("polygon-offset"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var circleEnclosure = function circleEnclosure(_ref) {
  var d = _ref.d,
      i = _ref.i,
      circle = _ref.circle;
  var _d$padding = d.padding,
      padding = _d$padding === void 0 ? 2 : _d$padding,
      _d$radiusPadding = d.radiusPadding,
      radiusPadding = _d$radiusPadding === void 0 ? padding : _d$radiusPadding,
      label = d.label;

  var noteData = _extends({
    dx: 0,
    dy: 0,
    note: {
      label: label
    },
    connector: {
      end: "arrow"
    }
  }, d, {
    coordinates: undefined,
    x: circle.x,
    y: circle.y,
    type: _AnnotationCalloutCircle.default,
    subject: {
      radius: circle.r,
      radiusPadding: radiusPadding
    },
    i: i
  });

  if (noteData.rp) {
    switch (noteData.rp) {
      case "top":
        noteData.dx = 0;
        noteData.dy = -circle.r - noteData.rd;
        break;

      case "bottom":
        noteData.dx = 0;
        noteData.dy = circle.r + noteData.rd;
        break;

      case "left":
        noteData.dx = -circle.r - noteData.rd;
        noteData.dy = 0;
        break;

      default:
        noteData.dx = circle.r + noteData.rd;
        noteData.dy = 0;
    }
  } //TODO: Support .ra (setting angle)


  return React.createElement(_Annotation.default, {
    key: d.key || "annotation-".concat(i),
    noteData: noteData
  });
};

exports.circleEnclosure = circleEnclosure;

var rectangleEnclosure = function rectangleEnclosure(_ref2) {
  var bboxNodes = _ref2.bboxNodes,
      d = _ref2.d,
      i = _ref2.i;
  var _d$padding2 = d.padding,
      padding = _d$padding2 === void 0 ? 0 : _d$padding2,
      _d$dx = d.dx,
      dx = _d$dx === void 0 ? -25 : _d$dx,
      _d$dy = d.dy,
      dy = _d$dy === void 0 ? -25 : _d$dy,
      label = d.label;
  var bbox = [[Math.min.apply(Math, _toConsumableArray(bboxNodes.map(function (p) {
    return p.x0;
  }))) - padding, Math.min.apply(Math, _toConsumableArray(bboxNodes.map(function (p) {
    return p.y0;
  }))) - padding], [Math.max.apply(Math, _toConsumableArray(bboxNodes.map(function (p) {
    return p.x1;
  }))) + padding, Math.max.apply(Math, _toConsumableArray(bboxNodes.map(function (p) {
    return p.y1;
  }))) + padding]];

  var noteData = _extends({
    dx: dx,
    dy: dy,
    note: {
      label: label
    },
    connector: {
      end: "arrow"
    }
  }, d, {
    type: _AnnotationCalloutRect.default,
    x: bbox[0][0],
    y: bbox[0][1],
    subject: {
      width: bbox[1][0] - bbox[0][0],
      height: bbox[1][1] - bbox[0][1]
    }
  });

  return React.createElement(_Annotation.default, {
    key: d.key || "annotation-".concat(i),
    noteData: noteData
  });
};

exports.rectangleEnclosure = rectangleEnclosure;

var hullEnclosure = function hullEnclosure(_ref3) {
  var points = _ref3.points,
      d = _ref3.d,
      i = _ref3.i;
  var _d$color = d.color,
      color = _d$color === void 0 ? "black" : _d$color,
      _d$dx2 = d.dx,
      dx = _d$dx2 === void 0 ? -25 : _d$dx2,
      _d$dy2 = d.dy,
      dy = _d$dy2 === void 0 ? -25 : _d$dy2,
      label = d.label,
      _d$padding3 = d.padding,
      padding = _d$padding3 === void 0 ? 10 : _d$padding3,
      _d$buffer = d.buffer,
      buffer = _d$buffer === void 0 ? padding : _d$buffer,
      _d$strokeWidth = d.strokeWidth,
      strokeWidth = _d$strokeWidth === void 0 ? 10 : _d$strokeWidth;
  var hullPoints = (0, _d3Polygon.polygonHull)(points);
  var offset = new _polygonOffset.default();
  var bufferedHull = offset.data([].concat(_toConsumableArray(hullPoints), [hullPoints[0]])).margin(buffer)[0];
  var hullD = "M".concat(bufferedHull.map(function (d) {
    return d.join(",");
  }).join("L"), "Z");
  var firstCoord = bufferedHull[0];
  var _d$nx = d.nx,
      nx = _d$nx === void 0 ? firstCoord[0] + dx : _d$nx,
      _d$ny = d.ny,
      ny = _d$ny === void 0 ? firstCoord[1] + dy : _d$ny;
  var closestCoordinates = bufferedHull.reduce(function (p, c) {
    if (Math.hypot(nx - p[0], ny - p[1]) > Math.hypot(nx - c[0], ny - c[1])) {
      p = c;
    }

    return p;
  }, firstCoord);

  var noteData = _extends({
    dx: dx,
    dy: dy,
    note: {
      label: label
    },
    connector: {
      end: "arrow"
    }
  }, d, {
    type: _AnnotationCalloutCustom.default,
    x: closestCoordinates[0],
    y: closestCoordinates[1],
    subject: {
      custom: [React.createElement("path", {
        key: "hull-drawing",
        d: hullD,
        strokeWidth: strokeWidth,
        strokeMiterlimit: "10",
        strokeLinejoin: "miter",
        strokeLinecap: "butt",
        fill: "none",
        stroke: color,
        transform: "translate(".concat(-closestCoordinates[0], ",").concat(-closestCoordinates[1], ")")
      })],
      customID: "hull-annotation"
    }
  });

  return React.createElement(_Annotation.default, {
    key: d.key || "annotation-".concat(i),
    noteData: noteData
  });
};

exports.hullEnclosure = hullEnclosure;

var desaturationLayer = function desaturationLayer(_ref4) {
  var _ref4$style = _ref4.style,
      style = _ref4$style === void 0 ? {
    fill: "white",
    fillOpacity: 0.5
  } : _ref4$style,
      size = _ref4.size,
      i = _ref4.i,
      key = _ref4.key;
  return React.createElement("rect", {
    key: key || "desaturation-".concat(i),
    x: -5,
    y: -5,
    width: size[0] + 10,
    height: size[1] + 10,
    style: style
  });
};

exports.desaturationLayer = desaturationLayer;