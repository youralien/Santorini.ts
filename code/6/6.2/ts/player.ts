import { Board } from "./board";
import { Strategy } from "./strategy";

/**
 * Cell interface for boardInstance.
 */
interface Cell {
    worker?: string;
    height: number;
}

/**
 * Implements a Player component that can communicate with a game engine to play Santorini.
 */
export class Player {
    /**
     * Player Knowledge
     */
    color: string;             // chosen color for game
    boardInstance: Board;      // boardInstance class instance that holds the current state of the game

    /**
     * Initializes class attributes to default values (see above).
     */
    constructor(selectedColor: string, initialBoard: Array<Array<any>>) {
        this.color = selectedColor;
        this.boardInstance = new Board(initialBoard);
    }


    /**
     * Connects to the game engine, and responds with appropriate actions when requested.
     * NOT IMPLEMENTED IN CURRENT VERSION
     */
    connectToGameEngine() {
        // communicates with game engine to set color, make moves, and update internal game state
    }

    /**
     * Picks and returns a worker color (i.e. blue, white) for game when requested by the game engine.
     * @return {string} selected color.
     */
    chooseColor(): string {
        let color = '';
        this.color = color;
        return color;
    }

    /**
     * Places workers for the Player's selected color on unoccupied corners clock-wise starting
     * from the top-leftmost corner of the boardInstance.
     * @return {[[number, number]]>} JSON list that contains two pairs of numbers, each between 0 and 4.
     */
    placeWorkers() {
        const potentialPlacements = [[0, 0], [0, 4], [4, 4], [4, 0]];
        let workersToPlace = [`${ this.color }1`, `${ this.color }2`];
        let workerPlacements = [];

        // add workers clockwise on corners
        for (let placementCandidate in potentialPlacements) {
            // if all workers have been placed, stop
            if (workersToPlace.length === 0) {
                break;
            }

            // check if corner is already occupied or not
            let [currRow, currCol] = potentialPlacements[placementCandidate];
            if (!this.boardInstance.isCellByCoordsOccupied(currRow, currCol)) {
                this.boardInstance.setCellWithWorkerByCoords(workersToPlace.shift(), currRow, currCol);
                workerPlacements.push([currRow, currCol]);
            }
        }

        // return placements
        return workerPlacements;
    }

    determinePlays(board: Board) {
        return Strategy.computeNonLosingValidPlays(board, this.color);
    }

    /**
     * Uses Strategy module pickBestMove function to to determine a game move, and returns the properly formatted move.
     * @return {[Array<Array<Cell>>, string, [string, string]]} valid play command.
     */
    makePlay(): [Array<Array<Cell>>, string, [string, string]] {
        return [this.boardInstance.board, 'worker', ['direction1', 'direction2']];
    }

    /**
     * Updates the Player's internal view of the boardInstance once the game engine returns the updated boardInstance.
     * @param updatedBoard {Array<Array<Cell>>} current state of the game boardInstance as sent by the game engine.
     */
    updateGameState(updatedBoard: Array<Array<Cell>>): void {
        this.boardInstance.board = updatedBoard;
    }
}