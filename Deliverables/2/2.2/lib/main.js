"use strict";

// load in package for stdin and stdout, and create input/output interface
var readline = require('./packages/readline-sync'); // Administrator Interface

/**
 * Requests a number between 1 and 10 inclusive from the player.
 * @return {number} input number from player
 */


var requestPlayerNumber = function askPlayerToDeclareNumber() {
  // make request to player interface
  console.log('{"operation-name" : "declareNumber"}'); // listen to single-line numeric input from player interface

  while (true) {
    var declaredPlayerNumber = readline.questionInt('');

    if (declaredPlayerNumber >= 1 && declaredPlayerNumber <= 10) {
      return declaredPlayerNumber;
    }
  }
};
/**
 * Requests input from player on whether they would like to switch their number.
 * @return {boolean} true if player wants to switch, false otherwise.
 */


var requestPlayerSwitch = function askPlayerIfSwitch() {
  // make request to player interface
  console.log('{"operation-name" : "switchNumber"}'); // listen to single-line boolean input from player interface

  while (true) {
    var playerSwitchInput = readline.question(''); // check if valid input

    var maybePlayerSwitch = maybeValidJson(playerSwitchInput);

    if (maybePlayerSwitch !== undefined) {
      // check if input is type boolean and true/false
      if (maybePlayerSwitch === true || maybePlayerSwitch === false) {
        return maybePlayerSwitch;
      }
    }
  }
};
/**
 * Returns a number for the Administrator by randomly picking an integer from 1 to 10 inclusive.
 * @return {number} Administrator's number for the the game.
 */


var declareOwnNumber = function declareNumberForAdmin() {
  return getRandomInt(1, 10);
};
/**
 * Returns a random integer between min and max inclusive.
 * @param min {number} lower bound of random number to be generated
 * @param max {number} upper bound of random number to be generated
 * @return {number} random integer between min and max inclusive
 */


var getRandomInt = function getRandomIntegerBetweenBounds(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
/**
 * Determines and prints winner of game based on selected numbers and whether player switched.
 * @param adminNumber {number} player's selected number between 1 and 10 inclusive.
 * @param playerNumber {number} administrator's random number between 1 and 10 inclusive.
 * @param didSwitch {boolean} whether player decided to switch their number with the administrator.
 */


var determineWinner = function determineWinnerFromGame(adminNumber, playerNumber, didSwitch) {
  // print game state to player is aware
  console.log("Player Number: ".concat(playerNumber, " | Admin Number: ").concat(adminNumber)); // determine and print winner

  var didAdminWin = adminNumber > playerNumber;

  if (!didSwitch && didAdminWin || didSwitch && !didAdminWin) {
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


var maybeValidJson = function checkIfJsonIsValid(inputString) {
  // attempt to parse JSON
  try {
    return JSON.parse(inputString);
  } catch (e) {
    return undefined;
  }
};
/**
 * Runs a full game.
 */


var runLoop = function runGameAsAdministrator() {
  // 1: get number from player
  var playerNumber = requestPlayerNumber(); // 2: admin declares their own number

  var adminNumber = declareOwnNumber(); // 3: ask player if they want to swap

  var playerDidSwitch = requestPlayerSwitch(); // 4/5: determine game winner

  determineWinner(adminNumber, playerNumber, playerDidSwitch);
};

runLoop();
