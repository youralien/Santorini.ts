"use strict";
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
var remote_proxy_player_1 = require("./remote_proxy_player");
var referee_1 = require("./referee");
var validation_player_proxy_1 = require("./validation_player_proxy");
var TournamentType;
(function (TournamentType) {
    // RoundRobin
    TournamentType[TournamentType["League"] = 0] = "League";
    // Single Elimination
    TournamentType[TournamentType["Cup"] = 1] = "Cup";
})(TournamentType || (TournamentType = {}));
var RRLeaderboardItem = /** @class */ (function () {
    function RRLeaderboardItem(name) {
        this.name = name;
        this.wins = [];
        this.losses = [];
        this.cheated = false;
    }
    RRLeaderboardItem.prototype.compareFunction = function (a, b) {
        // highest score to the top
        return (b.wins.length - b.losses.length) - (a.wins.length - a.losses.length);
    };
    return RRLeaderboardItem;
}());
var Admin = /** @class */ (function () {
    function Admin(tournament_type, num_remote_players, ip_address, port, defaultPlayer) {
        this.tournament_type = tournament_type;
        this.num_remote_players = num_remote_players;
        this.defaultPlayer = defaultPlayer;
        this.num_total_players = this.numTotalPlayersNeeded();
        this.players = [];
        this.server = net.createServer(function (client) {
            this.players.push(new validation_player_proxy_1.ValidationPlayerProxy(new remote_proxy_player_1.RemoteProxyPlayer(client)));
            console.log(this.players.length);
        }.bind(this));
        console.log(ip_address + " and " + port);
        this.server.listen(port, ip_address);
    }
    Admin.prototype.isWaitingForPlayers = function () {
        return this.players.length < this.num_remote_players;
    };
    Admin.prototype.numTotalPlayersNeeded = function () {
        var totalPlayers = 2;
        while (totalPlayers < this.num_remote_players) {
            totalPlayers *= 2;
        }
        return totalPlayers;
    };
    Admin.prototype.numDefaultPlayersNeeded = function () {
        return this.num_total_players - this.num_remote_players;
    };
    Admin.prototype.addDefaultPlayers = function () {
        for (var i = 0; i < this.numDefaultPlayersNeeded(); i++) {
            this.players.push(new validation_player_proxy_1.ValidationPlayerProxy(new this.defaultPlayer()));
        }
    };
    Admin.prototype.registerAllPlayers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _i, i, name_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = [];
                        for (_b in this.players)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        i = _a[_i];
                        return [4 /*yield*/, this.players[i].register()];
                    case 2:
                        name_1 = _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Admin.roundRobinGameList = function (num_total_players) {
        var arr = [];
        for (var i = 0; i < num_total_players - 1; i++) {
            for (var j = i + 1; j < num_total_players; j++) {
                arr.push([i, j]);
            }
        }
        return arr;
    };
    Admin.prototype.runTournament = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.tournament_type == TournamentType.League)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.runRoundRobin()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.runSingleElimination()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // todo, leaderboard, track winners and cheater
    Admin.prototype.runRoundRobin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var robinGameList, unrankedLeaderboard, _a, _b, _i, i, _c, player1idx, player2idx, referee, winner_name, i_1, record, loss2cheater, newLosses, j, cheater_idx, i, rank, name_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        robinGameList = Admin.roundRobinGameList(this.num_total_players);
                        unrankedLeaderboard = this.players.map(function (player) {
                            return new RRLeaderboardItem(player.name);
                        });
                        _a = [];
                        for (_b in robinGameList)
                            _a.push(_b);
                        _i = 0;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        i = _a[_i];
                        _c = robinGameList[i], player1idx = _c[0], player2idx = _c[1];
                        referee = new referee_1.Referee(this.players[player1idx], this.players[player2idx]);
                        return [4 /*yield*/, referee.runGame()];
                    case 2:
                        winner_name = _d.sent();
                        console.log("Game #" + i + " finished between [" + player1idx + ", " + player2idx + "]");
                        console.log(winner_name + " won");
                        if (referee.cheater !== undefined) {
                            if (this.players[player1idx].name === winner_name) {
                                unrankedLeaderboard[player1idx].wins.push(this.players[player2idx].name);
                                unrankedLeaderboard[player2idx].losses.push(this.players[player1idx].name);
                            }
                            else {
                                unrankedLeaderboard[player1idx].losses.push(this.players[player2idx].name);
                                unrankedLeaderboard[player2idx].wins.push(this.players[player1idx].name);
                            }
                            // Handle math for cheater
                            for (i_1 in unrankedLeaderboard) {
                                record = unrankedLeaderboard[i_1];
                                loss2cheater = false;
                                newLosses = [];
                                for (j in record.losses) {
                                    if (referee.cheater === record.losses[j]) {
                                        loss2cheater = true;
                                    }
                                    else {
                                        newLosses.push(record.losses[j]);
                                    }
                                }
                                if (loss2cheater) {
                                    record.wins.push(referee.cheater);
                                    record.losses = newLosses;
                                }
                            }
                            cheater_idx = this.players[player1idx].name === referee.cheater ? player1idx : player2idx;
                            this.players[cheater_idx] = new validation_player_proxy_1.ValidationPlayerProxy(new this.defaultPlayer());
                            // update cheater on record list
                            unrankedLeaderboard[cheater_idx].cheated = true;
                        }
                        else {
                            if (this.players[player1idx].name === winner_name) {
                                unrankedLeaderboard[player1idx].wins.push(this.players[player2idx].name);
                                unrankedLeaderboard[player2idx].losses.push(this.players[player1idx].name);
                            }
                            else {
                                unrankedLeaderboard[player1idx].losses.push(this.players[player2idx].name);
                                unrankedLeaderboard[player2idx].wins.push(this.players[player1idx].name);
                            }
                        }
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        unrankedLeaderboard.sort();
                        console.log(unrankedLeaderboard);
                        for (i = 0; i < unrankedLeaderboard.length; i++) {
                            rank = i + 1;
                            name_2 = unrankedLeaderboard[i].name;
                            console.log(name_2 + " is ranked #" + rank);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Admin.prototype.runSingleElimination = function () {
        return __awaiter(this, void 0, void 0, function () {
            var winners, i, bracket_results, round, next_round_indices, this_round_losers, _a, _b, _i, i, _c, player1idx, player2idx, referee, winner_name, i, rank, player_idxs_for_round, j, playeridx, name_3;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        winners = [];
                        for (i = 0; i < this.players.length; i++) {
                            winners.push(i);
                        }
                        bracket_results = [];
                        round = Admin.generate_pairs(winners);
                        _d.label = 1;
                    case 1:
                        if (!(round.length >= 1)) return [3 /*break*/, 6];
                        next_round_indices = [];
                        this_round_losers = [];
                        _a = [];
                        for (_b in round)
                            _a.push(_b);
                        _i = 0;
                        _d.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        i = _a[_i];
                        _c = round[i], player1idx = _c[0], player2idx = _c[1];
                        console.log("before the failure: ", round[i]);
                        referee = new referee_1.Referee(this.players[player1idx], this.players[player2idx]);
                        return [4 /*yield*/, referee.runGame()];
                    case 3:
                        winner_name = _d.sent();
                        console.log("Game #" + i + " finished between [" + player1idx + ", " + player2idx + "]");
                        console.log(winner_name + " won");
                        if (this.players[player1idx].name === winner_name) {
                            next_round_indices.push(player1idx);
                            if (bracket_results.length && referee.cheater !== undefined) {
                                // push only to the bottom bracket if there is a bottom bracket in the first place
                                bracket_results[bracket_results.length - 1].push(player2idx);
                            }
                            else {
                                //
                                this_round_losers.push(player2idx);
                            }
                        }
                        else {
                            next_round_indices.push(player2idx);
                            if (bracket_results.length && referee.cheater !== undefined) {
                                // push only to the bottom bracket if there is a bottom bracket in the first place
                                bracket_results[bracket_results.length - 1].push(player1idx);
                            }
                            else {
                                this_round_losers.push(player1idx);
                            }
                        }
                        _d.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        // this round is pushed to the overall bracket
                        bracket_results.unshift(this_round_losers);
                        if (next_round_indices.length == 1) {
                            console.log(bracket_results);
                            bracket_results.unshift(next_round_indices);
                            return [3 /*break*/, 6];
                        }
                        round = Admin.generate_pairs(next_round_indices);
                        console.log("Next round to be played");
                        console.log(next_round_indices);
                        console.log(bracket_results);
                        return [3 /*break*/, 1];
                    case 6:
                        console.log("Winner is: ", this.players[round[0][0]].name);
                        for (i = 0; i < bracket_results.length; i++) {
                            rank = i + 1;
                            player_idxs_for_round = bracket_results[i];
                            for (j in player_idxs_for_round) {
                                playeridx = player_idxs_for_round[j];
                                name_3 = this.players[playeridx].name;
                                console.log(name_3 + " is ranked #" + rank);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Admin.generate_pairs = function (player_list_indices) {
        var res = [];
        for (var i = 0; i < player_list_indices.length; i += 2) {
            res.push([player_list_indices[i], player_list_indices[i + 1]]);
        }
        return res;
    };
    return Admin;
}());
exports.Admin = Admin;
var sleep = function sleepForMilliseconds(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
var PARENT_DIR = __dirname + "/../";
var main = function commandLine() {
    return __awaiter(this, void 0, void 0, function () {
        var buffer, parsed, ip_address, port, lib, defaultPlayer, myArgs, n_players, admin, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 data listeners added. Use emitter.setMaxListeners() to increase limit
                    process.setMaxListeners(0);
                    buffer = fs.readFileSync(PARENT_DIR + '/santorini.config', 'utf8');
                    parsed = JSON.parse(buffer.toString());
                    ip_address = parsed["IP"];
                    port = parsed["port"];
                    lib = require(PARENT_DIR + parsed["default-player"]);
                    // e.g., lib = { __esModule: true, Player: [Function: Player] }
                    assert(lib.__esModule, 'Module not found: Check "default-player" in santorini.config');
                    assert('Player' in lib, 'Player class not found: The module should have an exported class named "Player"');
                    defaultPlayer = lib.Player;
                    myArgs = require('minimist')(process.argv.slice(2));
                    // e.g., { _: [], league: 3 }
                    assert(Object.keys(myArgs).length === 2, 'Admin takes two arguments, e.g., node src/admin.js --league 3');
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
                        return [2 /*return*/];
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
                    console.log('Found connecting players');
                    admin.addDefaultPlayers();
                    console.log('Adding additional players... Total number of players = ', admin.players.length);
                    if (admin.players.length != admin.num_total_players) {
                        console.error('Yikes, math should equal math. Count number of players again');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, admin.registerAllPlayers()];
                case 4:
                    _a.sent();
                    for (i in admin.players) {
                        console.log("Constructor Name", admin.players[i].constructor.name);
                        console.log("Valid Proxy Player Name", admin.players[i].name);
                    }
                    admin.runTournament();
                    return [2 /*return*/];
            }
        });
    });
};
main();