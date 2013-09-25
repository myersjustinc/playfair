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
