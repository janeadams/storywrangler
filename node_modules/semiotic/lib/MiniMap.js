"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _XYFrame = _interopRequireDefault(require("./XYFrame"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var MiniMap = function MiniMap(props) {
  var brushStart = props.brushStart,
      brush = props.brush,
      brushEnd = props.brushEnd,
      xBrushable = props.xBrushable,
      yBrushable = props.yBrushable,
      yBrushExtent = props.yBrushExtent,
      xBrushExtent = props.xBrushExtent,
      rest = _objectWithoutProperties(props, ["brushStart", "brush", "brushEnd", "xBrushable", "yBrushable", "yBrushExtent", "xBrushExtent"]);

  var interactivity = {
    start: brushStart,
    during: brush,
    end: brushEnd
  };

  if (xBrushable && yBrushable) {
    interactivity.brush = "xyBrush";

    if (xBrushExtent || yBrushExtent) {
      interactivity.extent = [[0, 0], _toConsumableArray(props.size)];
    }

    if (xBrushExtent) {
      interactivity.extent[0] = xBrushExtent;
    }

    if (yBrushExtent) {
      interactivity.extent[1] = yBrushExtent;
    }
  } else if (xBrushable) {
    interactivity.brush = "xBrush";

    if (xBrushExtent) {
      interactivity.extent = xBrushExtent;
    }
  } else if (yBrushable) {
    interactivity.brush = "yBrush";

    if (yBrushExtent) {
      interactivity.extent = yBrushExtent;
    }
  }

  return React.createElement(_XYFrame.default, _extends({}, rest, {
    interaction: interactivity
  }));
};

var _default = MiniMap;
exports.default = _default;
module.exports = exports.default;