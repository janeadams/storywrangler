"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pointOnArcAtAngle = pointOnArcAtAngle;
exports.renderLaidOutPieces = void 0;

var React = _interopRequireWildcard(require("react"));

var _semioticMark = require("semiotic-mark");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function pointOnArcAtAngle(center, angle, distance) {
  var radians = Math.PI * (angle + 0.75) * 2;
  var xPosition = center[0] + distance * Math.cos(radians);
  var yPosition = center[1] + distance * Math.sin(radians);
  return [xPosition, yPosition];
}

var renderLaidOutPieces = function renderLaidOutPieces(_ref) {
  var data = _ref.data,
      shouldRender = _ref.shouldRender,
      canvasRender = _ref.canvasRender,
      canvasDrawing = _ref.canvasDrawing,
      styleFn = _ref.styleFn,
      classFn = _ref.classFn,
      baseMarkProps = _ref.baseMarkProps,
      renderKeyFn = _ref.renderKeyFn,
      ariaLabel = _ref.ariaLabel,
      axis = _ref.axis;
  var valueFormat = axis && axis[0] && axis[0].tickFormat;
  if (!shouldRender) return null;
  var renderedPieces = [];
  data.forEach(function (d, i) {
    if (canvasRender && canvasRender(d) === true) {
      var canvasPiece = {
        baseClass: "orframe-piece",
        tx: d.renderElement.tx || 0,
        ty: d.renderElement.ty || 0,
        d: d.piece,
        i: i,
        markProps: d.renderElement || d,
        styleFn: styleFn,
        classFn: classFn
      };
      canvasDrawing.push(canvasPiece);
    } else {
      if (React.isValidElement(d.renderElement || d)) {
        renderedPieces.push(d.renderElement || d);
      } else {
        /*ariaLabel.items*/
        var pieceAriaLabel = "".concat(d.o, " ").concat(ariaLabel.items, " value ").concat(valueFormat && valueFormat(d.piece.value) || d.piece.value);
        renderedPieces.push(React.createElement(_semioticMark.Mark, _extends({}, baseMarkProps, {
          key: renderKeyFn ? renderKeyFn(d.piece) : d.renderKey || "piece-render-".concat(i)
        }, d.renderElement || d, {
          "aria-label": pieceAriaLabel
        })));
      }
    }
  });
  return renderedPieces;
};

exports.renderLaidOutPieces = renderLaidOutPieces;