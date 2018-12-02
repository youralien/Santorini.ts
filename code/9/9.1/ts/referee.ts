import {RuleChecker} from "./rules";
import {Board} from "./board";
import {PlayerInterface} from "./player_interface";

export class Referee {

    /*
      It detects if players are violating any rules.
     */

    /*
     The referee has to be able to receive two instances of your player component that implements the interface for players you have designed and manage a game of Santorini between these two players.
     */
    boardInstance: Board;
    player1;
    player2;
    whoseTurnIdx: number;
    winner: string;
    // player1status: string;// won, loss, still playing
    // player2status: string;// won, loss, still playing

    /**
     *
     * @param {PlayerInterface} player1 Already registered players
     * @param {PlayerInterface} player2 Already registered players
     */
    constructor(player1, player2) {
        this.boardInstance = new Board(Board.createEmptyBoard(5,5));
        this.player1 = player1;
        this.player2 = player2;
        this.whoseTurnIdx = 0;
        this.winner = undefined; // not set until theres a winner
    }

    initializeName(name: string) {
        let player = this.whoseTurnIsIt();
        player.name = name;
        return player.color;
    }

    whoseTurnIsIt() {
        if (this.whoseTurnIdx % 2 === 0) {
            // maybe set player1 name
            return this.player1;
        }
        else {
            // maybe set player2 name
            return this.player2;
        }
    }

    whoseTurnIsItNot() {
        if (this.whoseTurnIdx % 2 === 0) {
            return this.player2;
        }
        else {
            return this.player1;
        }
    }

    // todo if invalid placement kick the player
    placeWorkers(placementList: Array<Array<number>>) {
        let [[w1row, w1col], [w2row, w2col]] = placementList;
        this.boardInstance.setCellWithWorkerByCoords(this.whoseTurnIsIt().color + '1', w1row, w1col);
        this.boardInstance.setCellWithWorkerByCoords(this.whoseTurnIsIt().color + '2', w2row, w2col);
        this.whoseTurnIdx++;
        return this.boardInstance.board;
    }

    playTurn(workerdirections: [string, [string, string]]) {
        let [worker, directions] = workerdirections;

        if (worker.slice(0, -1) !== this.whoseTurnIsIt().color) {
            console.error('Wrong player piece move, says Richard the Great');
            return;
        }

        let rulecheck = new RuleChecker(this.boardInstance.board, worker, directions);
        let validplay = rulecheck.executeTurn();

        // Game will End
        let didWin = rulecheck.didPlayerWin();
        if (didWin) {
            this.winner = this.whoseTurnIsIt().name;
        }
        else if (validplay == 'no') {
            this.winner = this.whoseTurnIsItNot().name;
        }

        if (this.winner !== undefined) {
            return this.winner;
        }

        // Keep Playing - update our board
        this.boardInstance.board = rulecheck.boardInstance.board;
        this.whoseTurnIdx++;
        return this.boardInstance.board;
    }

    /**
     * doTurn
     * Purpose:
     * - Asks next player to choose a play, and updates the board accordingly.
     * - It will return false
     *
     * Dependencies:
     * - Player.makePlay: request each Player to make a play
     * - RuleChecker.executeTurn: using the declared play, RuleChecker will simulate executing the turn and see if its valid
     * Knowledge:
     * - whoseTurnIdx: Which players turn it is currently;
     * - board: the master Board instance representation to which to compare
     *
     * @return didNotViolate {boolean} true if play was good otherwise false
     */
    doTurn(command: string, parsedJson) {
        if (this.winner) {
            // Any messages after deciding on the winner of a game should be ignored.
            return;
        }

        let result = undefined;
        if (command == 'Name') {
            result = this.initializeName(parsedJson);
        }
        else if (command == 'Place') {
            result = this.placeWorkers(parsedJson);
        }
        else if (command == 'Play') {
            result = this.playTurn(parsedJson);
        }

        // increment turn
        //this.whoseTurnIdx++;

        return result;
    }

    /**
     * Plays the game turn by turn; if player makes a move that violates, then it will set the status
     * for both players accordingly
     *
     * Dependencies:
     * - Referee.doTurn
     *
     * Knowledge:
     * - player1status: if player1 won or lost, or still playing
     * - player2status: if player2 won or lost, or still playing
     *
     */
    async runGame() {
        this.player1.reset();
        this.player2.reset();
        let placements1 = await this.player1.placeWorkers('blue', this.boardInstance.board);
        this.placeWorkers(placements1);
        console.log("first step: " + this.boardInstance.board);

        let placements2 = await this.player2.placeWorkers('white', this.boardInstance.board);
        this.placeWorkers(placements2);
        console.log("second step: " + this.boardInstance.board);

        while (this.winner === undefined) {
            console.log("turn: " + this.whoseTurnIdx);
            let curr_player = this.whoseTurnIsIt();
            console.log("board for play")

            console.log(this.boardInstance.board);
            let play = await curr_player.play(this.boardInstance.board);
            console.log(play);
            // todo play validation 
            let new_board = this.playTurn(play);
        }
        return this.winner;
    }

    /** Checks if player has won
     *
     * Knowledge:
     * - player1status: if player1 won or lost, or still playing
     * - player2status: if player2 won or lost, or still playing
     *
     * @param {string} playerColor
     * @return {string} won, lost, or still playing
     */
    status(playerColor: string) {

    }
}
