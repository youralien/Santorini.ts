/**
 * Call this file like so
 * Will have to compile tsc to src, and then run
 * node src/admin.js --league 3
 * node src/admin.js --cup 8
 */

let fs = require('fs');
let assert = require('assert');
const net = require('net');
import {RemoteProxyPlayer} from "./player";

enum TournamentType {
    // RoundRobin
    League = 0,
    // Single Elimination
    Cup = 1,
}

export class Admin {
    tournament_type: TournamentType;
    num_players: number;
    ip_address: string;
    port: number;
    server;
    client;
    players;

    constructor (tournament_type: TournamentType, num_players: number) {
        this.tournament_type = tournament_type;
        this.num_players = num_players;
        let buffer = fs.readFileSync(`${ __dirname }/../santorini.config`, 'utf8');
        let parsed = JSON.parse(buffer.toString());
        this.ip_address = parsed["IP"];
        this.port = parsed["port"];
        this.players = [];

        this.server = net.createServer(function(client) {
            console.log(this.ip_address);
            this.players.push(new RemoteProxyPlayer(client));
            console.log(this.players.length);
        }.bind(this));
        this.server.listen(8000, '');
    }

    isWaitingForPlayers() {
        return this.players.length < this.num_players;
    }
}

const sleep = function sleepForMilliseconds(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const main = async function commandLine() {

    // parse command line arguments
    var myArgs = require('minimist')(process.argv.slice(2));
    // e.g., { _: [], league: 3 }

    assert(Object.keys(myArgs).length === 2, 'Admin takes two arguments, e.g., node src/admin.js --league 3');

    let n_players;
    let admin;
    if ('league' in myArgs) {
        n_players = myArgs['league'];
        admin = new Admin(TournamentType.League, n_players);
    }
    else if ('cup' in myArgs) {
        n_players = myArgs['cup'];
        admin = new Admin(TournamentType.Cup, n_players);
    }
    else {
        console.error('Admin takes a tournament type of string "league" or "cup", e.g., node src/admin.js --league 3')
    }

    while (admin.isWaitingForPlayers()) {
        console.log('Waiting for players to connect...');
        await sleep(5000);
    }

    console.log('Found players')
};

main();
