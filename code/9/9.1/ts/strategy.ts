import { Board } from "./board";
import { RuleChecker } from "./rules";
import {worker} from "cluster";

/**
 * Implements a Strategy module that the Player uses to decide what plays to make.
 * To determine the next move, we are proposing to use decision rule similar to Minimax where we compute a search tree of possible moves, and use a heuristic to determine what move will yield the best future outcome based on the move currently made.
 */
export class Strategy {
    constructor() {
    }


    static pickOneNonLosingPlay(board: Board, targetPlayerColor: string, n: number) : [string, string[]] {
        let manyPlays = Strategy.computeManyNonLosingPlays(board, targetPlayerColor, n);
        // TODO: choose something smarter from the options
        return (manyPlays.length ? manyPlays[0] : undefined);
    }

    static computeManyNonLosingPlays(board : Board, targetPlayerColor : string, n : number) : Array<[string, string[]]> {
        let nonLosingPlays = Strategy.getNonLosingBoardsPlaysWinsAtDepth(board, targetPlayerColor, n);
        let ret = [];
        
        if (nonLosingPlays.length > 0) {
            for (let i = 0; i < nonLosingPlays.length; i++) {
                let [targetPlayerBoard, workerDirections, targetPlayerDidWin] = nonLosingPlays[i];
                if (workerDirections) {
                    ret.push(workerDirections);
                }
            }
        }    
        return ret;
    }

    static getNonLosingBoardsPlaysWinsAtDepth(board : Board, targetPlayerColor : string, n : number) : Array<[Board, [string, string[]], boolean]> {
        if (n === 1) {
            return Strategy.computeNonLosingValidBoardsPlaysWins(board, targetPlayerColor);
        }

        let playsTarget = Strategy.computeNonLosingValidBoardsPlaysWins(board, targetPlayerColor);

        let playsTargetNext = [];

        for (let i in playsTarget) {
            let [targetPlayerBoard, [targetPlayerWorker, targetPlayerDirections], targetPlayerDidWin] = playsTarget[i];
            let currPlay = playsTarget[i];

            // if win then use this play
            if (targetPlayerDidWin) {
                playsTargetNext.push(currPlay);
            } else {
                let otherPlayerColor = targetPlayerColor === 'white' ? 'blue' : 'white';

                let otherPlayerPlays = Strategy.computeNonLosingValidBoardsPlaysWins(targetPlayerBoard, otherPlayerColor);
                if (otherPlayerPlays.length === 0) {
                    playsTargetNext.push(currPlay);
                }

                for (let j in otherPlayerPlays) {
                    let [otherPlayerBoard, [otherPlayerWorker, otherPlayerDirections], otherPlayerDidWin] = otherPlayerPlays[j];
                    let temp = Strategy.getNonLosingBoardsPlaysWinsAtDepth(otherPlayerBoard, targetPlayerColor, n - 1);

                    if (temp.length > 0) {
                        playsTargetNext.push(temp);

                        // return first feasible move found
                        return playsTargetNext;
                    }
                }
            }
        }
        return playsTargetNext;
    }
    static computeNonLosingValidBoardsPlaysWins(board: Board, targetPlayerColor: string) : Array<[Board, [string, string[]], boolean]> {
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
                nonLosingValidPlays.push(currPlay);
            }
        });
        return nonLosingValidPlays;
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

    /**
     *
     * @param {string[]} directions. All Cardinal directions i.e. N, E, ... SW...
     * @return {string[][]} list of move, build directions, i.e. [['N', 'N'], ['N', 'W'], ....]
     */
    static computeAllPlays(directions: string[]) {
        let allPlayCombos = directions.map(direction => [direction]);
        for (let i in directions) {
            for (let j in directions) {
                allPlayCombos.push([directions[i], directions[j]]);
            }
        }

        return allPlayCombos;
    }
}
