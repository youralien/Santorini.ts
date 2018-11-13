"use strict";
exports.__esModule = true;
var fs = require('fs');
var board_1 = require("./board");
var strategy_1 = require("./strategy");
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
        return this.color;
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
