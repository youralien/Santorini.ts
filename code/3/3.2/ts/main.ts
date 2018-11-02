// import necessary packages and modules
import * as readline from 'readline';
import { Board } from "./board";


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
            let [boardInput, [command, worker, direction]] = maybeValidResponse;

            // create new board with inputted board
            let board = new Board(boardInput);

            // execute command
            let result;
            switch (command) {
                case 'neighboring-cell-exists?':
                    result = board.neighboringCellExists(worker, direction);
                    break;
                case 'get-height':
                    result = board.getHeight(worker, direction);
                    break;
                case 'occupied?':
                    result = board.isOccupied(worker, direction);
                    break;
                case 'build':
                    result = board.build(worker, direction);
                    break;
                case 'move':
                    result = board.move(worker, direction);
                    break;
                default:
                    result = undefined;
            }

            if (result !== undefined) {
                console.log(JSON.stringify(result));
            }
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
    let validCommandSet = new Set(['neighboring-cell-exists?', 'get-height', 'occupied?', 'build', 'move']);
    let validWorkers = ['blue1', 'blue2', 'white1', 'white2'];
    let validDirections = ['N', 'S', 'W', 'E', 'NW', 'NE', 'SW', 'SE'];

    // check structure of command
    if (Array.isArray(obj) && obj.length === 2) { // [Board, [...]]
        // check if board is valid
        if (Board.isValidBoard(obj[0], 5, validWorkers)) {
            // check if command is valid
            if (obj[1].length === 3) { // ["command", "worker", "direction"]
                let [command, worker, direction] = obj[1];

                // check if command is valid
                if (validCommandSet.has(command)) {
                    if (validWorkers.includes(worker) && validDirections.includes(direction)) {
                        return true;
                    }
                }
            }
        }
    }

    return false;
};