(function (root) {

  root.pw = root.pw || {};

  root.pw.DataService = {
    get: getData
  };

  function getData () {
    return [
      {
        title: 'Environmental',
        benefits: [
		  {name: 'WHealth Contingent Medical'},	
          {name: 'Wellness committee'},
          {name: 'Walking meetings'},
          {
            name: 'Healthy food options:',
            highlights: [
              {name: 'Onsite potlucks'},
              {name: 'Employee appreciation events'}
            ]
          }
        ]
      },
      {
        title: 'Eight planet',
        benefits: [
          {
            name: 'WHealth Contingent Medical Plans',
            highlights: [
              {name: 'Onsite potlucks'},
              {name: 'Employee appreciation events'}
            ]
          },
          {name: 'Dental222'},
          {name: 'Health Advocate Services'},
          {name: 'Encouraging Preventive Medicine'},
          {name: 'Healthy Food Options'},
          {name: 'Healthy Food Options'},
          {name: 'Telecommuting'},
          {name: 'Walking meetings'}
        ]
      },
      {
        title: 'Spiritual',
        benefits: [
          {name: 'WHealth Contingent Medical'},
          {name: 'Dental'},
          {name: 'Healthy Food Options'},
          {name: 'Walking meetings'},
          {name: 'Healthy Food Options'},
          {name: 'Walking meetings'}
        ]
      },
      {
        title: 'Occupational',
        benefits: [
          {name: 'WHealth Contingent'},
          {name: 'Dental'},
          {name: 'Health Advocate'},
          {name: 'Telecommuting'},
          {name: 'Walking meetings'}
        ]
      },
      {
        title: 'Financial',
        benefits: [
          {name: 'Walking meetings'}
        ]
      },
      {
        title: 'Community',
        benefits: [
          {name: 'WHealth Contingent Medical'},
          {name: 'Dental'},
          {name: 'Health Advocate Services'},
          {name: 'Encouraging Preventive '},
          {name: 'Healthy Food Options'},
          {name: 'Telecommuting'},
          {name: 'Walking meetings'},
          {name: 'Telecommuting'},
          {name: 'Walking meetings'}
        ]
      },
      {
        title: 'Physical',
        benefits: [
		 	
          {name: 'Dental'},
          {name: 'Health Advocate Services'},
          {
            name: 'Encouraging preventive',
            highlights: [
              {name: 'Onsite potlucks'},
              {name: 'Employee appreciation events'}
            ]
          },
          {name: 'Healthy Food Options'},
          {name: 'Telecommuting'},
          {name: 'Walking meetings'},
		
          {name: 'Telecommuting'},
          {name: 'Walking meetings'}
        ]
      },
      {
        title: 'Mental',
        benefits: [
          {
            name: 'Comprehensive Medical & Rx Coverage',
            highlights: [
              {name: 'Onsite potlucks'},
              {name: 'Employee appreciation events'}
            ]
          },
          {name: 'WHealth Contingent Medical Plans'},
          {name: 'Dental'},
          {name: 'Health Advocate Services'},
          {name: 'Encouraging Preventive Medicine'},
          {name: 'Healthy Food Options'},
          {name: 'Encouraging preventive Medicine'},
          {name: 'Healthy Food Options'},
          {name: 'Telecommuting'},
          {name: 'Walking meetings'},
          {name: 'Telecommuting'},
          {name: 'Walking meetings'}
        ]
      }
    ];
  }
})(window);