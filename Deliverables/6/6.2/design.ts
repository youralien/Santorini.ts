import { Board } from "../../4.1/ts/board";

/**
 * Implements a Player component that can communicate with a game engine to play Santorini.
 */
class Player {
    /**
     * Player Knowledge
     */
    color: string;             // chosen color for game
    boardInstance: Board;      // current state of the game board
    look_ahead: number;         

    /**
     * Initializes class attributes to default values (see above).
     */
    constructor(color: string, initialBoard) {
        this.strategyModule = strategy;
        this.color = '';
        this.board = [[], [], [], [], []];

    }

    /**
     * Picks and returns a worker color (i.e. blue, white) for game when requested by the game engine.
     * @return {string} selected color.
     */
    chooseColor(): string {
    }

    /**
     * Places workers for the Player's selected color on unoccupied corners clock-wise starting
     * from the top-leftmost corner of the boardInstance.
     * @return {[[number, number]]>} JSON list that contains two pairs of numbers, each between 0 and 4.
     */
    placeWorkers() {
    }

    /**
     * Uses Strategy.pickNonLosingPlay, for the this.color and for a particular number of this.look_ahead steps
     * @return {Array<[worker, directions]>}
     */
    pickNonLosingPlay(board: Board) {
    }

}
