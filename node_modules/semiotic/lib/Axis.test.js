"use strict";

var React = _interopRequireWildcard(require("react"));

var _enzyme = require("enzyme");

var _Axis = _interopRequireDefault(require("./Axis"));

var _d3Scale = require("d3-scale");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var axisWidth = 100;
var axisHeight = 200;
var axisProps = {
  size: [axisWidth, axisHeight],
  scale: (0, _d3Scale.scaleLinear)().domain([0, 100]).range([10, 100])
};
describe("Axis", function () {
  it("renders without crashing", function () {
    (0, _enzyme.mount)(React.createElement(_Axis.default, axisProps));
  });
  var shallowAxis = (0, _enzyme.shallow)(React.createElement(_Axis.default, _extends({}, axisProps, {
    className: "test-class"
  })));
  it("renders with a className", function () {
    expect(shallowAxis.find("g.test-class").length).toEqual(2);
  });
  it("renders without an annotation brush", function () {
    expect(shallowAxis.find("g.annotation-brush").length).toEqual(0);
  });
  it("renders with annotation brush area properly", function () {
    var clicked = false;

    var testFuncStub = function testFuncStub(e) {
      console.info("e", e);
      clicked = true;
    };

    var shallowAxisBrushLeft = (0, _enzyme.shallow)(React.createElement(_Axis.default, _extends({}, axisProps, {
      annotationFunction: testFuncStub,
      orient: "left"
    })));
    expect(shallowAxisBrushLeft.find("g.annotation-brush").length).toEqual(1);
    shallowAxisBrushLeft.find("g.annotation-brush > rect").simulate("click");
    expect(clicked).toEqual(true);
    expect(shallowAxisBrushLeft.find("g.annotation-brush").props().transform).toEqual("translate(-50,0)");
    var shallowAxisBrushBottom = (0, _enzyme.shallow)(React.createElement(_Axis.default, _extends({}, axisProps, {
      annotationFunction: testFuncStub,
      orient: "bottom"
    })));
    expect(shallowAxisBrushBottom.find("g.annotation-brush").props().transform).toEqual("translate(0,".concat(axisHeight, ")"));
  });
});