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
var main_1 = require("./main");
var RemoteProxyPlayer = /** @class */ (function () {
    function RemoteProxyPlayer(socket) {
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
    RemoteProxyPlayer.prototype.progressTurn = function (commandInput) {
        return __awaiter(this, void 0, void 0, function () {
            var command, res, color, board, board, name_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = commandInput[0];
                        res = undefined;
                        if (!(command == 'Register')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.register()];
                    case 1:
                        res = _a.sent();
                        return [3 /*break*/, 9];
                    case 2:
                        if (!(command == 'Place')) return [3 /*break*/, 4];
                        color = commandInput[1];
                        board = commandInput[2];
                        return [4 /*yield*/, this.placeWorkers(color, board)];
                    case 3:
                        res = _a.sent();
                        return [3 /*break*/, 9];
                    case 4:
                        if (!(command == 'Play')) return [3 /*break*/, 6];
                        board = commandInput[1];
                        return [4 /*yield*/, this.play(board)];
                    case 5:
                        res = _a.sent();
                        return [3 /*break*/, 9];
                    case 6:
                        if (!(command == 'Game Over')) return [3 /*break*/, 8];
                        name_1 = commandInput[1];
                        return [4 /*yield*/, this.gameOver(name_1)];
                    case 7:
                        res = _a.sent();
                        return [3 /*break*/, 9];
                    case 8: 
                    // if its not one of the interfaces, just return and dont progress the turn successfully
                    return [2 /*return*/];
                    case 9:
                        this.turn++;
                        return [2 /*return*/, res];
                }
            });
        });
    };
    RemoteProxyPlayer.prototype.receive = function () {
        return __awaiter(this, void 0, void 0, function () {
            var currReadString, res;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currReadString = '';
                        this.client.on('data', function (data) {
                            var input = data.toString('utf-8');
                            // add new input to current read in string (handling valid JSON across multiple lines)
                            currReadString += input;
                            // determine if JSON is valid
                            var isValidResponse = main_1.maybeValidJson(currReadString);
                            if (isValidResponse !== undefined) {
                                // clear current read string and augment the valid, parsed JSON
                                currReadString = '';
                                // write response to 'mailbox' that stores results of remote call
                                _this.currRes = isValidResponse;
                            }
                        });
                        _a.label = 1;
                    case 1:
                        if (!(this.currRes === undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.sleep(1000)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        res = this.currRes;
                        // reset the mailbox
                        this.currRes = undefined;
                        return [2 /*return*/, res];
                }
            });
        });
    };
    RemoteProxyPlayer.prototype.sleep = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    RemoteProxyPlayer.prototype.commandsOutOfSequence = function () {
        return "Santorini is broken! Too many tourists in such a small place...";
    };
    RemoteProxyPlayer.prototype.register = function () {
        return __awaiter(this, void 0, void 0, function () {
            var commandAndArgs, ans;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.turn !== 0) {
                            return [2 /*return*/, this.commandsOutOfSequence()];
                        }
                        commandAndArgs = ["Register"];
                        this.client.write(JSON.stringify(commandAndArgs));
                        return [4 /*yield*/, this.receive()];
                    case 1:
                        ans = _a.sent();
                        return [2 /*return*/, ans];
                }
            });
        });
    };
    RemoteProxyPlayer.prototype.placeWorkers = function (color, board) {
        return __awaiter(this, void 0, void 0, function () {
            var commandAndArgs, ans;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.turn != 1) {
                            return [2 /*return*/, this.commandsOutOfSequence()];
                        }
                        commandAndArgs = ["Place", color, board];
                        this.client.write(JSON.stringify(commandAndArgs));
                        return [4 /*yield*/, this.receive()];
                    case 1:
                        ans = _a.sent();
                        return [2 /*return*/, ans];
                }
            });
        });
    };
    RemoteProxyPlayer.prototype.play = function (board) {
        return __awaiter(this, void 0, void 0, function () {
            var commandAndArgs, ans;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.turn < 1) {
                            return [2 /*return*/, this.commandsOutOfSequence()];
                        }
                        commandAndArgs = ["Play", board];
                        this.client.write(JSON.stringify(commandAndArgs));
                        return [4 /*yield*/, this.receive()];
                    case 1:
                        ans = _a.sent();
                        return [2 /*return*/, ans];
                }
            });
        });
    };
    /*
     * todo
     * define interface
     */
    RemoteProxyPlayer.prototype.playOptionsNonLosing = function (board) {
        if (this.turn < 1) {
            return this.commandsOutOfSequence();
        }
        var commandAndArgs = ["Get-Plays", board];
        this.client.write(JSON.stringify(commandAndArgs));
        var ans = this.receive();
        return ans;
    };
    RemoteProxyPlayer.prototype.gameOver = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var commandAndArgs, ans;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        commandAndArgs = ["Game Over", name];
                        this.client.write(JSON.stringify(commandAndArgs));
                        return [4 /*yield*/, this.receive()];
                    case 1:
                        ans = _a.sent();
                        return [2 /*return*/, ans];
                }
            });
        });
    };
    return RemoteProxyPlayer;
}());
exports.RemoteProxyPlayer = RemoteProxyPlayer;
