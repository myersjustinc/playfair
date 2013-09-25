(function( window ) {
'use strict';

var PF = window.PF,
  QUnit = window.QUnit;

QUnit.test( 'Hash parsing', function( assert ) {
  var basicHash,
    basicHashResults;

  basicHash = 'a=1&b=2&c=wtf&d=ohai';
  basicHashResults = {
    a: '1',
    b: '2',
    c: 'wtf',
    d: 'ohai'
  };
  assert.deepEqual(
    PF.utils.parseHash( basicHash ), basicHashResults, 'Hash parsing works' );
  assert.deepEqual(
    PF.utils.parseHash( '#' + basicHash ), basicHashResults,
    'Hash parser ignores leading hash mark' );
});

}( this ));
