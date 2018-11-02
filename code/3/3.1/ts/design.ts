class Board {
    board: Array<Array<any>>;
    workers: Array<string>;
    directions: Array<string>;
    constructor(rows=5, cols=5) {
        this.board = Board.createEmptyBoard(rows, cols);
        this.workers = ['blue1', 'blue2', 'white1', 'white2'];
        this.directions = ['N', 'S', 'W', 'E', 'NW', 'NE', 'SW', 'SE'];
    }

    /**
     * Creates an blank board of rows-by-cols size with initial value of 0.
     * @param rows number of rows in board.
     * @param cols number of columns in board.
     * @return {array} array of array representing blank board.
     */
    static createEmptyBoard(rows: number, cols: number): Array<Array<any>> {
        let blankBoard = [];
        for (let r = 0; r < rows; r++) {
            let blankRow = [];
            for (let c = 0; c < cols; c++) {
                blankRow.push(0);
            }

            blankBoard[r].push(blankRow);
        }

        return blankBoard;
    }

    /**
     * Verifies whether a cell neighboring the worker in the direction exists.
     * @param worker {string} worker to check neighboring cell for.
     * @param direction {string} direction to find cell.
     * @return {boolean} whether cell is valid on the board (e.g. within bounds).
     */
    neighboringCellExists(worker: string, direction: string) {
        // contract to verify that the worker and direction are valid
        if (this.verifyWorker(worker) && this.verifyDirection(direction)) {
            // TODO: check if neighboring cell in direction exists for worker.
            return false;
        }

        // return undefined if the cell does not exist
        return undefined;
    }

    /**
     * Gets height of cell neighboring worker in direction.
     * @param worker {string} worker to check neighboring cell for.
     * @param direction {string} direction to find cell.
     * @return {number} height of cell.
     */
    getHeight(worker: string, direction: string) {
        // contract to ensure cell that we want exists
        if (this.neighboringCellExists(worker, direction)) {
            // TODO: get height from target cell
            return 0;
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
        // contract to ensure cell that we want exists
        if (this.neighboringCellExists(worker, direction)) {
            // TODO: check if cell is occupied
            return false;
        }

        // return undefined if the cell does not exist
        return undefined;
    }

    /**
     * Return a Board that reflects building a level in the cell on the Board adjacent to the Worker in this Direction if it is possible to build there.
     * @param worker {string} worker to check neighboring cell for.
     * @param direction {string} direction to find cell.
     * @return {Board} maybe board if successful build, otherwise undefined.
     */
    build(worker: string, direction: string) {
        // contract to ensure cell that we want exists
        if (this.neighboringCellExists(worker, direction)) {
            // TODO: get the valid cell and check if you can build there
            let cell: [number, number] = [0, 0];
            if (this.canBuildOnCell(cell)) {
                // TODO: build on board and return
                return this.board;
            }
            return undefined;
        }

        // return undefined if the cell does not exist
        return undefined;
    }

    /**
     * Determines if cell can be built upon.
     * @param cell {array} array of 2 values as [row, col].
     * @return {boolean} whether cell can be build on.
     */
    canBuildOnCell(cell: [number, number]) {
        // TODO: determine if building can be done on cell based on if a player is occupying it or if the height is already at a max.
        return true;
    }

    /**
     * Returns a Board that reflects moving the Worker to the cell on the Board adjacent to the Worker in this Direction if it is possible to move there.
     * @param worker {string} worker to check neighboring cell for.
     * @param direction {string} direction to find cell.
     * @return {Board} maybe board if successful move, otherwise undefined.
     */
    move(worker: string, direction: string) {
        // contract to ensure cell that we want exists
        if (this.neighboringCellExists(worker, direction)) {
            // TODO: get the valid cell and check if you can move there
            let cell: [number, number] = [0, 0];
            if (this.canMoveToCell(cell)) {
                // TODO: move on board and return
                return this.board;
            }
            return undefined;
        }

        // return undefined if the cell does not exist
        return undefined;
    }

    /**
     * Determines if cell can be moved to.
     * @param cell {array} array of 2 values as [row, col].
     * @return {boolean} whether cell can be moved to.
     */
    canMoveToCell(cell: [number, number]) {
        // TODO: determine if worker can move to a cell.
        return true;
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