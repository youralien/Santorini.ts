// import necessary packages and modules
import * as readline from 'readline';
import { RemoteProxyPlayer, Player } from "./player";
import { Board } from "./board";


// create stdin interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

// global variables
let currReadString = '';  // stores current input from user (allows for multi-line JSON)
let playerInstance = new RemoteProxyPlayer('10.105.131.163', 8080);

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
            let outputMessage = undefined;

            let command = maybeValidResponse[0];
            if (command === 'Place') {
                let color = maybeValidResponse[1];
                let initialBoard = maybeValidResponse[2];

                outputMessage = playerInstance.placeWorkers(color, initialBoard);
            } else if (command === 'Play') {
                outputMessage = playerInstance.play(maybeValidResponse[1]);
            } else if (command === 'Register') {
                outputMessage = playerInstance.register();
            } else if (command === 'Game Over') {
                outputMessage = playerInstance.gameOver(maybeValidResponse[1]);
            }
            // return output from function call
            console.log(JSON.stringify(outputMessage));
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
export const maybeValidJson = function checkIfJsonIsValid(inputString) {
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
    // check if array of either length 2 or 3
    return Array.isArray(obj) && (obj.length === 2 || obj.length === 3);
};
