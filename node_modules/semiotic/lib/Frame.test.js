"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _Frame = _interopRequireDefault(require("./Frame"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var frameWidth = 100;
var frameHeight = 200;
var frameProps = {
  size: [frameWidth, frameHeight],
  disableContext: true
};
describe("Frame", function () {
  it("renders without crashing", function () {
    (0, _enzyme.mount)(_react.default.createElement(_Frame.default, frameProps));
  }); //  const shallowFrame = shallow(<Frame {...frameProps} className="test-class" />)
});