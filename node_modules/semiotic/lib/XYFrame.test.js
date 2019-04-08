"use strict";

var React = _interopRequireWildcard(require("react"));

var _enzyme = require("enzyme");

var _XYFrame = _interopRequireDefault(require("./XYFrame"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var somePointData = [{
  day: 1,
  date: "2017-01-01",
  value: 180
}, {
  day: 2,
  date: "2017-02-01",
  value: 80
}, {
  day: 3,
  date: "2017-03-14",
  value: 0
}, {
  day: 4,
  date: "2017-06-20",
  value: 20
}];
var someOtherPointData = [{
  day: 1,
  date: "2017-01-01",
  value: 280
}, {
  day: 2,
  date: "2017-02-01",
  value: 0
}, {
  day: 3,
  date: "2017-03-14",
  value: 50
}, {
  day: 4,
  date: "2017-06-20",
  value: 50
}];
var htmlAnnotation = {
  day: 3,
  value: 100,
  type: "frame-hover"
};
var svgAnnotation = {
  day: 3,
  value: 100,
  type: "xy" //Enzyme doesn't do well with context so disable it for now

};
describe("XYFrame", function () {
  it("renders points, lines, areas without crashing", function () {
    (0, _enzyme.mount)(React.createElement(_XYFrame.default, {
      points: somePointData,
      lines: [{
        label: "points",
        coordinates: somePointData
      }],
      areas: [{
        label: "areas",
        coordinates: somePointData
      }],
      xAccessor: "day",
      yAccessor: "value",
      disableContext: true
    }));
  });
  var returnedExtent;
  var wrapper = (0, _enzyme.shallow)(React.createElement(_XYFrame.default, {
    points: somePointData,
    lines: [{
      label: "points",
      coordinates: somePointData
    }, {
      label: "otherpoints",
      coordinates: someOtherPointData
    }],
    areas: [{
      label: "areas",
      coordinates: somePointData
    }],
    xExtent: {
      onChange: function onChange(d) {
        returnedExtent = d;
      }
    },
    xAccessor: "day",
    yAccessor: "value",
    disableContext: true
  }));
  it("renders a <Frame>", function () {
    expect(wrapper.find("Frame").length).toEqual(1);
  });
  it("returns the calculated extent", function () {
    expect(returnedExtent[0]).toEqual(1);
    expect(returnedExtent[1]).toEqual(4);
  });
  var mountedFrame = (0, _enzyme.mount)(React.createElement(_XYFrame.default, {
    points: somePointData,
    lines: [{
      label: "points",
      coordinates: somePointData
    }, {
      label: "otherpoints",
      coordinates: someOtherPointData
    }],
    areas: [{
      label: "areas",
      coordinates: somePointData
    }],
    xExtent: {
      onChange: function onChange(d) {
        returnedExtent = d;
      }
    },
    xAccessor: "day",
    yAccessor: "value",
    disableContext: true
  }));
  it("renders points in their own <g>", function () {
    expect(mountedFrame.find("g.points").length).toEqual(1);
    expect(mountedFrame.find("g.frame-piece").length).toEqual(4);
  });
  it("renders lines in their own <g>", function () {
    expect(mountedFrame.find("g.lines").length).toEqual(1);
    expect(mountedFrame.find("g.xyframe-line").length).toEqual(2);
  });
  it("renders summaries in their own <g>", function () {
    expect(mountedFrame.find("g.summaries").length).toEqual(1);
    expect(mountedFrame.find("g.xyframe-summary").length).toEqual(1);
  });
  it("doesn't render an interaction layer", function () {
    expect(mountedFrame.find("div.interaction-layer").length).toEqual(0);
  });
  it("doesn't offset because there shouldn't be a margin", function () {
    expect(mountedFrame.find("g.data-visualization").length).toEqual(1);
    expect(mountedFrame.find("g.data-visualization").props().transform).toEqual("translate(0,0)");
  });
  it("doesn't render any axis <g> elements", function () {
    expect(mountedFrame.find("g.axis").length).toEqual(0);
  });
  var mountedFrameWithOptions = (0, _enzyme.mount)(React.createElement(_XYFrame.default, {
    title: "test title",
    points: somePointData,
    lines: [{
      label: "points",
      coordinates: somePointData
    }, {
      label: "otherpoints",
      coordinates: someOtherPointData
    }],
    summaries: [{
      label: "summaries",
      coordinates: somePointData
    }],
    xExtent: {
      onChange: function onChange(d) {
        returnedExtent = d;
      }
    },
    xAccessor: "day",
    yAccessor: "value",
    disableContext: true,
    showLinePoints: true,
    showSummaryPoints: true,
    hoverAnnotation: true,
    axes: [{
      orient: "left"
    }, {
      orient: "bottom"
    }]
  }));
  it("showLinePoints exposes more points", function () {
    expect(mountedFrameWithOptions.find("g.frame-piece").length).toEqual(16);
  });
  it("hoverAnnotation turns on interaction layer and only has regions for non-overlapping points", function () {
    expect(mountedFrameWithOptions.find("div.interaction-layer").length).toEqual(1);
    expect(mountedFrameWithOptions.find("g.interaction-regions > path").length).toEqual(8);
  });
  it("axes and title cause a default margin that offsets the data-visualization container", function () {
    expect(mountedFrameWithOptions.find("g.data-visualization").props().transform).toEqual("translate(50,40)");
  });
  it("renders two axis <g> elements, one for lines and one for labels", function () {
    expect(mountedFrameWithOptions.find("g.axis-tick-lines").length).toEqual(1);
    expect(mountedFrameWithOptions.find("g.axis-labels").length).toEqual(1);
  });
  it("renders a title <g>", function () {
    expect(mountedFrameWithOptions.find("g.frame-title").length).toEqual(1);
  });
  var mountedFrameWithAnnotation = (0, _enzyme.mount)(React.createElement(_XYFrame.default, {
    title: "test title",
    points: somePointData,
    lines: [{
      label: "points",
      coordinates: somePointData
    }, {
      label: "otherpoints",
      coordinates: someOtherPointData
    }],
    xAccessor: "day",
    yAccessor: "value",
    disableContext: true,
    annotations: [htmlAnnotation, svgAnnotation]
  }));
  it("renders an svg annotation", function () {
    expect(mountedFrameWithAnnotation.find("g.annotation.xy").length).toEqual(1);
  });
  it("renders an html annotation", function () {
    expect(mountedFrameWithAnnotation.find("div.annotation.annotation-xy-label").length).toEqual(1);
  });
  var svgAnnotationXY = mountedFrameWithAnnotation.find("g.annotation.xy > circle");
  var htmlAnnotationStyle = mountedFrameWithAnnotation.find("div.annotation.annotation-xy-label").getDOMNode().style;
  var x = 333.3333333333333;
  var y = 295.7142857142857;
  it("html and svg annotations have the same x & y positions for each", function () {
    expect(svgAnnotationXY.props().cx).toEqual(x);
    expect(svgAnnotationXY.props().cy).toEqual(y);
    expect(htmlAnnotationStyle.left).toEqual("".concat(x, "px"));
    expect(htmlAnnotationStyle.top).toEqual("".concat(y, "px"));
  });
});