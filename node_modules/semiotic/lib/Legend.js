"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var typeHash = {
  fill: function fill(style) {
    return React.createElement("rect", {
      style: style,
      width: 20,
      height: 20
    });
  },
  line: function line(style) {
    return React.createElement("line", {
      style: style,
      x1: 0,
      y1: 0,
      x2: 20,
      y2: 20
    });
  }
};

function renderType(item, i, type, styleFn) {
  var renderedType;

  if (typeof type === "function") {
    renderedType = type(item);
  } else {
    var Type = typeHash[type];
    var style = styleFn(item, i);
    renderedType = Type(style);
  }

  return renderedType;
}

var Legend =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Legend, _React$Component);

  function Legend() {
    _classCallCheck(this, Legend);

    return _possibleConstructorReturn(this, _getPrototypeOf(Legend).apply(this, arguments));
  }

  _createClass(Legend, [{
    key: "renderLegendGroup",
    value: function renderLegendGroup(legendGroup) {
      var _legendGroup$type = legendGroup.type,
          type = _legendGroup$type === void 0 ? "fill" : _legendGroup$type,
          styleFn = legendGroup.styleFn,
          items = legendGroup.items;
      var renderedItems = [];
      var itemOffset = 0;
      items.forEach(function (item, i) {
        var renderedType = renderType(item, i, type, styleFn);
        renderedItems.push(React.createElement("g", {
          key: "legend-item-".concat(i),
          transform: "translate(0,".concat(itemOffset, ")")
        }, renderedType, React.createElement("text", {
          y: 15,
          x: 30
        }, item.label)));
        itemOffset += 25;
      });
      return renderedItems;
    }
  }, {
    key: "renderLegendGroupHorizontal",
    value: function renderLegendGroupHorizontal(legendGroup) {
      var _legendGroup$type2 = legendGroup.type,
          type = _legendGroup$type2 === void 0 ? "fill" : _legendGroup$type2,
          styleFn = legendGroup.styleFn,
          items = legendGroup.items;
      var renderedItems = [];
      var itemOffset = 0;
      items.forEach(function (item, i) {
        var renderedType = renderType(item, i, type, styleFn);
        renderedItems.push(React.createElement("g", {
          key: "legend-item-".concat(i),
          transform: "translate(".concat(itemOffset, ",0)")
        }, renderedType, React.createElement("text", {
          y: 15,
          x: 25
        }, item.label)));
        itemOffset += 35;
        itemOffset += item.label.length * 8;
      });
      return {
        items: renderedItems,
        offset: itemOffset
      };
    }
  }, {
    key: "renderGroup",
    value: function renderGroup(_ref) {
      var _this = this;

      var legendGroups = _ref.legendGroups,
          width = _ref.width;
      var offset = 30;
      var renderedGroups = [];
      legendGroups.forEach(function (l, i) {
        offset += 5;
        renderedGroups.push(React.createElement("line", {
          key: "legend-top-line legend-symbol-".concat(i),
          stroke: "gray",
          x1: 0,
          y1: offset,
          x2: width,
          y2: offset
        }));
        offset += 10;

        if (l.label) {
          offset += 20;
          renderedGroups.push(React.createElement("text", {
            key: "legend-text-".concat(i),
            y: offset,
            className: "legend-group-label"
          }, l.label));
          offset += 10;
        }

        renderedGroups.push(React.createElement("g", {
          key: "legend-group-".concat(i),
          className: "legend-item",
          transform: "translate(0,".concat(offset, ")")
        }, _this.renderLegendGroup(l)));
        offset += l.items.length * 25 + 10;
      });
      return renderedGroups;
    }
  }, {
    key: "renderHorizontalGroup",
    value: function renderHorizontalGroup(_ref2) {
      var _this2 = this;

      var legendGroups = _ref2.legendGroups,
          title = _ref2.title,
          height = _ref2.height;
      var offset = 0;
      var renderedGroups = [];
      var verticalOffset = title === false ? 10 : 40;
      legendGroups.forEach(function (l, i) {
        if (l.label) {
          renderedGroups.push(React.createElement("text", {
            key: "legend-text-".concat(i),
            transform: "translate(".concat(offset, ",").concat(verticalOffset, ") rotate(90)"),
            textAnchor: "start",
            className: "legend-group-label"
          }, l.label));
          offset += 20;
        }

        var renderedItems = _this2.renderLegendGroupHorizontal(l);

        renderedGroups.push(React.createElement("g", {
          key: "legend-group-".concat(i),
          className: "legend-item",
          transform: "translate(".concat(offset, ",").concat(verticalOffset, ")")
        }, renderedItems.items));
        offset += renderedItems.offset + 5;

        if (legendGroups[i + 1]) {
          renderedGroups.push(React.createElement("line", {
            key: "legend-top-line legend-symbol-".concat(i),
            stroke: "gray",
            x1: offset,
            y1: verticalOffset - 10,
            x2: offset,
            y2: height + verticalOffset + 10
          }));
        }

        offset += 15;
      });
      return React.createElement("g", null, title !== false && React.createElement("line", {
        x1: 0,
        x2: offset + 10,
        y1: verticalOffset - 10,
        y2: verticalOffset - 10,
        stroke: "gray",
        className: "title-neatline"
      }), renderedGroups);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          legendGroups = _this$props.legendGroups,
          _this$props$title = _this$props.title,
          title = _this$props$title === void 0 ? "Legend" : _this$props$title,
          _this$props$width = _this$props.width,
          width = _this$props$width === void 0 ? 100 : _this$props$width,
          _this$props$height = _this$props.height,
          height = _this$props$height === void 0 ? 20 : _this$props$height,
          _this$props$orientati = _this$props.orientation,
          orientation = _this$props$orientati === void 0 ? "vertical" : _this$props$orientati;
      var renderedGroups = orientation === "vertical" ? this.renderGroup({
        legendGroups: legendGroups,
        width: width
      }) : this.renderHorizontalGroup({
        legendGroups: legendGroups,
        title: title,
        height: height
      });
      return React.createElement("g", null, title !== undefined && React.createElement("text", {
        className: "legend-title",
        y: 20,
        x: orientation === "horizontal" ? 0 : width / 2,
        textAnchor: orientation === "horizontal" ? "start" : "middle"
      }, title), renderedGroups);
    }
  }]);

  return Legend;
}(React.Component);

var _default = Legend;
exports.default = _default;
module.exports = exports.default;