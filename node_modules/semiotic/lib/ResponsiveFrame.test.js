"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _ResponsiveNetworkFrame = _interopRequireDefault(require("./ResponsiveNetworkFrame"));

var _ResponsiveMinimapXYFrame = _interopRequireDefault(require("./ResponsiveMinimapXYFrame"));

var _ResponsiveXYFrame = _interopRequireDefault(require("./ResponsiveXYFrame"));

var _ResponsiveOrdinalFrame = _interopRequireDefault(require("./ResponsiveOrdinalFrame"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ResponsiveFrameComponents = {
  ResponsiveXYFrame: _ResponsiveXYFrame.default,
  ResponsiveMinimapXYFrame: _ResponsiveMinimapXYFrame.default,
  ResponsiveNetworkFrame: _ResponsiveNetworkFrame.default,
  ResponsiveOrdinalFrame: _ResponsiveOrdinalFrame.default
};
describe("ResponsiveFrameComponents", function () {
  Object.keys(ResponsiveFrameComponents).forEach(function (componentName) {
    var ResponsiveFrameComponent = ResponsiveFrameComponents[componentName];
    var mounted;
    it("".concat(componentName, " renders"), function () {
      mounted = (0, _enzyme.mount)(_react.default.createElement(ResponsiveFrameComponent, {
        dataVersion: "foo",
        disableContext: true,
        responsiveHeight: true,
        responsiveWidth: true
      }));
    });
    it("the ".concat(componentName, " have a responsive container classed div"), function () {
      expect(mounted.find("div.responsive-container").length).toEqual(1);
    });
  });
});