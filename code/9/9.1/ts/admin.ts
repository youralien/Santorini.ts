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
    wins: string[];
    losses: string[];
    cheated: boolean;

    constructor(name) {
        this.name = name;
        this.wins = [];
        this.losses = [];
        this.cheated = false;
    }

    compareFunction(a, b) {
        // highest score to the top
        return (b.wins.length - b.losses.length) - (a.wins.length - a.losses.length);
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

            if (referee.cheater !== undefined) {

                // Handle math for cheater
                for (let i in unrankedLeaderboard) {
                    let record = unrankedLeaderboard[i];
                    // give people who
                    let loss2cheater = false;
                    let newLosses = [];
                    for (let j in record.losses) {
                        if (referee.cheater === record.losses[j]) {
                            loss2cheater = true;
                        } else {
                            newLosses.push(record.losses[j]);
                        }
                    }
                    if (loss2cheater) {
                        record.wins.push(referee.cheater);
                        record.losses = newLosses;
                    }
                }

                // replace with default player
                let cheater_idx = this.players[player1idx].name === referee.cheater ? player1idx : player2idx;
                this.players[cheater_idx] = new ValidationPlayerProxy(new this.defaultPlayer());

                // update cheater on record list
                unrankedLeaderboard[cheater_idx].cheated = true;
            }
            else {
                if (this.players[player1idx].name === winner_name) {
                    unrankedLeaderboard[player1idx].wins.push(this.players[player2idx].name);
                    unrankedLeaderboard[player2idx].losses.push(this.players[player1idx].name);
                } else {
                    unrankedLeaderboard[player1idx].losses.push(this.players[player2idx].name);
                    unrankedLeaderboard[player2idx].wins.push(this.players[player1idx].name);
                }
            }

        }

        unrankedLeaderboard.sort();
        console.log(unrankedLeaderboard);

        for (let i = 0; i < unrankedLeaderboard.length; i++) {
            let rank = i+1;
            let name = unrankedLeaderboard[i].name;
            console.log(`${name} is ranked #${rank}`);
        }
        // TODO: write ranking (i.e. 1: name, 2: name)
    }

    private async runSingleElimination() {
        let winners = [];
        for (let i = 0; i < this.players.length; i++) {
            winners.push(i);
        }

        let bracket_results = []

        let round = Admin.generate_pairs(winners);
        while (round.length >= 1) {

            let next_round_indices = [];
            let this_round_losers = [];

            for (let i in round) {
                let [player1idx, player2idx] = round[i];
                console.log("before the failure: ", round[i]);
                let referee = new Referee(this.players[player1idx], this.players[player2idx]);
                let winner_name = await referee.runGame();

                console.log(`Game #${i} finished between [${player1idx}, ${player2idx}]`);
                console.log(winner_name + " won");

                if (this.players[player1idx].name === winner_name) {
                    next_round_indices.push(player1idx);
                    if (bracket_results.length && referee.cheater !== undefined) {
                        // push only to the bottom bracket if there is a bottom bracket in the first place
                        bracket_results[bracket_results.length-1].push(player2idx);
                    } else {
                        //
                        this_round_losers.push(player2idx);
                    }
                } else {
                    next_round_indices.push(player2idx);
                    if (bracket_results.length && referee.cheater !== undefined) {
                        // push only to the bottom bracket if there is a bottom bracket in the first place
                        bracket_results[bracket_results.length-1].push(player1idx);
                    } else {
                        this_round_losers.push(player1idx);
                    }
                }
            }

            // this round is pushed to the overall bracket
            bracket_results.unshift(this_round_losers);

            if (next_round_indices.length == 1) {
                console.log(bracket_results);
                bracket_results.unshift(next_round_indices);
                break;
            }

            round = Admin.generate_pairs(next_round_indices);
            console.log("Next round to be played");
            console.log(next_round_indices);
            console.log(bracket_results);
        }

        console.log("Winner is: ", this.players[round[0][0]].name)

        for (let i = 0; i < bracket_results.length; i++) {
            let rank = i+1; // 0-indexing
            let player_idxs_for_round = bracket_results[i];
            for (let j in player_idxs_for_round) {
                let playeridx = player_idxs_for_round[j];
                let name = this.players[playeridx].name;
                console.log(`${name} is ranked #${rank}`);
            }
        }

    }

    static generate_pairs(player_list_indices) {
        let res = [];
        for (let i = 0; i < player_list_indices.length; i += 2) {
            res.push([player_list_indices[i], player_list_indices[i + 1]]);
        }
        return res;
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
    assert('Player' in lib, 'Player class not found: The module should have an exported class named "Player"'); let defaultPlayer = lib.Player;

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
