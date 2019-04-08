"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findFirstAccessorValue = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var findFirstAccessorValue = function findFirstAccessorValue(accessorArray, data) {
  for (var i = 0; i < accessorArray.length; i++) {
    var valueCheck = accessorArray[i](data);
    if (valueCheck !== undefined && !Number.isNaN(valueCheck) && valueCheck !== null) return valueCheck;
  }

  return undefined;
};

exports.findFirstAccessorValue = findFirstAccessorValue;