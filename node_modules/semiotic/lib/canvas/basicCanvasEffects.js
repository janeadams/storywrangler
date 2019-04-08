"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chuckCloseCanvasTransform = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var chuckCloseCanvasTransform = function chuckCloseCanvasTransform(canvas, context, size) {
  var pixelSize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;

  var _size = _slicedToArray(size, 2),
      baseWidth = _size[0],
      baseHeight = _size[1];

  var height = baseHeight + (baseHeight % pixelSize === 0 ? 0 : pixelSize - baseHeight % pixelSize);
  var width = baseWidth + (baseWidth % pixelSize === 0 ? 0 : pixelSize - baseWidth % pixelSize);
  var rgbStep = 4 * pixelSize;
  var imageData = context.getImageData(0, 0, width, height);
  var rgbaArray = [];
  var imageArray = imageData.data;
  var rgbWidth = width * 4;
  var halfPixelSize = pixelSize / 2;

  for (var i = 0; i < imageArray.length; i += rgbStep) {
    var pixelPoint = {};

    if (pixelSize === 1) {
      pixelPoint = {
        r: imageArray[i],
        g: imageArray[i + 1],
        b: imageArray[i + 2],
        a: imageArray[i + 3],
        x: i / 4 % width,
        y: Math.floor(i / 4 / width)
      };
    } else {
      var rgbHash = {};
      var totalHash = 0;

      for (var p = 0; p < pixelSize * 4; p += pixelSize * 4) {
        for (var q = 0; q < pixelSize * rgbWidth; q += rgbWidth) {
          if (imageArray[p + i + q + 3] !== -1) {
            var hashVal = "rgba(".concat(imageArray[p + i + q], ",").concat(imageArray[p + i + q + 1], ",").concat(imageArray[p + i + q + 2], ",").concat(imageArray[p + i + q + 3], ")");
            rgbHash[hashVal] = rgbHash[hashVal] ? rgbHash[hashVal] + 1 : 1;
            totalHash += 1;
          }
        }
      }

      pixelPoint = {
        rgbEntries: Object.values(rgbHash).sort(function (a, b) {
          return b - a;
        }),
        totalEntries: totalHash,
        x: i / 4 % width,
        y: Math.floor(i / 4 / width),
        rmod: pixelSize
      };
    }

    rgbaArray.push(pixelPoint);

    if (pixelSize !== 1 && (i + rgbStep) % rgbWidth === 0) {
      i += rgbWidth * (pixelSize - 1);
    }
  }

  var scale = 1;
  var r = scale / 2;
  context.clearRect(0, 0, width, height);
  var circleArc = 2 * Math.PI;
  rgbaArray.forEach(function (point) {
    var currentR = r * pixelSize;
    var rStep = currentR / point.totalEntries;
    var baseX = point.x * scale + halfPixelSize;
    var baseY = point.y * scale + halfPixelSize;
    point.rgbEntries.forEach(function (e) {
      context.fillStyle = e[0];
      context.beginPath();
      context.arc(baseX, baseY, currentR, 0, circleArc);
      context.fill();
      currentR -= e[1] * rStep;
    });
  });
};

exports.chuckCloseCanvasTransform = chuckCloseCanvasTransform;