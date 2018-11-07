// import necessary packages and modules
import * as readline from 'readline';
import { Player } from "./player";
import { Board } from "./board";
import {Referee} from "./referee";

// create stdin interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

// global variables
let currReadString = '';  // stores current input from user (allows for multi-line JSON)
let refInstance = new Referee(new Player(), new Player());

/**
 * Reads lines as input to stdin is made.
 */
rl.on('line', (input) => {
    // add new input to current read in string (handling valid JSON across multiple lines)
    currReadString += input;
    // determine if JSON is valid
    let maybeValidResponse = maybeValidJson(currReadString);
    if (maybeValidResponse !== undefined) {
        // clear current read string and augment the valid, parsed JSON
        currReadString = '';

        if (isValidInput(maybeValidResponse)) {
            let outputMessage = '';

            // HELPFUL INPUT DEBUGGING
            // console.log(maybeValidResponse);

            // Name
            let command;
            if (typeof(maybeValidResponse) === 'string') {
                command = 'Name';
            }
            else if (Array.isArray(maybeValidResponse[0])) {
                command = 'Place';
            } else {
                command = 'Play';
            }

            let res = refInstance.doTurn(command, maybeValidResponse);

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
rl.on('close', () => {
    // exit do nothing
});


/**
 * Attempts to parse and return valid JSON object from string, returning undefined if it can't.
 * @param inputString {string} string to attempt to find valid JSON in.
 * @return {object} valid JSON object or undefined if failed to parse.
 */
const maybeValidJson = function checkIfJsonIsValid(inputString) {
    // attempt to parse JSON
    try {
        return JSON.parse(inputString);
    } catch(e) {
        return undefined;
    }
};


/**
 * Checks if inputs passed from parsed JSON is valid for Santorini Referee Interface.
 * @param obj {Object} parsed, valid JSON from command line input
 */
const isValidInput = function checkValidCommand(obj): boolean {
    // Name
    // [Placement,Placement]
    // [Worker,Directions]
    return ((Array.isArray(obj) && (obj.length === 2)) || (typeof(obj) === 'string'));
};