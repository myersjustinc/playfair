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
