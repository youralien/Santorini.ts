var fs = require('fs');

import { Board } from "./board";
import { Strategy } from "./strategy";
import { maybeValidJson } from "./main";

interface PlayerInterface {

    register(); // string;
    placeWorkers(color: string, board: any[][]); // number[][];
    play(board: any[][]); // [string, string[]];
    playOptionsNonLosing(board: any[][]); // Array<[string, string[]]>;
    gameOver(name: string); // string;

}


/**
 * Implements a Player component that can communicate with a game engine to play Santorini.
 */
export class Player implements PlayerInterface {
    name: string;
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





// load in package for stdin and stdout, and create input/output interface
// const readline = require('readline');
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
//   terminal: false
// });

// global variables
let currReadString = '';  // stores current input from user (allows for multi-line JSON)


/**
 * Reads lines as input to stdin is made.
client.on('data', (data) => {
    let input = data.toString('utf-8');

    // add new input to current read in string (handling valid JSON across multiple lines)
    currReadString += input;
    // determine if JSON is valid
    let isValidResponse = maybeValidJson(currReadString);
    console.log(isValidResponse);
    if (isValidResponse !== undefined) {
        // clear current read string and augment the valid, parsed JSON
        currReadString = '';

        if (isValidCommand(isValidResponse)) {
            if (isValidResponse["operation-name"] === 'Declare') {
                // console.log(JSON.stringify(declareNumber()));
                client.write(JSON.stringify(declareNumber()));
            }
            else if (isValidResponse["operation-name"] === 'Swap') {
                // console.log(JSON.stringify(swapNumber()));
                client.write(JSON.stringify(swapNumber()));
            }
        }
    }
});


 * Detect when input stream is closed.

thisclient.on('close', () => {
    console.log('connection to administrator closed.');
});

 * Implements a Remote Proxy for the Player Class
 * It will setup the tcp/ip socket as a “client” to connect to some remote player component
 */
export class RemoteProxyPlayer implements PlayerInterface {
    client;
    turn: number;
    commands: object;
    x: number;

    constructor(host: string, port: number) {

        // track what command turn it is, starts on expecting register
        this.turn = 0;

        // remote client
        const net = require('net');
        this.client = new net.Socket();
        this.client.connect(port, host, function() {
            console.log('ProxyPlayer is connected to Remote Player.');
        });

        this.commands = {
            "Register": this.register,
            "Place": this.placeWorkers,
            "Play": this.play,
            "Game Over": this.gameOver
        };
    }

    /**
     * Assume valid input commmand
     * @param commandInput
     */
    progressTurn(commandInput: any[]) {
        let command = commandInput[0];
        let res = undefined;

        console.log("progressing turn:");
        console.log(command)

        if (command == 'Register') {
            res = this.register();
        } else if (command == 'Place') {
            let color = commandInput[1];
            let board = commandInput[2];
            res = this.placeWorkers(color, board);
        } else if (command == 'Play') {
            let board = commandInput[1]
            res = this.play(board);
        } else if (command == 'Game Over') {
            let name = commandInput[1]
            res = this.gameOver(name);
        }
        this.turn++;
        return res;
        // if ((command == 'Register') && (this.turn != 0)) {
        //     outputMessage = this.commandsOutOfSequence();
        // }
        // if (command == 'Register') {
        //     if (this.turn != this.commands.indexOf(command)) {
        //         outputMessage = this.commandsOutOfSequence();
        //     } else {
        //         outputMessage = this.register();
        //     }
        //
        // } {
        // }
        //
    }

    private receive() {
        // global variables
        let currReadString = '';  // stores current input from user (allows for multi-line JSON)

        /**
         * Reads lines as input to stdin is made.
         */
        this.client.on('data', (data) => {
            let input = data.toString('utf-8');

            // add new input to current read in string (handling valid JSON across multiple lines)
            currReadString += input;
            // determine if JSON is valid
            let isValidResponse = maybeValidJson(currReadString);
            console.log("received: ")
            console.log(isValidResponse);
            if (isValidResponse !== undefined) {
                // clear current read string and augment the valid, parsed JSON
                currReadString = '';

                return isValidResponse;
            }
        });
    }


    private commandsOutOfSequence() {
        return "Santorini is broken! Too many tourists in such a small place...";
    }

    register() {
        if (this.turn !== 0) {
            return this.commandsOutOfSequence();
        }
        let commandAndArgs = ["Register"];
        this.client.write(JSON.stringify(commandAndArgs));
        let ans = this.receive();
        return ans;
    }

    placeWorkers(color: string, board: any[][]) {
        if (this.turn != 1) {
            return this.commandsOutOfSequence();
        }

        let commandAndArgs = ["Place", color, board];
        this.client.write(JSON.stringify(commandAndArgs));
        let ans = this.receive();
        return ans;
    }
    play(board: any[][])  {
        if (this.turn < 1) {
            return this.commandsOutOfSequence();
        }
        let commandAndArgs = ["Play", board];
        this.client.write(JSON.stringify(commandAndArgs));
        let ans = this.receive();
        return ans;
    }
    /*
     * todo 
     * define interface 
     */
    playOptionsNonLosing(board: any[][]) {
        if (this.turn < 1) {
            return this.commandsOutOfSequence();
        }
        let commandAndArgs = ["Get-Plays", board];
        this.client.write(JSON.stringify(commandAndArgs));
        let ans = this.receive();
        return ans;
    }
    gameOver(name: string) {
        this.turn = -1;
        let commandAndArgs = ["Game Over", name]
        this.client.write(JSON.stringify(commandAndArgs))
        let ans = this.receive();
        return ans;
    }
}