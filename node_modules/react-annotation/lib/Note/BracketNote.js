"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = BracketNote;

var _react = _interopRequireDefault(require("react"));

var _Note = _interopRequireDefault(require("./Note"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function BracketNote(_ref) {
  var width = _ref.width,
      height = _ref.height,
      depth = _ref.depth,
      rest = _objectWithoutProperties(_ref, ["width", "height", "depth"]);

  var dx = rest.dx,
      orientation,
      align = "middle",
      dy = rest.dy;

  if (height) {
    if (!dy) dy = height / 2;
    if (!dx) dx = depth;
    orientation = "leftRight";
  } else if (width) {
    if (!dx) dx = width / 2;
    if (!dy) dy = depth;
    orientation = "topBottom";
  }

  return _react.default.createElement(_Note.default, _extends({
    align: align,
    orientation: orientation,
    padding: 10
  }, rest, {
    editMode: false,
    dx: dx,
    dy: dy
  }));
}