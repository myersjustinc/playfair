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
