"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Handle;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var events = {
  mouse: {
    start: "mousedown",
    move: "mousemove",
    stop: "mouseup"
  },
  touch: {
    start: "touchstart",
    move: "touchemove",
    stop: "touchend"
  }
};
var listenerOptions = {
  passive: false
};

var makeHandler = function makeHandler(type, handleStart, handleStop, handleDrag) {
  return function (e) {
    e.preventDefault();
    var xDim = "clientX";
    var yDim = "clientY";
    var oX = e.nativeEvent[xDim];
    var oY = e.nativeEvent[yDim];
    var x = oX;
    var y = oY;
    handleStart && handleStart();

    var move = function move(d) {
      d.preventDefault();
      handleDrag && handleDrag(d, {
        deltaX: d[xDim] - x,
        deltaY: d[yDim] - y,
        oDeltaX: d[xDim] - oX,
        oDeltaY: d[yDim] - oY
      });
      x = d[xDim];
      y = d[yDim];
    };

    var stop = function stop(e) {
      e.preventDefault();
      document.removeEventListener(events[type].move, move, listenerOptions);
      document.removeEventListener(events[type].stop, stop, listenerOptions);
      handleStop && handleStop();
    };

    document.addEventListener(events[type].move, move, listenerOptions);
    document.addEventListener(events[type].stop, stop, listenerOptions);
  };
};

function Handle(_ref) {
  var _ref$x = _ref.x,
      x = _ref$x === void 0 ? 0 : _ref$x,
      _ref$y = _ref.y,
      y = _ref$y === void 0 ? 0 : _ref$y,
      _ref$r = _ref.r,
      r = _ref$r === void 0 ? 10 : _ref$r,
      handleStart = _ref.handleStart,
      handleStop = _ref.handleStop,
      handleDrag = _ref.handleDrag;
  return _react.default.createElement("circle", {
    className: "handle",
    cx: x,
    cy: y,
    r: r,
    onMouseDown: makeHandler("mouse", handleStart, handleStop, handleDrag),
    onTouchStart: makeHandler("touch", handleStart, handleStop, handleDrag),
    strokeDasharray: "5",
    stroke: "grey",
    fill: "white",
    fillOpacity: 0
  });
}

Handle.propTypes = {
  x: _propTypes.default.number,
  y: _propTypes.default.number,
  r: _propTypes.default.number,
  handleStart: _propTypes.default.func,
  handleStop: _propTypes.default.func,
  handleDrag: _propTypes.default.func
};