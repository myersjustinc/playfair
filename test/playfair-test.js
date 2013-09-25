(function( window ) {
'use strict';

var document = window.document,
  PF = window.PF,
  QUnit = window.QUnit;

function setupErrorElem() {
  var errorElem = document.createElement( 'div' ),
    existingErrorElem = document.getElementById( 'playfair-errors' ),
    fixture = document.getElementById( 'qunit-fixture' );

  if ( existingErrorElem ) {
    fixture.removeChild( existingErrorElem );
  }

  errorElem.setAttribute( 'id', 'playfair-errors' );
  fixture.appendChild( errorElem );

  return errorElem;
}

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

QUnit.test( 'Error logging', function( assert ) {
  var errorElem = setupErrorElem();

  PF.utils.logError( 'test error' );
  assert.equal(
    errorElem.getElementsByTagName( 'p' ).length, 1, 'Error logged' );
});

QUnit.test( 'Multiple-error logging', function( assert ) {
  var errorElem = setupErrorElem();

  PF.utils.logError( 'test error 1' );
  PF.utils.logError( 'test error 2' );
  assert.equal(
    errorElem.getElementsByTagName( 'p' ).length, 2, 'Errors logged' );
});

QUnit.test( 'Option parsing', function( assert ) {
  var errorElem = setupErrorElem();

  assert.deepEqual( PF.opts.chs( '500x450' ), {
    height: 450,
    width: 500
  }, 'Correctly parses chart size' );
  assert.deepEqual( PF.opts.chs( 'wtf' ), {
    height: 200,
    width: 300
  }, 'Chart size falls back to default with malformed input' );
});

}( this ));
