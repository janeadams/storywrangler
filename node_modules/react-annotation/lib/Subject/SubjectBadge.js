"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _badge = _interopRequireDefault(require("viz-annotation/lib/Subject/badge"));

var _Subject2 = _interopRequireDefault(require("./Subject"));

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

var SubjectBadge =
/*#__PURE__*/
function (_Subject) {
  _inherits(SubjectBadge, _Subject);

  function SubjectBadge() {
    _classCallCheck(this, SubjectBadge);

    return _possibleConstructorReturn(this, _getPrototypeOf(SubjectBadge).apply(this, arguments));
  }

  _createClass(SubjectBadge, [{
    key: "getComponents",
    value: function getComponents(_ref) {
      var leftRight = _ref.leftRight,
          topBottom = _ref.topBottom,
          text = _ref.text,
          editMode = _ref.editMode,
          color = _ref.color,
          radius = _ref.radius;
      var components = (0, _badge.default)({
        leftRight: leftRight,
        topBottom: topBottom,
        text: text,
        editMode: editMode,
        color: color,
        radius: radius
      });
      components.handleKeys = {
        leftRight: leftRight,
        topBottom: topBottom
      };

      components.handleFunction = function (h, data) {
        var lr = data.oDeltaX < -radius * 2 ? "left" : data.oDeltaX > radius * 2 ? "right" : undefined;
        var tb = data.oDeltaY < -radius * 2 ? "top" : data.oDeltaY > radius * 2 ? "bottom" : undefined;
        return {
          leftRight: lr,
          topBottom: tb
        };
      };

      return components;
    }
  }]);

  return SubjectBadge;
}(_Subject2.default);

exports.default = SubjectBadge;
SubjectBadge.propTypes = {
  leftRight: _propTypes.default.oneOf(["left", "right"]),
  topBottom: _propTypes.default.oneOf(["top", "bottom"]),
  text: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  color: _propTypes.default.string,
  editMode: _propTypes.default.bool
};