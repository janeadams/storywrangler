"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extentValue = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var extentValue = function extentValue(extent) {
  return extent && extent.extent || Array.isArray(extent) && extent || [];
};

exports.extentValue = extentValue;