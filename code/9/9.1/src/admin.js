"use strict";
exports.__esModule = true;
var fs = require('fs');
var net = require('net');
var player_1 = require("./player");
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
var admin = new Admin("hello", 3);
