import { PlayerInterface} from "./player_interface";
import {RuleChecker} from "./rules";
import {Strategy}  from "./strategy";
import {Board} from "./board";

export class ValidationPlayerProxy implements PlayerInterface {

    wrapped_player: PlayerInterface;
    name: string;
    color: string;
    turn: number;
    prev_board: Board;

    constructor(wrapped_player: PlayerInterface) {
        this.wrapped_player = wrapped_player;

        // track what command turn it is, starts on expecting register
        this.turn = 0;
    }

    commandsOutOfSequence() {
        return "Santorini is broken! Too many tourists in such a small place...";
    }

    async register() {// : string | Promise<string> {
        if (this.turn !== 0) {
            return ["turn_error", "register out of sequence, not turn 0. turn = " + this.turn];
        }
        this.turn++;
        return await this.wrapped_player.register();
    }

    /**
     * Checks that should happen
     * 1. Board should be a valid board (the right size, no one has won)
     * 2. If its asking me to place white, there shouldn't be white players already on there
     * 3. Should have 0 or 2 players on there
     *
     * @param {string} color
     * @param {any[][]} board
     */
    async placeWorkers(color: string, board: any[][]) {
        if (this.turn != 1) {
            return ["turn_error", "placeworkers out of sequence, not turn 1. turn = " + this.turn];
        }
        // todo check that board is valid

        this.turn++;
        let  placement_list = await this.wrapped_player.placeWorkers(color, board);
        let  [[w1row, w1col], [w2row, w2col]] =  placement_list;
        this.prev_board.setCellWithWorkerByCoords(color + "1", w1row, w1col);
        this.prev_board.setCellWithWorkerByCoords(color + "2", w2row, w2col);
        return placement_list;
    }

    async play(board: any[][]) {
        if (this.turn < 2) {
            return ["turn_error", "play out of sequence, turn less than 2. turn = " + this.turn];
        }
        
        
        this.turn++;
        let play =  await this.wrapped_player.play(board);
        let [worker, directions] = play;
        let rule_checker = new RuleChecker(board, worker, directions);
        rule_checker.executeTurn();
        this.prev_board = rule_checker.boardInstance;
        return play;
    }

    async gameOver(name: string) {
        this.turn++;
        return await this.wrapped_player.gameOver(name);
    }

    reset() {
        this.turn = 1;
    }
}
export const Player = ValidationPlayerProxy;
