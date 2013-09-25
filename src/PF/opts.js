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
