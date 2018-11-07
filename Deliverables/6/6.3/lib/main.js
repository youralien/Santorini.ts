"use strict";
exports.__esModule = true;
// import necessary packages and modules
var readline = require("readline");
var player_1 = require("./player");
var referee_1 = require("./referee");
// create stdin interface
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});
// global variables
var currReadString = ''; // stores current input from user (allows for multi-line JSON)
var refInstance = new referee_1.Referee(new player_1.Player(), new player_1.Player());
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
            // HELPFUL INPUT DEBUGGING
            // console.log(maybeValidResponse);
            // Name
            var command = void 0;
            if (typeof (maybeValidResponse) === 'string') {
                command = 'Name';
            }
            else if (Array.isArray(maybeValidResponse[0])) {
                command = 'Place';
            }
            else {
                command = 'Play';
            }
            var res = refInstance.doTurn(command, maybeValidResponse);
            if (res === undefined) {
                return;
            }
            // FOR NICE PRINTING
            // if (typeof(res) === "string") {
            //     console.log(JSON.stringify(res));
            // }
            // else {
            //     console.table(res);
            // }
            // FOR TURNING IT IN
            console.log(JSON.stringify(res));
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
 * Checks if inputs passed from parsed JSON is valid for Santorini Referee Interface.
 * @param obj {Object} parsed, valid JSON from command line input
 */
var isValidInput = function checkValidCommand(obj) {
    // Name
    // [Placement,Placement]
    // [Worker,Directions]
    return ((Array.isArray(obj) && (obj.length === 2)) || (typeof (obj) === 'string'));
};
