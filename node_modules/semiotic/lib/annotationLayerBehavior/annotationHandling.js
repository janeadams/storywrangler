"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bumpAnnotations = bumpAnnotations;

var _react = _interopRequireDefault(require("react"));

var _d3labeler = _interopRequireDefault(require("./d3labeler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var basicLabelSizeFunction = function basicLabelSizeFunction(noteData, characterWidth, lineHeight, padding) {
  var text = noteData.note.label || noteData.note.title;
  var textLength = text.length;
  var wrap = noteData.note.wrap || 120;
  var width = Math.min(wrap, textLength * characterWidth) + padding * 2;
  var height = Math.ceil(textLength * characterWidth / 120) * lineHeight + padding * 2;
  return [width, height];
};

function bumpAnnotations(adjustableNotes, processor, size, propsPointSizeFunction, propsLabelSizeFunction) {
  var _processor$padding = processor.padding,
      padding = _processor$padding === void 0 ? 1 : _processor$padding,
      _processor$characterW = processor.characterWidth,
      characterWidth = _processor$characterW === void 0 ? 8 : _processor$characterW,
      _processor$lineHeight = processor.lineHeight,
      lineHeight = _processor$lineHeight === void 0 ? 20 : _processor$lineHeight,
      _processor$iterations = processor.iterations,
      iterations = _processor$iterations === void 0 ? 500 : _processor$iterations,
      _processor$pointSizeF = processor.pointSizeFunction,
      pointSizeFunction = _processor$pointSizeF === void 0 ? propsPointSizeFunction : _processor$pointSizeF,
      _processor$labelSizeF = processor.labelSizeFunction,
      labelSizeFunction = _processor$labelSizeF === void 0 ? propsLabelSizeFunction || basicLabelSizeFunction : _processor$labelSizeF;
  var labels = adjustableNotes.map(function (d, i) {
    var anchorX = (d.props.noteData.x[0] || d.props.noteData.x) + (d.props.noteData.dx !== undefined ? d.props.noteData.dx : (i % 3 - 1) * -10);
    var anchorY = (d.props.noteData.y[0] || d.props.noteData.y) + (d.props.noteData.dy !== undefined ? d.props.noteData.dy : (i % 3 - 1) * 10);

    var _labelSizeFunction = labelSizeFunction(d.props.noteData, characterWidth, lineHeight, padding),
        _labelSizeFunction2 = _slicedToArray(_labelSizeFunction, 2),
        labelWidth = _labelSizeFunction2[0],
        labelHeight = _labelSizeFunction2[1];

    return {
      x: anchorX,
      y: anchorY,
      above: anchorY < d.props.noteData.y,
      left: anchorX < d.props.noteData.x,
      width: labelWidth,
      height: labelHeight,
      type: "label",
      name: "",
      originalNote: d
    };
  });
  var points = adjustableNotes.map(function (d) {
    return {
      x: d.props.noteData.x,
      y: d.props.noteData.y,
      fx: d.props.noteData.x,
      fy: d.props.noteData.y,
      r: pointSizeFunction && pointSizeFunction(d.props.noteData) || 5,
      type: "point",
      originalNote: d
    };
  });
  var instantiatedLabeler = (0, _d3labeler.default)();
  instantiatedLabeler.label(labels);
  instantiatedLabeler.anchor(points);
  instantiatedLabeler.width(size[0]);
  instantiatedLabeler.height(size[1]);
  instantiatedLabeler.start(iterations);
  labels.forEach(function (d) {
    if (d.type === "label") {
      var adjusted = adjustedXY(d.originalNote.props.noteData, d, padding);
      d.originalNote.props.noteData.nx = adjusted[0];
      d.originalNote.props.noteData.ny = adjusted[1];
    }
  });
  return adjustableNotes;
}

function adjustedXY(note, calculated, padding) {
  if (note.y > calculated.y) {
    //below
    return [calculated.x + calculated.width / 2 + padding / 2, calculated.y - calculated.height + padding / 2];
  }

  return [calculated.x + calculated.width / 2, calculated.y];
}