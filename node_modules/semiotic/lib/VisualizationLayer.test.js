"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _VisualizationLayer = _interopRequireDefault(require("./VisualizationLayer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var visualizationLayerWidth = 100;
var visualizationLayerHeight = 200;
var visualizationLayerProps = {
  size: [visualizationLayerWidth, visualizationLayerHeight]
};

function drawSomeRectangles(_ref) {
  var data = _ref.data;
  return data.map(function (d) {
    return _react.default.createElement("rect", {
      key: "test-render-rect-".concat(d),
      x: d * 10,
      y: d * 5,
      height: 5,
      width: 8
    });
  });
}

var simplePipeline = {
  rectangles: {
    data: [1, 2, 3, 4, 5],
    behavior: drawSomeRectangles
  }
};
describe("VisualizationLayer", function () {
  it("renders without crashing", function () {
    (0, _enzyme.mount)(_react.default.createElement(_VisualizationLayer.default, visualizationLayerProps));
  });
  var shallowVisualizationLayer = (0, _enzyme.shallow)(_react.default.createElement(_VisualizationLayer.default, _extends({}, visualizationLayerProps, {
    renderPipeline: simplePipeline
  })));
  it("draws things in the render pipeline according to behavior", function () {
    expect(shallowVisualizationLayer.find("rect").length).toEqual(5);
  });
});