"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genericFunction = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var genericFunction = function genericFunction(value) {
  return function () {
    return value;
  };
};

exports.genericFunction = genericFunction;