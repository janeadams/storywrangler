'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _canvas2 = require('./canvas.js');

var _svg2 = require('./svg.js');

var _generator = require('./generator.js');

exports.default = {
  canvas: function canvas(_canvas, config) {
    if (config && config.async) {
      return new _canvas2.RoughCanvasAsync(_canvas, config);
    }
    return new _canvas2.RoughCanvas(_canvas, config);
  },
  svg: function svg(_svg, config) {
    if (config && config.async) {
      return new _svg2.RoughSVGAsync(_svg, config);
    }
    return new _svg2.RoughSVG(_svg, config);
  },
  createRenderer: function createRenderer() {
    return _canvas2.RoughCanvas.createRenderer();
  },
  generator: function generator(config, size) {
    if (config && config.async) {
      return new _generator.RoughGeneratorAsync(config, size);
    }
    return new _generator.RoughGenerator(config, size);
  }
};