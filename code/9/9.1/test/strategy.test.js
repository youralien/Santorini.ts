// const Board = require('../src/board').Board;
// const Player = require('../src/basic_player').Player;
// const Stategy = require('../src/strategy').Strategy;
// const expect = require('chai').expect;
//
// const randomEndBoard = function createCloseToEndGame() {
//   // create input test boardInstance
//   var inputBoard = Board.createEmptyBoard(5, 5);
//   for (var i in inputBoard) {
//     for (var j in inputBoard[i]) {
//       var min=0;
//       var max=4;
//       var random =Math.floor(Math.random() * (+max - +min)) + +min;
//
//       inputBoard[i][j] = random;
//     }
//   }
//   inputBoard[0][0] = [0, 'blue1'];
//   inputBoard[3][3] = [2, 'blue2'];
//   inputBoard[0][4] = [1, 'white1'];
//   inputBoard[4][4] = [2, 'white2'];
//
//   inputBoard[0][1] = 3; // blue1 cant move here
//   inputBoard[1][0] = 4; // shouldnt be able to build here
//
//   inputBoard[0][3] = 2;
//   inputBoard[3][4] = 4; // white2 shouldn't be able to climb up here
//   inputBoard[4][3] = 3; // white2 shouldn't be able to climb up here
//
//   inputBoard[2][3] = 3; // blue2 should be able to move here and win
//   console.log('Player -- Random Testing Board');
//   console.log(JSON.stringify(inputBoard));
//   console.table(inputBoard);
//
//   return inputBoard;
// };
//
// const middlePlayerBoard = function createMiddlePlayerBoard() {
//
//   var inputBoard = Board.createEmptyBoard(5, 5);
//
//   inputBoard[2][2] = [0, 'white1']; // middle player
//   inputBoard[0][4] = [0, 'white2'];
//   inputBoard[4][4] = [0, 'blue1'];
//   inputBoard[4][0] = [0, 'blue2'];
//   console.log('Player -- Middle Testing Board');
//   console.log(JSON.stringify(inputBoard));
//   console.table(inputBoard);
//   return inputBoard;
// };
//
//
// const deepCloneInputBoard = function createDeepCloneOfBoard() {
//   return JSON.parse(JSON.stringify(inputBoard));
// };
//
//
// /**
//  * TODO write tests for strategizer
//  */
//
// var inputBoard = middlePlayerBoard();
//
// // let playerInstance = new Player('white', inputBoard);
// // console.log(JSON.stringify(playerInstance.determinePlays(new Board(inputBoard))));
//
// var targetPlayer = 'white';
// var foo = Stategy.computeNonLosingValidBoardsPlaysWins(new Board(inputBoard), targetPlayer);
// console.log('computeNonLosingValidBoardsPlaysWins: ', foo.map(e => {
//   let [targetPlayerBoard, [targetPlayerWorker, targetPlayerDirections], targetPlayerDidWin] = e;
//   return [targetPlayerWorker, targetPlayerDirections];
// }));
// console.log('computeNonLosingValidBoardsPlaysWins.length: ', foo.length);
//
// var richard = Stategy.pickNonLosingPlay(new Board(inputBoard), targetPlayer, 3);
// console.log('pickNonLosingPlay', richard);