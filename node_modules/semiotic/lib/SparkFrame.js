"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.networkFrameDefaults = exports.ordinalFrameDefaults = exports.xyFrameDefaults = exports.axisDefaults = void 0;

var React = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var allFrameDefaults = {
  margin: 0
};

function sparkNetworkSettings() {
  var originalSettings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "force";
  var finalSettings = {};

  if (originalSettings) {
    finalSettings = originalSettings;
    if (originalSettings === "force") finalSettings = {
      type: "force"
    };
    return _objectSpread({
      edgeStrength: 2,
      edgeDistance: 5,
      nodePadding: 1,
      nodeWidth: 5,
      groupWidth: 4
    }, finalSettings);
  }

  return originalSettings;
}

var createSparkFrame = function createSparkFrame(Frame, defaults, frameName) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(SparkFrame, _React$Component);

    function SparkFrame(props) {
      var _this;

      _classCallCheck(this, SparkFrame);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SparkFrame).call(this, props));

      _defineProperty(_assertThisInitialized(_this), "node", null);

      _defineProperty(_assertThisInitialized(_this), "_onResize", function (width, height) {
        _this.setState({
          containerHeight: height,
          containerWidth: width
        });
      });

      _this.state = {
        containerHeight: props.size[1],
        containerWidth: props.size[0]
      };
      return _this;
    }

    _createClass(SparkFrame, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var element = this.node;
        var lineHeight = +window.getComputedStyle(element).lineHeight.split("px")[0] - 5;
        this.setState({
          containerHeight: isNaN(lineHeight) ? element.offsetHeight : lineHeight,
          containerWidth: element.offsetWidth
        });
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        var _this$props = this.props,
            size = _this$props.size,
            _this$props$style = _this$props.style,
            style = _this$props$style === void 0 ? {} : _this$props$style;
        var _this$state$container = this.state.containerHeight,
            containerHeight = _this$state$container === void 0 ? 30 : _this$state$container;
        var actualSize = [];
        actualSize[0] = typeof size === "number" ? size : size[0] ? size[0] : containerHeight;
        actualSize[1] = containerHeight;
        return React.createElement("span", {
          style: _extends({
            width: "".concat(actualSize[0], "px"),
            height: "".concat(actualSize[1], "px"),
            display: "inline-block",
            marginLeft: "5px",
            marginRight: "5px"
          }, style),
          ref: function ref(node) {
            return _this2.node = node;
          }
        }, React.createElement(Frame, _extends({}, defaults(this.props), {
          size: actualSize,
          useSpans: true
        })));
      }
    }]);

    return SparkFrame;
  }(React.Component), _defineProperty(_class, "displayName", frameName), _defineProperty(_class, "defaultProps", {
    size: []
  }), _temp;
};

var axisDefaults = {
  tickFormat: function tickFormat() {
    return "";
  },
  baseline: false
};
exports.axisDefaults = axisDefaults;

var xyFrameDefaults = function xyFrameDefaults(props) {
  return _objectSpread({}, allFrameDefaults, props, {
    hoverAnnotation: props.hoverAnnotation,
    axes: props.axes ? props.axes.map(function (a) {
      return _objectSpread({}, axisDefaults, a);
    }) : props.axes
  });
};

exports.xyFrameDefaults = xyFrameDefaults;

var ordinalFrameDefaults = function ordinalFrameDefaults(props) {
  return _objectSpread({}, allFrameDefaults, props, {
    hoverAnnotation: props.hoverAnnotation,
    axis: props.axis ? _objectSpread({
      axisDefaults: axisDefaults
    }, props.axis) : props.axis
  });
};

exports.ordinalFrameDefaults = ordinalFrameDefaults;

var networkFrameDefaults = function networkFrameDefaults(props) {
  return _objectSpread({}, allFrameDefaults, {
    nodeSizeAccessor: 2
  }, props, {
    networkType: sparkNetworkSettings(props.networkType) //  hoverAnnotation: props.hoverAnnotation === true ? [{ type: "react-annotation"}] : props.hoverAnnotation,

  });
};

exports.networkFrameDefaults = networkFrameDefaults;
var _default = createSparkFrame;
exports.default = _default;