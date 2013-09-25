//  -=-=-=-=-=-=-=-=-=-=-=-=-=- INITIALIZATION =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

PF.init = function init( hash, chartId ) {
  var hashOptions = PF.utils.parseHash( hash );

  google.load( 'visualization', '1.0', {
    'packages': [ 'corechart' ]
  });

  google.setOnLoadCallback(function() {
    var chartElem = window.document.getElementById( chartId ),
      dimensions = PF.opts.chs( hashOptions.chs );

    log( 'Loaded.' );  // TODO: Fill out the rest of this.
  });
};
