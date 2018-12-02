var fs = require('fs');
import {PlayerInterface} from "./player_interface";
import {Strategy} from "./strategy";
import {Board} from "./board";

/**
 * Implements a Player component that can communicate with a game engine to play Santorini.
 */
class BasicPlayer implements PlayerInterface {
    name: string;
    color: string;
    boardInstance: Board;
    look_ahead: number;
    gameOverResponse: string;

    constructor() {
        this.color = undefined;
        this.boardInstance = undefined;

        let buffer = fs.readFileSync(`${ __dirname }/../strategy.config`, 'utf8');
        let parsed = JSON.parse(buffer.toString());
        this.look_ahead = parsed['look-ahead'];
        this.gameOverResponse = 'OK';
    }

    /**
     *
     * @return {string} denotes name of player (their color)
     */
    register(): string {
        this.name = this.randomPlayerName();
        return this.name;
    }

    private randomPlayerName(): string {
        let randomInt = Math.floor((Math.random() * 10) + 1);
        return `player-name-${randomInt}`;
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
        this.color = color;
        this.boardInstance = new Board(board);

        const potentialPlacements = [[0, 0], [0, 4], [4, 4], [4, 0]];
        let workersToPlace = [`${ this.color }1`, `${ this.color }2`];
        console.log('workers to place', workersToPlace);
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
     * @return {[string , [string , string]]} [worker, directions] e.g. ['blue1', ['W']] or ['white2', ['N', 'W']]
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
        return this.gameOverResponse;
    }
}

export const Player = BasicPlayer;
