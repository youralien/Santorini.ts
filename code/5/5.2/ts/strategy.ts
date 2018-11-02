import { Board } from "./board";
import { RuleChecker } from "./rules";

/**
 * Implements a Strategy module that the Player uses to decide what plays to make.
 * To determine the next move, we are proposing to use decision rule similar to Minimax where we compute a search tree of possible moves, and use a heuristic to determine what move will yield the best future outcome based on the move currently made.
 */
export class Strategy {
    constructor() {
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
    pickBestMove(searchTree: object): [Array<Array<any>>, string, [string, string]] {
        return [[[], [], [], [], []], 'worker', ['direction1', 'direction2']];
    }

    /**
     * Computes all valid plays that don't cause the target to lose.
     * @param board {Board} Board instance.
     * @param targetPlayerColor {string} Color of target player.
     * @return {[string, [string, string]]} all valid plays that don't cause target player to lose next turn.
     */
    static computeNonLosingValidPlays(board: Board, targetPlayerColor: string) {
        // compute plays for target player
        let targetPlayerValidPlays = Strategy.computeValidPlays(board, targetPlayerColor);

        // loop through each play for target player, and see what other player could do
        let otherPlayerColor = targetPlayerColor === 'white' ? 'blue' : 'white';
        let nonLosingValidPlays = [];
        targetPlayerValidPlays.forEach((currPlay) => {
            let [targetPlayerBoard, [targetPlayerWorker, targetPlayerDirections], targetPlayerDidWin] = currPlay;

            // simulate other player's plays given targetPlayer's board
            let otherPlayerValidPlays = Strategy.computeValidPlays(targetPlayerBoard, otherPlayerColor);

            // check if any otherPlayer's plays result in win
            let otherPlayerCouldWin = otherPlayerValidPlays.some((currOtherPlay) => currOtherPlay[2] === true);

            // only include valid play in final output if target player already won or other player cant win on next move
            if (targetPlayerDidWin || !otherPlayerCouldWin) {
                nonLosingValidPlays.push([targetPlayerWorker, targetPlayerDirections]);
            }
        });

        return nonLosingValidPlays;
    }


    /**
     * Computes all valid plays that don't cause the target to lose.
     * @param board {Board} Board instance.
     * @param targetPlayerColor {string} Color of target player.
     * @return {[Board, string, [string, string], boolean]} all valid plays player can make.
     */
    static computeValidPlays(board: Board, targetPlayerColor: string) {
        let allPlayCombos = Strategy.computeAllPlays(board.directions);
        let targetWorkers = [`${ targetPlayerColor }1`, `${ targetPlayerColor }2`];

        // loop over workers and plays
        let validPlays = [];
        targetWorkers.forEach((currWorker) => {
            allPlayCombos.forEach((currDirections) => {
                // create a new rule checker instance given the current worker and possible move
                let ruleCheckerInstance = new RuleChecker(JSON.parse(JSON.stringify(board.board)), currWorker, currDirections);
                let isTurnValid = ruleCheckerInstance.executeTurn() === 'yes';

                // keep only valid plays
                if (isTurnValid) {
                    validPlays.push([ruleCheckerInstance.boardInstance, [currWorker, currDirections], ruleCheckerInstance.didPlayerWin()]);
                }
            });
        });

        return validPlays;
    }

    static computeAllPlays(directions: string[]) {
        let allPlayCombos = directions.map(direction => [direction]);
        for (let direction1 in directions) {
            for (let direction2 in directions) {
                allPlayCombos.push([directions[direction1], directions[direction2]]);
            }
        }

        return allPlayCombos;
    }
}
