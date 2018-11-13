var fs = require('fs');

import { Board } from "./board";
import { Strategy } from "./strategy";

interface PlayerInterface {

    register(): string;
    placeWorkers(color: string, board: any[][]): number[][];
    play(board: any[][]): [string, string[]];
    gameOver(name: string): string;

}


/**
 * Implements a Player component that can communicate with a game engine to play Santorini.
 */
export class Player implements PlayerInterface {
    color: string;
    boardInstance: Board;
    look_ahead: number;

    constructor() {
        this.color = undefined;
        this.boardInstance = undefined;
        this.look_ahead = fs.readFileSync('strategy.config', 'utf8');
    }

    /**
     *
     * @return {string} denotes name of player (their color)
     */
    register(): string {
        return this.color;
    }

    /**
     * Starts Remote Connection
     */
    startRemoteConnection() {
        // communicates with game engine to set color, make moves, and update internal game state
    }

    /**
     * Places workers for the Player's selected color on unoccupied corners clock-wise starting
     * from the top-leftmost corner of the boardInstance.
     * @return {[[number, number]]>} JSON list that contains two pairs of numbers, each between 0 and 4.
     */
    placeWorkers(color: string, board: any[][]) : number[][] {
        if (this.color || this.boardInstance) {
            console.log(`Place command should only be called once for player name ${this.color}`);
            return;
        }

        this.color = color;
        this.boardInstance = new Board(board);
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

    /**
     * Chooses a single play. Currently is dumb, and chooses the first play
     * @param {any[][]} board
     * @return {[string , [string , string]]}
     */
    play(board: any[][]): [string, string[] ] {
        this.boardInstance = new Board(board);
        return this.pickNonLosingPlay(this.boardInstance);
    }

    private pickNonLosingPlay(board: Board) : [string, string[]] {
        return Strategy.pickOneNonLosingPlay(board, this.color, this.look_ahead);
    }

    playOptionsNonLosing(board: any[][]): Array<[string, string[]]> {
        this.boardInstance = new Board(board);
        return this.computeManyNonLosingPlays(this.boardInstance);
    }

    private computeManyNonLosingPlays(board: Board) : Array<[string, string[]]> {
        if (this.look_ahead) {
            return Strategy.computeManyNonLosingPlays(board, this.color, this.look_ahead);
        } else {
            console.log("look_ahead value not found");
        }
    }

    gameOver(name: string) : string {
        // TODO: maybe change the state
        return 'ok';
    }
}

