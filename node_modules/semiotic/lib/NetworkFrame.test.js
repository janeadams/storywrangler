"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _NetworkFrame = _interopRequireDefault(require("./NetworkFrame"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var someEdgeData = [{
  source: "Heathcliff",
  target: "Garfield"
}, {
  source: "Fexix",
  target: "Tom"
}, {
  source: "Bill",
  target: "Hobbes"
}]; //Enzyme doesn't do well with context so disable it for now

describe("NetworkFrame", function () {
  it("renders", function () {
    (0, _enzyme.mount)(_react.default.createElement(_NetworkFrame.default, {
      edges: someEdgeData,
      disableContext: true
    }));
  });
  var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_NetworkFrame.default, {
    edges: someEdgeData,
    disableContext: true
  }));
  it("renders a <Frame>", function () {
    expect(wrapper.find("Frame").length).toEqual(1);
  });
  it("renders some edges", function () {
    var mountedFrame = (0, _enzyme.mount)(_react.default.createElement(_NetworkFrame.default, {
      edges: someEdgeData,
      disableContext: true
    }));
    expect(mountedFrame.find("g.edge").length).toEqual(3);
  });
});