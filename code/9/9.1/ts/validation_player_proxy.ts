import { PlayerInterface} from "./player_interface";
import {RuleChecker} from "./rules";

export class ValidationPlayerProxy implements PlayerInterface {

    wrapped_player: PlayerInterface;
    name: string;
    color: string;
    turn: number;
    rulecheck: RuleChecker;

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
            return this.commandsOutOfSequence();
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
            return this.commandsOutOfSequence();
        }
        this.turn++;
        return await this.wrapped_player.placeWorkers(color, board);
    }
    async play(board: any[][]) {
        if (this.turn < 2) {
            return this.commandsOutOfSequence();
        }
        this.turn++;
        return await this.wrapped_player.play(board);
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