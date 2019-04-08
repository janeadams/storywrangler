"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _XYFrame = _interopRequireDefault(require("./XYFrame"));

var _MiniMap = _interopRequireDefault(require("./MiniMap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MinimapXYFrame =
/*#__PURE__*/
function (_React$Component) {
  _inherits(MinimapXYFrame, _React$Component);

  function MinimapXYFrame(props) {
    var _this;

    _classCallCheck(this, MinimapXYFrame);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MinimapXYFrame).call(this, props));
    _this.generateMinimap = _this.generateMinimap.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(MinimapXYFrame, [{
    key: "generateMinimap",
    value: function generateMinimap() {
      var _this$props = this.props,
          xAccessor = _this$props.xAccessor,
          yAccessor = _this$props.yAccessor,
          points = _this$props.points,
          lines = _this$props.lines,
          minimap = _this$props.minimap,
          areas = _this$props.areas,
          _this$props$summaries = _this$props.summaries,
          summaries = _this$props$summaries === void 0 ? "areas" in minimap ? minimap.areas : areas : _this$props$summaries,
          size = _this$props.size,
          lineDataAccessor = _this$props.lineDataAccessor,
          lineType = _this$props.lineType,
          lineStyle = _this$props.lineStyle,
          summaryStyle = _this$props.summaryStyle,
          pointStyle = _this$props.pointStyle,
          lineClass = _this$props.lineClass,
          summaryClass = _this$props.summaryClass,
          pointClass = _this$props.pointClass,
          lineRenderMode = _this$props.lineRenderMode,
          pointRenderMode = _this$props.pointRenderMode,
          summaryRenderMode = _this$props.summaryRenderMode,
          canvasLines = _this$props.canvasLines,
          canvasPoints = _this$props.canvasPoints,
          canvasSummaries = _this$props.canvasSummaries,
          axes = _this$props.axes,
          margin = _this$props.margin,
          useSpans = _this$props.useSpans,
          name = _this$props.name,
          annotations = _this$props.annotations,
          areaType = _this$props.areaType,
          summaryType = _this$props.summaryType;
      var miniDefaults = {
        position: [0, 0],
        size: [size[0], size[1] * 0.25],
        xAccessor: xAccessor,
        yAccessor: yAccessor,
        points: points,
        lines: lines,
        summaries: summaries,
        lineDataAccessor: lineDataAccessor,
        xBrushable: true,
        yBrushable: true,
        brushStart: function brushStart() {},
        brush: function brush() {},
        brushEnd: function brushEnd() {},
        lineType: lineType,
        lineStyle: lineStyle,
        summaryStyle: summaryStyle,
        pointStyle: pointStyle,
        lineClass: lineClass,
        summaryClass: summaryClass,
        pointClass: pointClass,
        lineRenderMode: lineRenderMode,
        pointRenderMode: pointRenderMode,
        summaryRenderMode: summaryRenderMode,
        canvasLines: canvasLines,
        canvasPoints: canvasPoints,
        canvasSummaries: canvasSummaries,
        axes: axes,
        margin: margin,
        useSpans: useSpans,
        name: name,
        annotations: annotations,
        areaType: areaType,
        summaryType: summaryType
      };

      var combinedOptions = _objectSpread({}, miniDefaults, minimap, {
        hoverAnnotation: false
      });

      return React.createElement(_MiniMap.default, combinedOptions);
    }
  }, {
    key: "render",
    value: function render() {
      var miniMap = this.generateMinimap();
      var options = {};

      var _this$props2 = this.props,
          minimap = _this$props2.minimap,
          renderBefore = _this$props2.renderBefore,
          rest = _objectWithoutProperties(_this$props2, ["minimap", "renderBefore"]);

      if (renderBefore) {
        options.beforeElements = miniMap;
      } else {
        options.afterElements = miniMap;
      }

      return React.createElement(_XYFrame.default, _extends({}, rest, options));
    }
  }]);

  return MinimapXYFrame;
}(React.Component);

_defineProperty(MinimapXYFrame, "displayName", "MinimapXYFrame");

var _default = MinimapXYFrame;
exports.default = _default;
module.exports = exports.default;