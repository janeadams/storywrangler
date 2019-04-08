"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nodesEdgesFromHierarchy = void 0;

var _react = _interopRequireDefault(require("react"));

var _d3Hierarchy = require("d3-hierarchy");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function recursiveIDAccessor(idAccessor, node, accessorString) {
  if (node.parent) {
    accessorString = "".concat(accessorString, "-").concat(recursiveIDAccessor(idAccessor, _objectSpread({}, node.parent, node.parent.data), accessorString));
  }

  return "".concat(accessorString, "-").concat(idAccessor(_objectSpread({}, node, node.data)));
}

var nodesEdgesFromHierarchy = function nodesEdgesFromHierarchy(baseRootNode) {
  var idAccessor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (d) {
    return d.id || d.descendantIndex;
  };
  var edges = [];
  var nodes = [];
  var rootNode = baseRootNode.descendants ? baseRootNode : (0, _d3Hierarchy.hierarchy)(baseRootNode);
  var descendants = rootNode.descendants();
  descendants.forEach(function (d, i) {
    d.descendantIndex = i;
  });
  descendants.forEach(function (node, i) {
    var generatedID = "".concat(idAccessor(_objectSpread({}, node, node.data)), "-").concat(node.parent && recursiveIDAccessor(idAccessor, _objectSpread({}, node.parent, node.parent.data), "") || "root");

    var dataD = _extends(node, node.data || {}, {
      hierarchicalID: generatedID
    });

    nodes.push(dataD);

    if (node.parent !== null) {
      var dataParent = _extends(node.parent, node.parent.data || {});

      edges.push({
        source: dataParent,
        target: dataD,
        depth: node.depth,
        weight: 1,
        value: 1,
        _NWFEdgeKey: generatedID
      });
    }
  });
  return {
    edges: edges,
    nodes: nodes
  };
};

exports.nodesEdgesFromHierarchy = nodesEdgesFromHierarchy;