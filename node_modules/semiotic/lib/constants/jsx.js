"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterDefs = void 0;

var React = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var filterDefs = function filterDefs(_ref) {
  var matte = _ref.matte,
      key = _ref.key,
      additionalDefs = _ref.additionalDefs;
  return React.createElement("defs", null, React.createElement("filter", {
    id: "paintyFilterHeavy"
  }, React.createElement("feGaussianBlur", {
    id: "gaussblurrer",
    in: "SourceGraphic",
    stdDeviation: 4,
    colorInterpolationFilters: "sRGB",
    result: "blur"
  }), React.createElement("feColorMatrix", {
    in: "blur",
    mode: "matrix",
    values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 34 -7",
    result: "gooey"
  })), React.createElement("filter", {
    id: "paintyFilterLight"
  }, React.createElement("feGaussianBlur", {
    id: "gaussblurrer",
    in: "SourceGraphic",
    stdDeviation: 2,
    colorInterpolationFilters: "sRGB",
    result: "blur"
  }), React.createElement("feColorMatrix", {
    in: "blur",
    mode: "matrix",
    values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 34 -7",
    result: "gooey"
  })), React.createElement("clipPath", {
    id: "matte-clip-".concat(key)
  }, matte), additionalDefs);
};

exports.filterDefs = filterDefs;