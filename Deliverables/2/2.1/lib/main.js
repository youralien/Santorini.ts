"use strict";

// load in package for stdin and stdout, and create input/output interface
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
}); // global variables

var currReadString = ''; // stores current input from user (allows for multi-line JSON)

/**
 * Reads lines as input to stdin is made.
 */

rl.on('line', function (input) {
  // add new input to current read in string (handling valid JSON across multiple lines)
  currReadString += input; // determine if JSON is valid

  var isValidResponse = maybeValidJson(currReadString);

  if (isValidResponse !== undefined) {
    // clear current read string and augment the valid, parsed JSON
    currReadString = '';

    if (isValidCommand(isValidResponse)) {
      if (isValidResponse["operation-name"] === 'Declare') {
        console.log(JSON.stringify(declareNumber()));
      } else if (isValidResponse["operation-name"] === 'Swap') {
        console.log(JSON.stringify(swapNumber()));
      }
    }
  }
});
/**
 * Detect when input stream is closed.
 */

rl.on('close', function () {// exit do nothing
});
/**
 * Attempts to parse and return valid JSON object from string, returning undefined if it can't.
 * @param inputString {string} string to attempt to find valid JSON in.
 * @return {object} valid JSON object or undefined if failed to parse.
 */

var maybeValidJson = function checkIfJsonIsValid(inputString) {
  // attempt to parse JSON
  try {
    return JSON.parse(inputString);
  } catch (e) {
    return undefined;
  }
};
/**
 * Augments the raw JSON by placing it within a object that contains the current index.
 * @param obj {Object} parsed, valid JSON from command line input
 */


var isValidCommand = function checkValidCommand(obj) {
  if ('Declare' === obj["operation-name"] || 'Swap' === obj["operation-name"]) {
    // command is only valid if no arguments are specified
    return Object.keys(obj).length === 1;
  }

  return false;
};
/* ======================================== */
// Player Interface

/**
 * Returns an integer between 1 and 10.
 *  This fixed Player will always choose 1.
 * @return {number} number between 1 and 10 inclusive that the player chooses.
 */


var declareNumber = function declareNumber() {
  return 1;
};
/**
 * Returns whether a player has decided to swap their number with the Adminstrator.
 *  This fixed Player will always swap card.
 * @return {boolean} true if player decides to swap, false otherwise.
 */


var swapNumber = function swapNumber() {
  return true;
};