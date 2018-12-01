import {Board} from "./board";

export interface PlayerInterface {

    name: string;
    color: string;

    register(); // string;
    placeWorkers(color: string, board: any[][]); // number[][];
    play(board: any[][]); // [string, string[]];
    gameOver(name: string); // string;

}