"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _AnnotationLayer = _interopRequireDefault(require("./AnnotationLayer"));

var _InteractionLayer = _interopRequireDefault(require("./InteractionLayer"));

var _VisualizationLayer = _interopRequireDefault(require("./VisualizationLayer"));

var _frameFunctions = require("./svg/frameFunctions");

var _jsx = require("./constants/jsx");

var _SpanOrDiv = _interopRequireDefault(require("./SpanOrDiv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultZeroMargin = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0
};

var Frame =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Frame, _React$Component);

  function Frame(props) {
    var _this;

    _classCallCheck(this, Frame);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Frame).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "canvasContext", null);

    _defineProperty(_assertThisInitialized(_this), "setVoronoi", function (d) {
      _this.setState({
        voronoiHover: d
      });
    });

    _this.state = {
      canvasContext: null,
      voronoiHover: undefined
    };
    return _this;
  }

  _createClass(Frame, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        canvasContext: this.canvasContext
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.canvasContext !== this.state.canvasContext) this.setState({
        canvasContext: this.canvasContext
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          axes = _this$props.axes,
          axesTickLines = _this$props.axesTickLines,
          _this$props$className = _this$props.className,
          className = _this$props$className === void 0 ? "" : _this$props$className,
          matte = _this$props.matte,
          _this$props$name = _this$props.name,
          name = _this$props$name === void 0 ? "" : _this$props$name,
          frameKey = _this$props.frameKey,
          projectedCoordinateNames = _this$props.projectedCoordinateNames,
          renderPipeline = _this$props.renderPipeline,
          size = _this$props.size,
          _this$props$adjustedS = _this$props.adjustedSize,
          adjustedSize = _this$props$adjustedS === void 0 ? size : _this$props$adjustedS,
          title = _this$props.title,
          xScale = _this$props.xScale,
          yScale = _this$props.yScale,
          dataVersion = _this$props.dataVersion,
          annotations = _this$props.annotations,
          hoverAnnotation = _this$props.hoverAnnotation,
          projectedYMiddle = _this$props.projectedYMiddle,
          interaction = _this$props.interaction,
          customClickBehavior = _this$props.customClickBehavior,
          customHoverBehavior = _this$props.customHoverBehavior,
          customDoubleClickBehavior = _this$props.customDoubleClickBehavior,
          points = _this$props.points,
          _this$props$margin = _this$props.margin,
          margin = _this$props$margin === void 0 ? defaultZeroMargin : _this$props$margin,
          backgroundGraphics = _this$props.backgroundGraphics,
          foregroundGraphics = _this$props.foregroundGraphics,
          beforeElements = _this$props.beforeElements,
          afterElements = _this$props.afterElements,
          downloadButton = _this$props.downloadButton,
          defaultSVGRule = _this$props.defaultSVGRule,
          defaultHTMLRule = _this$props.defaultHTMLRule,
          adjustedPosition = _this$props.adjustedPosition,
          legendSettings = _this$props.legendSettings,
          annotationSettings = _this$props.annotationSettings,
          overlay = _this$props.overlay,
          columns = _this$props.columns,
          rScale = _this$props.rScale,
          projection = _this$props.projection,
          interactionOverflow = _this$props.interactionOverflow,
          canvasPostProcess = _this$props.canvasPostProcess,
          baseMarkProps = _this$props.baseMarkProps,
          useSpans = _this$props.useSpans,
          canvasRendering = _this$props.canvasRendering,
          renderOrder = _this$props.renderOrder,
          additionalDefs = _this$props.additionalDefs,
          showLinePoints = _this$props.showLinePoints,
          _this$props$disableCa = _this$props.disableCanvasInteraction,
          disableCanvasInteraction = _this$props$disableCa === void 0 ? false : _this$props$disableCa;
      var voronoiHover = this.state.voronoiHover;
      var areaAnnotations = [];
      var totalAnnotations = annotations ? [].concat(_toConsumableArray(annotations), areaAnnotations) : areaAnnotations;

      if (voronoiHover) {
        if (Array.isArray(voronoiHover)) {
          totalAnnotations.push.apply(totalAnnotations, _toConsumableArray(voronoiHover));
        } else {
          totalAnnotations.push(voronoiHover);
        }
      }

      var annotationLayer = (totalAnnotations && totalAnnotations.length > 0 || legendSettings) && React.createElement(_AnnotationLayer.default, {
        legendSettings: legendSettings,
        margin: margin,
        axes: axes,
        voronoiHover: this.setVoronoi,
        annotationHandling: annotationSettings,
        pointSizeFunction: annotationSettings.layout && annotationSettings.layout.pointSizeFunction,
        labelSizeFunction: annotationSettings.layout && annotationSettings.layout.labelSizeFunction,
        annotations: totalAnnotations,
        svgAnnotationRule: function svgAnnotationRule(d, i, thisALayer) {
          return defaultSVGRule(_objectSpread({
            d: d,
            i: i,
            annotationLayer: thisALayer
          }, renderPipeline));
        },
        htmlAnnotationRule: function htmlAnnotationRule(d, i, thisALayer) {
          return defaultHTMLRule(_objectSpread({
            d: d,
            i: i,
            annotationLayer: thisALayer
          }, renderPipeline));
        },
        useSpans: useSpans,
        size: adjustedSize,
        position: [adjustedPosition[0] + margin.left, adjustedPosition[1] + margin.top]
      });
      var generatedTitle = (0, _frameFunctions.generateFrameTitle)({
        title: title,
        size: size
      });
      var marginGraphic;
      var finalBackgroundGraphics = typeof backgroundGraphics === "function" ? backgroundGraphics({
        size: size,
        margin: margin
      }) : backgroundGraphics;
      var finalForegroundGraphics = typeof foregroundGraphics === "function" ? foregroundGraphics({
        size: size,
        margin: margin
      }) : foregroundGraphics;

      if (typeof matte === "function") {
        marginGraphic = matte({
          size: size,
          margin: margin
        });
      } else if (React.isValidElement(matte)) {
        marginGraphic = matte;
      } else if (matte === true) {
        marginGraphic = React.createElement("path", {
          fill: "white",
          transform: "translate(".concat(-margin.left, ",").concat(-margin.top, ")"),
          d: (0, _frameFunctions.drawMarginPath)({
            margin: margin,
            size: size,
            inset: 0
          }),
          className: "".concat(name, "-matte")
        });
      }

      var finalFilterDefs = (0, _jsx.filterDefs)({
        matte: marginGraphic,
        key: matte && (frameKey || name),
        additionalDefs: additionalDefs
      });
      return React.createElement(_SpanOrDiv.default, {
        span: useSpans,
        className: "".concat(className, " frame ").concat(name),
        style: {
          background: "none"
        }
      }, beforeElements && React.createElement(_SpanOrDiv.default, {
        span: useSpans,
        className: "".concat(name, " frame-before-elements")
      }, beforeElements), React.createElement(_SpanOrDiv.default, {
        span: useSpans,
        className: "frame-elements",
        style: {
          height: "".concat(size[1], "px"),
          width: "".concat(size[0], "px")
        }
      }, React.createElement(_SpanOrDiv.default, {
        span: useSpans,
        className: "visualization-layer",
        style: {
          position: "absolute"
        }
      }, (axesTickLines || backgroundGraphics) && React.createElement("svg", {
        className: "background-graphics",
        style: {
          position: "absolute"
        },
        width: size[0],
        height: size[1]
      }, backgroundGraphics && React.createElement("g", {
        "aria-hidden": true,
        className: "background-graphics"
      }, finalBackgroundGraphics), axesTickLines && React.createElement("g", {
        transform: "translate(".concat(margin.left, ",").concat(margin.top, ")"),
        key: "visualization-tick-lines",
        className: "axis axis-tick-lines",
        "aria-hidden": true
      }, axesTickLines)), canvasRendering && React.createElement("canvas", {
        className: "frame-canvas",
        ref: function ref(canvasContext) {
          return _this2.canvasContext = canvasContext;
        },
        style: {
          position: "absolute",
          left: "0px",
          top: "0px"
        },
        width: size[0],
        height: size[1]
      }), React.createElement("svg", {
        className: "visualization-layer",
        style: {
          position: "absolute"
        },
        width: size[0],
        height: size[1]
      }, finalFilterDefs, React.createElement(_VisualizationLayer.default, {
        disableContext: this.props.disableContext,
        renderPipeline: renderPipeline,
        position: adjustedPosition,
        size: adjustedSize,
        projectedCoordinateNames: projectedCoordinateNames,
        xScale: xScale,
        yScale: yScale,
        axes: axes,
        title: generatedTitle,
        frameKey: frameKey,
        canvasContext: this.state.canvasContext,
        dataVersion: dataVersion,
        matte: marginGraphic,
        margin: margin,
        canvasPostProcess: canvasPostProcess,
        baseMarkProps: baseMarkProps,
        voronoiHover: this.setVoronoi,
        renderOrder: renderOrder
      }), generatedTitle && React.createElement("g", {
        className: "frame-title"
      }, generatedTitle), foregroundGraphics && React.createElement("g", {
        "aria-hidden": true,
        className: "foreground-graphics"
      }, finalForegroundGraphics))), React.createElement(_InteractionLayer.default, {
        useSpans: useSpans,
        hoverAnnotation: hoverAnnotation,
        projectedX: projectedCoordinateNames.x,
        projectedY: projectedCoordinateNames.y,
        projectedYMiddle: projectedYMiddle,
        interaction: interaction,
        voronoiHover: this.setVoronoi,
        customClickBehavior: customClickBehavior,
        customHoverBehavior: customHoverBehavior,
        customDoubleClickBehavior: customDoubleClickBehavior,
        points: points,
        showLinePoints: showLinePoints,
        canvasRendering: canvasRendering,
        position: adjustedPosition,
        margin: margin,
        size: adjustedSize,
        svgSize: size,
        xScale: xScale,
        yScale: yScale,
        enabled: true,
        overlay: overlay,
        oColumns: columns,
        rScale: rScale,
        projection: projection,
        interactionOverflow: interactionOverflow,
        disableCanvasInteraction: disableCanvasInteraction,
        renderPipeline: renderPipeline
      }), annotationLayer), (downloadButton || afterElements) && React.createElement(_SpanOrDiv.default, {
        span: useSpans,
        className: "".concat(name, " frame-after-elements")
      }, downloadButton, afterElements));
    }
  }]);

  return Frame;
}(React.Component);

_defineProperty(Frame, "defaultProps", {
  annotationSettings: {},
  adjustedPosition: [0, 0],
  projectedCoordinateNames: {
    x: "x",
    y: "y"
  },
  renderOrder: []
});

var _default = Frame;
exports.default = _default;
module.exports = exports.default;