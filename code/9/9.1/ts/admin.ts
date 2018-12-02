/**
 * Call this file like so
 * Will have to compile tsc to src, and then run
 * node src/admin.js --league 3
 * node src/admin.js --cup 8
 */
import {PlayerInterface} from "./player_interface";

let fs = require('fs');
let assert = require('assert');
const net = require('net');
import { RemoteProxyPlayer} from "./remote_proxy_player";
import {RuleChecker} from "./rules";
import {Referee} from "./referee";
import {ValidationPlayerProxy} from "./validation_player_proxy";


enum TournamentType {
    // RoundRobin
    League = 0,
    // Single Elimination
    Cup = 1,
}

class RRLeaderboardItem {
    name: string;
    wins: number;
    losses: number;
    cheated: boolean;

    constructor(name) {
        this.name = name;
        this.wins = 0;
        this.losses = 0
        this.cheated = false;
    }

    compareFunction(a, b) {
        // highest score to the top
        return (b.wins - b.losses) - (a.wins - a.losses);
    }
}


export class Admin {
    tournament_type: TournamentType;
    num_total_players: number;
    num_remote_players: number;
    server;
    client;
    players: any[];
    defaultPlayer;

    constructor (tournament_type: TournamentType, num_remote_players: number, ip_address: string, port: number, defaultPlayer) {
        this.tournament_type = tournament_type;
        this.num_remote_players = num_remote_players;
        this.defaultPlayer = defaultPlayer;
        this.num_total_players = this.numTotalPlayersNeeded();

        this.players = [];
        this.server = net.createServer(function(client) {
            this.players.push(new ValidationPlayerProxy(new RemoteProxyPlayer(client)));
            console.log(this.players.length);
        }.bind(this));
        console.log(`${ip_address} and ${port}`);
        this.server.listen(port, ip_address);
    }

    isWaitingForPlayers() : boolean {
        return this.players.length < this.num_remote_players;
    }

    numTotalPlayersNeeded() : number {
        let totalPlayers = 2;
        while (totalPlayers < this.num_remote_players) {
            totalPlayers *= 2;
        }
        return totalPlayers;
    }

    numDefaultPlayersNeeded() : number {
        return this.num_total_players - this.num_remote_players;
    }

    addDefaultPlayers() {
        for (let i = 0; i < this.numDefaultPlayersNeeded(); i++) {
            this.players.push(new ValidationPlayerProxy(new this.defaultPlayer()));
        }
    }

    async registerAllPlayers() {
        for (let i in this.players) {
            let name = await this.players[i].register();
        }
    }

    static roundRobinGameList(num_total_players) : Array<[number, number]>{
        let arr = [];
        for (let i = 0; i < num_total_players - 1; i++) {
            for (let j = i + 1; j < num_total_players; j++) {
                arr.push([i, j]);
            }
        }
        return arr;
    }

    async runTournament() {
        if (this.tournament_type == TournamentType.League) {
            await this.runRoundRobin();
        }
        else {
            await this.runSingleElimination();
        }

    }

    // todo, leaderboard, track winners and cheater
    private async runRoundRobin() {
        let robinGameList = Admin.roundRobinGameList(this.num_total_players);

        let unrankedLeaderboard = this.players.map((player) => {
            return new RRLeaderboardItem(player.name);
        });

        for (let i in robinGameList) {
            let [player1idx, player2idx] = robinGameList[i];
            let referee = new Referee(this.players[player1idx], this.players[player2idx]);
            let winner_name = await referee.runGame();
            console.log(`Game #${i} finished between [${player1idx}, ${player2idx}]`);
            console.log(winner_name + " won");

            // TODO: process the cheaters, make them at the bottom and given points
            // TODO: and replace them with default players

            if (this.players[player1idx].name === winner_name) {
                unrankedLeaderboard[player1idx].wins++;
                unrankedLeaderboard[player2idx].losses++;
            } else {
                unrankedLeaderboard[player1idx].losses++;
                unrankedLeaderboard[player2idx].wins++;
            }
        }

        console.log(unrankedLeaderboard)
        unrankedLeaderboard.reverse();
        console.log(unrankedLeaderboard)
        unrankedLeaderboard.sort();
        console.log(unrankedLeaderboard)



    }

    static indexOfMax(arr) {
        if (arr.length === 0) {
            return -1;
        }

        let max = arr[0];
        let maxIndex = 0;

        for (let i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                maxIndex = i;
                max = arr[i];
            }
        }

        return maxIndex;
    }

    private runSingleElimination() {
        console.log('HA nope')
    }
}

const sleep = function sleepForMilliseconds(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

let PARENT_DIR = `${ __dirname }/../`;

const main = async function commandLine() {
    // MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 data listeners added. Use emitter.setMaxListeners() to increase limit
    process.setMaxListeners(0);

    // read santorini admin config file
    let buffer = fs.readFileSync(PARENT_DIR + '/santorini.config', 'utf8');
    let parsed = JSON.parse(buffer.toString());
    let ip_address = parsed["IP"];
    let port = parsed["port"];
    let lib = require(PARENT_DIR + parsed["default-player"]);
    // e.g., lib = { __esModule: true, Player: [Function: Player] }
    assert(lib.__esModule, 'Module not found: Check "default-player" in santorini.config');
    assert('Player' in lib, 'Player class not found: The module should have an exported class named "Player"');
    let defaultPlayer = lib.Player;

    // parse command line arguments
    let myArgs = require('minimist')(process.argv.slice(2));
    // e.g., { _: [], league: 3 }
    assert(Object.keys(myArgs).length === 2, 'Admin takes two arguments, e.g., node src/admin.js --league 3');

    let n_players;
    let admin;
    if ('league' in myArgs) {
        // e.g., myArgs = { _: [], league: 3 }
        n_players = myArgs['league'];
        admin = new Admin(TournamentType.League, n_players, ip_address, port, defaultPlayer);
    }
    else if ('cup' in myArgs) {
        // e.g., myArgs = { _: [], cup: 3 }
        n_players = myArgs['cup'];
        admin = new Admin(TournamentType.Cup, n_players, ip_address, port, defaultPlayer);
    }
    else {
        console.error('Admin takes a tournament type of string "league" or "cup", e.g., node src/admin.js --league 3');
        return;
    }

    while (admin.isWaitingForPlayers()) {
        console.log('Waiting for players to connect...');
        await sleep(5000);
    }
    console.log('Found connecting players');

    admin.addDefaultPlayers();
    console.log('Adding additional players... Total number of players = ', admin.players.length);

    if (admin.players.length != admin.num_total_players) {
        console.error('Yikes, math should equal math. Count number of players again');
        return;
    }
    await admin.registerAllPlayers();

    for (let i in admin.players) {
        console.log("Constructor Name", admin.players[i].constructor.name);
        console.log("Valid Proxy Player Name", admin.players[i].name);
    }
    admin.runTournament();
};
main();
