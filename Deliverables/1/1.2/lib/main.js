"use strict";

// load in package for stdin and stdout, and create input/output interface
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
}); // global variables

var currReadString = ''; // stores current input from user (allows for multi-line JSON)

var augmentedOutputList = []; // stores augmented JSON data

var currIndex = 1; // index used to augment JSON data

/**
 * Reads lines as input to stdin is made.
 */

rl.on('line', function (input) {
  // add new input to current read in string (handling valid JSON across multiple lines)
  currReadString += input; // determine if JSON is valid

  var isValidResponse = isValidJson(currReadString);

  if (isValidResponse !== undefined) {
    // clear current read string and augment the valid, parsed JSON
    currReadString = '';
    augmentJson(isValidResponse);
  }
});
/**
 * Detect when input stream is closed.
 */

rl.on('close', function () {
  outputResponse();
});
/**
 * Checks if current JSON is valid.
 * @param inputString raw string from stdin input.
 * @return {*} parsed JSON as JavaScript object, if valid. otherwise, undefined.
 */

var isValidJson = function checkIfJsonIsValid(inputString) {
  // attempt to parse JSON
  try {
    return JSON.parse(inputString);
  } catch (e) {
    return undefined;
  }
};
/**
 * Augments the raw JSON by placing it within a object that contains the current index.
 * @param data {Object} parsed, valid JSON from command line input
 */


var augmentJson = function formatDataForOutput(data) {
  augmentedOutputList.push({
    index: currIndex,
    value: data
  });
  currIndex++;
};
/**
 * Prints output to stdout
 * Output is all JSON input, by valid JSON line, augmented and in reverse order of input.
 */


var outputResponse = function printInputReversed() {
  for (var i = augmentedOutputList.length - 1; i >= 0; i--) {
    console.log(JSON.stringify(augmentedOutputList[i]));
  }
};