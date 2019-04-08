"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _NetworkFrame2 = _interopRequireDefault(require("./NetworkFrame"));

var _MiniMap = _interopRequireDefault(require("./MiniMap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var MinimapNetworkFrame =
/*#__PURE__*/
function (_NetworkFrame) {
  _inherits(MinimapNetworkFrame, _NetworkFrame);

  function MinimapNetworkFrame(props) {
    var _this;

    _classCallCheck(this, MinimapNetworkFrame);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MinimapNetworkFrame).call(this, props));
    _this.generateMinimap = _this.generateMinimap.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(MinimapNetworkFrame, [{
    key: "generateMinimap",
    value: function generateMinimap() {
      var miniDefaults = {
        title: "",
        position: [0, 0],
        size: [this.props.size[0] * 5, this.props.size[1] * 5],
        edges: this.props.edges,
        nodes: this.props.nodes,
        xBrushable: true,
        yBrushable: true,
        brushStart: function brushStart() {},
        brush: function brush() {},
        brushEnd: function brushEnd() {}
      };

      var combinedOptions = _extends(miniDefaults, this.props.minimap);

      combinedOptions.hoverAnnotation = false;
      return React.createElement(_MiniMap.default, combinedOptions);
    }
  }, {
    key: "render",
    value: function render() {
      var miniMap = this.generateMinimap();
      var options = {};

      if (this.props.renderBefore) {
        options.beforeElements = miniMap;
      } else {
        options.afterElements = miniMap;
      }

      return React.createElement("div", null, "Build out NetworkFrameMinimap Soon");
    }
  }]);

  return MinimapNetworkFrame;
}(_NetworkFrame2.default);

var _default = MinimapNetworkFrame;
exports.default = _default;
module.exports = exports.default;