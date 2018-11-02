// import necessary packages and modules
import * as readline from 'readline';
import { RuleChecker } from "./rules";


// create stdin interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

// global variables
let currReadString = '';  // stores current input from user (allows for multi-line JSON)


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
            // unwrap input into components
            let [boardInput, worker, directions] = maybeValidResponse;

            // create new board with inputted board
            let ruleChecker = new RuleChecker(boardInput, worker, directions);

            // execute instance and return
            console.log(JSON.stringify(ruleChecker.executeTurn()));
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
 * Checks if inputs passed from parsed JSON is valid for Santorini.
 * @param obj {Object} parsed, valid JSON from command line input
 */
const isValidInput = function checkValidCommand(obj): boolean {
    // check if array of length three
    if (Array.isArray(obj) && obj.length === 3) {
        // check if directions is an array of length 1 or 2
        let directions = obj[2];
        if (Array.isArray(directions) && directions.length >= 0 && directions.length <= 2) {
            return true;
        }
    }

    return false;
};