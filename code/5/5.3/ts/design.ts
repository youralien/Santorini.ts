import { Board } from "../../5.2/ts/board";

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
class Player {
    /**
     * Player Knowledge
     */
    strategyModule: Strategy;  // strategy module used to make game plays
    color: string;             // chosen color for game
    board: Array<Array<Cell>>; // current state of the game boardInstance

    /**
     * Initializes class attributes to default values (see above).
     */
    constructor(strategy: Strategy) {
        this.strategyModule = strategy;
        this.color = '';
        this.boardInstance = [[], [], [], [], []];

        this.connectToGameEngine();
    }


    /**
     * Connects to the game engine, and responds with appropriate actions when requested.
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
     * Uses Strategy module pickBestMove function to to determine a game move, and returns the properly formatted move.
     * @return {[Array<Array<Cell>>, string, [string, string]]} valid play command.
     */
    makePlay(): [Array<Array<Cell>>, string, [string, string]] {
        return [this.board, 'worker', ['direction1', 'direction2']];
    }

    /**
     * Updates the Player's internal view of the boardInstance once the game engine returns the updated boardInstance.
     * @param updatedBoard {Array<Array<Cell>>} current state of the game boardInstance as sent by the game engine.
     */
    updateGameState(updatedBoard: Array<Array<Cell>>): void {
        this.boardInstance = updatedBoard;
    }
}

/**
 * Implements a Strategy module that the Player uses to decide what plays to make.
 * To determine the next move, we are proposing to use decision rule similar to Minimax where we compute a search tree of possible moves, and use a heuristic to determine what move will yield the best future outcome based on the move currently made.
 */
class Strategy {
    searchTree: object;     // current search tree to evaluate potential moves of
    boardInstance: Board;   // full boardInstance object used to simulate potential moves on the current game state
    playerColor: string;   // player's selected color

    constructor(board: Array<Array<Cell>>, color: string) {
        this.searchTree = {};
        this.boardInstance = new Board(board);
        this.playerColor = color;
    }

    /**
     * Computes and returns a value that is a heuristic for how good an action is.
     * @param currentBoardState {Array<Array<Cell>>} current boardInstance to evaluate how good player is doing.
     * @return {number} computed heuristic
     */
    computeHeuristic(): number {
        let heuristic = 0;
        return heuristic;
    }

    /**
     * Uses boardInstance instance to compute valid potential next states of the boardInstance and their cooresponding heuristic values.
     * @return {object} computed search tree with heuristics.
     */
    generateSearchTree(): object {
        return {};
    }

    /**
     * Uses a search tree to figure out best move to make and returns instructions to make that move.
     * @param searchTree {object} search tree to use for computing best move
     * @return {[Array<Array<Cell>>, string, [string, string]]} valid play command.
     */
    pickBestMove(searchTree: object): [Array<Array<Cell>>, string, [string, string]] {
        return [this.boardInstance.board, 'worker', ['direction1', 'direction2']];
    }
}

