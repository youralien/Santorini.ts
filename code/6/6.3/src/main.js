"use strict";
exports.__esModule = true;
// import necessary packages and modules
var readline = require("readline");
var player_1 = require("./player");
var board_1 = require("./board");
// create stdin interface
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});
// global variables
var currReadString = ''; // stores current input from user (allows for multi-line JSON)
var playerInstance;
/**
 * Reads lines as input to stdin is made.
 */
rl.on('line', function (input) {
    // add new input to current read in string (handling valid JSON across multiple lines)
    currReadString += input;
    // determine if JSON is valid
    var maybeValidResponse = maybeValidJson(currReadString);
    if (maybeValidResponse !== undefined) {
        // clear current read string and augment the valid, parsed JSON
        currReadString = '';
        if (isValidInput(maybeValidResponse)) {
            var outputMessage = '';
            var command = maybeValidResponse[0];
            if (command === 'Place') {
                var color = maybeValidResponse[1];
                var initialBoard = maybeValidResponse[2];
                playerInstance = new player_1.Player(color, initialBoard);
                outputMessage = playerInstance.placeWorkers();
            }
            else if (command === 'Play') {
                outputMessage = playerInstance.determinePlays(new board_1.Board(maybeValidResponse[1]));
            }
            // return output from function call
            console.log(JSON.stringify(outputMessage));
        }
    }
});
/**
 * Detect when input stream is closed.
 */
rl.on('close', function () {
    // exit do nothing
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
    }
    catch (e) {
        return undefined;
    }
};
/**
 * Checks if inputs passed from parsed JSON is valid for Santorini.
 * @param obj {Object} parsed, valid JSON from command line input
 */
var isValidInput = function checkValidCommand(obj) {
    // check if array of either length 2 or 3
    return Array.isArray(obj) && (obj.length === 2 || obj.length === 3);
};
