"use strict";
exports.__esModule = true;
// import necessary packages and modules
var player_1 = require("./player");
var net = require('net');
/**
 * Attempts to parse and return valid JSON object from string, returning undefined if it can't.
 * @param inputString {string} string to attempt to find valid JSON in.
 * @return {object} valid JSON object or undefined if failed to parse.
 */
exports.maybeValidJson = function checkIfJsonIsValid(inputString) {
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
 * ["Register"]
 * ["Place",Color,Initial-Board],
 * ["Play",Board]
 * ["Game Over",Name],
 * @param obj {Object} parsed, valid JSON from command line input
 */
var isValidInput = function checkValidCommand(obj) {
    // check if array of either length 2 or 3
    return Array.isArray(obj) && (obj.length >= 1 && obj.length <= 3);
};
var playerInstance = new player_1.Player();
var server = net.createServer(function (socket) {
    socket.on('data', function (data) {
        var textChunk = data.toString('utf8');
        console.log(textChunk);
        var maybeValidResponse = exports.maybeValidJson(textChunk);
        if (maybeValidResponse !== undefined) {
            // clear current read string and augment the valid, parsed JSON
            if (isValidInput(maybeValidResponse)) {
                var outputMessage = undefined;
                var command = maybeValidResponse[0];
                if (command === 'Place') {
                    var color = maybeValidResponse[1];
                    var initialBoard = maybeValidResponse[2];
                    outputMessage = playerInstance.placeWorkers(color, initialBoard);
                }
                else if (command === 'Play') {
                    var board = maybeValidResponse[1];
                    // TODO: play? or playOptions?
                    outputMessage = playerInstance.playOptionsNonLosing(board);
                }
                else if (command === 'Register') {
                    outputMessage = playerInstance.register();
                }
                else if (command == 'Game Over') {
                    var name_1 = maybeValidResponse[1];
                    outputMessage = playerInstance.gameOver(name_1);
                }
                if (outputMessage) {
                    // send output from function call to client
                    socket.write(JSON.stringify(outputMessage));
                }
                else {
                    console.error("Returned undefined output for command = " + command);
                }
            }
        }
    });
});
server.listen(52275, '10.105.131.163');
