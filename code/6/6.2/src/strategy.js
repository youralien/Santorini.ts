"use strict";
exports.__esModule = true;
var rules_1 = require("./rules");
/**
 * Implements a Strategy module that the Player uses to decide what plays to make.
 * To determine the next move, we are proposing to use decision rule similar to Minimax where we compute a search tree of possible moves, and use a heuristic to determine what move will yield the best future outcome based on the move currently made.
 */
var Strategy = /** @class */ (function () {
    function Strategy() {
    }
    /**
     * Computes and returns a value that is a heuristic for how good an action is.
     * @param currentBoardState {Array<Array<Cell>>} current boardInstance to evaluate how good player is doing.
     * @return {number} computed heuristic
     */
    Strategy.prototype.computeHeuristic = function () {
        var heuristic = 0;
        return heuristic;
    };
    /**
     * Uses boardInstance instance to compute valid potential next states of the boardInstance and their cooresponding heuristic values.
     * @return {object} computed search tree with heuristics.
     */
    Strategy.prototype.generateSearchTree = function () {
        return {};
    };
    /**
     * Uses a search tree to figure out best move to make and returns instructions to make that move.
     * @param searchTree {object} search tree to use for computing best move
     * @return {[Array<Array<Cell>>, string, [string, string]]} valid play command.
     */
    Strategy.prototype.pickBestMove = function (searchTree) {
        return [[[], [], [], [], []], 'worker', ['direction1', 'direction2']];
    };
    Strategy.pickNonLosingPlay = function (board, targetPlayerColor, n) {
        var nonLosingPlays = Strategy.getNonLosingPlays(board, targetPlayerColor, n);
        if (nonLosingPlays.length > 0) {
            var ret = [];
            for (var i = 0; i < nonLosingPlays.length; i++) {
                var _a = nonLosingPlays[i], targetPlayerBoard = _a[0], ans = _a[1], targetPlayerDidWin = _a[2];
                if (ans) {
                    ret.push(ans);
                }
            }
            return ret;
        }
        else {
            console.error('Could not find a non losing play, in Strategy.pickNonLosingPlay');
        }
    };
    Strategy.getNonLosingPlays = function (board, targetPlayerColor, n) {
        if (n === 1) {
            return Strategy.computeNonLosingValidBoardsPlaysWins(board, targetPlayerColor);
        }
        var playsTarget = Strategy.computeNonLosingValidBoardsPlaysWins(board, targetPlayerColor);
        var playsTargetNext = [];
        for (var i in playsTarget) {
            var _a = playsTarget[i], targetPlayerBoard = _a[0], _b = _a[1], targetPlayerWorker = _b[0], targetPlayerDirections = _b[1], targetPlayerDidWin = _a[2];
            var currPlay = playsTarget[i];
            // if win then use this play
            if (targetPlayerDidWin) {
                playsTargetNext.push(currPlay);
            }
            else {
                var otherPlayerColor = targetPlayerColor === 'white' ? 'blue' : 'white';
                var otherPlayerPlays = Strategy.computeNonLosingValidBoardsPlaysWins(targetPlayerBoard, otherPlayerColor);
                if (otherPlayerPlays.length === 0) {
                    playsTargetNext.push(currPlay);
                }
                for (var j in otherPlayerPlays) {
                    var _c = otherPlayerPlays[j], otherPlayerBoard = _c[0], _d = _c[1], otherPlayerWorker = _d[0], otherPlayerDirections = _d[1], otherPlayerDidWin = _c[2];
                    var temp = Strategy.getNonLosingPlays(otherPlayerBoard, targetPlayerColor, n - 1);
                    if (temp.length > 0) {
                        playsTargetNext.push(temp);
                        // return first feasible move found
                        return playsTargetNext;
                    }
                }
            }
        }
        return playsTargetNext;
    };
    Strategy.computeNonLosingValidBoardsPlaysWins = function (board, targetPlayerColor) {
        // compute plays for target player
        var targetPlayerValidPlays = Strategy.computeValidPlays(board, targetPlayerColor);
        // loop through each play for target player, and see what other player could do
        var otherPlayerColor = targetPlayerColor === 'white' ? 'blue' : 'white';
        var nonLosingValidPlays = [];
        targetPlayerValidPlays.forEach(function (currPlay) {
            var targetPlayerBoard = currPlay[0], _a = currPlay[1], targetPlayerWorker = _a[0], targetPlayerDirections = _a[1], targetPlayerDidWin = currPlay[2];
            // simulate other player's plays given targetPlayer's board
            var otherPlayerValidPlays = Strategy.computeValidPlays(targetPlayerBoard, otherPlayerColor);
            // check if any otherPlayer's plays result in win
            var otherPlayerCouldWin = otherPlayerValidPlays.some(function (currOtherPlay) { return currOtherPlay[2] === true; });
            // only include valid play in final output if target player already won or other player cant win on next move
            if (targetPlayerDidWin || !otherPlayerCouldWin) {
                nonLosingValidPlays.push(currPlay);
            }
        });
        return nonLosingValidPlays;
    };
    /**
     * Computes all valid plays that don't cause the target to lose.
     * @param board {Board} Board instance.
     * @param targetPlayerColor {string} Color of target player.
     * @return {[string, [string, string]]} all valid plays that don't cause target player to lose next turn.
     */
    Strategy.computeNonLosingValidPlays = function (board, targetPlayerColor) {
        // compute plays for target player
        var targetPlayerValidPlays = Strategy.computeValidPlays(board, targetPlayerColor);
        // loop through each play for target player, and see what other player could do
        var otherPlayerColor = targetPlayerColor === 'white' ? 'blue' : 'white';
        var nonLosingValidPlays = [];
        targetPlayerValidPlays.forEach(function (currPlay) {
            var targetPlayerBoard = currPlay[0], _a = currPlay[1], targetPlayerWorker = _a[0], targetPlayerDirections = _a[1], targetPlayerDidWin = currPlay[2];
            // simulate other player's plays given targetPlayer's board
            var otherPlayerValidPlays = Strategy.computeValidPlays(targetPlayerBoard, otherPlayerColor);
            // check if any otherPlayer's plays result in win
            var otherPlayerCouldWin = otherPlayerValidPlays.some(function (currOtherPlay) { return currOtherPlay[2] === true; });
            // only include valid play in final output if target player already won or other player cant win on next move
            if (targetPlayerDidWin || !otherPlayerCouldWin) {
                nonLosingValidPlays.push([targetPlayerWorker, targetPlayerDirections]);
            }
        });
        return nonLosingValidPlays;
    };
    /**
     * Computes all valid plays that don't cause the target to lose.
     * @param board {Board} Board instance.
     * @param targetPlayerColor {string} Color of target player.
     * @return {[Board, string, [string, string], boolean]} all valid plays player can make.
     */
    Strategy.computeValidPlays = function (board, targetPlayerColor) {
        var allPlayCombos = Strategy.computeAllPlays(board.directions);
        var targetWorkers = [targetPlayerColor + "1", targetPlayerColor + "2"];
        // loop over workers and plays
        var validPlays = [];
        targetWorkers.forEach(function (currWorker) {
            allPlayCombos.forEach(function (currDirections) {
                // create a new rule checker instance given the current worker and possible move
                var ruleCheckerInstance = new rules_1.RuleChecker(JSON.parse(JSON.stringify(board.board)), currWorker, currDirections);
                var isTurnValid = ruleCheckerInstance.executeTurn() === 'yes';
                // keep only valid plays
                if (isTurnValid) {
                    validPlays.push([ruleCheckerInstance.boardInstance, [currWorker, currDirections], ruleCheckerInstance.didPlayerWin()]);
                }
            });
        });
        return validPlays;
    };
    /**
     *
     * @param {string[]} directions. All Cardinal directions i.e. N, E, ... SW...
     * @return {string[][]} list of move, build directions, i.e. [['N', 'N'], ['N', 'W'], ....]
     */
    Strategy.computeAllPlays = function (directions) {
        var allPlayCombos = directions.map(function (direction) { return [direction]; });
        for (var i in directions) {
            for (var j in directions) {
                allPlayCombos.push([directions[i], directions[j]]);
            }
        }
        return allPlayCombos;
    };
    return Strategy;
}());
exports.Strategy = Strategy;
