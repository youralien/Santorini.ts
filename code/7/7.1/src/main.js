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
// import necessary packages and modules
var player_1 = require("./player");
var readline = require("readline");
var net = require('net');
/**
 * Checks if inputs passed from parsed JSON is valid for Santorini.
 * ["Register"]
 * ["Place",Color,Initial-Board],
 * ["Play",Board]
 * ["Game Over",Name],
 * @param obj {Object} parsed, valid JSON from command line input
 */
var isValidInput = function checkValidCommand(obj) {
    // check if array of either length 2 or 3
    return Array.isArray(obj) && (obj.length >= 1 && obj.length <= 3);
};
var playerComponent = function (port, host) {
    var playerInstance = new player_1.Player();
    var server = net.createServer(function (socket) {
        socket.on('data', function (data) {
            var textChunk = data.toString('utf8');
            // console.log(textChunk);
            var maybeValidResponse = exports.maybeValidJson(textChunk);
            if (maybeValidResponse !== undefined) {
                // clear current read string and augment the valid, parsed JSON
                if (isValidInput(maybeValidResponse)) {
                    //      console.log('maybeValidresponse', maybeValidResponse);
                    var outputMessage = undefined;
                    var command = maybeValidResponse[0];
                    if (command === 'Place') {
                        var color = maybeValidResponse[1];
                        var initialBoard = maybeValidResponse[2];
                        outputMessage = playerInstance.placeWorkers(color, initialBoard);
                    }
                    else if (command === 'Play') {
                        var board = maybeValidResponse[1];
                        // TODO: play? or playOptions?
                        outputMessage = playerInstance.playOptionsNonLosing(board);
                    }
                    else if (command === 'Register') {
                        outputMessage = playerInstance.register();
                    }
                    else if (command == 'Game Over') {
                        var name_1 = maybeValidResponse[1];
                        outputMessage = playerInstance.gameOver(name_1);
                    }
                    if (outputMessage !== undefined) {
                        // send output from function call to client
                        //console.log('Writing to socket');
                        socket.write(JSON.stringify(outputMessage));
                    }
                    else {
                        console.error("Returned undefined output for command = " + command);
                    }
                }
            }
        });
    });
    server.listen(port, host);
};
var proxy_test = function (port, host) {
    return __awaiter(this, void 0, void 0, function () {
        var rl, currReadString, playerInstance, queue, did_close, _a, _b, _i, i, maybeValidResponse, outputMessage;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout,
                        terminal: false
                    });
                    currReadString = '';
                    playerInstance = new player_1.RemoteProxyPlayer(host, port);
                    queue = [];
                    rl.on('line', function (input) {
                        // add new input to current read in string (handling valid JSON across multiple lines)
                        currReadString += input;
                        // determine if JSON is valid
                        var maybeValidResponse = exports.maybeValidJson(currReadString);
                        if (maybeValidResponse !== undefined) {
                            // clear current read string and augment the valid, parsed JSON
                            currReadString = '';
                            if (isValidInput(maybeValidResponse)) {
                                queue.push(maybeValidResponse);
                            }
                        }
                    });
                    did_close = false;
                    /**
                     * Detect when input stream is closed.
                     */
                    rl.on('close', function () {
                        did_close = true;
                    });
                    _c.label = 1;
                case 1:
                    if (!!did_close) return [3 /*break*/, 3];
                    return [4 /*yield*/, playerInstance.sleep(1000)];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 1];
                case 3:
                    _a = [];
                    for (_b in queue)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 4;
                case 4:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    i = _a[_i];
                    maybeValidResponse = queue.shift();
                    return [4 /*yield*/, playerInstance.progressTurn(maybeValidResponse)];
                case 5:
                    outputMessage = _c.sent();
                    console.log(JSON.stringify(outputMessage));
                    _c.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    process.exit();
                    return [2 /*return*/];
            }
        });
    });
};
proxy_test(8080, '10.105.131.163');
// playerComponent(8080, '10.105.131.163');
/**
 * Attempts to parse and return valid JSON object from string, returning undefined if it can't.
 * @param inputString {string} string to attempt to find valid JSON in.
 * @return {object} valid JSON object or undefined if failed to parse.
 */
exports.maybeValidJson = function checkIfJsonIsValid(inputString) {
    // attempt to parse JSON
    try {
        return JSON.parse(inputString);
    }
    catch (e) {
        return undefined;
    }
};
