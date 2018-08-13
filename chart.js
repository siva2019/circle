(function ($, d3, Data, DataModel) {
  // #TODO Please read all comments, for better understanding

  var
    svg,
    bubbleGroups,
    canvasId = '#canvas',
    bigRadius,
    bubbles = 8,
    angle = (2 * Math.PI/*360°= 2π radians*/) / bubbles, // Angle at which the bubble is placed
    data = Data.get();

  var fontSize = 13;
  var intend = 10;
  var bulletPadding = 10;
  var circlePadding =0;
  console.log(data);

  var model = data.map(DataModel.build);

  init();

  function init () {
    createSvg();
    createMarker();
    createBubbleGroups();
    findBigRadius();
    positionTheBubbles();
    alignViewport();
    createInlineCircle();
    createLegend();
    createArrows();
    console.log(model);
  }

  /**
   * Generates the svg node and with a group element placed in the center of screen
   */
  function createSvg () {
    // Remove the existing one
    d3
      .select(canvasId)
      .selectAll('svg')
      .remove();
    // Create a new svg node
    svg = d3
      .select(canvasId)
      .append('svg:svg')
      .attr('width', 500)
      .attr('height', 500)
      .append('g') // Group all element to make alignment easier
      .attr('transform', function () { // Place in center of the page
        return 'translate(' + (500 / 2) + ', ' + (500 / 2) + ')';
      });
  }

  function createMarker () {
    svg.append('defs')
      .append('marker')
      .attr('id', 'hws-arrow')
      .attr('markerUnits', 'strokeWidth')
      .attr('markerWidth', 12)
      .attr('markerHeight', 12)
      .attr('viewBox', '0 0 12 12')
      .attr('refX', '6')
      .attr('refY', '6')
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M2,2 L10,6 L2,10 L6,6 L2,2')
      .attr('fill', '#078BCC');

  }

  function createBubbleGroups () {
    bubbleGroups = svg.append('g')
      .selectAll('circle')
      .data(model)
      .enter()
      .append('g')
      .each(createBubbleContent);
  }

  function createBubbleContent (data) {
    createTrailText(d3.select(this), data)
  }

  function createTrailText (textGroup, data) {
    //var textGroup = bubbleGroups;

    var textBox = textGroup
      .append('g')
      .append('text')
      .attr('x', 0)
      .attr('y', 0);

    textBox
      .selectAll('tspan')
      .data(data.textList)
      .enter()
      .append('tspan')
      .text(function (d) {
        return d.data;
      })
      .style('font-size', fontSize)
      .attr('x', function (d) {
        return d.indented ? intend : 0;
      })
      .attr('dy', (fontSize + 2));

    var dimension = textBox.node().getBBox();
    var bigSide = Math.max(dimension.width + bulletPadding, dimension.height);
    var halfOfBigSide = bigSide / 2;
    var radius = Math.sqrt((halfOfBigSide * halfOfBigSide) + (halfOfBigSide * halfOfBigSide)) + circlePadding;
    data.radius = radius;
    textGroup
      .append('circle')
      .attr('r', radius)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('fill', 'transparent')
      .attr('stroke', '#078BCC')
      .attr('stroke-width', 1);

    /*textGroup
     .append('rect')
     .attr('x', -halfOfBigSide)
     .attr('y', -halfOfBigSide)
     .attr('width', bigSide)
     .attr('height', bigSide)
     .attr('fill', 'transparent')
     .attr('stroke', '#078BCC')
     .attr('stroke-width', 1);*/

    textBox
      .attr('y', -halfOfBigSide);

    var allTexts = textBox
      .selectAll('tspan')
      .attr('x', function (d) {
        var x = halfOfBigSide - bulletPadding;
        if (d.indented) {
          x = x - intend;
        }
        return -x;
      });

    allTexts.each(function (d, i) {
      var tspan = d3.select(this);
      var dy = tspan.attr('dy');
      var r = 2;
      var x = halfOfBigSide - bulletPadding / 2;
      var y = halfOfBigSide - (dy * i) - (dy * 3 / 4);
      if (d.indented) {
        x = x - intend;
      }
      textGroup
        .select('g')
        .append('circle')
        .attr('cx', -x)
        .attr('cy', -y)
        .attr('r', r)
        .attr('fill', '#ff0000');
    });

    textGroup
      .select('g')
      .append('text')
      .style('font-size', 16)
      .attr('x', 0)
      .attr('y', -halfOfBigSide - 5)
      .attr('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .text(function () {
        return data.title;
      });

    var textBoxHeight = textBox.node().getBBox().height;
    if (textBoxHeight < bigSide) {
      textGroup
        .select('g')
        .attr('transform', function () {
          return 'translate(0, ' + ((bigSide - textBoxHeight) / 2) + ')';
        })
    }
  }

  function findBigRadius () {
    // Find the big circle radius
    bigRadius = model.reduce(function (prev, current) {
      return (prev.radius > current.radius) ? prev : current
    }).radius;
  }

  function positionTheBubbles () {
    model.forEach(function (d, i) {
      var a = i * angle;
      d.x = (bigRadius * 2.5 * Math.cos(a));
      d.y = (bigRadius * 2.5 * Math.sin(a));
      d.angle = a;
    });
    bubbleGroups.attr('transform', function (d) {
      return 'translate(' + d.x + ', ' + d.y + ')';
    });
  }

  function createInlineCircle () {
    svg.append('circle')
      .attr('cx', 0)
      .attr('cx', 0)
      .attr('r', radius)
      .attr('fill', 'transparent')
      .attr('stroke', '#078BCC')
      .attr('stroke-width', 1);
  }

  function alignViewport () {
    var dimension = svg.node().getBBox();
    var w = dimension.width + 50;
    var h = dimension.height + 50;

    d3
      .select(canvasId)
      .select('svg')
      .attr('width', w)
      .attr('height', h);

    svg
      .attr('transform', function () { // Place in center of the page
        return 'translate(' + (w / 2) + ', ' + (h / 2) + ')';
      })

  }

  function createInlineCircle () {
    svg.append('circle')
      .attr('cx', 0)
      .attr('cx', 0)
      .attr('r', 130)
      .attr('fill', 'transparent')
      .attr('stroke', '#078BCC')
      .attr('stroke-width', 1);
  }

  function createLegend () {
    svg.append('g')
      .append('text')
      .text('Health and Wellness Strategy')
      .style('font-size', 16)
      .style('font-weight', 'bold')
      .attr('fill', 'green')
      .attr('text-anchor', 'middle')
      .attr('dy', function () {
        return (this.getBBox().height / 2);
      });
  }

  function createArrows () {
    svg.append('g')
      .selectAll('lines')
      .data(model)
      .enter()
      .append('line')
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('x1', (bigRadius * 1.2))
      .attr('x2', (bigRadius * 1))
      .attr('stroke', '#078BCC')
      .attr('stroke-width', 1)
      .attr("marker-end", "url(#hws-arrow)")
      .attr('transform', function (d) {
        return 'rotate(' + (d.angle * (180 / Math.PI)) + ')';
      });
  }
})(
  window.$,
  window.d3,
  window.pw.DataService,
  window.pw.ChartDataModel
);