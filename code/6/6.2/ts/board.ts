export class Board {
    board: Array<Array<any>>;
    workers: Array<string>;
    directions: Array<string>;
    constructor(board: Array<Array<any>>, workers?: string[], directions?: string[]) {
        this.board = JSON.parse(JSON.stringify(board));
        this.workers = workers || ['blue1', 'blue2', 'white1', 'white2'];
        this.directions = directions || ['N', 'S', 'W', 'E', 'NW', 'NE', 'SW', 'SE'];
    }

    /**
     * Creates an blank boardInstance of rows-by-cols size with initial value of 0.
     * @param rows {number} number of rows in boardInstance.
     * @param cols {number} number of columns in boardInstance.
     * @return {array} array of array representing blank boardInstance.
     */
    static createEmptyBoard(rows: number, cols: number): Array<Array<any>> {
        let blankBoard = [];
        for (let r = 0; r < rows; r++) {
            let blankRow = [];
            for (let c = 0; c < cols; c++) {
                blankRow.push(0);
            }

            blankBoard.push(blankRow);
        }

        return blankBoard;
    }

    /**
     * Returns true if input boardInstance is a valid boardInstance.
     *  A valid boardInstance (1) has same number of rows and columns, (2) has all rows as arrays,
     *  and contains 1 of each valid worker.
     * @param board {Array<Array<any>>} boardInstance as a 2-D array.
     * @param size {number} number of rows and cols in a boardInstance.
     * @param workers {Array<string>} list of valid validWorkers to be found on the boardInstance.
     * @return {boolean} whether boardInstance is valid based on above conditions.
     */
    static isValidBoard(board: Array<Array<any>>, size: number, workers: string[]): boolean {
        // check if boardInstance has rows and is of correct number of rows
        if (!Array.isArray(board) || board.length !== size) {
            return false;
        }

        // check if each row in boardInstance is array and has correct number of columns
        for (let row in board) {
            if (!Array.isArray(board[row]) || board[row].length !== size) {
                return false;
            }
        }

        // check if all validWorkers are there
        let workerSet = new Set(workers);
        for (let row in board) {
            if (Array.isArray(board[row])) {
                for (let col in board[row]) {
                    if (Array.isArray(board[row][col])) {
                        let currWorker = board[row][col][1];
                        if (!workerSet.has(currWorker)) {
                            return false;
                        } else {
                            workerSet.delete(currWorker);
                        }
                    }
                }
            }
        }

        return workerSet.size === 0;
    }

    /**
     * Verifies whether a cell neighboring the worker in the direction exists.
     * @param worker {string} worker to check neighboring cell for.
     * @param direction {string} direction to find cell.
     * @return {boolean} whether cell is valid on the boardInstance (e.g. within bounds).
     */
    neighboringCellExists(worker: string, direction: string) {
        // contract to verify that the worker and direction are valid
        if (this.verifyWorker(worker) && this.verifyDirection(direction)) {
            return this.getNeighboringCellIfExists(worker, direction) !== undefined;
        }

        // return undefined if the cell does not exist
        return undefined;
    }

    /**
     * Returns a cell neighboring the worker in the direction if it exists.
     * @param worker {string} worker to check neighboring cell for.
     * @param direction {string} direction to find cell.
     * @return {object} neighboring cell as [number, number] if valid and exists, else undefined.
     */
    getNeighboringCellIfExists(worker: string, direction: string) {
        // contract to verify that the worker and direction are valid
        if (this.verifyWorker(worker) && this.verifyDirection(direction)) {
            // get worker's current cell
            let workerCellCoord = this.getCellIndicesForWorker(worker);
            let neighboringCellCoord = this.getAdjacentCell(workerCellCoord, direction);

            // return if a valid neighboring cell exists and is valid
            if ((0 <= neighboringCellCoord[0] && neighboringCellCoord[0] <= 4) &&
                (0 <= neighboringCellCoord[1] && neighboringCellCoord[1] <= 4)) {
                return neighboringCellCoord;
            }
        }

        // return undefined if input validation fails
        return undefined;
    }

    /**
     * Gets height of cell neighboring worker in direction.
     * @param worker {string} worker to check neighboring cell for.
     * @param direction {string} direction to find cell.
     * @return {number} height of cell.
     */
    getHeight(worker: string, direction: string) {
        // check to see if target neighboring cell is valid
        let maybeNeighboringCellCoords = this.getNeighboringCellIfExists(worker, direction);
        if (maybeNeighboringCellCoords !== undefined) {
            let [cellRow, cellCol] = maybeNeighboringCellCoords;
            let neighboringCell = this.board[cellRow][cellCol];

            // return appropriate value for height
            if (Array.isArray(neighboringCell)) {
                return neighboringCell[0]; // height is first element in [height, worker]
            }

            return neighboringCell; // cell with no worker
        }

        // return undefined if the cell does not exist
        return undefined;
    }

    /**
     * Checks if neighboring cell to worker in direction is occupied.
     * @param worker {string} worker to check neighboring cell for.
     * @param direction {string} direction to find cell.
     * @return {boolean} whether cell is occupied by player.
     */
    isOccupied(worker: string, direction: string) {
        // check to see if target neighboring cell is valid
        let maybeNeighboringCellCoords = this.getNeighboringCellIfExists(worker, direction);
        if (maybeNeighboringCellCoords !== undefined) {
            let [cellRow, cellCol] = maybeNeighboringCellCoords;
            let neighboringCell = this.board[cellRow][cellCol];

            // return if cell has an array value indicating a worker is there
            return Array.isArray(neighboringCell);
        }

        // return undefined if the cell does not exist
        return undefined;
    }

    /**
     * Returns whether a cell, specified by a row and col, is occupied.
     * @param row {number} row of desired cell.
     * @param col {number} col of desired cell.
     * @return {boolean} whether cell is occupied.
     */
    isCellByCoordsOccupied(row: number, col: number) {
        return Array.isArray(this.board[row][col]);
    }

    /**
     * Modifies internal boardInstance data structure and returns it reflecting a Worker building on an adjacent cell specified by Direction if it is possible to move there. Otherwise, returns unmodified boardInstance.
     * @param worker {string} worker to check neighboring cell for.
     * @param direction {string} direction to find cell.
     * @return {Array<Array<any>>} boardInstance with building added, if possible.
     */
    build(worker: string, direction: string): Array<Array<any>> {
        // check to see if target neighboring cell is valid
        let maybeNeighboringCellCoords = this.getNeighboringCellIfExists(worker, direction);
        if (maybeNeighboringCellCoords !== undefined) {
            let [cellRow, cellCol] = maybeNeighboringCellCoords;

            // build without checking rule if can build
            this.board[cellRow][cellCol] += 1;
        }

        // return boardInstance with modifications, if possible
        return this.board;
    }

    /**
     * Modifies internal boardInstance data structure and returns it reflecting a Worker moving to an adjacent cell specified by Direction if it is possible to move there. Otherwise, returns unmodified boardInstance.
     * @param worker {string} worker to check neighboring cell for.
     * @param direction {string} direction to find cell.
     * @return {Board} maybe boardInstance if successful move, otherwise undefined.
     */
    move(worker: string, direction: string): Array<Array<any>> {
        // check to see if target neighboring cell is valid
        let workerCellCoords = this.getCellIndicesForWorker(worker);
        let maybeNeighboringCellCoords = this.getNeighboringCellIfExists(worker, direction);
        if (maybeNeighboringCellCoords !== undefined) {
            let [neighboringCellRow, neighboringCellCol] = maybeNeighboringCellCoords;
            let neighboringCell = this.board[neighboringCellRow][neighboringCellCol];

            let [workerCellRow, workerCellCol] = workerCellCoords;
            let workerCell = this.board[workerCellRow][workerCellCol];

            // move without checking if valid move
            this.board[neighboringCellRow][neighboringCellCol] = [neighboringCell, workerCell[1]];
            this.board[workerCellRow][workerCellCol] = workerCell[0];
        }

        // return boardInstance with modifications, if possible
        return this.board;
    }

    /**
     * Returns location on boardInstance for a worker as cell indices.
     * @param worker {string}
     * @returns {[number, number]} coordinate of worker.
     */
    getCellIndicesForWorker(worker: string): [number, number] {
        // search through boardInstance to find worker
        for (let rowIndex = 0; rowIndex < this.board.length; rowIndex++) {
            let currRow = this.board[rowIndex];
            for (let colIndex = 0; colIndex < currRow.length; colIndex++) {
                if (Array.isArray(currRow[colIndex])) {
                    if (currRow[colIndex][1] === worker) {
                        return [rowIndex, colIndex];
                    }
                }
            }
        }

        // return invalid worker if cant find
        return [-1, -1];
    }

    /**
     * Returns cell with a worker on it.
     * @param worker {string}
     * @returns {[number, string]} cell with worker on it.
     */
    getCellForWorker(worker: string): [number, string] {
        let [row, col] = this.getCellIndicesForWorker(worker);
        if (row !== -1 && col !== -1) {
            return this.board[row][col];
        }

        // return undefined if no cell
        return undefined;
    }

    /**
     * Sets a cell specified by row, col with the provided worker.
     * @param worker {string} worker to add to cell
     * @param row {number} row of desired cell.
     * @param col {number} col of desired cell.
     */
    setCellWithWorkerByCoords(worker: string, row: number, col: number) {
        let towerHeight = this.board[row][col];
        this.board[row][col] = [towerHeight, worker];
    }

    /**
     * Returns the adjacent cell to current cell in desired direction.
     * @param cell {[number, number]} current cell.
     * @param direction {string} cardinal direction to get adjacent cell for.
     * @return {[number, number]} adjacent cell.
     */
    getAdjacentCell(cell: [number, number], direction: string): [number, number] {
        let directionMapping = {
            'N':  [-1, 0],
            'NE': [-1, 1],
            'E':  [0, 1],
            'SE': [1, 1],
            'S':  [1, 0],
            'SW': [1, -1],
            'W':  [0, -1],
            'NW': [-1, -1]
        };

        let shift = directionMapping[direction];
        return [cell[0] + shift[0], cell[1] + shift[1]];
    }

    /**
     * Verifies that worker is one of the valid validWorkers.
     * @param worker {string} worker to check if valid, by name.
     * @return {boolean} whether worker name is valid.
     */
    verifyWorker(worker: string): boolean {
        return this.workers.includes(worker);
    }

    /**
     * Verifies that specified direction is one of the valid validDirections.
     * @param specifiedDirection {string} direction to check if valid.
     * @return {boolean} whether direction is valid.
     */
    verifyDirection(specifiedDirection: string): boolean {
        return this.directions.includes(specifiedDirection);
    }
}
