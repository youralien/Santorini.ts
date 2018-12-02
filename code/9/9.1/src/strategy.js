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
    Strategy.pickOneNonLosingPlay = function (board, targetPlayerColor, n) {
        var manyPlays = Strategy.computeManyNonLosingPlays(board, targetPlayerColor, n);
        // TODO: choose something smarter from the options
        return (manyPlays.length ? manyPlays[0] : undefined);
    };
    Strategy.computeManyNonLosingPlays = function (board, targetPlayerColor, n) {
        var nonLosingPlays = Strategy.getNonLosingBoardsPlaysWinsAtDepth(board, targetPlayerColor, n);
        var ret = [];
        if (nonLosingPlays.length > 0) {
            for (var i = 0; i < nonLosingPlays.length; i++) {
                var _a = nonLosingPlays[i], targetPlayerBoard = _a[0], workerDirections = _a[1], targetPlayerDidWin = _a[2];
                if (workerDirections) {
                    ret.push(workerDirections);
                }
            }
        }
        return ret;
    };
    Strategy.getNonLosingBoardsPlaysWinsAtDepth = function (board, targetPlayerColor, n) {
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
                    var temp = Strategy.getNonLosingBoardsPlaysWinsAtDepth(otherPlayerBoard, targetPlayerColor, n - 1);
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
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        console.log(targetWorkers);
        // loop over workers and plays
        var validPlays = [];
        targetWorkers.forEach(function (currWorker) {
            allPlayCombos.forEach(function (currDirections) {
                // create a new rule checker instance given the current worker and possible move
                console.log("curr_worker: " + currWorker);
                console.log("this is the board for strategy");
                console.log(board.board);
                var ruleCheckerInstance = new rules_1.RuleChecker(JSON.parse(JSON.stringify(board.board)), currWorker, currDirections);
                var isTurnValid = ruleCheckerInstance.executeTurn() === 'yes';
                console.log("isTurnValid: " + isTurnValid);
                // keep only valid plays
                if (isTurnValid) {
                    validPlays.push([ruleCheckerInstance.boardInstance, [currWorker, currDirections], ruleCheckerInstance.didPlayerWin()]);
                }
            });
        });
        console.log(validPlays);
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
