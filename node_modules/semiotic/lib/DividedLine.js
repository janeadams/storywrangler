"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _d3Shape = require("d3-shape");

var _lineDrawing = require("./svg/lineDrawing");

var _semioticMark = require("semiotic-mark");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DividedLine =
/*#__PURE__*/
function (_React$Component) {
  _inherits(DividedLine, _React$Component);

  function DividedLine(props) {
    var _this;

    _classCallCheck(this, DividedLine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DividedLine).call(this, props));
    _this.createLineSegments = _this.createLineSegments.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(DividedLine, [{
    key: "createLineSegments",
    value: function createLineSegments() {
      var _this$props = this.props,
          parameters = _this$props.parameters,
          className = _this$props.className,
          _this$props$interpola = _this$props.interpolate,
          interpolate = _this$props$interpola === void 0 ? _d3Shape.curveLinear : _this$props$interpola,
          customAccessors = _this$props.customAccessors,
          lineDataAccessor = _this$props.lineDataAccessor,
          data = _this$props.data,
          searchIterations = _this$props.searchIterations,
          rest = _objectWithoutProperties(_this$props, ["parameters", "className", "interpolate", "customAccessors", "lineDataAccessor", "data", "searchIterations"]);

      var x = customAccessors.x,
          y = customAccessors.y;
      var lineData = (0, _lineDrawing.projectLineData)({
        data: data,
        lineDataAccessor: [lineDataAccessor],
        xProp: "x",
        yProp: "y",
        xAccessor: [x],
        yAccessor: [y]
      }); //Compatibility before Semiotic 2

      lineData.forEach(function (projectedD) {
        projectedD.data = projectedD.data.map(function (d) {
          return _objectSpread({}, d.data, d);
        });
      });
      var lines = (0, _lineDrawing.dividedLine)(parameters, lineData[0].data, searchIterations);
      var lineRender = (0, _d3Shape.line)().curve(interpolate).x(function (d) {
        return d.x;
      }).y(function (d) {
        return d.y;
      });
      return lines.map(function (d, i) {
        return React.createElement(_semioticMark.Mark, _extends({}, rest, {
          className: className,
          markType: "path",
          key: "DividedLine-".concat(i),
          style: d.key,
          d: lineRender(d.points)
        }));
      });
    }
  }, {
    key: "render",
    value: function render() {
      var lines = this.createLineSegments();
      return React.createElement("g", null, lines);
    }
  }]);

  return DividedLine;
}(React.Component);

var _default = DividedLine;
exports.default = _default;
module.exports = exports.default;