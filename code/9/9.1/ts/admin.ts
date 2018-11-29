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


enum TournamentType {
    // RoundRobin
    League = 0,
    // Single Elimination
    Cup = 1,
}


export class Admin {
    tournament_type: TournamentType;
    num_players: number;
    server;
    client;
    players: any[];
    defaultPlayer;

    constructor (tournament_type: TournamentType, num_players: number, ip_address: string, port: number, defaultPlayer) {
        this.tournament_type = tournament_type;
        this.num_players = num_players;
        this.defaultPlayer = defaultPlayer;

        this.players = [];
        this.server = net.createServer(function(client) {
            this.players.push(new RemoteProxyPlayer(client));
            console.log(this.players.length);
        }.bind(this));
        console.log(`${ip_address} and ${port}`);
        this.server.listen(port, ip_address);
    }

    isWaitingForPlayers() : boolean {
        return this.players.length < this.num_players;
    }

    numDefaultPlayersNeeded() : number {
        // TODO(rlouie): should compute the highest power of two. See npm install mathjs
        return 1;
    }

    addDefaultPlayers() {
        for (let i = 0; i < this.numDefaultPlayersNeeded(); i++) {
            this.players.push(new this.defaultPlayer());
        }
    }

    async registerAllPlayers() {
        for (let i in this.players) {
            let name = await this.players[i].register();
            console.log('got name: ', name);
        }
    }
}

const sleep = function sleepForMilliseconds(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

let PARENT_DIR = `${ __dirname }/../`;

const main = async function commandLine() {

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

    await admin.registerAllPlayers();


    for (let i in admin.players) {
        console.log(admin.players[i].constructor.name);
        console.log(admin.players[i].name);
    }

};

main();
