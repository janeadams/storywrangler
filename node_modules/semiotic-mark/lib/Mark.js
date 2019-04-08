"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _d3Selection = require("d3-selection");

require("d3-transition");

var _drawing = require("./markBehavior/drawing");

var _generator = require("roughjs-es5/lib/generator");

var _markTransition = require("./constants/markTransition");

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function generateSketchyHash(props) {
  var _props$style = props.style,
      style = _props$style === undefined ? {} : _props$style;

  var sketchyHash = "";
  _markTransition.redrawSketchyList.forEach(function (d) {
    sketchyHash += "-" + (style[d] || props[d]);
  });
  return sketchyHash;
}

var Mark = function (_React$Component) {
  _inherits(Mark, _React$Component);

  function Mark(props) {
    _classCallCheck(this, Mark);

    var _this = _possibleConstructorReturn(this, (Mark.__proto__ || Object.getPrototypeOf(Mark)).call(this, props));

    _this._mouseup = _this._mouseup.bind(_this);
    _this._mousedown = _this._mousedown.bind(_this);
    _this._mousemove = _this._mousemove.bind(_this);

    _this.state = {
      translate: [0, 0],
      mouseOrigin: [],
      translateOrigin: [0, 0],
      dragging: false,
      uiUpdate: false,
      sketchyFill: undefined,
      sketchyHash: ""
    };
    return _this;
  }

  _createClass(Mark, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      this.updateSketchy(nextProps);
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      this.updateSketchy(this.props);
    }
  }, {
    key: "updateSketchy",
    value: function updateSketchy(nextProps) {
      var renderOptions = nextProps.renderMode !== null && _typeof(nextProps.renderMode) === "object" ? nextProps.renderMode : { renderMode: nextProps.renderMode };

      var sketchyHash = renderOptions.renderMode === "sketchy" && generateSketchyHash(nextProps);
      if (sketchyHash && sketchyHash !== this.state.sketchyHash) {
        var _nextProps$style = nextProps.style,
            style = _nextProps$style === undefined ? {} : _nextProps$style;
        var _renderOptions$simpli = renderOptions.simplification,
            simplification = _renderOptions$simpli === undefined ? 0 : _renderOptions$simpli,
            _renderOptions$curveS = renderOptions.curveStepCount,
            curveStepCount = _renderOptions$curveS === undefined ? 9 : _renderOptions$curveS,
            _renderOptions$fillSt = renderOptions.fillStyle,
            fillStyle = _renderOptions$fillSt === undefined ? "hachure" : _renderOptions$fillSt,
            _renderOptions$roughn = renderOptions.roughness,
            roughness = _renderOptions$roughn === undefined ? 1 : _renderOptions$roughn,
            _renderOptions$bowing = renderOptions.bowing,
            bowing = _renderOptions$bowing === undefined ? 1 : _renderOptions$bowing,
            _renderOptions$fillWe = renderOptions.fillWeight,
            fillWeight = _renderOptions$fillWe === undefined ? 1 : _renderOptions$fillWe,
            _renderOptions$hachur = renderOptions.hachureAngle,
            hachureAngle = _renderOptions$hachur === undefined ? -41 : _renderOptions$hachur;


        var roughGenerator = new _generator.RoughGenerator({}, { width: 1000, height: 1000 });
        var drawingInstructions = void 0;
        var roughOptions = {
          fill: style.fill || nextProps.fill,
          stroke: style.stroke || nextProps.stroke,
          strokeWidth: style.strokeWidth || nextProps.strokeWidth,
          fillStyle: fillStyle,
          roughness: roughness,
          bowing: bowing,
          fillWeight: fillWeight,
          hachureAngle: hachureAngle,
          hachureGap: renderOptions.hachureGap || style.fillOpacity && (5 - style.fillOpacity * 5) * fillWeight || fillWeight * 2,
          curveStepCount: curveStepCount,
          simplification: simplification
        };

        switch (nextProps.markType) {
          case "line":
            drawingInstructions = roughGenerator.line(nextProps.x1 || 0, nextProps.y1 || 0, nextProps.x2 || 0, nextProps.y2 || 0, roughOptions);
            break;
          case "rect":
            if (nextProps.rx || nextProps.ry) {
              drawingInstructions = roughGenerator.circle((nextProps.x || 0) + nextProps.width / 2, (nextProps.y || 0) + nextProps.width / 2, nextProps.width, roughOptions);
            } else {
              drawingInstructions = roughGenerator.rectangle(nextProps.x || 0, nextProps.y || 0, nextProps.width, nextProps.height, roughOptions);
            }
            break;
          case "circle":
            drawingInstructions = roughGenerator.circle(nextProps.cx || 0, nextProps.cy || 0, nextProps.r * 2, roughOptions);
            break;
          case "ellipse":
            drawingInstructions = roughGenerator.ellipse(nextProps.x || 0, nextProps.y || 0, nextProps.width, nextProps.height, roughOptions);
            break;
          case "polygon":
            drawingInstructions = roughGenerator.polygon(nextProps.points, roughOptions);
            break;
          case "path":
            drawingInstructions = roughGenerator.path(nextProps.d, roughOptions);
            break;
        }

        var roughPieces = [];
        roughGenerator.toPaths(drawingInstructions).forEach(function (_ref, i) {
          var d = _ref.d,
              fill = _ref.fill,
              stroke = _ref.stroke,
              strokeWidth = _ref.strokeWidth,
              pattern = _ref.pattern;

          if (pattern) {
            var roughRandomID = "rough-" + Math.random();
            roughPieces.push(_react2.default.createElement(
              "pattern",
              {
                key: "pattern-" + i,
                id: roughRandomID,
                x: pattern.x,
                y: pattern.y,
                height: pattern.height,
                width: pattern.width,
                viewBox: pattern.viewBox
              },
              _react2.default.createElement("path", {
                key: "pattern-path-" + i,
                d: pattern.path.d,
                style: {
                  fill: pattern.path.fill,
                  stroke: pattern.path.stroke,
                  strokeWidth: pattern.path.strokeWidth
                }
              })
            ));
            fill = "url(#" + roughRandomID + ")";
          }
          roughPieces.push(_react2.default.createElement("path", {
            key: "path-" + i,
            d: d,
            style: {
              fill: fill,
              stroke: stroke,
              strokeWidth: strokeWidth
            },
            transform: nextProps.transform
          }));
        });

        this.setState({
          sketchyHash: sketchyHash,
          sketchyFill: roughPieces
        });
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      var _this2 = this;

      if (nextProps.renderMode || this.props.renderMode || this.props.markType !== nextProps.markType || this.state.dragging || this.props.forceUpdate || nextProps.forceUpdate || this.props.className !== nextProps.className || this.props.children !== nextProps.children || this.props.customTween && !nextProps.customTween || !this.props.customTween && nextProps.customTween) {
        return true;
      }

      var canvas = this.props.canvas !== true && this.props.canvas || this.context && this.context.canvas;

      var node = this.node;

      var actualSVG = (0, _drawing.generateSVG)(nextProps, nextProps.className);
      var cloneProps = actualSVG.props;

      if (!cloneProps) {
        return true;
      }

      var _nextProps$transition = nextProps.transitionDuration,
          transitionDuration = _nextProps$transition === undefined ? {} : _nextProps$transition;

      var isDefault = typeof transitionDuration === "number";
      var defaultDuration = isDefault ? transitionDuration : 1000;
      transitionDuration = isDefault ? { default: defaultDuration } : _extends({ default: defaultDuration }, transitionDuration);

      var newProps = Object.keys(cloneProps).filter(function (d) {
        return d !== "style";
      });
      var oldProps = Object.keys(this.props).filter(function (d) {
        return d !== "style" && !newProps.find(function (p) {
          return p === d;
        });
      });

      var hasTransition = (0, _d3Selection.select)(node).select("*").transition;

      function adjustedPropName(propname) {
        return _markTransition.reactCSSNameStyleHash[propname] || propname;
      }

      oldProps.forEach(function (oldProp) {
        if (oldProp !== "style") {
          (0, _d3Selection.select)(node).select("*").attr(adjustedPropName(oldProp), undefined);
        }
      });

      newProps.forEach(function (newProp) {
        if (!hasTransition || !_markTransition.attributeTransitionWhitelist.find(function (d) {
          return d === newProp;
        }) || newProp === "d" && (0, _markTransition.differentD)(cloneProps.d, _this2.props.d)) {
          if (newProp === "d" && nextProps.customTween) {
            (0, _d3Selection.select)(node).select("*").attr("d", nextProps.customTween.fn(nextProps.customTween.props, nextProps.customTween.props)(1));
          } else {
            (0, _d3Selection.select)(node).select("*").attr(adjustedPropName(newProp), cloneProps[newProp]);
          }
        } else {
          var _transitionDuration = transitionDuration,
              defaultDur = _transitionDuration.default,
              _transitionDuration$n = _transitionDuration[newProp],
              appliedDuration = _transitionDuration$n === undefined ? defaultDur : _transitionDuration$n;


          if (newProp === "d" && nextProps.customTween) {
            var initialTweenProps = _extends({}, _this2.props.customTween.props);
            var nextTweenProps = _extends({}, nextProps.customTween.props);
            (0, _d3Selection.select)(node).select("*").transition(adjustedPropName("d")).duration(appliedDuration).attrTween("d", function () {
              return nextProps.customTween.fn(initialTweenProps, nextTweenProps);
            });
          } else {
            (0, _d3Selection.select)(node).select("*").transition(adjustedPropName(newProp)).duration(appliedDuration).attr(adjustedPropName(newProp), cloneProps[newProp]);
          }
        }
      });

      var newStyleProps = Object.keys(cloneProps.style || {});
      var oldStyleProps = Object.keys(this.props.style || {}).filter(function (d) {
        return !newStyleProps.find(function (p) {
          return p === d;
        });
      });

      oldStyleProps.forEach(function (oldProp) {
        (0, _d3Selection.select)(node).select("*").style(adjustedPropName(oldProp), undefined);
      });

      newStyleProps.forEach(function (newProp) {
        if (!hasTransition) {
          (0, _d3Selection.select)(node).select("*").style(adjustedPropName(newProp), cloneProps.style[newProp]);
        } else {
          var _transitionDuration2 = transitionDuration,
              defaultDur = _transitionDuration2.default,
              _transitionDuration2$ = _transitionDuration2[newProp],
              appliedDuration = _transitionDuration2$ === undefined ? defaultDur : _transitionDuration2$;


          (0, _d3Selection.select)(node).select("*").transition(adjustedPropName(newProp)).duration(appliedDuration).style(adjustedPropName(newProp), cloneProps.style[newProp]);
        }
      });

      return false;
    }
  }, {
    key: "_mouseup",
    value: function _mouseup() {
      document.onmousemove = null;

      var finalTranslate = [0, 0];
      if (!this.props.resetAfter) finalTranslate = this.state.translate;

      this.setState({
        dragging: false,
        translate: finalTranslate,
        uiUpdate: false
      });
      if (this.props.dropFunction && this.props.context && this.props.context.dragSource) {
        this.props.dropFunction(this.props.context.dragSource.props, this.props);
        this.props.updateContext("dragSource", undefined);
      }
    }
  }, {
    key: "_mousedown",
    value: function _mousedown(event) {
      this.setState({
        mouseOrigin: [event.pageX, event.pageY],
        translateOrigin: this.state.translate,
        dragging: true
      });
      document.onmouseup = this._mouseup;
      document.onmousemove = this._mousemove;
    }
  }, {
    key: "_mousemove",
    value: function _mousemove(event) {
      var xAdjust = this.props.freezeX ? 0 : 1;
      var yAdjust = this.props.freezeY ? 0 : 1;

      var adjustedPosition = [event.pageX - this.state.mouseOrigin[0], event.pageY - this.state.mouseOrigin[1]];
      var adjustedTranslate = [(adjustedPosition[0] + this.state.translateOrigin[0]) * xAdjust, (adjustedPosition[1] + this.state.translateOrigin[1]) * yAdjust];
      if (this.props.dropFunction && this.state.uiUpdate === false) {
        this.props.updateContext("dragSource", this);
        this.setState({
          translate: adjustedTranslate,
          uiUpdate: true,
          dragging: true
        });
      } else {
        this.setState({ translate: adjustedTranslate });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var className = this.props.className || "";

      var mouseIn = null;
      var mouseOut = null;

      var actualSVG = (this.props.renderMode === "sketchy" || this.props.renderMode && this.props.renderMode.renderMode === "sketchy") && this.state.sketchyFill || (0, _drawing.generateSVG)(this.props, className);

      if (this.props.draggable) {
        return _react2.default.createElement(
          "g",
          {
            ref: function ref(node) {
              return _this3.node = node;
            },
            className: className,
            onMouseEnter: mouseIn,
            onMouseOut: mouseOut,
            onDoubleClick: this._doubleclick,
            style: {
              pointerEvents: this.props.dropFunction && this.state.dragging ? "none" : "all"
            },
            onMouseDown: this._mousedown,
            onMouseUp: this._mouseup,
            transform: "translate(" + this.state.translate + ")",
            "aria-label": this.props["aria-label"]
          },
          actualSVG
        );
      } else {
        return _react2.default.createElement(
          "g",
          {
            ref: function ref(node) {
              return _this3.node = node;
            },
            className: className,
            onMouseEnter: mouseIn,
            onMouseOut: mouseOut,
            "aria-label": this.props["aria-label"]
          },
          actualSVG
        );
      }
    }
  }]);

  return Mark;
}(_react2.default.Component);

Mark.propTypes = {
  markType: _propTypes2.default.string.isRequired,
  forceUpdate: _propTypes2.default.bool,
  renderMode: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func, _propTypes2.default.object]),
  draggable: _propTypes2.default.bool,
  dropFunction: _propTypes2.default.func,
  resetAfter: _propTypes2.default.bool,
  freezeX: _propTypes2.default.bool,
  freezeY: _propTypes2.default.bool,
  context: _propTypes2.default.object,
  updateContext: _propTypes2.default.func,
  className: _propTypes2.default.string
};

Mark.contextTypes = {
  canvas: _propTypes2.default.object
};

exports.default = Mark;
module.exports = exports['default'];