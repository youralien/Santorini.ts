import {RuleChecker} from "../../../code/5/5.2/ts/rules";

class Referee {

    /*
      It detects if players are violating any rules.
     */

    /*
     The referee has to be able to receive two instances of your player component that implements the interface for players you have designed and manage a game of Santorini between these two players.
     */
    board: Board;
    player1: Player;
    player2: Player;
    rulecheck: RuleChecker;
    whoseTurnIdx: number;
    player1status: string // won, loss, still playing
    player2status: string // won, loss, still playing

    constructor(board: Board, player1: Player, player2: Player) {
        this.player1 = player1;
        this.player2 = player2;
        this.player1.setColor('blue');
        this.player1.setColor('white');

        this.rulecheck = new RuleChecker();
        this.whoseTurnIdx = 0;
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
        if (this.whiteTurnIdx % 2 === 0) {
            return this.player2;
        }
        else {
            return this.player1;
        }
    }

    placeWorkers(placementList: Array<Array<int>>) {
        let [[w1row, w1col], [w2row, w2col]] = placementList;
        this.board.setCellWithWorkerByCoords(this.whoseTurnIsIt().color + '1', w1row, w1col);
        this.board.setCellWithWorkerByCoords(this.whoseTurnIsIt().color + '2', w2row, w2col);
        return this.board.board;
    }

    playTurn(workerdirections: [string, [string, string]]) {
        let [worker, directions] = workerdirections;

        if (worker.slice(0, -1) !== this.whoseTurnIsIt().color) {
            console.error('Wrong player piece move, says Richard the Great');
            return;
        }

        let rulecheck = new RuleChecker(this.board.board, worker, directions);
        let validplay = rulecheck.executeTurn();
        let didWin = rulecheck.didPlayerWin();
        if (didWin) {
            return this.whoseTurnIsIt().name;
        }
        else if (validplay == 'no') {
            return this.whoseTurnIsItNot().name;
        }

        return this.board.board;
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
        let result = undefined;
        if (command == 'Name') {
            result = this.initializeName(JSON.stringify(parsedJson));
        }
        else if (command == 'Place') {
            result = this.placeWorkers(parsedJson);
        }
        else if (command == 'Play') {
            result = this.playTurn(parsedJson);
        }

        // increment turn
        this.whoseTurnIdx++;

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
    main() {

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