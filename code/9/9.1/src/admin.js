"use strict";
/**
 * Call this file like so
 * Will have to compile tsc to src, and then run
 * node src/admin.js --league 3
 * node src/admin.js --cup 8
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs = require('fs');
var assert = require('assert');
var net = require('net');
var player_1 = require("./player");
var TournamentType;
(function (TournamentType) {
    // RoundRobin
    TournamentType[TournamentType["League"] = 0] = "League";
    // Single Elimination
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
    Admin.prototype.isWaitingForPlayers = function () {
        return this.players.length < this.num_players;
    };
    return Admin;
}());
exports.Admin = Admin;
var sleep = function sleepForMilliseconds(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
var main = function commandLine() {
    return __awaiter(this, void 0, void 0, function () {
        var myArgs, n_players, admin;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    myArgs = require('minimist')(process.argv.slice(2));
                    // e.g., { _: [], league: 3 }
                    assert(Object.keys(myArgs).length === 2, 'Admin takes two arguments, e.g., node src/admin.js --league 3');
                    if ('league' in myArgs) {
                        n_players = myArgs['league'];
                        admin = new Admin(TournamentType.League, n_players);
                    }
                    else if ('cup' in myArgs) {
                        n_players = myArgs['cup'];
                        admin = new Admin(TournamentType.Cup, n_players);
                    }
                    else {
                        console.error('Admin takes a tournament type of string "league" or "cup", e.g., node src/admin.js --league 3');
                    }
                    _a.label = 1;
                case 1:
                    if (!admin.isWaitingForPlayers()) return [3 /*break*/, 3];
                    console.log('Waiting for players to connect...');
                    return [4 /*yield*/, sleep(5000)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3:
                    console.log('Found players');
                    return [2 /*return*/];
            }
        });
    });
};
main();
