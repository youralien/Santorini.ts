const Board = require('../src/board').Board;
const Player = require('../src/player').Player;
const expect = require('chai').expect;

// create input test boardInstance
let inputBoard = Board.createEmptyBoard(5, 5);
for (var i in inputBoard) {
  for (var j in inputBoard[i]) {
    var min=0;
    var max=4;
    var random =Math.floor(Math.random() * (+max - +min)) + +min;

    inputBoard[i][j] = random;
  }
}
inputBoard[0][0] = [0, 'blue1'];
inputBoard[3][3] = [2, 'blue2'];
inputBoard[0][4] = [1, 'white1'];
inputBoard[4][4] = [2, 'white2'];

inputBoard[0][1] = 3; // blue1 cant move here
inputBoard[1][0] = 4; // shouldnt be able to build here

inputBoard[0][3] = 2;
inputBoard[3][4] = 4; // white2 shouldn't be able to climb up here
inputBoard[4][3] = 3; // white2 shouldn't be able to climb up here

inputBoard[2][3] = 3; // blue2 should be able to move here and win
console.log('Player -- Testing Board');
console.log(JSON.stringify(inputBoard))
console.table(inputBoard);

const deepCloneInputBoard = function createDeepCloneOfBoard() {
  return JSON.parse(JSON.stringify(inputBoard));
};


/**
 * TESTING MOVE AND BUILD WHERE MOVE AND BUILD VALID
 */
describe('Player -- Testing Placement of Workers', () => {
  it('empty board, so place at top two corners', function () {
    let inputBoard = Board.createEmptyBoard(5, 5);

    let playerInstance = new Player('white', inputBoard);
    expect(playerInstance.placeWorkers()).to.deep.equal([[0, 0], [0, 4]]);
  });

  it('blue is at top half', function () {
    let inputBoard = Board.createEmptyBoard(5, 5);
    inputBoard[0][0] = [0, 'blue1'];
    inputBoard[0][4] = [0, 'blue2'];

    let playerInstance = new Player('white', inputBoard);
    expect(playerInstance.placeWorkers()).to.deep.equal([[4, 4], [4, 0]]);
  });

  it('blue is at bottom half', function () {
    let inputBoard = Board.createEmptyBoard(5, 5);
    inputBoard[4][0] = [0, 'blue1'];
    inputBoard[4][4] = [0, 'blue2'];

    let playerInstance = new Player('white', inputBoard);
    expect(playerInstance.placeWorkers()).to.deep.equal([[0, 0], [0, 4]]);
  });

  it('blue is at left half', function () {
    let inputBoard = Board.createEmptyBoard(5, 5);
    inputBoard[0][0] = [0, 'blue1'];
    inputBoard[4][0] = [0, 'blue2'];

    let playerInstance = new Player('white', inputBoard);
    expect(playerInstance.placeWorkers()).to.deep.equal([[0, 4], [4, 4]]);
  });

  it('blue is at right half', function () {
    let inputBoard = Board.createEmptyBoard(5, 5);
    inputBoard[0][4] = [0, 'blue1'];
    inputBoard[4][4] = [0, 'blue2'];

    let playerInstance = new Player('white', inputBoard);
    expect(playerInstance.placeWorkers()).to.deep.equal([[0, 0], [4, 0]]);
  });

  it('blue is at top-left and bottom-right', function () {
    let inputBoard = Board.createEmptyBoard(5, 5);
    inputBoard[0][0] = [0, 'blue1'];
    inputBoard[4][4] = [0, 'blue2'];

    let playerInstance = new Player('white', inputBoard);
    expect(playerInstance.placeWorkers()).to.deep.equal([[0, 4], [4, 0]]);
  });

  it('blue is at top-right and bottom-left', function () {
    let inputBoard = Board.createEmptyBoard(5, 5);
    inputBoard[0][4] = [0, 'blue1'];
    inputBoard[4][0] = [0, 'blue2'];

    let playerInstance = new Player('white', inputBoard);
    expect(playerInstance.placeWorkers()).to.deep.equal([[0, 0], [4, 4]]);
  });
});


let playerInstance = new Player('white', inputBoard);
console.log(JSON.stringify(playerInstance.determinePlays(new Board(inputBoard))));