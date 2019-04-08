"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _elementResizeEvent = _interopRequireDefault(require("./vendor/element-resize-event"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var createResponsiveFrame = function createResponsiveFrame(Frame) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(ResponsiveFrame, _React$Component);

    function ResponsiveFrame(props) {
      var _this;

      _classCallCheck(this, ResponsiveFrame);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ResponsiveFrame).call(this, props));

      _defineProperty(_assertThisInitialized(_this), "node", null);

      _defineProperty(_assertThisInitialized(_this), "isResizing", undefined);

      _defineProperty(_assertThisInitialized(_this), "_onResize", function (width, height) {
        _this.setState({
          containerHeight: height,
          containerWidth: width
        });
      });

      _this.state = {
        containerHeight: undefined,
        containerWidth: undefined
      };
      return _this;
    }

    _createClass(ResponsiveFrame, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this2 = this;

        var element = this.node;
        (0, _elementResizeEvent.default)(element, function () {
          window.clearTimeout(_this2.isResizing);
          _this2.isResizing = setTimeout(function () {
            _this2.isResizing = false;

            _this2.setState({
              containerHeight: element.offsetHeight,
              containerWidth: element.offsetWidth
            });
          }, _this2.props.debounce);
        });
        this.setState({
          containerHeight: element.offsetHeight,
          containerWidth: element.offsetWidth
        });
      }
    }, {
      key: "render",
      value: function render() {
        var _this3 = this;

        var _this$props = this.props,
            responsiveWidth = _this$props.responsiveWidth,
            responsiveHeight = _this$props.responsiveHeight,
            size = _this$props.size,
            dataVersion = _this$props.dataVersion,
            debounce = _this$props.debounce,
            gridDisplay = _this$props.gridDisplay,
            rest = _objectWithoutProperties(_this$props, ["responsiveWidth", "responsiveHeight", "size", "dataVersion", "debounce", "gridDisplay"]);

        var _this$state = this.state,
            containerHeight = _this$state.containerHeight,
            containerWidth = _this$state.containerWidth;

        var actualSize = _toConsumableArray(size);

        var returnEmpty = false;

        if (responsiveWidth) {
          if (!containerWidth) returnEmpty = true;
          actualSize[0] = containerWidth;
        }

        if (responsiveHeight) {
          if (!containerHeight) returnEmpty = true;
          actualSize[1] = containerHeight;
        }

        var dataVersionWithSize = dataVersion + actualSize.toString() + debounce;
        return React.createElement("div", {
          className: "responsive-container",
          style: gridDisplay ? {
            minWidth: "0px",
            minHeight: "0px"
          } : {
            height: "100%",
            width: "100%"
          },
          ref: function ref(node) {
            return _this3.node = node;
          }
        }, !returnEmpty && React.createElement(Frame, _extends({}, rest, {
          size: actualSize,
          dataVersion: dataVersion ? dataVersionWithSize : undefined
        })));
      }
    }]);

    return ResponsiveFrame;
  }(React.Component), _defineProperty(_class, "defaultProps", {
    size: [500, 500],
    debounce: 200
  }), _defineProperty(_class, "displayName", "Responsive".concat(Frame.displayName)), _temp;
};

var _default = createResponsiveFrame;
exports.default = _default;
module.exports = exports.default;