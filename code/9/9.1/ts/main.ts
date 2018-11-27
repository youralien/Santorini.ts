// import necessary packages and modules
import { RemoteProxyPlayer, Player } from "./player";
import * as readline from 'readline';

const net = require('net');



/**
 * Checks if inputs passed from parsed JSON is valid for Santorini.
 * ["Register"]
 * ["Place",Color,Initial-Board],
 * ["Play",Board]
 * ["Game Over",Name],
 * @param obj {Object} parsed, valid JSON from command line input
 */
const isValidInput = function checkValidCommand(obj): boolean {
    // check if array of either length 2 or 3
    return Array.isArray(obj) && (obj.length >= 1 && obj.length <= 3);
};

export const playerDriverComponent = function(port, host) {
    let playerInstance = new Player();

    const server = net.createServer(function(socket) {

        socket.on('data', function(data) {
            let textChunk = data.toString('utf8');
            // console.log(textChunk);

            let maybeValidResponse = maybeValidJson(textChunk);
            if (maybeValidResponse !== undefined) {
                // clear current read string and augment the valid, parsed JSON

                if (isValidInput(maybeValidResponse)) {
                    //      console.log('maybeValidresponse', maybeValidResponse);
                    let outputMessage = undefined;

                    let command = maybeValidResponse[0];
                    if (command === 'Place') {
                        let color = maybeValidResponse[1];
                        let initialBoard = maybeValidResponse[2];

                        outputMessage = playerInstance.placeWorkers(color, initialBoard);
                    } else if (command === 'Play') {
                        let board = maybeValidResponse[1];

                        // TODO: play? or playOptions?
                        outputMessage = playerInstance.playOptionsNonLosing(board);
                    } else if (command === 'Register') {
                        outputMessage = playerInstance.register();
                    } else if (command == 'Game Over') {
                        let name = maybeValidResponse[1];

                        outputMessage = playerInstance.gameOver(name);
                    }

                    if (outputMessage !== undefined) {
                        // send output from function call to client
                        //console.log('Writing to socket');
                        socket.write(JSON.stringify(outputMessage));

                        // TODO: exit out of player component when the game is over
                        if (outputMessage === playerInstance.gameOverResponse) {
                            server.close(() => {
                                process.exit();
                            });
                        }
                    }
                    else {
                        console.error(`Returned undefined output for command = ${command}`);
                        // TODO: undefined output for our monad/maybe structure means that we're propagating an error
                        server.close(() => {
                            process.exit();
                        });
                    }
                }
            }
        });

    });
    server.listen(port, host);
};


export const adminRemoteProxy = async function(port, host) {
    // create stdin interface
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    // global variables
    let currReadString = '';  // stores current input from user (allows for multi-line JSON)
    let socket = new net.Socket();
    socket.connect(port, host);
    let playerInstance = new RemoteProxyPlayer(socket);

    /**
     * Reads lines as input to stdin is made.
     */
    let queue = []
    rl.on('line', (input) => {
        // add new input to current read in string (handling valid JSON across multiple lines)
        
        currReadString += input;
        // determine if JSON is valid
        let maybeValidResponse = maybeValidJson(currReadString);
        if (maybeValidResponse !== undefined) {
            // clear current read string and augment the valid, parsed JSON
            currReadString = '';

            if (isValidInput(maybeValidResponse)) {
                queue.push(maybeValidResponse);
            }
        }
    });

    let did_close = false;
    /**
     * Detect when input stream is closed.
     */
    rl.on('close', () => {
        did_close = true;
    });


    while (!did_close) {
        await playerInstance.sleep(1000);
    }

    let tmp = await playerInstance.progressTurn(["Register"])

    for (let i in queue) {
        let maybeValidResponse = queue.shift();
        let outputMessage = await playerInstance.progressTurn(maybeValidResponse)
        console.log(JSON.stringify(outputMessage));
        if (outputMessage === playerInstance.commandsOutOfSequence()) {
            // TODO should use other player name as the one who won, since this player used commands out of sequence
            // Send game over signal to player component, so it shuts down
            playerInstance.gameOver('otherPlayer');
            process.exit();
        }
    }
    process.exit();
};


/**
 * Attempts to parse and return valid JSON object from string, returning undefined if it can't.
 * @param inputString {string} string to attempt to find valid JSON in.
 * @return {object} valid JSON object or undefined if failed to parse.
 */
export const maybeValidJson = function checkIfJsonIsValid(inputString) {
    // attempt to parse JSON
    try {
        return JSON.parse(inputString);
    } catch(e) {
        return undefined;
    }
};
