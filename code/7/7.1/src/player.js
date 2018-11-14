"use strict";
exports.__esModule = true;
var fs = require('fs');
var board_1 = require("./board");
var strategy_1 = require("./strategy");
var main_1 = require("./main");
/**
 * Implements a Player component that can communicate with a game engine to play Santorini.
 */
var Player = /** @class */ (function () {
    function Player() {
        this.color = undefined;
        this.boardInstance = undefined;
        this.look_ahead = fs.readFileSync('strategy.config', 'utf8');
    }
    /**
     *
     * @return {string} denotes name of player (their color)
     */
    Player.prototype.register = function () {
        this.name = this.randomPlayerName();
        return this.name;
    };
    Player.prototype.randomPlayerName = function () {
        var randomInt = Math.floor((Math.random() * 10) + 1);
        return "player-name-" + randomInt;
    };
    /**
     * Starts Remote Connection
     */
    Player.prototype.startRemoteConnection = function () {
        // communicates with game engine to set color, make moves, and update internal game state
    };
    /**
     * Places workers for the Player's selected color on unoccupied corners clock-wise starting
     * from the top-leftmost corner of the boardInstance.
     * @return {[[number, number]]>} JSON list that contains two pairs of numbers, each between 0 and 4.
     */
    Player.prototype.placeWorkers = function (color, board) {
        if (this.color || this.boardInstance) {
            console.log("Place command should only be called once for player name " + this.color);
            return;
        }
        this.color = color;
        this.boardInstance = new board_1.Board(board);
        var potentialPlacements = [[0, 0], [0, 4], [4, 4], [4, 0]];
        var workersToPlace = [this.color + "1", this.color + "2"];
        var workerPlacements = [];
        // add workers clockwise on corners
        for (var placementCandidate in potentialPlacements) {
            // if all workers have been placed, stop
            if (workersToPlace.length === 0) {
                break;
            }
            // check if corner is already occupied or not
            var _a = potentialPlacements[placementCandidate], currRow = _a[0], currCol = _a[1];
            if (!this.boardInstance.isCellByCoordsOccupied(currRow, currCol)) {
                this.boardInstance.setCellWithWorkerByCoords(workersToPlace.shift(), currRow, currCol);
                workerPlacements.push([currRow, currCol]);
            }
        }
        // return placements
        return workerPlacements;
    };
    /**
     * Chooses a single play. Currently is dumb, and chooses the first play
     * @param {any[][]} board
     * @return {[string , [string , string]]}
     */
    Player.prototype.play = function (board) {
        this.boardInstance = new board_1.Board(board);
        return this.pickNonLosingPlay(this.boardInstance);
    };
    Player.prototype.pickNonLosingPlay = function (board) {
        return strategy_1.Strategy.pickOneNonLosingPlay(board, this.color, this.look_ahead);
    };
    Player.prototype.playOptionsNonLosing = function (board) {
        this.boardInstance = new board_1.Board(board);
        return this.computeManyNonLosingPlays(this.boardInstance);
    };
    Player.prototype.computeManyNonLosingPlays = function (board) {
        if (this.look_ahead) {
            return strategy_1.Strategy.computeManyNonLosingPlays(board, this.color, this.look_ahead);
        }
        else {
            console.log("look_ahead value not found");
        }
    };
    Player.prototype.gameOver = function (name) {
        // TODO: maybe change the state
        return 'ok';
    };
    return Player;
}());
exports.Player = Player;
// load in package for stdin and stdout, and create input/output interface
// const readline = require('readline');
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
//   terminal: false
// });
// global variables
var currReadString = ''; // stores current input from user (allows for multi-line JSON)
/**
 * Reads lines as input to stdin is made.
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


 * Detect when input stream is closed.

thisclient.on('close', () => {
    console.log('connection to administrator closed.');
});

 * Implements a Remote Proxy for the Player Class
 * It will setup the tcp/ip socket as a “client” to connect to some remote player component
 */
var RemoteProxyPlayer = /** @class */ (function () {
    function RemoteProxyPlayer(host, port) {
        this.commands = {
            "Register": this.register,
            "Place": this.placeWorkers,
            "Play": this.play,
            "Game Over": this.gameOver
        };
        // track what command turn it is, starts on expecting register
        this.turn = 0;
        // remote client
        var net = require('net');
        this.client = new net.Socket();
        this.client.connect(port, host, function () {
            console.log('ProxyPlayer is connected to Remote Player.');
        });
    }
    /**
     * Assume valid input commmand
     * @param commandInput
     */
    RemoteProxyPlayer.prototype.progressTurn = function (commandInput) {
        var command = commandInput[0];
        var args = commandInput.slice(1);
        var func = this.commands[command];
        var outputMessage = func.apply(void 0, args);
        console.log(outputMessage);
        this.turn++;
        return outputMessage;
        // if ((command == 'Register') && (this.turn != 0)) {
        //     outputMessage = this.commandsOutOfSequence();
        // }
        // if (command == 'Register') {
        //     if (this.turn != this.commands.indexOf(command)) {
        //         outputMessage = this.commandsOutOfSequence();
        //     } else {
        //         outputMessage = this.register();
        //     }
        //
        // } {
        // }
        //
    };
    RemoteProxyPlayer.prototype.receive = function () {
        // global variables
        var currReadString = ''; // stores current input from user (allows for multi-line JSON)
        /**
         * Reads lines as input to stdin is made.
         */
        this.client.on('data', function (data) {
            var input = data.toString('utf-8');
            // add new input to current read in string (handling valid JSON across multiple lines)
            currReadString += input;
            // determine if JSON is valid
            var isValidResponse = main_1.maybeValidJson(currReadString);
            console.log(isValidResponse);
            if (isValidResponse !== undefined) {
                // clear current read string and augment the valid, parsed JSON
                currReadString = '';
                return isValidResponse;
            }
        });
    };
    RemoteProxyPlayer.prototype.commandsOutOfSequence = function () {
        return "Santorini is broken! Too many tourists in such a small place...";
    };
    RemoteProxyPlayer.prototype.register = function () {
        if (this.turn !== 0) {
            return this.commandsOutOfSequence();
        }
        var commandAndArgs = ["Register"];
        this.client.write(commandAndArgs);
        return this.receive();
    };
    RemoteProxyPlayer.prototype.placeWorkers = function (color, board) {
        if (this.turn != 1) {
            return this.commandsOutOfSequence();
        }
        var commandAndArgs = [];
    };
    RemoteProxyPlayer.prototype.play = function (board) {
        return ['richard', ['ryan']];
    };
    RemoteProxyPlayer.prototype.playOptionsNonLosing = function (board) {
        return [
            ['richard', ['ryan']],
            ['richard', ['ryan']]
        ];
    };
    RemoteProxyPlayer.prototype.gameOver = function (name) {
        return 'OK';
    };
    return RemoteProxyPlayer;
}());
exports.RemoteProxyPlayer = RemoteProxyPlayer;
