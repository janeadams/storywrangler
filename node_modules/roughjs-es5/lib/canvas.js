'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RoughCanvasAsync = exports.RoughCanvas = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _generator = require('./generator.js');

var _renderer = require('./renderer.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RoughCanvas = exports.RoughCanvas = function () {
  function RoughCanvas(canvas, config) {
    _classCallCheck(this, RoughCanvas);

    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this._init(config);
  }

  _createClass(RoughCanvas, [{
    key: '_init',
    value: function _init(config) {
      this.gen = new _generator.RoughGenerator(config, this.canvas);
    }
  }, {
    key: 'line',
    value: function line(x1, y1, x2, y2, options) {
      var d = this.gen.line(x1, y1, x2, y2, options);
      this.draw(d);
      return d;
    }
  }, {
    key: 'rectangle',
    value: function rectangle(x, y, width, height, options) {
      var d = this.gen.rectangle(x, y, width, height, options);
      this.draw(d);
      return d;
    }
  }, {
    key: 'ellipse',
    value: function ellipse(x, y, width, height, options) {
      var d = this.gen.ellipse(x, y, width, height, options);
      this.draw(d);
      return d;
    }
  }, {
    key: 'circle',
    value: function circle(x, y, diameter, options) {
      var d = this.gen.circle(x, y, diameter, options);
      this.draw(d);
      return d;
    }
  }, {
    key: 'linearPath',
    value: function linearPath(points, options) {
      var d = this.gen.linearPath(points, options);
      this.draw(d);
      return d;
    }
  }, {
    key: 'polygon',
    value: function polygon(points, options) {
      var d = this.gen.polygon(points, options);
      this.draw(d);
      return d;
    }
  }, {
    key: 'arc',
    value: function arc(x, y, width, height, start, stop, closed, options) {
      var d = this.gen.arc(x, y, width, height, start, stop, closed, options);
      this.draw(d);
      return d;
    }
  }, {
    key: 'curve',
    value: function curve(points, options) {
      var d = this.gen.curve(points, options);
      this.draw(d);
      return d;
    }
  }, {
    key: 'path',
    value: function path(d, options) {
      var drawing = this.gen.path(d, options);
      this.draw(drawing);
      return drawing;
    }
  }, {
    key: 'draw',
    value: function draw(drawable) {
      var sets = drawable.sets || [];
      var o = drawable.options || this.gen.defaultOptions;
      var ctx = this.ctx;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = sets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var drawing = _step.value;

          switch (drawing.type) {
            case 'path':
              ctx.save();
              ctx.strokeStyle = o.stroke;
              ctx.lineWidth = o.strokeWidth;
              this._drawToContext(ctx, drawing);
              ctx.restore();
              break;
            case 'fillPath':
              ctx.save();
              ctx.fillStyle = o.fill;
              this._drawToContext(ctx, drawing, o);
              ctx.restore();
              break;
            case 'fillSketch':
              this._fillSketch(ctx, drawing, o);
              break;
            case 'path2Dfill':
              {
                this.ctx.save();
                this.ctx.fillStyle = o.fill;
                var p2d = new Path2D(drawing.path);
                this.ctx.fill(p2d);
                this.ctx.restore();
                break;
              }
            case 'path2Dpattern':
              {
                var size = drawing.size;
                var hcanvas = document.createElement('canvas');
                var hcontext = hcanvas.getContext("2d");
                var bbox = this._computeBBox(drawing.path);
                if (bbox && (bbox.width || bbox.height)) {
                  hcanvas.width = this.canvas.width;
                  hcanvas.height = this.canvas.height;
                  hcontext.translate(bbox.x || 0, bbox.y || 0);
                } else {
                  hcanvas.width = size[0];
                  hcanvas.height = size[1];
                }
                this._fillSketch(hcontext, drawing, o);
                this.ctx.save();
                this.ctx.fillStyle = this.ctx.createPattern(hcanvas, 'repeat');
                var _p2d = new Path2D(drawing.path);
                this.ctx.fill(_p2d);
                this.ctx.restore();
                break;
              }
          }
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
    }
  }, {
    key: '_computeBBox',
    value: function _computeBBox(d) {
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
          var bbox = pathNode.getBBox();
          self.document.body.removeChild(svg);
          return bbox;
        } catch (err) {}
      }
      return null;
    }
  }, {
    key: '_fillSketch',
    value: function _fillSketch(ctx, drawing, o) {
      var fweight = o.fillWeight;
      if (fweight < 0) {
        fweight = o.strokeWidth / 2;
      }
      ctx.save();
      ctx.strokeStyle = o.fill;
      ctx.lineWidth = fweight;
      this._drawToContext(ctx, drawing);
      ctx.restore();
    }
  }, {
    key: '_drawToContext',
    value: function _drawToContext(ctx, drawing) {
      ctx.beginPath();
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = drawing.ops[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var item = _step2.value;

          var data = item.data;
          switch (item.op) {
            case 'move':
              ctx.moveTo(data[0], data[1]);
              break;
            case 'bcurveTo':
              ctx.bezierCurveTo(data[0], data[1], data[2], data[3], data[4], data[5]);
              break;
            case 'qcurveTo':
              ctx.quadraticCurveTo(data[0], data[1], data[2], data[3]);
              break;
            case 'lineTo':
              ctx.lineTo(data[0], data[1]);
              break;
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

      if (drawing.type === 'fillPath') {
        ctx.fill();
      } else {
        ctx.stroke();
      }
    }
  }, {
    key: 'generator',
    get: function get() {
      return this.gen;
    }
  }], [{
    key: 'createRenderer',
    value: function createRenderer() {
      return new _renderer.RoughRenderer();
    }
  }]);

  return RoughCanvas;
}();

