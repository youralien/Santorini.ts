"use strict";
exports.__esModule = true;
var rules_1 = require("../../../code/5/5.2/ts/rules");
var Referee = /** @class */ (function () {
    function Referee(board, player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.player1.setColor('blue');
        this.player1.setColor('white');
        this.rulecheck = new rules_1.RuleChecker();
        this.whoseTurnIdx = 0;
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
        if (this.whiteTurnIdx % 2 === 0) {
            return this.player2;
        }
        else {
            return this.player1;
        }
    };
    Referee.prototype.placeWorkers = function (placementList) {
        var _a = placementList[0], w1row = _a[0], w1col = _a[1], _b = placementList[1], w2row = _b[0], w2col = _b[1];
        this.board.setCellWithWorkerByCoords(this.whoseTurnIsIt().color + '1', w1row, w1col);
        this.board.setCellWithWorkerByCoords(this.whoseTurnIsIt().color + '2', w2row, w2col);
        return this.board.board;
    };
    Referee.prototype.playTurn = function (workerdirections) {
        var worker = workerdirections[0], directions = workerdirections[1];
        if (worker.slice(0, -1) !== this.whoseTurnIsIt().color) {
            console.error('Wrong player piece move, says Richard the Great');
            return;
        }
        var rulecheck = new rules_1.RuleChecker(this.board.board, worker, directions);
        var validplay = rulecheck.executeTurn();
        var didWin = rulecheck.didPlayerWin();
        if (didWin) {
            return this.whoseTurnIsIt().name;
        }
        else if (validplay == 'no') {
            return this.whoseTurnIsItNot().name;
        }
        return this.board.board;
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
        var result = undefined;
        if (command == 'Name') {
            result = this.initializeName(JSON.stringify(parsedJson));
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
