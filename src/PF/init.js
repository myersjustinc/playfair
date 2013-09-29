//  -=-=-=-=-=-=-=-=-=-=-=-=-=- INITIALIZATION =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

PF.init = function init( hash, chartId ) {
  var hashOptions = PF.utils.parseHash( hash );

  google.load( 'visualization', '1.0', {
    'packages': [ 'corechart' ]
  });

  google.setOnLoadCallback(function() {
    var chart,
      chartElem = window.document.getElementById( chartId ),
      chartType = PF.opts.cht( hashOptions.cht ),
      dimensions = PF.opts.chs( hashOptions.chs ),
      key,
      options = {},
      table = PF.utils.buildTable(
        PF.opts.chdl( hashOptions.chdl || hashOptions.chl ),
        PF.opts.chd( hashOptions.chd ) );

    // Clone chartType.options into main options object, which also will hold
    // other configuration data for the chart we're about to initialize.
    for ( key in chartType.options ) {
      if ( chartType.options.hasOwnProperty( key ) ) {
        options[ key ] = chartType.options[ key ];
      }
    }

    // Add dimensions to the options object.
    options.height = dimensions.height;
    options.width = dimensions.width;

    // Initialize the chart.
    chart = new chartType.chartClass( chartElem );
    chart.draw( table, options );
  });
};
