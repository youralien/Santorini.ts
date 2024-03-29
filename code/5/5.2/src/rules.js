"use strict";
exports.__esModule = true;
var board_1 = require("./board");
var RuleChecker = /** @class */ (function () {
    function RuleChecker(board, worker, directions) {
        this.validWorkers = ['blue1', 'blue2', 'white1', 'white2'];
        this.validDirections = ['N', 'S', 'W', 'E', 'NW', 'NE', 'SW', 'SE'];
        // store turn's worker and directions
        this.turnWorker = worker;
        this.turnDirections = directions;
        // create a boardInstance instance for the turn
        this.boardInstance = new board_1.Board(board, this.validWorkers, this.validDirections);
    }
    /**
     * Executes turn given the worker and directions, returning "yes" if valid or "no" if not.
     * @return {string} "yes" if instructions were valid for turn, "no" otherwise.
     * TODO: think about whether it's good to directly manipulate the boardInstance vs. doing the check on a copy of the boardInstance, and changing the boardInstance later on through the actual game boardInstance's functions.
     */
    RuleChecker.prototype.executeTurn = function () {
        // must always move regardless of if 1 or 2 directions are given
        if (this.canMoveToCell()) {
            // simulate player moving
            this.boardInstance.move(this.turnWorker, this.getMoveDirection());
            // check if player is on a tower of height 3 after moving
            if (this.didPlayerWin()) {
                // if player won and they only gave one direction, valid play
                if (this.turnDirections.length === 1) {
                    return 'yes';
                }
                // if two directions given and won, invalid move
                if (this.turnDirections.length === 2) {
                    return 'no';
                }
            }
            else {
                // if two directions given and valid build, win
                if (this.turnDirections.length === 2) {
                    if (this.canBuildOnCell()) {
                        this.boardInstance.build(this.turnWorker, this.getBuildDirection());
                        return 'yes';
                    }
                }
            }
        }
        // invalid set of directions
        return 'no';
    };
    /**
     * Determines if cell can be built upon.
     * @return {boolean} whether cell can be build on.
     */
    RuleChecker.prototype.canBuildOnCell = function () {
        // check to see if target neighboring cell is valid
        var maybeNeighboringCellCoords = this.boardInstance.getNeighboringCellIfExists(this.turnWorker, this.getBuildDirection());
        // check if neighboring cell is valid before running other checks
        if (maybeNeighboringCellCoords === undefined) {
            return false;
        }
        // carry out other tests for valid move
        var cellRow = maybeNeighboringCellCoords[0], cellCol = maybeNeighboringCellCoords[1];
        var neighboringCell = this.boardInstance.board[cellRow][cellCol];
        // case: cannot build on cell with another worker
        if (Array.isArray(neighboringCell)) {
            return false;
        }
        // case: can only build if cell doesnt have a dome on it
        return neighboringCell < 4;
    };
    /**
     * Determines if cell can be moved to.
     * @return {boolean} whether cell can be moved to.
     */
    RuleChecker.prototype.canMoveToCell = function () {
        var workerCellCoords = this.boardInstance.getCellIndicesForWorker(this.turnWorker);
        var maybeNeighboringCellCoords = this.boardInstance.getNeighboringCellIfExists(this.turnWorker, this.getMoveDirection());
        // check if neighboring cell is valid before running other checks
        if (maybeNeighboringCellCoords === undefined) {
            return false;
        }
        // carry out other tests for valid move
        var neighboringCellRow = maybeNeighboringCellCoords[0], neighboringCellCol = maybeNeighboringCellCoords[1];
        var neighboringCell = this.boardInstance.board[neighboringCellRow][neighboringCellCol];
        var workerCellRow = workerCellCoords[0], workerCellCol = workerCellCoords[1];
        var workerCell = this.boardInstance.board[workerCellRow][workerCellCol];
        // case: worker is in neighboring cell, so cant move there
        if (Array.isArray(neighboringCell)) {
            return false;
        }
        // case: height can be at most 1 higher than worker
        if (neighboringCell - workerCell[0] > 1) {
            return false;
        }
        // case: neighbor cell cannot have cap on it (must not be 4)
        if (neighboringCell === 4) {
            return false;
        }
        return true;
    };
    /**
     * Returns true if player had won, which happens when they are on a tower with height = 3.
     * @return {boolean} true if winning.
     */
    RuleChecker.prototype.didPlayerWin = function () {
        var workerCell = this.boardInstance.getCellForWorker(this.turnWorker);
        if (workerCell !== undefined) {
            return workerCell[0] === 3;
        }
        return false;
    };
    /**
     * Gets move direction from inputted direction array.
     * @return {string} move direction.
     */
    RuleChecker.prototype.getMoveDirection = function () {
        return this.turnDirections[0];
    };
    /**
     * Gets build direction from inputted direction array.
     * @return {string} build direction.
     */
    RuleChecker.prototype.getBuildDirection = function () {
        return this.turnDirections[1];
    };
    return RuleChecker;
}());
exports.RuleChecker = RuleChecker;
