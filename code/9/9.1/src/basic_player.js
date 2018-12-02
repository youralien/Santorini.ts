"use strict";
exports.__esModule = true;
var fs = require('fs');
var strategy_1 = require("./strategy");
var board_1 = require("./board");
/**
 * Implements a Player component that can communicate with a game engine to play Santorini.
 */
var BasicPlayer = /** @class */ (function () {
    function BasicPlayer() {
        this.color = undefined;
        this.boardInstance = undefined;
        var buffer = fs.readFileSync(__dirname + "/../strategy.config", 'utf8');
        var parsed = JSON.parse(buffer.toString());
        this.look_ahead = parsed['look-ahead'];
        this.gameOverResponse = 'OK';
    }
    /**
     *
     * @return {string} denotes name of player (their color)
     */
    BasicPlayer.prototype.register = function () {
        this.name = this.randomPlayerName();
        return this.name;
    };
    BasicPlayer.prototype.randomPlayerName = function () {
        var randomInt = Math.floor((Math.random() * 1000) + 1);
        return "player-name-" + randomInt;
    };
    /**
     * Starts Remote Connection
     */
    BasicPlayer.prototype.startRemoteConnection = function () {
        // communicates with game engine to set color, make moves, and update internal game state
    };
    /**
     * Places workers for the Player's selected color on unoccupied corners clock-wise starting
     * from the top-leftmost corner of the boardInstance.
     * @return {[[number, number]]>} JSON list that contains two pairs of numbers, each between 0 and 4.
     */
    BasicPlayer.prototype.placeWorkers = function (color, board) {
        this.color = color;
        this.boardInstance = new board_1.Board(board);
        var potentialPlacements = [[0, 0], [0, 4], [4, 4], [4, 0]];
        var workersToPlace = [this.color + "1", this.color + "2"];
        console.log('workers to place', workersToPlace);
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
     * @return {[string , [string , string]]} [worker, directions] e.g. ['blue1', ['W']] or ['white2', ['N', 'W']]
     */
    BasicPlayer.prototype.play = function (board) {
        this.boardInstance = new board_1.Board(board);
        return this.pickNonLosingPlay(this.boardInstance);
    };
    BasicPlayer.prototype.pickNonLosingPlay = function (board) {
        return strategy_1.Strategy.pickOneNonLosingPlay(board, this.color, this.look_ahead);
    };
    BasicPlayer.prototype.playOptionsNonLosing = function (board) {
        this.boardInstance = new board_1.Board(board);
        return this.computeManyNonLosingPlays(this.boardInstance);
    };
    BasicPlayer.prototype.computeManyNonLosingPlays = function (board) {
        if (this.look_ahead) {
            return strategy_1.Strategy.computeManyNonLosingPlays(board, this.color, this.look_ahead);
        }
        else {
            console.log("look_ahead value not found");
        }
    };
    BasicPlayer.prototype.gameOver = function (name) {
        // TODO: maybe change the state
        return this.gameOverResponse;
    };
    return BasicPlayer;
}());
exports.Player = BasicPlayer;
