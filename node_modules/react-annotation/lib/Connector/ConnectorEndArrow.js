"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _endArrow = _interopRequireDefault(require("viz-annotation/lib/Connector/end-arrow"));

var _ConnectorEnd2 = _interopRequireDefault(require("./ConnectorEnd"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ConnectorEndArrow =
/*#__PURE__*/
function (_ConnectorEnd) {
  _inherits(ConnectorEndArrow, _ConnectorEnd);

  function ConnectorEndArrow() {
    _classCallCheck(this, ConnectorEndArrow);

    return _possibleConstructorReturn(this, _getPrototypeOf(ConnectorEndArrow).apply(this, arguments));
  }

  _createClass(ConnectorEndArrow, [{
    key: "getComponents",
    value: function getComponents(_ref) {
      var x = _ref.x,
          y = _ref.y,
          dy = _ref.dy,
          dx = _ref.dx,
          lineData = _ref.lineData,
          scale = _ref.scale;
      var start = lineData[1];
      var end = lineData[0];
      var distance = Math.sqrt(Math.pow(start[0] - end[0], 2) + Math.pow(start[1] - end[1], 2));

      if (distance < 5 && lineData[2]) {
        start = lineData[2];
      }

      return (0, _endArrow.default)({
        x: x,
        y: y,
        dx: dx,
        dy: dy,
        start: start,
        end: end,
        scale: scale
      });
    }
  }]);

  return ConnectorEndArrow;
}(_ConnectorEnd2.default);

exports.default = ConnectorEndArrow;
ConnectorEndArrow.propTypes = {
  x: _propTypes.default.number,
  y: _propTypes.default.number,
  dx: _propTypes.default.number,
  dy: _propTypes.default.number,
  scale: _propTypes.default.number,
  lineData: _propTypes.default.array
};