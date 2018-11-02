"use strict";
exports.__esModule = true;
// import necessary packages and modules
var readline = require("readline");
var rules_1 = require("./rules");
// create stdin interface
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});
// global variables
var currReadString = ''; // stores current input from user (allows for multi-line JSON)
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
            // unwrap input into components
            var boardInput = maybeValidResponse[0], worker = maybeValidResponse[1], directions = maybeValidResponse[2];
            // create new board with inputted board
            var ruleChecker = new rules_1.RuleChecker(boardInput, worker, directions);
            // execute instance and return
            console.log(JSON.stringify(ruleChecker.executeTurn()));
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
    // check if array of length three
    if (Array.isArray(obj) && obj.length === 3) {
        // check if directions is an array of length 1 or 2
        var directions = obj[2];
        if (Array.isArray(directions) && directions.length >= 0 && directions.length <= 2) {
            return true;
        }
    }
    return false;
};
