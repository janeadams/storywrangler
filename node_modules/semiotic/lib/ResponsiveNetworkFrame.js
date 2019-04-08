"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _NetworkFrame = _interopRequireDefault(require("./NetworkFrame"));

var _ResponsiveFrame = _interopRequireDefault(require("./ResponsiveFrame"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _ResponsiveFrame.default)(_NetworkFrame.default);

exports.default = _default;
module.exports = exports.default;