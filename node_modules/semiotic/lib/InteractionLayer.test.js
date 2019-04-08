"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _InteractionLayer = _interopRequireDefault(require("./InteractionLayer"));

var _d3Scale = require("d3-scale");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var xyEndFunction = function xyEndFunction(end) {
  console.info(end);
};

describe("InteractionLayer", function () {
  it("renders without crashing", function () {
    (0, _enzyme.mount)(_react.default.createElement(_InteractionLayer.default, null));
  });
  var mountedLayerWithOptions = (0, _enzyme.mount)(_react.default.createElement(_InteractionLayer.default, {
    margin: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10
    },
    size: [400, 400],
    svgSize: [400, 400],
    enabled: true,
    xScale: (0, _d3Scale.scaleLinear)().domain([0, 1000]).range([0, 400]),
    yScale: (0, _d3Scale.scaleLinear)().domain([0, 1200]).range([400, 0]),
    disableCanvas: true,
    interaction: {
      brush: "xyBrush",
      end: xyEndFunction,
      during: undefined,
      start: undefined,
      extent: [[550, 300], [600, 650]]
    },
    renderPipeline: {}
  }));
  it("draws an SVG", function () {
    expect(mountedLayerWithOptions.find("svg").length).toEqual(1);
    expect(mountedLayerWithOptions.find("g.brush").length).toEqual(1);
    expect(mountedLayerWithOptions.find("g.xybrush").length).toEqual(1);
  });
  /*
  looks like d3-selection no workie
  it("a selection rectangle is drawn of the right shape", () => {
    expect(mountedLayerWithOptions.find("rect.selection").length).toEqual(5)
     expect(
      mountedLayerWithOptions.find("rect.selection").props().height
    ).toEqual(50)
  })
  */
});