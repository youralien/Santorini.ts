"use strict";
exports.__esModule = true;
var Board = /** @class */ (function () {
    function Board(board) {
        this.board = JSON.parse(JSON.stringify(board));
        this.workers = ['blue1', 'blue2', 'white1', 'white2'];
        this.directions = ['N', 'S', 'W', 'E', 'NW', 'NE', 'SW', 'SE'];
    }
    /**
     * Creates an blank board of rows-by-cols size with initial value of 0.
     * @param rows {number} number of rows in board.
     * @param cols {number} number of columns in board.
     * @return {array} array of array representing blank board.
     */
    Board.createEmptyBoard = function (rows, cols) {
        var blankBoard = [];
        for (var r = 0; r < rows; r++) {
            var blankRow = [];
            for (var c = 0; c < cols; c++) {
                blankRow.push(0);
            }
            blankBoard.push(blankRow);
        }
        return blankBoard;
    };
    /**
     * Returns true if input board is a valid board.
     *  A valid board (1) has same number of rows and columns, (2) has all rows as arrays,
     *  and contains 1 of each valid worker.
     * @param board {Array<Array<any>>} board as a 2-D array.
     * @param size {number} number of rows and cols in a board.
     * @param workers {Array<string>} list of valid validWorkers to be found on the board.
     * @return {boolean} whether board is valid based on above conditions.
     */
    Board.isValidBoard = function (board, size, workers) {
        // check if board has rows and is of correct number of rows
        if (!Array.isArray(board) || board.length !== size) {
            return false;
        }
        // check if each row in board is array and has correct number of columns
        for (var row in board) {
            if (!Array.isArray(board[row]) || board[row].length !== size) {
                return false;
            }
        }
        // check if all validWorkers are there
        var workerSet = new Set(workers);
        for (var row in board) {
            if (Array.isArray(board[row])) {
                for (var col in board[row]) {
                    if (Array.isArray(board[row][col])) {
                        var currWorker = board[row][col][1];
                        if (!workerSet.has(currWorker)) {
                            return false;
                        }
                        else {
                            workerSet["delete"](currWorker);
                        }
                    }
                }
            }
        }
        return workerSet.size === 0;
    };
    /**
     * Verifies whether a cell neighboring the worker in the direction exists.
     * @param worker {string} worker to check neighboring cell for.
     * @param direction {string} direction to find cell.
     * @return {boolean} whether cell is valid on the board (e.g. within bounds).
     */
    Board.prototype.neighboringCellExists = function (worker, direction) {
        // contract to verify that the worker and direction are valid
        if (this.verifyWorker(worker) && this.verifyDirection(direction)) {
            // get worker's current cell
            var workerCellCoord = this.getCellForWorker(worker);
            var neighboringCellCoord = this.getAdjacentCell(workerCellCoord, direction);
            // check if valid cell
            return (0 <= neighboringCellCoord[0] && neighboringCellCoord[0] <= 4) &&
                (0 <= neighboringCellCoord[1] && neighboringCellCoord[1] <= 4);
        }
        // return undefined if the cell does not exist
        return undefined;
    };
    /**
     * Returns a cell neighboring the worker in the direction if it exists.
     * @param worker {string} worker to check neighboring cell for.
     * @param direction {string} direction to find cell.
     * @return {object} neighboring cell as [number, number] if valid and exists, else undefined.
     */
    Board.prototype.getNeighboringCellIfExists = function (worker, direction) {
        // contract to verify that the worker and direction are valid
        if (this.verifyWorker(worker) && this.verifyDirection(direction)) {
            // get worker's current cell
            var workerCellCoord = this.getCellForWorker(worker);
            var neighboringCellCoord = this.getAdjacentCell(workerCellCoord, direction);
            // return if a valid neighboring cell exists and is valid
            if ((0 <= neighboringCellCoord[0] && neighboringCellCoord[0] <= 4) &&
                (0 <= neighboringCellCoord[1] && neighboringCellCoord[1] <= 4)) {
                return neighboringCellCoord;
            }
        }
        // return undefined if input validation fails
        return undefined;
    };
    /**
     * Gets height of cell neighboring worker in direction.
     * @param worker {string} worker to check neighboring cell for.
     * @param direction {string} direction to find cell.
     * @return {number} height of cell.
     */
    Board.prototype.getHeight = function (worker, direction) {
        // check to see if target neighboring cell is valid
        var maybeNeighboringCellCoords = this.getNeighboringCellIfExists(worker, direction);
        if (maybeNeighboringCellCoords !== undefined) {
            var cellRow = maybeNeighboringCellCoords[0], cellCol = maybeNeighboringCellCoords[1];
            var neighboringCell = this.board[cellRow][cellCol];
            // return appropriate value for height
            if (Array.isArray(neighboringCell)) {
                return neighboringCell[0]; // height is first element in [height, worker]
            }
            return neighboringCell; // cell with no worker
        }
        // return undefined if the cell does not exist
        return undefined;
    };
    /**
     * Checks if neighboring cell to worker in direction is occupied.
     * @param worker {string} worker to check neighboring cell for.
     * @param direction {string} direction to find cell.
     * @return {boolean} whether cell is occupied by player.
     */
    Board.prototype.isOccupied = function (worker, direction) {
        // check to see if target neighboring cell is valid
        var maybeNeighboringCellCoords = this.getNeighboringCellIfExists(worker, direction);
        if (maybeNeighboringCellCoords !== undefined) {
            var cellRow = maybeNeighboringCellCoords[0], cellCol = maybeNeighboringCellCoords[1];
            var neighboringCell = this.board[cellRow][cellCol];
            // return if cell has an array value indicating a worker is there
            return Array.isArray(neighboringCell);
        }
        // return undefined if the cell does not exist
        return undefined;
    };
    /**
     * Return a board that reflects building a level in the cell on the board adjacent to the Worker in this Direction if it is possible to build there.
     * @param worker {string} worker to check neighboring cell for.
     * @param direction {string} direction to find cell.
     * @return {Array<Array<any>>} board with building added, if possible.
     */
    Board.prototype.build = function (worker, direction) {
        // check to see if target neighboring cell is valid
        var maybeNeighboringCellCoords = this.getNeighboringCellIfExists(worker, direction);
        if (maybeNeighboringCellCoords !== undefined) {
            var cellRow = maybeNeighboringCellCoords[0], cellCol = maybeNeighboringCellCoords[1];
            var neighboringCell = this.board[cellRow][cellCol];
            // check if can build on cell
            if (this.canBuildOnCell(neighboringCell)) {
                this.board[cellRow][cellCol] += 1;
            }
        }
        // return board with modifications, if possible
        return this.board;
    };
    /**
     * Determines if cell can be built upon.
     * @param cell {number or array} number if just height or array of [height, worker].
     * @return {boolean} whether cell can be build on.
     */
    Board.prototype.canBuildOnCell = function (cell) {
        if (Array.isArray(cell)) {
            return false; // cant build on cell with worker
        }
        return cell < 4; // can build if height is < 4
    };
    /**
     * Returns a Board that reflects moving the Worker to the cell on the Board adjacent to the Worker in this Direction if it is possible to move there.
     * @param worker {string} worker to check neighboring cell for.
     * @param direction {string} direction to find cell.
     * @return {Board} maybe board if successful move, otherwise undefined.
     */
    Board.prototype.move = function (worker, direction) {
        // check to see if target neighboring cell is valid
        var workerCellCoords = this.getCellForWorker(worker);
        var maybeNeighboringCellCoords = this.getNeighboringCellIfExists(worker, direction);
        if (maybeNeighboringCellCoords !== undefined) {
            var neighboringCellRow = maybeNeighboringCellCoords[0], neighboringCellCol = maybeNeighboringCellCoords[1];
            var neighboringCell = this.board[neighboringCellRow][neighboringCellCol];
            var workerCellRow = workerCellCoords[0], workerCellCol = workerCellCoords[1];
            var workerCell = this.board[workerCellRow][workerCellCol];
            if (this.canMoveToCell(workerCell, neighboringCell)) {
                this.board[neighboringCellRow][neighboringCellCol] = [neighboringCell, workerCell[1]];
                this.board[workerCellRow][workerCellCol] = workerCell[0];
            }
        }
        // return board with modifications, if possible
        return this.board;
    };
    /**
     * Determines if cell can be moved to.
     * @param workerCell {array} array of 2 values as [height, worker].
     * @param neighboringCell {number or array} number if just height or array of [height, worker].
     * @return {boolean} whether cell can be moved to.
     */
    Board.prototype.canMoveToCell = function (workerCell, neighboringCell) {
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
     * Returns location on board for a worker.
     * @param worker {string}
     * @returns {[number, number]} coordinate of worker.
     */
    Board.prototype.getCellForWorker = function (worker) {
        // search through board to find worker
        for (var rowIndex = 0; rowIndex < this.board.length; rowIndex++) {
            var currRow = this.board[rowIndex];
            for (var colIndex = 0; colIndex < currRow.length; colIndex++) {
                if (Array.isArray(currRow[colIndex])) {
                    if (currRow[colIndex][1] === worker) {
                        return [rowIndex, colIndex];
                    }
                }
            }
        }
        // return invalid worker if cant find
        return [-1, -1];
    };
    /**
     * Returns the adjacent cell to current cell in desired direction.
     * @param cell {[number, number]} current cell.
     * @param direction {string} cardinal direction to get adjacent cell for.
     * @return {[number, number]} adjacent cell.
     */
    Board.prototype.getAdjacentCell = function (cell, direction) {
        var directionMapping = {
            'N': [-1, 0],
            'NE': [-1, 1],
            'E': [0, 1],
            'SE': [1, 1],
            'S': [1, 0],
            'SW': [1, -1],
            'W': [0, -1],
            'NW': [-1, -1]
        };
        var shift = directionMapping[direction];
        return [cell[0] + shift[0], cell[1] + shift[1]];
    };
    /**
     * Verifies that worker is one of the valid validWorkers.
     * @param worker {string} worker to check if valid, by name.
     * @return {boolean} whether worker name is valid.
     */
    Board.prototype.verifyWorker = function (worker) {
        return this.workers.includes(worker);
    };
    /**
     * Verifies that specified direction is one of the valid validDirections.
     * @param specifiedDirection {string} direction to check if valid.
     * @return {boolean} whether direction is valid.
     */
    Board.prototype.verifyDirection = function (specifiedDirection) {
        return this.directions.includes(specifiedDirection);
    };
    return Board;
}());
exports.Board = Board;
