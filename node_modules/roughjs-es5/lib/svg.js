'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RoughSVGAsync = exports.RoughSVG = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _generator = require('./generator.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RoughSVG = exports.RoughSVG = function () {
  function RoughSVG(svg, config) {
    _classCallCheck(this, RoughSVG);

    this.svg = svg;
    this._init(config);
  }

  _createClass(RoughSVG, [{
    key: '_init',
    value: function _init(config) {
      this.gen = new _generator.RoughGenerator(config, this.svg);
    }
  }, {
    key: 'line',
    value: function line(x1, y1, x2, y2, options) {
      var d = this.gen.line(x1, y1, x2, y2, options);
      return this.draw(d);
    }
  }, {
    key: 'rectangle',
    value: function rectangle(x, y, width, height, options) {
      var d = this.gen.rectangle(x, y, width, height, options);
      return this.draw(d);
    }
  }, {
    key: 'ellipse',
    value: function ellipse(x, y, width, height, options) {
      var d = this.gen.ellipse(x, y, width, height, options);
      return this.draw(d);
    }
  }, {
    key: 'circle',
    value: function circle(x, y, diameter, options) {
      var d = this.gen.circle(x, y, diameter, options);
      return this.draw(d);
    }
  }, {
    key: 'linearPath',
    value: function linearPath(points, options) {
      var d = this.gen.linearPath(points, options);
      return this.draw(d);
    }
  }, {
    key: 'polygon',
    value: function polygon(points, options) {
      var d = this.gen.polygon(points, options);
      return this.draw(d);
    }
  }, {
    key: 'arc',
    value: function arc(x, y, width, height, start, stop, closed, options) {
      var d = this.gen.arc(x, y, width, height, start, stop, closed, options);
      return this.draw(d);
    }
  }, {
    key: 'curve',
    value: function curve(points, options) {
      var d = this.gen.curve(points, options);
      return this.draw(d);
    }
  }, {
    key: 'path',
    value: function path(d, options) {
      var drawing = this.gen.path(d, options);
      return this.draw(drawing);
    }
  }, {
    key: 'draw',
    value: function draw(drawable) {
      var sets = drawable.sets || [];
      var o = drawable.options || this.gen.defaultOptions;
      var doc = this.svg.ownerDocument || document;
      var g = doc.createElementNS('http://www.w3.org/2000/svg', 'g');
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = sets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var drawing = _step.value;

          var path = null;
          switch (drawing.type) {
            case 'path':
              {
                path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', this._opsToPath(drawing));
                path.style.stroke = o.stroke;
                path.style.strokeWidth = o.strokeWidth;
                path.style.fill = 'none';
                break;
              }
            case 'fillPath':
              {
                path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', this._opsToPath(drawing));
                path.style.stroke = 'none';
                path.style.strokeWidth = 0;
                path.style.fill = o.fill;
                break;
              }
            case 'fillSketch':
              {
                path = this._fillSketch(doc, drawing, o);
                break;
              }
            case 'path2Dfill':
              {
                path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', drawing.path);
                path.style.stroke = 'none';
                path.style.strokeWidth = 0;
                path.style.fill = o.fill;
                break;
              }
            case 'path2Dpattern':
              {
                var size = drawing.size;
                var pattern = doc.createElementNS('http://www.w3.org/2000/svg', 'pattern');
                var id = 'rough-' + Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER || 999999));
                pattern.setAttribute('id', id);
                pattern.setAttribute('x', 0);
                pattern.setAttribute('y', 0);
                pattern.setAttribute('width', 1);
                pattern.setAttribute('height', 1);
                pattern.setAttribute('height', 1);
                pattern.setAttribute('viewBox', '0 0 ' + Math.round(size[0]) + ' ' + Math.round(size[1]));
                pattern.setAttribute('patternUnits', 'objectBoundingBox');
                var patternPath = this._fillSketch(doc, drawing, o);
                pattern.appendChild(patternPath);
                this.defs.appendChild(pattern);

                path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', drawing.path);
                path.style.stroke = 'none';
                path.style.strokeWidth = 0;
                path.style.fill = 'url(#' + id + ')';
                break;
              }
          }
          if (path) {
            g.appendChild(path);
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

      return g;
    }
  }, {
    key: '_fillSketch',
    value: function _fillSketch(doc, drawing, o) {
      var fweight = o.fillWeight;
      if (fweight < 0) {
        fweight = o.strokeWidth / 2;
      }
      var path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', this._opsToPath(drawing));
      path.style.stroke = o.fill;
      path.style.strokeWidth = fweight;
      path.style.fill = 'none';
      return path;
    }
  }, {
    key: '_opsToPath',
    value: function _opsToPath(drawing) {
      return this.gen.opsToPath(drawing);
    }
  }, {
    key: 'generator',
    get: function get() {
      return this.gen;
    }
  }, {
    key: 'defs',
    get: function get() {
      if (!this._defs) {
        var doc = this.svg.ownerDocument || document;
        var dnode = doc.createElementNS('http://www.w3.org/2000/svg', 'defs');
        if (this.svg.firstChild) {
          this.svg.insertBefore(dnode, this.svg.firstChild);
        } else {
          this.svg.appendChild(dnode);
        }
        this._defs = dnode;
      }
      return this._defs;
    }
  }]);

  return RoughSVG;
}();

var RoughSVGAsync = exports.RoughSVGAsync = function (_RoughSVG) {
  _inherits(RoughSVGAsync, _RoughSVG);

  function RoughSVGAsync() {
    _classCallCheck(this, RoughSVGAsync);

    return _possibleConstructorReturn(this, (RoughSVGAsync.__proto__ || Object.getPrototypeOf(RoughSVGAsync)).apply(this, arguments));
  }

  _createClass(RoughSVGAsync, [{
    key: '_init',
    value: function _init(config) {
      this.gen = new _generator.RoughGeneratorAsync(config, this.svg);
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
                return _context.abrupt('return', this.draw(d));

              case 4:
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
                return _context2.abrupt('return', this.draw(d));

              case 4:
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
                return _context3.abrupt('return', this.draw(d));

              case 4:
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
                return _context4.abrupt('return', this.draw(d));

              case 4:
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
                return _context5.abrupt('return', this.draw(d));

              case 4:
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
                return _context6.abrupt('return', this.draw(d));

              case 4:
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
                return _context7.abrupt('return', this.draw(d));

              case 4:
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
                return _context8.abrupt('return', this.draw(d));

              case 4:
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
                return _context9.abrupt('return', this.draw(drawing));

              case 4:
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

  return RoughSVGAsync;
}(RoughSVG);