var RoughCanvasAsync = exports.RoughCanvasAsync = function (_RoughCanvas) {
  _inherits(RoughCanvasAsync, _RoughCanvas);

  function RoughCanvasAsync() {
    _classCallCheck(this, RoughCanvasAsync);

    return _possibleConstructorReturn(this, (RoughCanvasAsync.__proto__ || Object.getPrototypeOf(RoughCanvasAsync)).apply(this, arguments));
  }

  _createClass(RoughCanvasAsync, [{
    key: '_init',
    value: function _init(config) {
      this.gen = new _generator.RoughGeneratorAsync(config, this.canvas);
    }
  }, {
    key: 'line',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(x1, y1, x2, y2, options) {
        var d;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.gen.line(x1, y1, x2, y2, options);

              case 2:
                d = _context.sent;

                this.draw(d);
                return _context.abrupt('return', d);

              case 5:
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
        var d;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.gen.rectangle(x, y, width, height, options);

              case 2:
                d = _context2.sent;

                this.draw(d);
                return _context2.abrupt('return', d);

              case 5:
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
        var d;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.gen.ellipse(x, y, width, height, options);

              case 2:
                d = _context3.sent;

                this.draw(d);
                return _context3.abrupt('return', d);

              case 5:
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
        var d;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.gen.circle(x, y, diameter, options);

              case 2:
                d = _context4.sent;

                this.draw(d);
                return _context4.abrupt('return', d);

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
        var d;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.gen.linearPath(points, options);

              case 2:
                d = _context5.sent;

                this.draw(d);
                return _context5.abrupt('return', d);

              case 5:
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
        var d;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this.gen.polygon(points, options);

              case 2:
                d = _context6.sent;

                this.draw(d);
                return _context6.abrupt('return', d);

              case 5:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
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
        var d;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.gen.arc(x, y, width, height, start, stop, closed, options);

              case 2:
                d = _context7.sent;

                this.draw(d);
                return _context7.abrupt('return', d);

              case 5:
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
        var d;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.gen.curve(points, options);

              case 2:
                d = _context8.sent;

                this.draw(d);
                return _context8.abrupt('return', d);

              case 5:
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
        var drawing;
        return _regenerator2.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return this.gen.path(d, options);

              case 2:
                drawing = _context9.sent;

                this.draw(drawing);
                return _context9.abrupt('return', drawing);

              case 5:
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

  return RoughCanvasAsync;
}(RoughCanvas);