const Board = require('../src/board').Board;

const ValidationPlayerProxy = require('../src/validation_player_proxy').ValidationPlayerProxy;
const Player = require('../src/basic_player').Player;
const expect = require('chai').expect;

// // create input test boardInstance
// let inputBoard = Board.createEmptyBoard(5, 5);
// for (var i in inputBoard) {
//   for (var j in inputBoard[i]) {
//     var min=0;
//     var max=4;
//     var random =Math.floor(Math.random() * (+max - +min)) + +min;
//
//     inputBoard[i][j] = random;
//   }
// }
// inputBoard[0][0] = [0, 'blue1'];
// inputBoard[3][3] = [2, 'blue2'];
// inputBoard[0][4] = [1, 'white1'];
// inputBoard[4][4] = [2, 'white2'];
//
// inputBoard[0][1] = 3; // blue1 cant move here
// inputBoard[1][0] = 4; // shouldnt be able to build here
//
// inputBoard[0][3] = 2;
// inputBoard[3][4] = 4; // white2 shouldn't be able to climb up here
// inputBoard[4][3] = 3; // white2 shouldn't be able to climb up here
//
// inputBoard[2][3] = 3; // blue2 should be able to move here and win
// console.log('Player -- Testing Board');
// console.log(JSON.stringify(inputBoard))
// console.table(inputBoard);
//
// const deepCloneInputBoard = function createDeepCloneOfBoard() {
//   return JSON.parse(JSON.stringify(inputBoard));
// };

describe('Validation wrapping Default Player -- Ordering' , function() {


  var cmdError = 'turn_error';
  // var cmdError = ['error', 'some error'];

  var p;
  var testBoard = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
  beforeEach(function() {

    var _p = new Player();
    p = new ValidationPlayerProxy(_p);
  });

  it('should not be able to register twice', async function() {

    await p.register();
    res = await p.register();

    expect(res[0]).to.equal(cmdError);

  });

  it('it should be fail to place twice if NOT reset', async function() {

    await p.register();
    await p.placeWorkers('blue', testBoard);

    // no reset

    // placing on blue a second time is allowed with reset
    res = await p.placeWorkers('blue', testBoard);
    console.log("###################3", res);
    expect(res[0]).to.equal(cmdError);

  });

  it('it should be fail to play WITHOUT placing', async function() {

    await p.register();
    // no place

    res = await p.play(testBoard);
    expect(res[0]).to.equal(cmdError);

  });

});

// describe('Validation wrapped Default Player -- Valid Boards for Place', function() {
//
//   var cmdError = 'turn_error';
//   // var cmdError = ['error', 'some error'];
//
//   var p;
//   // var testBoard = [[[0, 'blue1'],[0, 'blue2'],0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
//   // var testBoard1 = [[[0, 'blue1'],[0, 'blue2'],0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
//   beforeEach(async function() {
//
//     var _p = new Player();
//     p = new ValidationPlayerProxy(_p);
//     await p.register();
//
//   });
//
//   it('should not be able to place with same color', async function() {
//
//     // board that has blue
//     var testBoard = [[[0, 'blue1'],[0, 'blue2'],0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
//     res = await p.place('blue', testBoard);
//     expect(res[0]).to.equal(cmdError);
//
//   });
//
// });

describe('Validation wrapped Default Player -- N+1 valid board', function() {

  var cmdError = "Santorini is broken! Too many tourists in such a small place...";
  // var cmdError = ['error', 'some error'];

  var p;
  var testBoard = [[[0, 'blue1'],[0, 'blue2'],0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
  var prevBoard;
  beforeEach(async function() {

    var _p = new Player();
    p = new ValidationPlayerProxy(_p);
    await p.register();
    // blue has already placed

    console.table(testBoard);
    await p.placeWorkers('white', testBoard);

    // VERY USEFUL TO DEEP COPY - aliasing errors made us cry
    prevBoard = JSON.parse(JSON.stringify(p.prev_board));
  });

  it('VALID play on the start board (4 workers, 0 height)', async function() {

    // console.log('PREV BOARD');
    console.table(prevBoard.board);

    // blue1 moved south, and built north
    prevBoard.board[1][0] = [0, 'blue1'];
    prevBoard.board[0][0] = 1;

    // console.log('BEFORE play');
    console.table(prevBoard.board);

    let res = await p.play(prevBoard.board);

    // console.log("AFTER play", res);

    expect(res[0]).to.not.equal('invalid_board_error');

  });

  it('INVALID play on start board', async function() {
    // console.log('PREV BOARD');
    console.table(prevBoard.board);

    // blue1 moved south, and built north
    prevBoard.board[1][0] = [0, 'blue1'];
    // building to height 2 is cheating
    prevBoard.board[0][0] = 2;

    // console.log('BEFORE play');
    console.table(prevBoard.board);

    let res = await p.play(prevBoard.board);

    // console.log("AFTER play", res);

    expect(res[0]).to.equal('invalid_board_error');

  })

});

describe('Validation wrapping Default Player -- Resetting' , function() {


  var cmdError = "turn_error";

  var p;
  var testBoard = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];

  beforeEach(function() {

    var _p = new Player();
    p = new ValidationPlayerProxy(_p);
  });

  it('it should be able to place twice if reset', async function() {

    await p.register();
    await p.placeWorkers('blue', testBoard);

    await p.reset();

    // placing on blue a second time is allowed with reset
    res = await p.placeWorkers('blue', testBoard);
    // console.log(res);
    // expect(typeof(res)).to.not.equal(Array);
    // expect(res[0]).to.not.equal(cmdError);

  });


});


describe('ValidationPlayerProxy helper methods', function() {

  it('Other player color', async function() {

    var _p = new Player();
    p = new ValidationPlayerProxy(_p);
    let color1 = 'blue';
    res = p.get_other_player(color1);
    expect(res).to.equal('white');

  });

});