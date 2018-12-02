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
var board_1 = require("./board");
var Referee = /** @class */ (function () {
    // player1status: string;// won, loss, still playing
    // player2status: string;// won, loss, still playing
    /**
     *
     * @param {PlayerInterface} player1 Already registered players
     * @param {PlayerInterface} player2 Already registered players
     */
    function Referee(player1, player2) {
        this.boardInstance = new board_1.Board(board_1.Board.createEmptyBoard(5, 5));
        this.player1 = player1;
        this.player2 = player2;
        this.whoseTurnIdx = 0;
        this.winner = undefined; // not set until theres a winner
    }
    Referee.prototype.initializeName = function (name) {
        var player = this.whoseTurnIsIt();
        player.name = name;
        return player.color;
    };
    Referee.prototype.whoseTurnIsIt = function () {
        if (this.whoseTurnIdx % 2 === 0) {
            // maybe set player1 name
            return this.player1;
        }
        else {
            // maybe set player2 name
            return this.player2;
        }
    };
    Referee.prototype.whoseTurnIsItNot = function () {
        if (this.whoseTurnIdx % 2 === 0) {
            return this.player2;
        }
        else {
            return this.player1;
        }
    };
    // todo if invalid placement kick the player
    Referee.prototype.placeWorkers = function (placementList) {
        var _a = placementList[0], w1row = _a[0], w1col = _a[1], _b = placementList[1], w2row = _b[0], w2col = _b[1];
        console.log("Referee says placing for this guy", this.whoseTurnIsIt().color);
        this.boardInstance.setCellWithWorkerByCoords(this.whoseTurnIsIt().color + '1', w1row, w1col);
        this.boardInstance.setCellWithWorkerByCoords(this.whoseTurnIsIt().color + '2', w2row, w2col);
        this.whoseTurnIdx++;
        return this.boardInstance.board;
    };
    Referee.prototype.playTurn = function (workerdirections) {
        var worker = workerdirections[0], directions = workerdirections[1];
        if (worker.slice(0, -1) !== this.whoseTurnIsIt().color) {
            console.error('Wrong player piece move, says Richard the Great');
            return;
        }
        var rulecheck = new rules_1.RuleChecker(this.boardInstance.board, worker, directions);
        var validplay = rulecheck.executeTurn();
        // Game will End
        var didWin = rulecheck.didPlayerWin();
        if (didWin) {
            this.winner = this.whoseTurnIsIt().name;
        }
        else if (validplay == 'no') {
            this.winner = this.whoseTurnIsItNot().name;
        }
        if (this.winner !== undefined) {
            return this.winner;
        }
        // Keep Playing - update our board
        this.boardInstance.board = rulecheck.boardInstance.board;
        this.whoseTurnIdx++;
        return this.boardInstance.board;
    };
    /**
     * doTurn
     * Purpose:
     * - Asks next player to choose a play, and updates the board accordingly.
     * - It will return false
     *
     * Dependencies:
     * - Player.makePlay: request each Player to make a play
     * - RuleChecker.executeTurn: using the declared play, RuleChecker will simulate executing the turn and see if its valid
     * Knowledge:
     * - whoseTurnIdx: Which players turn it is currently;
     * - board: the master Board instance representation to which to compare
     *
     * @return didNotViolate {boolean} true if play was good otherwise false
     */
    Referee.prototype.doTurn = function (command, parsedJson) {
        if (this.winner) {
            // Any messages after deciding on the winner of a game should be ignored.
            return;
        }
        var result = undefined;
        if (command == 'Name') {
            result = this.initializeName(parsedJson);
        }
        else if (command == 'Place') {
            result = this.placeWorkers(parsedJson);
        }
        else if (command == 'Play') {
            result = this.playTurn(parsedJson);
        }
        // increment turn
        //this.whoseTurnIdx++;
        return result;
    };
    /**
     * Plays the game turn by turn; if player makes a move that violates, then it will set the status
     * for both players accordingly
     *
     * Dependencies:
     * - Referee.doTurn
     *
     * Knowledge:
     * - player1status: if player1 won or lost, or still playing
     * - player2status: if player2 won or lost, or still playing
     *
     */
    Referee.prototype.runGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            var placements1, placements2, curr_player, play, new_board;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.player1.reset();
                        this.player2.reset();
                        return [4 /*yield*/, this.player1.placeWorkers('blue', this.boardInstance.board)];
                    case 1:
                        placements1 = _a.sent();
                        this.placeWorkers(placements1);
                        return [4 /*yield*/, this.player2.placeWorkers('white', this.boardInstance.board)];
                    case 2:
                        placements2 = _a.sent();
                        this.placeWorkers(placements2);
                        _a.label = 3;
                    case 3:
                        if (!(this.winner === undefined)) return [3 /*break*/, 5];
                        console.log("turn: " + this.whoseTurnIdx);
                        curr_player = this.whoseTurnIsIt();
                        return [4 /*yield*/, curr_player.play(this.boardInstance.board)];
                    case 4:
                        play = _a.sent();
                        console.log(play);
                        new_board = this.playTurn(play);
                        return [3 /*break*/, 3];
                    case 5: return [2 /*return*/, this.winner];
                }
            });
        });
    };
    /** Checks if player has won
     *
     * Knowledge:
     * - player1status: if player1 won or lost, or still playing
     * - player2status: if player2 won or lost, or still playing
     *
     * @param {string} playerColor
     * @return {string} won, lost, or still playing
     */
    Referee.prototype.status = function (playerColor) {
    };
    return Referee;
}());
exports.Referee = Referee;
