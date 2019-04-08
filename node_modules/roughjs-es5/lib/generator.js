'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RoughGeneratorAsync = exports.RoughGenerator = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _renderer = require('./renderer.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

self._roughScript = self.document && self.document.currentScript && self.document.currentScript.src;

var RoughGenerator = exports.RoughGenerator = function () {
  function RoughGenerator(config, canvas) {
    _classCallCheck(this, RoughGenerator);

    this.config = config || {};
    this.canvas = canvas;
    this.defaultOptions = {
      maxRandomnessOffset: 2,
      roughness: 1,
      bowing: 1,
      stroke: '#000',
      strokeWidth: 1,
      curveTightness: 0,
      curveStepCount: 9,
      fill: null,
      fillStyle: 'hachure',
      fillWeight: -1,
      hachureAngle: -41,
      hachureGap: -1
    };
    if (this.config.options) {
      this.defaultOptions = this._options(this.config.options);
    }
  }

  _createClass(RoughGenerator, [{
    key: '_options',
    value: function _options(options) {
      return options ? Object.assign({}, this.defaultOptions, options) : this.defaultOptions;
    }
  }, {
    key: '_drawable',
    value: function _drawable(shape, sets, options) {
      return { shape: shape, sets: sets || [], options: options || this.defaultOptions };
    }
  }, {
    key: 'line',
    value: function line(x1, y1, x2, y2, options) {
      var o = this._options(options);
      return this._drawable('line', [this.lib.line(x1, y1, x2, y2, o)], o);
    }
  }, {
    key: 'rectangle',
    value: function rectangle(x, y, width, height, options) {
      var o = this._options(options);
      var paths = [];
      if (o.fill) {
        var xc = [x, x + width, x + width, x];
        var yc = [y, y, y + height, y + height];
        if (o.fillStyle === 'solid') {
          paths.push(this.lib.solidFillShape(xc, yc, o));
        } else {
          paths.push(this.lib.hachureFillShape(xc, yc, o));
        }
      }
      paths.push(this.lib.rectangle(x, y, width, height, o));
      return this._drawable('rectangle', paths, o);
    }
  }, {
    key: 'ellipse',
    value: function ellipse(x, y, width, height, options) {
      var o = this._options(options);
      var paths = [];
      if (o.fill) {
        if (o.fillStyle === 'solid') {
          var shape = this.lib.ellipse(x, y, width, height, o);
          shape.type = 'fillPath';
          paths.push(shape);
        } else {
          paths.push(this.lib.hachureFillEllipse(x, y, width, height, o));
        }
      }
      paths.push(this.lib.ellipse(x, y, width, height, o));
      return this._drawable('ellipse', paths, o);
    }
  }, {
    key: 'circle',
    value: function circle(x, y, diameter, options) {
      var ret = this.ellipse(x, y, diameter, diameter, options);
      ret.shape = 'circle';
      return ret;
    }
  }, {
    key: 'linearPath',
    value: function linearPath(points, options) {
      var o = this._options(options);
      return this._drawable('linearPath', [this.lib.linearPath(points, false, o)], o);
    }
  }, {
    key: 'polygon',
    value: function polygon(points, options) {
      var o = this._options(options);
      var paths = [];
      if (o.fill) {
        var xc = [],
            yc = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var p = _step.value;

            xc.push(p[0]);
            yc.push(p[1]);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (o.fillStyle === 'solid') {
          paths.push(this.lib.solidFillShape(xc, yc, o));
        } else {
          paths.push(this.lib.hachureFillShape(xc, yc, o));
        }
      }
      paths.push(this.lib.linearPath(points, true, o));
      return this._drawable('polygon', paths, o);
    }
  }, {
    key: 'arc',
    value: function arc(x, y, width, height, start, stop, closed, options) {
      var o = this._options(options);
      var paths = [];
      if (closed && o.fill) {
        if (o.fillStyle === 'solid') {
          var shape = this.lib.arc(x, y, width, height, start, stop, true, false, o);
          shape.type = 'fillPath';
          paths.push(shape);
        } else {
          paths.push(this.lib.hachureFillArc(x, y, width, height, start, stop, o));
        }
      }
      paths.push(this.lib.arc(x, y, width, height, start, stop, closed, true, o));
      return this._drawable('arc', paths, o);
    }
  }, {
    key: 'curve',
    value: function curve(points, options) {
      var o = this._options(options);
      return this._drawable('curve', [this.lib.curve(points, o)], o);
    }
  }, {
    key: 'path',
    value: function path(d, options) {
      var o = this._options(options);
      var paths = [];
      if (!d) {
        return this._drawable('path', paths, o);
      }
      if (o.fill) {
        if (o.fillStyle === 'solid') {
          var shape = { type: 'path2Dfill', path: d };
          paths.push(shape);
        } else {
          var size = this._computePathSize(d);
          var xc = [0, size[0], size[0], 0];
          var yc = [0, 0, size[1], size[1]];
          var _shape = this.lib.hachureFillShape(xc, yc, o);
          _shape.type = 'path2Dpattern';
          _shape.size = size;
          _shape.path = d;
          paths.push(_shape);
        }
      }
      paths.push(this.lib.svgPath(d, o));
      return this._drawable('path', paths, o);
    }
  }, {
    key: 'toPaths',
    value: function toPaths(drawable) {
      var sets = drawable.sets || [];
      var o = drawable.options || this.defaultOptions;
      var paths = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = sets[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var drawing = _step2.value;

          var path = null;
          switch (drawing.type) {
            case 'path':
              path = {
                d: this.opsToPath(drawing),
                stroke: o.stroke,
                strokeWidth: o.strokeWidth,
                fill: 'none'
              };
              break;
            case 'fillPath':
              path = {
                d: this.opsToPath(drawing),
                stroke: 'none',
                strokeWidth: 0,
                fill: o.fill
              };
              break;
            case 'fillSketch':
              path = this._fillSketch(drawing, o);
              break;
            case 'path2Dfill':
              path = {
                d: drawing.path,
                stroke: 'none',
                strokeWidth: 0,
                fill: o.fill
              };
              break;
            case 'path2Dpattern':
              {
                var size = drawing.size;
                var pattern = {
                  x: 0, y: 0, width: 1, height: 1,
                  viewBox: '0 0 ' + Math.round(size[0]) + ' ' + Math.round(size[1]),
                  patternUnits: 'objectBoundingBox',
                  path: this._fillSketch(drawing, o)
                };
                path = {
                  d: drawing.path,
                  stroke: 'none',
                  strokeWidth: 0,
                  pattern: pattern
                };
                break;
              }
          }
          if (path) {
            paths.push(path);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return paths;
    }
  }, {
    key: '_fillSketch',
    value: function _fillSketch(drawing, o) {
      var fweight = o.fillWeight;
      if (fweight < 0) {
        fweight = o.strokeWidth / 2;
      }
      return {
        d: this.opsToPath(drawing),
        stroke: o.fill,
        strokeWidth: fweight,
        fill: 'none'
      };
    }
  }, {
    key: 'opsToPath',
    value: function opsToPath(drawing) {
      var path = '';
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = drawing.ops[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var item = _step3.value;

          var data = item.data;
          switch (item.op) {
            case 'move':
              path += 'M' + data[0] + ' ' + data[1] + ' ';
              break;
            case 'bcurveTo':
              path += 'C' + data[0] + ' ' + data[1] + ', ' + data[2] + ' ' + data[3] + ', ' + data[4] + ' ' + data[5] + ' ';
              break;
            case 'qcurveTo':
              path += 'Q' + data[0] + ' ' + data[1] + ', ' + data[2] + ' ' + data[3] + ' ';
              break;
            case 'lineTo':
              path += 'L' + data[0] + ' ' + data[1] + ' ';
              break;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return path.trim();
    }
  }, {
    key: '_computePathSize',
    value: function _computePathSize(d) {
      var size = [0, 0];
      if (self.document) {
        try {
          var ns = "http://www.w3.org/2000/svg";
          var svg = self.document.createElementNS(ns, "svg");
          svg.setAttribute("width", "0");
          svg.setAttribute("height", "0");
          var pathNode = self.document.createElementNS(ns, "path");
          pathNode.setAttribute('d', d);
          svg.appendChild(pathNode);
          self.document.body.appendChild(svg);
          var bb = pathNode.getBBox();
          if (bb) {
            size[0] = bb.width || 0;
            size[1] = bb.height || 0;
          }
          self.document.body.removeChild(svg);
        } catch (err) {}
      }
      var canvasSize = this._canvasSize();
      if (!(size[0] * size[1])) {
        size = canvasSize;
      }
      size[0] = Math.min(size[0], canvasSize[0]);
      size[1] = Math.min(size[1], canvasSize[1]);
      return size;
    }
  }, {
    key: '_canvasSize',
    value: function _canvasSize() {
      var val = function val(w) {
        if (w) {
          if ((typeof w === 'undefined' ? 'undefined' : _typeof(w)) === 'object') {
            if (w.baseVal && w.baseVal.value) {
              return w.baseVal.value;
            }
          }
        }
        return w || 100;
      };
      return this.canvas ? [val(this.canvas.width), val(this.canvas.height)] : [100, 100];
    }
  }, {
    key: 'lib',
    get: function get() {
      if (!this._renderer) {
        if (self && self.workly && this.config.async && !this.config.noWorker) {
          var tos = Function.prototype.toString;
          var worklySource = this.config.worklyURL || 'https://cdn.jsdelivr.net/gh/pshihn/workly/dist/workly.min.js';
          var rendererSource = this.config.roughURL || self._roughScript;
          if (rendererSource && worklySource) {
            var code = 'importScripts(\'' + worklySource + '\', \'' + rendererSource + '\');\nworkly.expose(self.rough.createRenderer());';
            var ourl = URL.createObjectURL(new Blob([code]));
            this._renderer = workly.proxy(ourl);
          } else {
            this._renderer = new _renderer.RoughRenderer();
          }
        } else {
          this._renderer = new _renderer.RoughRenderer();
        }
      }
      return this._renderer;
    }
  }]);

  return RoughGenerator;
}();

var RoughGeneratorAsync = exports.RoughGeneratorAsync = function (_RoughGenerator) {
  _inherits(RoughGeneratorAsync, _RoughGenerator);

  function RoughGeneratorAsync() {
    _classCallCheck(this, RoughGeneratorAsync);

    return _possibleConstructorReturn(this, (RoughGeneratorAsync.__proto__ || Object.getPrototypeOf(RoughGeneratorAsync)).apply(this, arguments));
  }

  _createClass(RoughGeneratorAsync, [{
    key: 'line',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(x1, y1, x2, y2, options) {
        var o;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                o = this._options(options);
                _context.t0 = this;
                _context.next = 4;
                return this.lib.line(x1, y1, x2, y2, o);

              case 4:
                _context.t1 = _context.sent;
                _context.t2 = [_context.t1];
                _context.t3 = o;
                return _context.abrupt('return', _context.t0._drawable.call(_context.t0, 'line', _context.t2, _context.t3));

              case 8:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function line(_x, _x2, _x3, _x4, _x5) {
        return _ref.apply(this, arguments);
      }

      return line;
    }()
  }, {
    key: 'rectangle',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(x, y, width, height, options) {
        var o, paths, xc, yc;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                o = this._options(options);
                paths = [];

                if (!o.fill) {
                  _context2.next = 18;
                  break;
                }

                xc = [x, x + width, x + width, x];
                yc = [y, y, y + height, y + height];

                if (!(o.fillStyle === 'solid')) {
                  _context2.next = 13;
                  break;
                }

                _context2.t0 = paths;
                _context2.next = 9;
                return this.lib.solidFillShape(xc, yc, o);

              case 9:
                _context2.t1 = _context2.sent;

                _context2.t0.push.call(_context2.t0, _context2.t1);

                _context2.next = 18;
                break;

              case 13:
                _context2.t2 = paths;
                _context2.next = 16;
                return this.lib.hachureFillShape(xc, yc, o);

              case 16:
                _context2.t3 = _context2.sent;

                _context2.t2.push.call(_context2.t2, _context2.t3);

              case 18:
                _context2.t4 = paths;
                _context2.next = 21;
                return this.lib.rectangle(x, y, width, height, o);

              case 21:
                _context2.t5 = _context2.sent;

                _context2.t4.push.call(_context2.t4, _context2.t5);

                return _context2.abrupt('return', this._drawable('rectangle', paths, o));

              case 24:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function rectangle(_x6, _x7, _x8, _x9, _x10) {
        return _ref2.apply(this, arguments);
      }

      return rectangle;
    }()
  }, {
    key: 'ellipse',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3(x, y, width, height, options) {
        var o, paths, shape;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                o = this._options(options);
                paths = [];

                if (!o.fill) {
                  _context3.next = 16;
                  break;
                }

                if (!(o.fillStyle === 'solid')) {
                  _context3.next = 11;
                  break;
                }

                _context3.next = 6;
                return this.lib.ellipse(x, y, width, height, o);

              case 6:
                shape = _context3.sent;

                shape.type = 'fillPath';
                paths.push(shape);
                _context3.next = 16;
                break;

              case 11:
                _context3.t0 = paths;
                _context3.next = 14;
                return this.lib.hachureFillEllipse(x, y, width, height, o);

              case 14:
                _context3.t1 = _context3.sent;

                _context3.t0.push.call(_context3.t0, _context3.t1);

              case 16:
                _context3.t2 = paths;
                _context3.next = 19;
                return this.lib.ellipse(x, y, width, height, o);

              case 19:
                _context3.t3 = _context3.sent;

                _context3.t2.push.call(_context3.t2, _context3.t3);

                return _context3.abrupt('return', this._drawable('ellipse', paths, o));

              case 22:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function ellipse(_x11, _x12, _x13, _x14, _x15) {
        return _ref3.apply(this, arguments);
      }

      return ellipse;
    }()
  }, {
    key: 'circle',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee4(x, y, diameter, options) {
        var ret;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.ellipse(x, y, diameter, diameter, options);

              case 2:
                ret = _context4.sent;

                ret.shape = 'circle';
                return _context4.abrupt('return', ret);

              case 5:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function circle(_x16, _x17, _x18, _x19) {
        return _ref4.apply(this, arguments);
      }

      return circle;
    }()
  }, {
    key: 'linearPath',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee5(points, options) {
        var o;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                o = this._options(options);
                _context5.t0 = this;
                _context5.next = 4;
                return this.lib.linearPath(points, false, o);

              case 4:
                _context5.t1 = _context5.sent;
                _context5.t2 = [_context5.t1];
                _context5.t3 = o;
                return _context5.abrupt('return', _context5.t0._drawable.call(_context5.t0, 'linearPath', _context5.t2, _context5.t3));

              case 8:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function linearPath(_x20, _x21) {
        return _ref5.apply(this, arguments);
      }

      return linearPath;
    }()
  }, {
    key: 'polygon',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee6(points, options) {
        var o, paths, xc, yc, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, p;

        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                o = this._options(options);
                paths = [];

                if (!o.fill) {
                  _context6.next = 36;
                  break;
                }

                xc = [], yc = [];
                _iteratorNormalCompletion4 = true;
                _didIteratorError4 = false;
                _iteratorError4 = undefined;
                _context6.prev = 7;

                for (_iterator4 = points[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                  p = _step4.value;

                  xc.push(p[0]);
                  yc.push(p[1]);
                }
                _context6.next = 15;
                break;

              case 11:
                _context6.prev = 11;
                _context6.t0 = _context6['catch'](7);
                _didIteratorError4 = true;
                _iteratorError4 = _context6.t0;

              case 15:
                _context6.prev = 15;
                _context6.prev = 16;

                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
                }

              case 18:
                _context6.prev = 18;

                if (!_didIteratorError4) {
                  _context6.next = 21;
                  break;
                }

                throw _iteratorError4;

              case 21:
                return _context6.finish(18);

              case 22:
                return _context6.finish(15);

              case 23:
                if (!(o.fillStyle === 'solid')) {
                  _context6.next = 31;
                  break;
                }

                _context6.t1 = paths;
                _context6.next = 27;
                return this.lib.solidFillShape(xc, yc, o);

              case 27:
                _context6.t2 = _context6.sent;

                _context6.t1.push.call(_context6.t1, _context6.t2);

                _context6.next = 36;
                break;

              case 31:
                _context6.t3 = paths;
                _context6.next = 34;
                return this.lib.hachureFillShape(xc, yc, o);

              case 34:
                _context6.t4 = _context6.sent;

                _context6.t3.push.call(_context6.t3, _context6.t4);

              case 36:
                _context6.t5 = paths;
                _context6.next = 39;
                return this.lib.linearPath(points, true, o);

              case 39:
                _context6.t6 = _context6.sent;

                _context6.t5.push.call(_context6.t5, _context6.t6);

                return _context6.abrupt('return', this._drawable('polygon', paths, o));

              case 42:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this, [[7, 11, 15, 23], [16,, 18, 22]]);
      }));

      function polygon(_x22, _x23) {
        return _ref6.apply(this, arguments);
      }

      return polygon;
    }()
  }, {
    key: 'arc',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee7(x, y, width, height, start, stop, closed, options) {
        var o, paths, shape;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                o = this._options(options);
                paths = [];

                if (!(closed && o.fill)) {
                  _context7.next = 16;
                  break;
                }

                if (!(o.fillStyle === 'solid')) {
                  _context7.next = 11;
                  break;
                }

                _context7.next = 6;
                return this.lib.arc(x, y, width, height, start, stop, true, false, o);

              case 6:
                shape = _context7.sent;

                shape.type = 'fillPath';
                paths.push(shape);
                _context7.next = 16;
                break;

              case 11:
                _context7.t0 = paths;
                _context7.next = 14;
                return this.lib.hachureFillArc(x, y, width, height, start, stop, o);

              case 14:
                _context7.t1 = _context7.sent;

                _context7.t0.push.call(_context7.t0, _context7.t1);

              case 16:
                _context7.t2 = paths;
                _context7.next = 19;
                return this.lib.arc(x, y, width, height, start, stop, closed, true, o);

              case 19:
                _context7.t3 = _context7.sent;

                _context7.t2.push.call(_context7.t2, _context7.t3);

                return _context7.abrupt('return', this._drawable('arc', paths, o));

              case 22:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function arc(_x24, _x25, _x26, _x27, _x28, _x29, _x30, _x31) {
        return _ref7.apply(this, arguments);
      }

      return arc;
    }()
  }, {
    key: 'curve',
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee8(points, options) {
        var o;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                o = this._options(options);
                _context8.t0 = this;
                _context8.next = 4;
                return this.lib.curve(points, o);

              case 4:
                _context8.t1 = _context8.sent;
                _context8.t2 = [_context8.t1];
                _context8.t3 = o;
                return _context8.abrupt('return', _context8.t0._drawable.call(_context8.t0, 'curve', _context8.t2, _context8.t3));

              case 8:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function curve(_x32, _x33) {
        return _ref8.apply(this, arguments);
      }

      return curve;
    }()
  }, {
    key: 'path',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee9(d, options) {
        var o, paths, shape, size, xc, yc, _shape2;

        return _regenerator2.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                o = this._options(options);
                paths = [];

                if (d) {
                  _context9.next = 4;
                  break;
                }

                return _context9.abrupt('return', this._drawable('path', paths, o));

              case 4:
                if (!o.fill) {
                  _context9.next = 20;
                  break;
                }

                if (!(o.fillStyle === 'solid')) {
                  _context9.next = 10;
                  break;
                }

                shape = { type: 'path2Dfill', path: d };

                paths.push(shape);
                _context9.next = 20;
                break;

              case 10:
                size = this._computePathSize(d);
                xc = [0, size[0], size[0], 0];
                yc = [0, 0, size[1], size[1]];
                _context9.next = 15;
                return this.lib.hachureFillShape(xc, yc, o);

              case 15:
                _shape2 = _context9.sent;

                _shape2.type = 'path2Dpattern';
                _shape2.size = size;
                _shape2.path = d;
                paths.push(_shape2);

              case 20:
                _context9.t0 = paths;
                _context9.next = 23;
                return this.lib.svgPath(d, o);

              case 23:
                _context9.t1 = _context9.sent;

                _context9.t0.push.call(_context9.t0, _context9.t1);

                return _context9.abrupt('return', this._drawable('path', paths, o));

              case 26:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function path(_x34, _x35) {
        return _ref9.apply(this, arguments);
      }

      return path;
    }()
  }]);

  return RoughGeneratorAsync;
}(RoughGenerator);