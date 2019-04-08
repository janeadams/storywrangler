"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _typeLine = _interopRequireDefault(require("viz-annotation/lib/Connector/type-line"));

var _Connector2 = _interopRequireDefault(require("./Connector"));

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

var ConnectorLine =
/*#__PURE__*/
function (_Connector) {
  _inherits(ConnectorLine, _Connector);

  function ConnectorLine() {
    _classCallCheck(this, ConnectorLine);

    return _possibleConstructorReturn(this, _getPrototypeOf(ConnectorLine).apply(this, arguments));
  }

  _createClass(ConnectorLine, [{
    key: "getComponents",
    value: function getComponents(_ref) {
      var x = _ref.x,
          y = _ref.y,
          dy = _ref.dy,
          dx = _ref.dx,
          radius = _ref.radius,
          outerRadius = _ref.outerRadius,
          width = _ref.width,
          height = _ref.height;
      return (0, _typeLine.default)({
        x: x,
        y: y,
        dx: dx,
        dy: dy,
        radius: radius,
        outerRadius: outerRadius,
        width: width,
        height: height
      });
    }
  }]);

  return ConnectorLine;
}(_Connector2.default);

exports.default = ConnectorLine;