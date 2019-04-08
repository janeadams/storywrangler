"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Subject2 = _interopRequireDefault(require("./Subject"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Handle = _interopRequireDefault(require("../Handle"));

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

var SubjectCustom =
/*#__PURE__*/
function (_Subject) {
  _inherits(SubjectCustom, _Subject);

  function SubjectCustom() {
    _classCallCheck(this, SubjectCustom);

    return _possibleConstructorReturn(this, _getPrototypeOf(SubjectCustom).apply(this, arguments));
  }

  _createClass(SubjectCustom, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          _this$props$custom = _this$props.custom,
          custom = _this$props$custom === void 0 ? "M0,0" : _this$props$custom,
          editMode = _this$props.editMode,
          transform = _this$props.transform;
      var handles;

      if (editMode) {
        handles = _react.default.createElement(_Handle.default, {
          handleStart: this.props.dragStart,
          handleStop: this.props.dragEnd,
          handleDrag: this.props.dragSubject
        });
      }

      return _react.default.createElement("g", {
        className: "annotation-subject"
      }, _react.default.createElement("g", {
        transform: transform
      }, typeof custom === "string" ? _react.default.createElement("path", {
        d: custom,
        pointerEvents: "none"
      }) : _react.default.createElement("g", {
        pointerEvents: "none"
      }, custom)), handles);
    }
  }]);

  return SubjectCustom;
}(_Subject2.default);

exports.default = SubjectCustom;
SubjectCustom.propTypes = {
  editMode: _propTypes.default.bool
};