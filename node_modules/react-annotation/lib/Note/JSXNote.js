"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = JSXNote;

var _react = _interopRequireDefault(require("react"));

var _Handle = _interopRequireDefault(require("../Handle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-unused-vars */

/* eslint-enable no-unused-vars */
function JSXNote(props) {
  var note = props.note,
      dx = props.dx,
      dy = props.dy,
      editMode = props.editMode,
      dragStart = props.dragStart,
      dragEnd = props.dragEnd,
      dragNote = props.dragNote;
  var handle;

  if (editMode) {
    handle = _react.default.createElement(_Handle.default, {
      handleStart: dragStart,
      handleStop: dragEnd,
      handleDrag: dragNote
    });
  }

  return _react.default.createElement("g", {
    className: "annotation-note",
    transform: "translate(".concat(dx, ", ").concat(dy, ")")
  }, typeof note === "function" ? note(props) : note, handle);
}