// load in package for stdin and stdout, and create input/output interface
// const readline = require('readline-sync');

// load in package for client/server tcp sockets
const net = require('net');

let playerNumber;
let adminNumber;
let playerDidSwitch;


const server = net.createServer(function(socket) {

  socket.on('data', function(data) {
    let textChunk = data.toString('utf8');
    console.log(textChunk)

    if (textChunk == 'player ready') {
      console.log('yes it is')
      // request number
      socket.write('{"operation-name" : "Declare"}');
      return
    }

    let maybePlayerNumber = requestPlayerNumber(textChunk);
    let maybeSwitch = requestPlayerSwitch(textChunk);

    if (maybePlayerNumber !== undefined) {
      // socket.emit('gotNumber');
      playerNumber = maybePlayerNumber;
      // request swap
      socket.write('{"operation-name" : "Swap"}');
    } else if (maybeSwitch !== undefined) {
      // socket.emit('gotSwitch');
      playerDidSwitch = maybeSwitch;
      playGame();
    }
  });

});

server.listen(52275, '10.105.131.163');


// Administrator Interface
/**
 * Requests a number between 1 and 10 inclusive from the player.
 * @return {number} input number from player
 */
const requestPlayerNumber = function askPlayerToDeclareNumber(str) {
  // make request to player interface
  // console.log('{"operation-name" : "declareNumber"}');

  let declaredPlayerNumber = parseInt(str);
  if (!isNaN(declaredPlayerNumber) && (declaredPlayerNumber >= 1 && declaredPlayerNumber <= 10)) {
    return declaredPlayerNumber;
  }

  // listen to single-line numeric input from player interface
  // while (true) {
  //   let declaredPlayerNumber = readline.questionInt('');
  //   if (declaredPlayerNumber >= 1 && declaredPlayerNumber <= 10) {
  //     return declaredPlayerNumber;
  //   }
  // }
};


/**
 * Requests input from player on whether they would like to switch their number.
 * @return {boolean} true if player wants to switch, false otherwise.
 */
const requestPlayerSwitch = function askPlayerIfSwitch(playerSwitchInput) {
  // make request to player interface
  // console.log('{"operation-name" : "switchNumber"}');
  //
  // // listen to single-line boolean input from player interface
  // while (true) {
  //   let playerSwitchInput = readline.question('');
  //
  //   // check if valid input
  //   let maybePlayerSwitch = maybeValidJson(playerSwitchInput);
  //   if (maybePlayerSwitch !== undefined) {
  //     // check if input is type boolean and true/false
  //     if (maybePlayerSwitch === true || maybePlayerSwitch === false) {
  //       return maybePlayerSwitch;
  //     }
  //   }
  // }

  let maybePlayerSwitch = maybeValidJson(playerSwitchInput);
  if (maybePlayerSwitch !== undefined) {
    // check if input is type boolean and true/false
    if (maybePlayerSwitch === true || maybePlayerSwitch === false) {
      return maybePlayerSwitch;
    }
  }
};

/**
 * Returns a number for the Administrator by randomly picking an integer from 1 to 10 inclusive.
 * @return {number} Administrator's number for the the game.
 */
const declareOwnNumber = function declareNumberForAdmin() {
  return getRandomInt(1, 10);
};

/**
 * Returns a random integer between min and max inclusive.
 * @param min {number} lower bound of random number to be generated
 * @param max {number} upper bound of random number to be generated
 * @return {number} random integer between min and max inclusive
 */
const getRandomInt = function getRandomIntegerBetweenBounds(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Determines and prints winner of game based on selected numbers and whether player switched.
 * @param adminNumber {number} player's selected number between 1 and 10 inclusive.
 * @param playerNumber {number} administrator's random number between 1 and 10 inclusive.
 * @param didSwitch {boolean} whether player decided to switch their number with the administrator.
 */
const determineWinner = function determineWinnerFromGame(adminNumber, playerNumber, didSwitch) {
  // print game state to player is aware
  console.log(`Player Number: ${ playerNumber } | Admin Number: ${ adminNumber }`);

  // determine and print winner
  let didAdminWin = adminNumber > playerNumber;
  if ((!didSwitch && didAdminWin) || (didSwitch && !didAdminWin)) {
    console.log('administrator wins.');
  } else {
    console.log('player wins');
  }
};

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
 * Runs a full game.
 */
const playGame = function runGameAsAdministrator() {
  console.log('playing game!')
  // 2: admin declares their own number
  adminNumber = declareOwnNumber();

  // 4/5: determine game winner
  determineWinner(adminNumber, playerNumber, playerDidSwitch);
};
