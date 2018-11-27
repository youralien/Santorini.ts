"use strict";
/**
 * Call this file like so
 * Will have to compile tsc to src, and then run
 * node src/admin.js --league 3
 * node src/admin.js --cup 8
 */
exports.__esModule = true;
var fs = require('fs');
var assert = require('assert');
var net = require('net');
var player_1 = require("./player");
var TournamentType;
(function (TournamentType) {
    TournamentType[TournamentType["League"] = 0] = "League";
    TournamentType[TournamentType["Cup"] = 1] = "Cup";
})(TournamentType || (TournamentType = {}));
var Admin = /** @class */ (function () {
    function Admin(tournament_type, num_players) {
        this.tournament_type = tournament_type;
        this.num_players = num_players;
        var buffer = fs.readFileSync(__dirname + "/../santorini.config", 'utf8');
        var parsed = JSON.parse(buffer.toString());
        this.ip_address = parsed["IP"];
        this.port = parsed["port"];
        this.players = [];
        this.server = net.createServer(function (client) {
            console.log(this.ip_address);
            this.players.push(new player_1.RemoteProxyPlayer(client));
            console.log(this.players.length);
        }.bind(this));
        this.server.listen(8000, '');
    }
    return Admin;
}());
exports.Admin = Admin;
var main = function commandLine() {
    // parse command line arguments
    var myArgs = require('minimist')(process.argv.slice(2));
    // e.g., { _: [], league: 3 }
    assert(Object.keys(myArgs).length === 2, 'Admin takes two arguments, e.g., node src/admin.js --league 3');
    if ('league' in myArgs) {
        var n_players = myArgs['league'];
        var admin = new Admin(TournamentType.League, n_players);
    }
    else if ('cup' in myArgs) {
        var n_players = myArgs['cup'];
        var admin = new Admin(TournamentType.Cup, n_players);
    }
    else {
        console.error('Admin takes a tournament type of string "league" or "cup", e.g., node src/admin.js --league 3');
    }
};
main();
