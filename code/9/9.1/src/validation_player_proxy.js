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
var rules_1 = require("./rules");
var strategy_1 = require("./strategy");
var board_1 = require("./board");
var ValidationPlayerProxy = /** @class */ (function () {
    function ValidationPlayerProxy(wrapped_player) {
        this.wrapped_player = wrapped_player;
        // track what command turn it is, starts on expecting register
        this.turn = 0;
    }
    ValidationPlayerProxy.prototype.commandsOutOfSequence = function () {
        return "Santorini is broken! Too many tourists in such a small place...";
    };
    ValidationPlayerProxy.prototype.register = function () {
        return __awaiter(this, void 0, void 0, function () {
            var name;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.turn !== 0) {
                            return [2 /*return*/, ["turn_error", "register out of sequence, not turn 0. turn = " + this.turn]];
                        }
                        this.turn++;
                        return [4 /*yield*/, this.wrapped_player.register()];
                    case 1:
                        name = _a.sent();
                        this.name = name;
                        return [2 /*return*/, name];
                }
            });
        });
    };
    /**
     * Checks that should happen
     * 1. Board should be a valid board (the right size, no one has won)
     * 2. If its asking me to place white, there shouldn't be white players already on there
     * 3. Should have 0 or 2 players on there
     *
     * @param {string} color
     * @param {any[][]} board
     */
    ValidationPlayerProxy.prototype.placeWorkers = function (color, board) {
        return __awaiter(this, void 0, void 0, function () {
            var size, workers, placement_list, _a, w1row, w1col, _b, w2row, w2col;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.turn != 1) {
                            return [2 /*return*/, ["turn_error", "placeworkers out of sequence, not turn 1. turn = " + this.turn]];
                        }
                        // previous board we are seeing now
                        this.prev_board = new board_1.Board(board);
                        size = 5;
                        this.color = color;
                        workers = this.color == 'blue' ? [] : ['blue1', 'blue2'];
                        // todo check that board is valid
                        // 1. no one has won
                        // 2. If its asking me to place white, there shouldn't be white players already on there
                        if (!board_1.Board.isValidBoard(board, size, workers)) {
                            return [2 /*return*/, ["invalid_board_error", "told to place on invalid board"]];
                        }
                        this.turn++;
                        return [4 /*yield*/, this.wrapped_player.placeWorkers(color, board)];
                    case 1:
                        placement_list = _c.sent();
                        _a = placement_list[0], w1row = _a[0], w1col = _a[1], _b = placement_list[1], w2row = _b[0], w2col = _b[1];
                        this.prev_board.setCellWithWorkerByCoords(color + "1", w1row, w1col);
                        this.prev_board.setCellWithWorkerByCoords(color + "2", w2row, w2col);
                        return [2 /*return*/, placement_list];
                }
            });
        });
    };
    ValidationPlayerProxy.prototype.play = function (board) {
        return __awaiter(this, void 0, void 0, function () {
            var other_player, valid_plays, valid_boards, board_string, contains, i, play, worker, directions, rule_checker;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.turn < 2) {
                            return [2 /*return*/, ["turn_error", "play out of sequence, turn less than 2. turn = " + this.turn]];
                        }
                        console.log("line 77 play of validation_proxy");
                        console.log(board);
                        other_player = this.get_other_player(this.color);
                        valid_plays = strategy_1.Strategy.computeValidPlays(new board_1.Board(board), other_player);
                        console.log(valid_plays);
                        valid_boards = valid_plays.map(function (x) {
                            var targetPlayerBoard = x[0], _a = x[1], targetPlayerWorker = _a[0], targetPlayerDirections = _a[1], targetPlayerDidWin = x[2];
                            return JSON.stringify(targetPlayerBoard.board);
                        });
                        board_string = JSON.stringify(board);
                        contains = false;
                        for (i in valid_boards) {
                            if (valid_boards[i] === board_string) {
                                contains = true;
                            }
                        }
                        if (!contains) {
                            return [2 /*return*/, ["invalid_board_error", "board passed by admin is not one move away from last move"]];
                        }
                        this.turn++;
                        return [4 /*yield*/, this.wrapped_player.play(board)];
                    case 1:
                        play = _a.sent();
                        worker = play[0], directions = play[1];
                        rule_checker = new rules_1.RuleChecker(board, worker, directions);
                        rule_checker.executeTurn();
                        this.prev_board = rule_checker.boardInstance;
                        return [2 /*return*/, play];
                }
            });
        });
    };
    ValidationPlayerProxy.prototype.gameOver = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.turn++;
                        return [4 /*yield*/, this.wrapped_player.gameOver(name)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ValidationPlayerProxy.prototype.reset = function () {
        this.turn = 1;
    };
    ValidationPlayerProxy.prototype.get_other_player = function (color) {
        if (color === "blue") {
            return "white";
        }
        else {
            return "blue";
        }
    };
    return ValidationPlayerProxy;
}());
exports.ValidationPlayerProxy = ValidationPlayerProxy;
exports.Player = ValidationPlayerProxy;
