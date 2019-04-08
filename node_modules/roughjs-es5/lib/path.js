"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PathToken = function () {
  function PathToken(type, text) {
    _classCallCheck(this, PathToken);

    this.type = type;
    this.text = text;
  }

  _createClass(PathToken, [{
    key: "isType",
    value: function isType(type) {
      return this.type === type;
    }
  }]);

  return PathToken;
}();

var ParsedPath = function () {
  function ParsedPath(d) {
    _classCallCheck(this, ParsedPath);

    this.PARAMS = {
      A: ["rx", "ry", "x-axis-rotation", "large-arc-flag", "sweep-flag", "x", "y"],
      a: ["rx", "ry", "x-axis-rotation", "large-arc-flag", "sweep-flag", "x", "y"],
      C: ["x1", "y1", "x2", "y2", "x", "y"],
      c: ["x1", "y1", "x2", "y2", "x", "y"],
      H: ["x"],
      h: ["x"],
      L: ["x", "y"],
      l: ["x", "y"],
      M: ["x", "y"],
      m: ["x", "y"],
      Q: ["x1", "y1", "x", "y"],
      q: ["x1", "y1", "x", "y"],
      S: ["x2", "y2", "x", "y"],
      s: ["x2", "y2", "x", "y"],
      T: ["x", "y"],
      t: ["x", "y"],
      V: ["y"],
      v: ["y"],
      Z: [],
      z: []
    };
    this.COMMAND = 0;
    this.NUMBER = 1;
    this.EOD = 2;
    this.segments = [];
    this.d = d || "";
    this.parseData(d);
    this.processPoints();
  }

  _createClass(ParsedPath, [{
    key: "loadFromSegments",
    value: function loadFromSegments(segments) {
      this.segments = segments;
      this.processPoints();
    }
  }, {
    key: "processPoints",
    value: function processPoints() {
      var first = null,
          prev = null,
          currentPoint = [0, 0];
      for (var i = 0; i < this.segments.length; i++) {
        var s = this.segments[i];
        switch (s.key) {
          case 'M':
          case 'L':
          case 'T':
            s.point = [s.data[0], s.data[1]];
            break;
          case 'm':
          case 'l':
          case 't':
            s.point = [s.data[0] + currentPoint[0], s.data[1] + currentPoint[1]];
            break;
          case 'H':
            s.point = [s.data[0], currentPoint[1]];
            break;
          case 'h':
            s.point = [s.data[0] + currentPoint[0], currentPoint[1]];
            break;
          case 'V':
            s.point = [currentPoint[0], s.data[0]];
            break;
          case 'v':
            s.point = [currentPoint[0], s.data[0] + currentPoint[1]];
            break;
          case 'z':
          case 'Z':
            if (first) {
              s.point = [first[0], first[1]];
            }
            break;
          case 'C':
            s.point = [s.data[4], s.data[5]];
            break;
          case 'c':
            s.point = [s.data[4] + currentPoint[0], s.data[5] + currentPoint[1]];
            break;
          case 'S':
            s.point = [s.data[2], s.data[3]];
            break;
          case 's':
            s.point = [s.data[2] + currentPoint[0], s.data[3] + currentPoint[1]];
            break;
          case 'Q':
            s.point = [s.data[2], s.data[3]];
            break;
          case 'q':
            s.point = [s.data[2] + currentPoint[0], s.data[3] + currentPoint[1]];
            break;
          case 'A':
            s.point = [s.data[5], s.data[6]];
            break;
          case 'a':
            s.point = [s.data[5] + currentPoint[0], s.data[6] + currentPoint[1]];
            break;
        }
        if (s.key === 'm' || s.key === 'M') {
          first = null;
        }
        if (s.point) {
          currentPoint = s.point;
          if (!first) {
            first = s.point;
          }
        }
        if (s.key === 'z' || s.key === 'Z') {
          first = null;
        }
        prev = s;
      }
    }
  }, {
    key: "parseData",
    value: function parseData(d) {
      var tokens = this.tokenize(d);
      var index = 0;
      var token = tokens[index];
      var mode = "BOD";
      this.segments = new Array();
      while (!token.isType(this.EOD)) {
        var param_length;
        var params = new Array();
        if (mode == "BOD") {
          if (token.text == "M" || token.text == "m") {
            index++;
            param_length = this.PARAMS[token.text].length;
            mode = token.text;
          } else {
            return this.parseData('M0,0' + d);
          }
        } else {
          if (token.isType(this.NUMBER)) {
            param_length = this.PARAMS[mode].length;
          } else {
            index++;
            param_length = this.PARAMS[token.text].length;
            mode = token.text;
          }
        }

        if (index + param_length < tokens.length) {
          for (var i = index; i < index + param_length; i++) {
            var number = tokens[i];
            if (number.isType(this.NUMBER)) {
              params[params.length] = number.text;
            } else {
              console.error("Parameter type is not a number: " + mode + "," + number.text);
              return;
            }
          }
          var segment;
          if (this.PARAMS[mode]) {
            segment = { key: mode, data: params };
          } else {
            console.error("Unsupported segment type: " + mode);
            return;
          }
          this.segments.push(segment);
          index += param_length;
          token = tokens[index];
          if (mode == "M") mode = "L";
          if (mode == "m") mode = "l";
        } else {
          console.error("Path data ended before all parameters were found");
        }
      }
    }
  }, {
    key: "tokenize",
    value: function tokenize(d) {
      var tokens = new Array();
      while (d != "") {
        if (d.match(/^([ \t\r\n,]+)/)) {
          d = d.substr(RegExp.$1.length);
        } else if (d.match(/^([aAcChHlLmMqQsStTvVzZ])/)) {
          tokens[tokens.length] = new PathToken(this.COMMAND, RegExp.$1);
          d = d.substr(RegExp.$1.length);
        } else if (d.match(/^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/)) {
          tokens[tokens.length] = new PathToken(this.NUMBER, parseFloat(RegExp.$1));
          d = d.substr(RegExp.$1.length);
        } else {
          console.error("Unrecognized segment command: " + d);
          return null;
        }
      }
      tokens[tokens.length] = new PathToken(this.EOD, null);
      return tokens;
    }
  }, {
    key: "closed",
    get: function get() {
      if (typeof this._closed === 'undefined') {
        this._closed = false;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.segments[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var s = _step.value;

            if (s.key.toLowerCase() === 'z') {
              this._closed = true;
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
      return this._closed;
    }
  }]);

  return ParsedPath;
}();

var RoughPath = exports.RoughPath = function () {
  function RoughPath(d) {
    _classCallCheck(this, RoughPath);

    this.d = d;
    this.parsed = new ParsedPath(d);
    this._position = [0, 0];
    this.bezierReflectionPoint = null;
    this.quadReflectionPoint = null;
    this._first = null;
  }

  _createClass(RoughPath, [{
    key: "setPosition",
    value: function setPosition(x, y) {
      this._position = [x, y];
      if (!this._first) {
        this._first = [x, y];
      }
    }
  }, {
    key: "segments",
    get: function get() {
      return this.parsed.segments;
    }
  }, {
    key: "closed",
    get: function get() {
      return this.parsed.closed;
    }
  }, {
    key: "linearPoints",
    get: function get() {
      if (!this._linearPoints) {
        var lp = [];
        var points = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this.parsed.segments[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var s = _step2.value;

            var key = s.key.toLowerCase();
            if (key === 'm' || key === 'z') {
              if (points.length) {
                lp.push(points);
                points = [];
              }
              if (key === 'z') {
                continue;
              }
            }
            if (s.point) {
              points.push(s.point);
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

        if (points.length) {
          lp.push(points);
          points = [];
        }
        this._linearPoints = lp;
      }
      return this._linearPoints;
    }
  }, {
    key: "first",
    get: function get() {
      return this._first;
    },
    set: function set(v) {
      this._first = v;
    }
  }, {
    key: "position",
    get: function get() {
      return this._position;
    }
  }, {
    key: "x",
    get: function get() {
      return this._position[0];
    }
  }, {
    key: "y",
    get: function get() {
      return this._position[1];
    }
  }]);

  return RoughPath;
}();

var RoughArcConverter = exports.RoughArcConverter = function () {
  // Algorithm as described in https://www.w3.org/TR/SVG/implnote.html
  // Code adapted from nsSVGPathDataParser.cpp in Mozilla 
  // https://hg.mozilla.org/mozilla-central/file/17156fbebbc8/content/svg/content/src/nsSVGPathDataParser.cpp#l887
  function RoughArcConverter(from, to, radii, angle, largeArcFlag, sweepFlag) {
    _classCallCheck(this, RoughArcConverter);

    var radPerDeg = Math.PI / 180;
    this._segIndex = 0;
    this._numSegs = 0;
    if (from[0] == to[0] && from[1] == to[1]) {
      return;
    }
    this._rx = Math.abs(radii[0]);
    this._ry = Math.abs(radii[1]);
    this._sinPhi = Math.sin(angle * radPerDeg);
    this._cosPhi = Math.cos(angle * radPerDeg);
    var x1dash = this._cosPhi * (from[0] - to[0]) / 2.0 + this._sinPhi * (from[1] - to[1]) / 2.0;
    var y1dash = -this._sinPhi * (from[0] - to[0]) / 2.0 + this._cosPhi * (from[1] - to[1]) / 2.0;
    var root;
    var numerator = this._rx * this._rx * this._ry * this._ry - this._rx * this._rx * y1dash * y1dash - this._ry * this._ry * x1dash * x1dash;
    if (numerator < 0) {
      var s = Math.sqrt(1 - numerator / (this._rx * this._rx * this._ry * this._ry));
      this._rx = s;
      this._ry = s;
      root = 0;
    } else {
      root = (largeArcFlag == sweepFlag ? -1.0 : 1.0) * Math.sqrt(numerator / (this._rx * this._rx * y1dash * y1dash + this._ry * this._ry * x1dash * x1dash));
    }
    var cxdash = root * this._rx * y1dash / this._ry;
    var cydash = -root * this._ry * x1dash / this._rx;
    this._C = [0, 0];
    this._C[0] = this._cosPhi * cxdash - this._sinPhi * cydash + (from[0] + to[0]) / 2.0;
    this._C[1] = this._sinPhi * cxdash + this._cosPhi * cydash + (from[1] + to[1]) / 2.0;
    this._theta = this.calculateVectorAngle(1.0, 0.0, (x1dash - cxdash) / this._rx, (y1dash - cydash) / this._ry);
    var dtheta = this.calculateVectorAngle((x1dash - cxdash) / this._rx, (y1dash - cydash) / this._ry, (-x1dash - cxdash) / this._rx, (-y1dash - cydash) / this._ry);
    if (!sweepFlag && dtheta > 0) {
      dtheta -= 2 * Math.PI;
    } else if (sweepFlag && dtheta < 0) {
      dtheta += 2 * Math.PI;
    }
    this._numSegs = Math.ceil(Math.abs(dtheta / (Math.PI / 2)));
    this._delta = dtheta / this._numSegs;
    this._T = 8 / 3 * Math.sin(this._delta / 4) * Math.sin(this._delta / 4) / Math.sin(this._delta / 2);
    this._from = from;
  }

  _createClass(RoughArcConverter, [{
    key: "getNextSegment",
    value: function getNextSegment() {
      var cp1, cp2, to;
      if (this._segIndex == this._numSegs) {
        return null;
      }
      var cosTheta1 = Math.cos(this._theta);
      var sinTheta1 = Math.sin(this._theta);
      var theta2 = this._theta + this._delta;
      var cosTheta2 = Math.cos(theta2);
      var sinTheta2 = Math.sin(theta2);

      to = [this._cosPhi * this._rx * cosTheta2 - this._sinPhi * this._ry * sinTheta2 + this._C[0], this._sinPhi * this._rx * cosTheta2 + this._cosPhi * this._ry * sinTheta2 + this._C[1]];
      cp1 = [this._from[0] + this._T * (-this._cosPhi * this._rx * sinTheta1 - this._sinPhi * this._ry * cosTheta1), this._from[1] + this._T * (-this._sinPhi * this._rx * sinTheta1 + this._cosPhi * this._ry * cosTheta1)];
      cp2 = [to[0] + this._T * (this._cosPhi * this._rx * sinTheta2 + this._sinPhi * this._ry * cosTheta2), to[1] + this._T * (this._sinPhi * this._rx * sinTheta2 - this._cosPhi * this._ry * cosTheta2)];

      this._theta = theta2;
      this._from = [to[0], to[1]];
      this._segIndex++;

      return {
        cp1: cp1,
        cp2: cp2,
        to: to
      };
    }
  }, {
    key: "calculateVectorAngle",
    value: function calculateVectorAngle(ux, uy, vx, vy) {
      var ta = Math.atan2(uy, ux);
      var tb = Math.atan2(vy, vx);
      if (tb >= ta) return tb - ta;
      return 2 * Math.PI - (ta - tb);
    }
  }]);

  return RoughArcConverter;
}();

var PathFitter = exports.PathFitter = function () {
  function PathFitter(sets, closed) {
    _classCallCheck(this, PathFitter);

    this.sets = sets;
    this.closed = closed;
  }

  _createClass(PathFitter, [{
    key: "fit",
    value: function fit(simplification) {
      var outSets = [];
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.sets[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var set = _step3.value;

          var length = set.length;
          var estLength = Math.floor(simplification * length);
          if (estLength < 5) {
            if (length <= 5) {
              continue;
            }
            estLength = 5;
          }
          outSets.push(this.reduce(set, estLength));
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

      var d = '';
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = outSets[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _set = _step4.value;

          for (var i = 0; i < _set.length; i++) {
            var point = _set[i];
            if (i === 0) {
              d += 'M' + point[0] + "," + point[1];
            } else {
              d += 'L' + point[0] + "," + point[1];
            }
          }
          if (this.closed) {
            d += 'z ';
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return d;
    }
  }, {
    key: "distance",
    value: function distance(p1, p2) {
      return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
    }
  }, {
    key: "reduce",
    value: function reduce(set, count) {
      if (set.length <= count) {
        return set;
      }
      var points = set.slice(0);
      while (points.length > count) {
        var areas = [];
        var minArea = -1;
        var minIndex = -1;
        for (var i = 1; i < points.length - 1; i++) {
          var a = this.distance(points[i - 1], points[i]);
          var b = this.distance(points[i], points[i + 1]);
          var c = this.distance(points[i - 1], points[i + 1]);
          var s = (a + b + c) / 2.0;
          var area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
          areas.push(area);
          if (minArea < 0 || area < minArea) {
            minArea = area;
            minIndex = i;
          }
        }
        if (minIndex > 0) {
          points.splice(minIndex, 1);
        } else {
          break;
        }
      }
      return points;
    }
  }]);

  return PathFitter;
}();