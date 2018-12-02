import {PlayerInterface} from "./player_interface";
import {maybeValidJson} from "./main";

export class RemoteProxyPlayer implements PlayerInterface {
    client;
    name: string;
    color: string;
    turn: number;
    commands: object;
    currReadString: string;
    currRes;
    x: number;



    constructor(socket) {
        // track what command turn it is, starts on expecting register
        this.turn = 0;

        // initialize current result read string
        // stores current input from user (allows for multi-line JSON)
        this.currReadString = '';

        // initialize current result/response which is a mailbox that stores results of remote calls
        this.currRes = undefined;
        this.client = socket;

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
    async progressTurn(commandInput: any[]) {
        let command = commandInput[0];
        let res = undefined;

        //console.log("progressing turn:");
        //console.log(command)

        if (command == 'Place') {
            let color = commandInput[1];
            let board = commandInput[2];
            res = await this.placeWorkers(color, board);
        } else if (command == 'Play') {
            let board = commandInput[1]
            res = await this.play(board);
        } else if (command == 'Game Over') {
            let name = commandInput[1]
            res = await this.gameOver(name);
        } else {
            // if its not one of the interfaces, just return and dont progress the turn successfully
            return;
        }
        this.turn++;
        return res;
    }

    private async receive() {
        let currReadString = '';

        this.client.on('data', (data) => {
            let input = data.toString('utf-8');

            // add new input to current read in string (handling valid JSON across multiple lines)
            currReadString += input;

            // determine if JSON is valid
            let isValidResponse = maybeValidJson(currReadString);
            if (isValidResponse !== undefined) {
                // clear current read string and augment the valid, parsed JSON
                currReadString = '';

                // write response to 'mailbox' that stores results of remote call
                this.currRes = isValidResponse;
            }
        });

        // block until we have the result
        while (this.currRes === undefined) {
            await this.sleep(1000);
        }

        // capture the result
        let res = this.currRes;

        // reset the mailbox
        this.currRes = undefined;

        return res;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    commandsOutOfSequence() {
        return "Santorini is broken! Too many tourists in such a small place...";
    }

    async register() {
        if (this.turn !== 0) {
            return this.commandsOutOfSequence();
        }
        let commandAndArgs = ["Register"];
        this.client.write(JSON.stringify(commandAndArgs));
        let ans = await this.receive();

        // set name
        this.name = ans;

        // increment turn, since this, since this
        this.turn++;

        return ans;
    }

    async placeWorkers(color: string, board: any[][]) {
        if (this.turn != 1) {
            return this.commandsOutOfSequence();
        }

        this.color = color;
        let commandAndArgs = ["Place", color, board];
        this.client.write(JSON.stringify(commandAndArgs));
        let ans = await this.receive();
        return ans;
    }

    async play(board: any[][])  {
        if (this.turn < 1) {
            return this.commandsOutOfSequence();
        }
        let commandAndArgs = ["Play", board];
        this.client.write(JSON.stringify(commandAndArgs));
        let ans = await this.receive();
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
    async gameOver(name: string) {
        let commandAndArgs = ["Game Over", name]
        this.client.write(JSON.stringify(commandAndArgs))
        let ans = await this.receive();
        return ans;
    }
}
