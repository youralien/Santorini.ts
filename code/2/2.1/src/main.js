const net = require('net');
const client = new net.Socket();
client.connect(52275, '10.105.131.163', function() {
  console.log('Player is connected to administrator.');
  client.write('player ready');
});



// load in package for stdin and stdout, and create input/output interface
// const readline = require('readline');
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
//   terminal: false
// });

// global variables
let currReadString = '';  // stores current input from user (allows for multi-line JSON)


/**
 * Reads lines as input to stdin is made.
 */
client.on('data', (data) => {
  let input = data.toString('utf-8');

  // add new input to current read in string (handling valid JSON across multiple lines)
  currReadString += input;
  // determine if JSON is valid
  let isValidResponse = maybeValidJson(currReadString);
  console.log(isValidResponse);
  if (isValidResponse !== undefined) {
    // clear current read string and augment the valid, parsed JSON
    currReadString = '';

    if (isValidCommand(isValidResponse)) {
      if (isValidResponse["operation-name"] === 'Declare') {
        // console.log(JSON.stringify(declareNumber()));
        client.write(JSON.stringify(declareNumber()));
      }
      else if (isValidResponse["operation-name"] === 'Swap') {
        // console.log(JSON.stringify(swapNumber()));
        client.write(JSON.stringify(swapNumber()));
      }
    }
  }
});


/**
 * Detect when input stream is closed.
 */
client.on('close', () => {
  console.log('connection to administrator closed.');
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
 * Augments the raw JSON by placing it within a object that contains the current index.
 * @param obj {Object} parsed, valid JSON from command line input
 */
const isValidCommand = function checkValidCommand(obj) {
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
const declareNumber = () => {
  return 1;
};

/**
 * Returns whether a player has decided to swap their number with the Adminstrator.
 *  This fixed Player will always swap card.
 * @return {boolean} true if player decides to swap, false otherwise.
 */
const swapNumber = () => {
  return true;
};
