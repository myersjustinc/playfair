/*! Playfair.js - v0.1.0-dev - 2013-09-25 */

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
    PF.utils.logError(
      'Extended encoding format not yet supported for chd (data). Aborting.' );
    return;
  }

  return parsedData;
};

//  -=-=-=-=-=-=-=-=-=-=-=-=-= UTILITY FUNCTIONS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

PF.utils = PF.utils || {};

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
    var chartElem = window.document.getElementById( chartId ),
      dimensions = PF.opts.chs( hashOptions.chs );

    log( 'Loaded.' );  // TODO: Fill out the rest of this.
  });
};


}( this ));
