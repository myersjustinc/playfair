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

