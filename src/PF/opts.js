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
