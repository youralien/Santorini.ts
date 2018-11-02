const Board = require('../src/board').Board;
const expect = require('chai').expect;

// create input test board
let inputBoard = Board.createEmptyBoard(5, 5);
inputBoard[0][0] = [0, 'blue1'];
inputBoard[3][3] = [0, 'blue2'];
inputBoard[0][4] = [1, 'white1'];
inputBoard[4][4] = [3, 'white2'];

inputBoard[0][1] = 2;
inputBoard[1][0] = 4; // shouldnt be able to build here

inputBoard[0][3] = 2;
inputBoard[3][4] = 4; // white2 shouldn't be able to climb up here
console.log('Testing Board');
console.table(inputBoard);

/**
 * TESTING NEIGHBORING CELLS
 */
describe('Testing neighboring-cell-exists', () => {
  //instantiate a new game board before each test
  let gameBoard;
  beforeEach(() => {
    gameBoard = new Board(JSON.parse(JSON.stringify(inputBoard)));
  });

  it('blue1 [0, 0] cant have cell N of it', function () {
    expect(gameBoard.neighboringCellExists('blue1', 'N')).to.equal(false);
  });

  it('blue1 [0, 0] has cell S of it', function () {
    expect(gameBoard.neighboringCellExists('blue1', 'S')).to.equal(true);
  });

  it('blue4 is not a valid worker', function () {
    expect(gameBoard.neighboringCellExists('blue4', 'S')).to.be.undefined;
  });
});

/**
 * TESTING GET HEIGHT
 */
describe('Testing get-height', () => {
  //instantiate a new game board before each test
  let gameBoard;
  beforeEach(() => {
    gameBoard = new Board(JSON.parse(JSON.stringify(inputBoard)));
  });

  it('no cell at [-1, 5] is not a valid cell', function () {
    expect(gameBoard.getHeight('white1', 'NE')).to.be.undefined;
  });

  it('2 is E of blue1', function () {
    expect(gameBoard.getHeight('blue1', 'E')).to.equal(2);
  });

  it('[3, white2] is SE of blue2', function () {
    expect(gameBoard.getHeight('blue2', 'SE')).to.equal(3);
  });
});

/**
 * TESTING IS OCCUPIED
 */
describe('Testing is-occupied', () => {
  //instantiate a new game board before each test
  let gameBoard;
  beforeEach(() => {
    gameBoard = new Board(JSON.parse(JSON.stringify(inputBoard)));
  });

  it('no cell at [-1, 5] is not a valid cell', function () {
    expect(gameBoard.isOccupied('white1', 'NE')).to.equal(undefined);
  });

  it('2 is E of blue1 and is thus unoccupied', function () {
    expect(gameBoard.isOccupied('blue1', 'E')).to.equal(false);
  });

  it('[3, white2] is SE of blue2', function () {
    expect(gameBoard.isOccupied('blue2', 'SE')).to.equal(true);
  });
});

/**
 * TESTING BUILD
 */
describe('Testing build', () => {
  //instantiate a new game board before each test
  let gameBoard;
  beforeEach(() => {
    gameBoard = new Board(JSON.parse(JSON.stringify(inputBoard)));
  });

  it('[3, white2] is SE of blue2, so no building should occur', function () {
    expect(gameBoard.build('blue2', 'SE')).to.deep.equal(inputBoard);
  });

  it('4 is S of blue1, so cant build on it', function () {
    expect(gameBoard.build('blue1', 'S')).to.deep.equal(inputBoard);
  });

  it('no cell at [-1, 5] so cant build', function () {
    expect(gameBoard.build('white1', 'NE')).to.deep.equal(inputBoard);
  });

  it('2 is E of blue1, so building should increase it to 3', function () {
    let successfulBuildExpectedOutput = JSON.parse(JSON.stringify(inputBoard));
    successfulBuildExpectedOutput[0][1] = 3;

    expect(gameBoard.build('blue1', 'E')).to.deep.equal(successfulBuildExpectedOutput);
  });
});

/**
 * TESTING MOVE
 */
describe('Testing move', () => {
  //instantiate a new game board before each test
  let gameBoard;
  beforeEach(() => {
    gameBoard = new Board(JSON.parse(JSON.stringify(inputBoard)));
  });

  it('no cell at [-1, 5] so cant move', function () {
    expect(gameBoard.move('white1', 'NE')).to.deep.equal(inputBoard);
  });

  it('2 is E of blue1, but blue1 can only move upto 1 (height diff of 2)', function () {
    expect(gameBoard.move('blue1', 'E')).to.deep.equal(inputBoard);
  });

  it('blue1 can move SE to [1, 1]', function () {
    let successfulMoveExpectedOutput = JSON.parse(JSON.stringify(inputBoard));
    successfulMoveExpectedOutput[1][1] = [0, 'blue1'];
    successfulMoveExpectedOutput[0][0] = 0;

    expect(gameBoard.move('blue1', 'SE')).to.deep.equal(successfulMoveExpectedOutput);
  });

  it('white1 can move W to [0, 3] where height is 2', function () {
    let successfulMoveExpectedOutput = JSON.parse(JSON.stringify(inputBoard));
    successfulMoveExpectedOutput[0][3] = [2, 'white1'];
    successfulMoveExpectedOutput[0][4] = 1;

    expect(gameBoard.move('white1', 'W')).to.deep.equal(successfulMoveExpectedOutput);
  });

  it('white2 cant move NW since blue2 is there', function () {
    expect(gameBoard.move('white2', 'NW')).to.deep.equal(inputBoard);
  });

  it('white2 cant move N because [3, 4] is capped at height 4', function () {
    expect(gameBoard.move('white2', 'N')).to.deep.equal(inputBoard);
  });

  it('white2 can move W because 0 < 4', function () {
    let successfulMoveExpectedOutput = JSON.parse(JSON.stringify(inputBoard));
    successfulMoveExpectedOutput[4][4] = 3;
    successfulMoveExpectedOutput[4][3] = [0, 'white2'];

    expect(gameBoard.move('white2', 'W')).to.deep.equal(successfulMoveExpectedOutput);
  });
});