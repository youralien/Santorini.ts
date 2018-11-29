"use strict";
exports.__esModule = true;
var rules_1 = require("./rules");
var board_1 = require("./board");
var Referee = /** @class */ (function () {
    // player1status: string;// won, loss, still playing
    // player2status: string;// won, loss, still playing
    function Referee(player1, player2) {
        this.boardInstance = new board_1.Board(board_1.Board.createEmptyBoard(5, 5));
        this.player1 = player1;
        this.player2 = player2;
        this.whoseTurnIdx = 0;
        this.winner = undefined; // not set until theres a winner
    }
    Referee.prototype.initializeName = function (name) {
        var player = this.whoseTurnIsIt();
        player.name = name;
        return player.color;
    };
    Referee.prototype.whoseTurnIsIt = function () {
        if (this.whoseTurnIdx % 2 === 0) {
            // maybe set player1 name
            return this.player1;
        }
        else {
            // maybe set player2 name
            return this.player2;
        }
    };
    Referee.prototype.whoseTurnIsItNot = function () {
        if (this.whoseTurnIdx % 2 === 0) {
            return this.player2;
        }
        else {
            return this.player1;
        }
    };
    Referee.prototype.placeWorkers = function (placementList) {
        var _a = placementList[0], w1row = _a[0], w1col = _a[1], _b = placementList[1], w2row = _b[0], w2col = _b[1];
        this.boardInstance.setCellWithWorkerByCoords(this.whoseTurnIsIt().color + '1', w1row, w1col);
        this.boardInstance.setCellWithWorkerByCoords(this.whoseTurnIsIt().color + '2', w2row, w2col);
        return this.boardInstance.board;
    };
    Referee.prototype.playTurn = function (workerdirections) {
        var worker = workerdirections[0], directions = workerdirections[1];
        if (worker.slice(0, -1) !== this.whoseTurnIsIt().color) {
            console.error('Wrong player piece move, says Richard the Great');
            return;
        }
        var rulecheck = new rules_1.RuleChecker(this.boardInstance.board, worker, directions);
        var validplay = rulecheck.executeTurn();
        // Game will End
        var didWin = rulecheck.didPlayerWin();
        if (didWin) {
            this.winner = this.whoseTurnIsIt().name;
        }
        else if (validplay == 'no') {
            this.winner = this.whoseTurnIsItNot().name;
        }
        if (this.winner !== undefined) {
            return this.winner;
        }
        // Keep Playing - update our board
        this.boardInstance.board = rulecheck.boardInstance.board;
        return this.boardInstance.board;
    };
    /**
     * doTurn
     * Purpose:
     * - Asks next player to choose a play, and updates the board accordingly.
     * - It will return false
     *
     * Dependencies:
     * - Player.makePlay: request each Player to make a play
     * - RuleChecker.executeTurn: using the declared play, RuleChecker will simulate executing the turn and see if its valid
     * Knowledge:
     * - whoseTurnIdx: Which players turn it is currently;
     * - board: the master Board instance representation to which to compare
     *
     * @return didNotViolate {boolean} true if play was good otherwise false
     */
    Referee.prototype.doTurn = function (command, parsedJson) {
        if (this.winner) {
            // Any messages after deciding on the winner of a game should be ignored.
            return;
        }
        var result = undefined;
        if (command == 'Name') {
            result = this.initializeName(parsedJson);
        }
        else if (command == 'Place') {
            result = this.placeWorkers(parsedJson);
        }
        else if (command == 'Play') {
            result = this.playTurn(parsedJson);
        }
        // increment turn
        this.whoseTurnIdx++;
        return result;
    };
    /**
     * Plays the game turn by turn; if player makes a move that violates, then it will set the status
     * for both players accordingly
     *
     * Dependencies:
     * - Referee.doTurn
     *
     * Knowledge:
     * - player1status: if player1 won or lost, or still playing
     * - player2status: if player2 won or lost, or still playing
     *
     */
    Referee.prototype.main = function () {
    };
    /** Checks if player has won
     *
     * Knowledge:
     * - player1status: if player1 won or lost, or still playing
     * - player2status: if player2 won or lost, or still playing
     *
     * @param {string} playerColor
     * @return {string} won, lost, or still playing
     */
    Referee.prototype.status = function (playerColor) {
    };
    return Referee;
}());
exports.Referee = Referee;
