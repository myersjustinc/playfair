/*! Playfair.js - v0.1.0-dev - 2013-09-28 */

(function( window ) {
'use strict';

// Variation of Paul Irish's log() for my IIFE setup:
// http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
function log() {
  log.history = log.history || [];
  log.history.push( arguments );
  if ( window.console ) {
    window.console.log( Array.prototype.slice.call( arguments ) );
  }
}

var google = window.google || {},
  PF = window.PF || {};

window.PF = PF;


//  -=-=-=-=-=-=-=-=-=-=-=-=-=- DEFAULT VALUES =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

PF.defaults = PF.defaults || {};

PF.defaults.chs = '300x200';

//  -=-=-=-=-=-=-=-=-=-=-=-=-=- OPTION PARSERS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

PF.opts = PF.opts || {};

PF.opts.chd = function chd( rawChd ) {  // Chart data
  var chdFormat = /^([tse]):(.+)$/,
    chdFormatMatch,
    parsedData;

  chdFormatMatch = chdFormat.exec( rawChd );
  if ( !chdFormatMatch ) {
    PF.utils.logError( 'No format specified for chd (data). Aborting.' );
    return;
  }

  if ( chdFormatMatch[ 1 ] === 't' ) {  // Basic text format
    parsedData = (function( rawData ) {
      var i,
        iLen,
        j,
        jLen,
        series,
        seriesList,
        seriesListRaw,
        seriesRaw,
        value,
        valuesRaw;

      seriesList = [];
      seriesListRaw = rawData.split( '|' );
      for ( i = 0, iLen = seriesListRaw.length; i < iLen; i++ ) {
        series = [];
        seriesRaw = seriesListRaw[ i ];

        valuesRaw = seriesRaw.split( ',' );
        for ( j = 0, jLen = valuesRaw.length; j < jLen; j++ ) {
          value = valuesRaw[ j ];

          if ( value === '_' ) {
            value = null;
          } else {
            value = parseFloat( value );
            if ( isNaN( value ) ) {
              value = null;
            }
          }

          series.push( value );
        }

        seriesList.push( series );
      }

      return seriesList;
    }( chdFormatMatch[ 2 ]));
  } else if ( chdFormatMatch[ 1 ] === 's' ) {  // Simple encoding format
    parsedData = (function( rawData ) {
      var encodingOptions = ('ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
          'abcdefghijklmnopqrstuvwxyz0123456789'),
        i,
        iLen,
        j,
        jLen,
        series,
        seriesList,
        seriesListRaw,
        seriesRaw,
        value;

      seriesList = [];
      seriesListRaw = rawData.split( ',' );
      for ( i = 0, iLen = seriesListRaw.length; i < iLen; i++ ) {
        series = [];
        seriesRaw = seriesListRaw[ i ];

        for ( j = 0, jLen = seriesRaw.length; j < jLen; j++ ) {
          value = seriesRaw.substring( j, j + 1 );

          if ( value === '_' ) {
            value = null;
          } else {
            value = encodingOptions.indexOf( value );
            if ( value === -1 ) {
              value = null;
            }
          }

          series.push( value );
        }

        seriesList.push( series );
      }

      return seriesList;
    }( chdFormatMatch[ 2 ]));
  } else if ( chdFormatMatch[ 1 ] === 'e' ) {  // Extended text format
    parsedData = (function( rawData ) {
      var encodingOptions = ('ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
          'abcdefghijklmnopqrstuvwxyz0123456789-.'),
        firstDigit,
        i,
        iLen,
        j,
        jLen,
        secondDigit,
        series,
        seriesList,
        seriesListRaw,
        seriesRaw,
        value;

      seriesList = [];
      seriesListRaw = rawData.split( ',' );
      for ( i = 0, iLen = seriesListRaw.length; i < iLen; i++ ) {
        series = [];
        seriesRaw = seriesListRaw[ i ];

        for ( j = 0, jLen = seriesRaw.length; j < jLen; j += 2 ) {
          firstDigit = seriesRaw.substring( j, j + 1 );
          secondDigit = seriesRaw.substring( j + 1, j + 2 );

          if ( firstDigit === '_' || secondDigit === '_' ) {
            value = null;
          } else {
            firstDigit = encodingOptions.indexOf( firstDigit );
            secondDigit = encodingOptions.indexOf( secondDigit );
            if ( firstDigit === -1 || secondDigit === -1 ) {
              value = null;
            } else {
              value = 64 * firstDigit + secondDigit;
            }
          }

          series.push( value );
        }

        seriesList.push( series );
      }

      return seriesList;
    }( chdFormatMatch[ 2 ]));
  }

  return parsedData;
};

PF.opts.chdl = function chdl( rawChdl ) {  // Legend labels
  return (rawChdl || '').split( '|' );  // Well, that was easy.
};

PF.opts.chl = PF.opts.chdl;  // Chart labels (pie, Google-O-Meter)

PF.opts.chs = function chs( rawChs ) {  // Chart size
  var dimsFormat = /^(\d+)x(\d+)$/,
    dimsMatch,
    dimsParsed,
    dimsSplit;

  if ( rawChs == null ) {
    PF.utils.logError( 'chs (size) not specified. Using default.' );
    rawChs = PF.defaults.chs;
  }

  dimsMatch = dimsFormat.exec( rawChs );
  if ( !dimsMatch ) {
    PF.utils.logError( 'chs (size) formatted incorrectly. Using default.' );
    dimsMatch = dimsFormat.exec( PF.defaults.chs );
  }

  return {
    height: parseInt( dimsMatch[ 2 ], 10 ),
    width: parseInt( dimsMatch[ 1 ], 10 )
  };
};

PF.opts.cht = function cht( rawCht ) {  // Chart type
  var chartClass,
    mainCht,
    options = {},
    splitCht;

  switch( rawCht ) {
    case 'p3':
      options.is3D = true;
      /* falls through */
    case 'p':
      chartClass = google.visualization.PieChart;
      break;
  }

  return {
    chartClass: chartClass,
    options: options
  };
};

//  -=-=-=-=-=-=-=-=-=-=-=-=-= UTILITY FUNCTIONS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

PF.utils = PF.utils || {};

PF.utils.buildTable = function buildTable( labels, data ) {
  var col,
    colLen,
    row,
    rowObj,
    series,
    seriesLengths = [],
    seriesMaxLength = 0,
    table;

  // Create the table schema and find the length of the longest series (i.e.,
  // the total number of rows).
  table = new google.visualization.DataTable();
  table.addColumn( 'string' );  // Add label column.
  for ( col = 0, colLen = data.length; col < colLen; col++ ) {
    table.addColumn( 'number' );  // Add data column for this series.
    series = data[ col ];
    seriesLengths.push( series.length );
  }
  seriesMaxLength = Math.max.apply( null, seriesLengths );

  // Fill in the actual data.
  for ( row = 0; row < seriesMaxLength; row++ ) {
    rowObj = [ labels[ row ] ];
    for ( col = 0, colLen = data.length; col < colLen; col++ ) {
      series = data[ col ];
      rowObj.push( series[ row ] );
    }
    table.addRow( rowObj );
  }

  return table;
};

PF.utils.logError = function logError( errorText, errorElem ) {
  errorElem = typeof errorElem !== 'undefined' ? errorElem : (
    window.document.getElementById( 'playfair-errors' ));

  var errorFragment = window.document.createDocumentFragment(),
    errorTextElem = window.document.createElement( 'p' );

  errorTextElem.textContent = errorText;
  errorFragment.appendChild( errorTextElem );
  errorElem.appendChild( errorFragment );
};

PF.utils.parseHash = function parseHash( hash ) {
  var i,
    len,
    paramParts,
    params = {},
    paramString,
    paramStrings;

  // Remove hash symbol from hash if present.
  hash = hash.substring( 0, 1 ) === '#' ? hash.substring( 1 ) : hash;

  // Split hash into keys and values.
  paramStrings = hash.split( '&' );
  for ( i = 0, len = paramStrings.length; i < len; i++ ) {
    paramString = paramStrings[ i ];
    paramParts = paramString.split( '=' );
    params[ paramParts[ 0 ] ] = paramParts[ 1 ];
  }

  return params;
};

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


}( this ));
