(function( window ) {
'use strict';

var PF = window.PF,
  QUnit = window.QUnit;

QUnit.test( 'Hash parsing', function( assert ) {
  var basicHash,
    basicHashResults;

  basicHash = 'chs=250x100&chd=t:60,40&cht=p3&chl=Hello|World';
  basicHashResults = {
    'chs': '250x100',
    'chd': 't:60,40',
    'cht': 'p3',
    'chl': 'Hello|World'
  };
  assert.deepEqual(
    PF.utils.parseHash( basicHash ), basicHashResults, 'Hash parsing works' );
  assert.deepEqual(
    PF.utils.parseHash( '#' + basicHash ), basicHashResults,
    'Hash parser ignores leading hash mark' );
});

}( this ));
