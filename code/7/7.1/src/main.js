"use strict";
exports.__esModule = true;
// import necessary packages and modules
var player_1 = require("./player");
var readline = require("readline");
var net = require('net');
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
var playerComponent = function (port, host) {
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
    server.listen(port, host);
};
var proxy_test = function (port, host) {
    // create stdin interface
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    // global variables
    var currReadString = ''; // stores current input from user (allows for multi-line JSON)
    var playerInstance = new player_1.RemoteProxyPlayer('10.105.131.163', 8080);
    /**
     * Reads lines as input to stdin is made.
     */
    rl.on('line', function (input) {
        // add new input to current read in string (handling valid JSON across multiple lines)
        currReadString += input;
        // determine if JSON is valid
        var maybeValidResponse = exports.maybeValidJson(currReadString);
        if (maybeValidResponse !== undefined) {
            // clear current read string and augment the valid, parsed JSON
            currReadString = '';
            if (isValidInput(maybeValidResponse)) {
                var outputMessage = playerInstance.progressTurn(maybeValidResponse);
                /*
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
// */
                console.log(JSON.stringify(outputMessage));
            }
        }
    });
    /**
     * Detect when input stream is closed.
     */
    rl.on('close', function () {
        // exit do nothing
    });
};
proxy_test(8080, '10.105.131.163');
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
