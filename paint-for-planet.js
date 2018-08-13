(function ($, d3) {
  // #TODO Please read all comments, for better understanding

  var
    /** Configurable scopes */
    radius = 145, // Circle radius
    bubbles = 8, // Allowed number of bubbles
    lineHeight = 13,
    canvasId = '#canvas', // Container of the SVG
    width = 2180 / 2, // Svg width
    height = 2808 / 2.5, // Svg height (2480 pixels x 3508 pixels) A4 size dimension in 300 DPI
    /** Derived scopes */
    diameter = radius * 2, // Circle diameter
    angle = (2 * Math.PI/*360°= 2π radians*/) / bubbles, // Angle at which the bubble is placed
    bubbleContentWidth = Math.sqrt((radius * radius) + (radius * radius)), // The Pythagorean Theorem (a2+b2=c2)
    bubbleContentX = radius * Math.cos(angle * 7),
    bubbleContentY = radius * Math.sin(angle * 7),
    data = getDummyData(8), // Data model from the database
    /** Component scopes */
    bubbleModel = buildBubbleModel(),
    svg,
    bubbleGroups,
    bubbleContent;

  // Start drawing
  $(document).ready(function () {
     draw();
   });

  /**
   * Painting initializer
   */
  function draw () {
    createSvg();
    createMarker();
    createInlineCircle();
    createLegend();
    createBubbleGroups();
    createBubbleContent();
   
    createBubbleContentTitle();
    createBubbleContentBenefits();
    createBubbleCircles(75);     
    createArrows();
  }

  /**
   * Generates the svg node and with a group element placed in the center of screen
   */
  function createSvg () {
    // Remove the existing one
    d3.select(canvasId).selectAll('svg').remove();
    // Create a new svg node
    svg = d3.select(canvasId).append('svg:svg')
      .attr('width', width)
      .attr('height', height)
      .append('g') // Group all element to make alignment easier
      .attr('transform', function () { // Place in center of the page
        return 'translate(' + (width / 2) + ', ' + (height / 2) + ')';
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

  function createInlineCircle () {

    svg.append('circle')
      .attr('cx', 0)
      .attr('cx', 0)
      .attr('r', radius)
      .attr('fill', 'transparent')
      .attr('stroke', '#078BCC')
      .attr('stroke-width', 2);
  }

  function createBubbleGroups () {
    var i = 0;
    bubbleGroups = svg.append('g')
      .selectAll('circle')
      .data(bubbleModel)
      .enter()
      .append('g')
      .attr('transform', function (d) {
        return 'translate(' + d.x + ', ' + d.y + ')';
      })
      .attr('viewBox', function (d) {
        // console.log(d.x)
        radius = 145
        // console.log((data[i].benefits).length)
        if( (data[i].benefits).length==5){
          radius=100
        }

        // console.log(radius)
        i++
        return [d.x - radius, d.y - radius, diameter, diameter].join(' ');
      });
  }

  function createBubbleCircles (r) {
    bubbleGroups
      .append('svg:circle')
      .attr('r', lineHeight*10)
      .attr('cx', 0)
      .attr('cy', 0)
      /*.attr('cx', function (d) {
       return d.x;
       })
       .attr('cy', function (d) {
       return d.y;
       })*/
      .attr('fill', 'transparent')
      .attr('stroke', '#078BCC')
      .attr('stroke-width', 2);
      console.log(lineHeight*10)
  }

  function createBubbleContent () {
    bubbleContent = bubbleGroups.append('g')
      .attr('viewBox', function (d) {
        return [bubbleContentX, bubbleContentY, bubbleContentWidth, bubbleContentWidth].join(' ');
      });
    /*bubbleContent
     .append('rect')
     .attr('x', -bubbleContentX)
     .attr('y', bubbleContentY)
     .attr('width', bubbleContentWidth)
     .attr('height', bubbleContentWidth)*/

  }

  function createBubbleContentTitle () {
    bubbleContent
      .append('text')
      .attr('x', 0)
      .attr('y', bubbleContentY - lineHeight / 2)
      .text(function (d) {
        return d.data.title;
      })
      .attr('text-anchor', 'middle')
      .style('font-size', 15)
      .style('font-weight', 'bold')
      .style('fill', 'green')
      .attr('dy', function () {
        return (this.getBBox().height / 2);
      });
  }

  function createBubbleContentBenefits () {
    // Create bullet
    bubbleContent
      .call(function (content) {
        content.each(createBenefitList);
      });
  }

  function createBenefitList (d) {
    if (!$.isArray(d.data.benefits)) {
      return true;
    }
    var g = d3.select(this);
    d.data.benefits.forEach(function (benefit, i) {
      nobubble = 0
      if((benefit.name).charAt(0)==" "){
        nobubble = 1        
      }
      if(benefit.length==5) {
        radius = 70
        // console.log((benefit.name).charAt(0))
      }
      createBulletPoint(g, bubbleContentX, bubbleContentY + lineHeight + (i * lineHeight), benefit, nobubble);
      /*if (benefit.highlights) {
        benefit.highlights.forEach(function () {
          createBulletPoint(g, bubbleContentX - 20, bubbleContentY + lineHeight + (i * lineHeight), highlights);
        });
      }*/
    });
  }

  function createBulletPoint (element, x, y, data, nobubble) {
    if(nobubble==0) {      
      element.append('circle')
        .attr('r', 2)
        .attr('cx', -x)
        .attr('cy', function (_d) {
          return y;
        })
        .style('fill', '#800000');
    }

    element.append('text')
      .attr('x', -x + 10)
      .attr('y', function (_d) { 
        return y + lineHeight / 3.5;
      })
      .text(function () {
        return data.name;
      })
      .style('font-size', 11);
  }

  function createLegend () {
    svg.append('g')
      .append('text')
      .text('Health and Wellness Strategy')
      .style('font-size', 15)
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
      .data(bubbleModel)
      .enter()
      .append('line')
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('x1', (radius * 1.55))
      .attr('x2', (radius * 1.25))
      .attr('stroke', '#078BCC')
      .attr('stroke-width', 1)
      .attr("marker-end", "url(#hws-arrow)")
      .attr('transform', function (d) {
        return 'rotate(' + (d.angle * (180 / Math.PI)) + ')';
      });
  }

  function buildBubbleModel () {
    return data.map(function (d, i) {
      var a = i * angle;
      return {
        id: i + 1,
        x: (radius * 2.75 * Math.cos(a)), // Calculate the x position of the bubble.
        y: (radius * 2.75 * Math.sin(a)), // Calculate the y position of the element.
        data: d,
        angle: a
      };
    });
  }

  /**
   * This method just returns a dummy data set for demo purpose
   *
   * @param length {number} is the size of the data model
   */
  function getDummyData (length) {
   

var itemdata = {
    'Mental' : [
          {name: 'Comprehensive Health Benefit Package'},
          {name: 'Comprehensive Medical & Rx Coverage'},
          {name: 'WHealth Contingent Medical Plans'},
          {name: 'Dental222'},
          {name: 'Health Advocate Services'},
          {name: 'Encouraging Preventive Medicine'},
          {name: 'Healthy Food Options'},
          {name: 'Encouraging preventive Medicine'},
          {name: 'Healthy Food Options'},
          {name: 'Telecommuting'},
          {name: 'Walking meetings'} 
],
    'Environmental' : [
          {name: 'Comprehensive Health Benefit Package'},
          {name: 'Comprehensive Medical & Rx Coverage'},
          {name: 'WHealth Contingent Medical Plans'},
          {name: 'Dental'},
          {name: 'Health Advocate Services'},
          {name: 'Encouraging Preventive Medicine'},
          {name: 'Healthy Food Options'},
          {name: 'Encouraging preventive Medicine'},
          {name: 'Healthy Food Options'},
          {name: 'Telecommuting'},
          {name: 'Walking meetings'} ,
          {name: 'Telecommuting'},
          {name: 'Walking meetings'}
]
,
    'Eight planet' : [
          {name: 'Comprehensive Health Benefit Package'},
          {name: 'Comprehensive Medical & Rx Coverage'},
          {name: 'WHealth Contingent Medical Plans'},
          {name: 'Dental'},
          {name: 'Health Advocate Services'},
          {name: 'Encouraging Preventive Medicine'}, 
          {name: 'Walking meetings'},
          {name: 'Encouraging preventive Medicine'},
          {name: 'Healthy Food Options'},
          {name: 'Telecommuting'},
          {name: 'Walking meetings'}
]
,
    'Spiritual' : [
          {name: 'Comprehensive Health Benefit Package'},
          {name: 'Comprehensive Medical & Rx Coverage'},
          {name: 'WHealth Contingent Medical Plans'},
          {name: 'Dental'},
          {name: 'Health Advocate Services'},
          {name: 'Encouraging Preventive Medicine'},
          {name: 'Healthy Food Options'},
          {name: 'Encouraging preventive Medicine'},
          {name: 'Healthy Food Options'},
          {name: 'Telecommuting'},
          {name: 'Walking meetings'},
          {name: 'Encouraging preventive Medicine'},
          {name: 'Healthy Food Options'},
          {name: 'Telecommuting'},
          {name: 'Walking meetings'}
]
,
    'Occupational' : [
          {name: 'Comprehensive Health Benefit Package'},
          {name: 'Comprehensive Medical & Rx Coverage'},
          {name: 'WHealth Contingent Medical Plans'},
          {name: 'Walking meetings'},
          {name: 'Encouraging preventive Medicine'},
          {name: 'Healthy Food Options'},
          {name: 'Telecommuting'},
          {name: 'Walking meetings'}
]
,
    'Financial' : [
          {name: 'Comprehensive Health Benefit Package'},
          {name: 'Comprehensive Medical & Rx Coverage'},
          {name: 'WHealth Contingent Medical Plans'},
          {name: 'Dental'},
          {name: 'Health Advocate Services'},
          {name: 'Encouraging Preventive Medicine'},
          {name: 'Healthy Food Options'},
          {name: 'Walking meetings'},
          {name: 'Encouraging preventive Medicine'},
          {name: 'Healthy Food Options'},
          {name: 'Telecommuting'},
          {name: 'Walking meetings'}
]
,
    'Environmental' : [
          {name: 'Comprehensive Health Benefit Package'},
          {name: 'Comprehensive Medical & Rx Coverage'},
          {name: 'WHealth Contingent Medical Plans'},
          {name: 'Dental'},          
          {name: 'Walking meetings'},
          {name: 'Encouraging preventive Medicine'},
          {name: 'Healthy Food Options'},
          {name: 'Telecommuting'},
          {name: 'Walking meetings'}
]
,
    'Community' : [
          {name: 'Comprehensive Health Benefit Package'},         
          {name: 'Encouraging preventive Medicine'},
          {name: 'Healthy Food Options'},
          {name: 'Telecommuting'},
          {name: 'Walking meetings'}
],
    'Physical' : [
          {name: "Comprehensive Health Benefit"},
          {name: " Package"},
          {name: 'Comprehensive Medical & Rx Coverage'},
          {name: 'WHealth Contingent Medical Plans'},
          {name: 'Dental'},
          {name: 'Health Advocate Services'},
          {name: 'Encouraging Preventive Medicine'},
          {name: 'Healthy Food Options'},
          {name: 'Encouraging preventive Medicine'},
          {name: 'Healthy Food Options'},
          {name: 'Telecommuting'},
          {name: 'Walking meetings'} ,
          {name: 'Telecommuting'},
          {name: 'Walking meetings'}
]
}; 
  
    toreturn = []
    for (title in itemdata) {      
      toreturn.push({
        title: title,
        benefits: itemdata[title]
      })
    }
    return toreturn;
 }
})(window.$, window.d3);