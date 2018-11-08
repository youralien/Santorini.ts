"use strict";
exports.__esModule = true;
var fs = require('fs');
var readline = require('readline');
var instream = fs.createReadStream('./strategy.config');
var rl = readline.createInterface(instream, process.stdout);
var board_1 = require("./board");
var strategy_1 = require("./strategy");
var main_1 = require("./main");
/**
 * Implements a Player component that can communicate with a game engine to play Santorini.
 */
var Player = /** @class */ (function () {
    /**
     * Initializes class attributes to default values (see above).
     */
    function Player(selectedColor, initialBoard) {
        var _this = this;
        this.color = selectedColor;
        this.boardInstance = new board_1.Board(initialBoard);
        rl.on('line', function (input) {
            var config = main_1.maybeValidJson(input);
            if (config) {
                _this.look_ahead = config["look-ahead"];
            }
            else {
                console.log("look_ahead value invalid");
            }
            rl.close();
        });
    }
    /**
     * Connects to the game engine, and responds with appropriate actions when requested.
     * NOT IMPLEMENTED IN CURRENT VERSION
     */
    Player.prototype.connectToGameEngine = function () {
        // communicates with game engine to set color, make moves, and update internal game state
    };
    /**
     * Picks and returns a worker color (i.e. blue, white) for game when requested by the game engine.
     * @return {string} selected color.
     */
    Player.prototype.chooseColor = function () {
        var color = '';
        this.color = color;
        return color;
    };
    /**
     * Places workers for the Player's selected color on unoccupied corners clock-wise starting
     * from the top-leftmost corner of the boardInstance.
     * @return {[[number, number]]>} JSON list that contains two pairs of numbers, each between 0 and 4.
     */
    Player.prototype.placeWorkers = function () {
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
    Player.prototype.determinePlays = function (board) {
        return strategy_1.Strategy.computeNonLosingValidPlays(board, this.color);
    };
    Player.prototype.pickNonLosingPlay = function (board) {
        if (this.look_ahead) {
            return strategy_1.Strategy.pickNonLosingPlay(board, this.color, this.look_ahead);
        }
        else {
            console.log("look_ahead value not found");
        }
    };
    /**
     * Uses Strategy module pickBestMove function to to determine a game move, and returns the properly formatted move.
     * @return {[Array<Array<Cell>>, string, [string, string]]} valid play command.
     */
    Player.prototype.makePlay = function () {
        return [this.boardInstance.board, 'worker', ['direction1', 'direction2']];
    };
    /**
     * Updates the Player's internal view of the boardInstance once the game engine returns the updated boardInstance.
     * @param updatedBoard {Array<Array<Cell>>} current state of the game boardInstance as sent by the game engine.
     */
    Player.prototype.updateGameState = function (updatedBoard) {
        this.boardInstance.board = updatedBoard;
    };
    return Player;
}());
exports.Player = Player;