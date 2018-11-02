const Board = require('../src/board').Board;
const RuleChecker = require('../src/rules').RuleChecker;
const expect = require('chai').expect;

// create input test board
let inputBoard = Board.createEmptyBoard(5, 5);
inputBoard[0][0] = [0, 'blue1'];
inputBoard[3][3] = [2, 'blue2'];
inputBoard[0][4] = [1, 'white1'];
inputBoard[4][4] = [3, 'white2'];

inputBoard[0][1] = 3; // blue1 cant move here
inputBoard[1][0] = 4; // shouldnt be able to build here

inputBoard[0][3] = 2;
inputBoard[3][4] = 4; // white2 shouldn't be able to climb up here

inputBoard[2][3] = 3; // blue2 should be able to move here and win
console.log('RuleChecker -- Testing Board');
console.table(inputBoard);

const deepCloneInputBoard = function createDeepCloneOfBoard() {
  return JSON.parse(JSON.stringify(inputBoard));
};

/**
 * TESTING MOVE ONLY AND WIN
 */
describe('RuleChecker -- Testing Move Only', () => {
  it('blue1 tries to move to [0, 1] where it would win but cant -- invalid', function () {
    let ruleChecker = new RuleChecker(deepCloneInputBoard(), 'blue1', ['E']);
    expect(ruleChecker.executeTurn()).to.equal('no');
  });

  it('blue2 moves to [2, 3] and wins -- valid', function () {
    let ruleChecker = new RuleChecker(deepCloneInputBoard(), 'blue2', ['N']);
    expect(ruleChecker.executeTurn()).to.equal('yes');
  });
});


/**
 * TESTING MOVE AND BUILD WHERE MOVE IS VALID, BUILD IS NOT
 */
describe('RuleChecker -- Testing Valid Move, Invalid Build', () => {
  it('blue2 can move S, but cant build E since white 2 is there -- invalid', function () {
    let ruleChecker = new RuleChecker(deepCloneInputBoard(), 'blue2', ['S', 'E']);
    expect(ruleChecker.executeTurn()).to.equal('no');
  });

  it('blue1 can move SE, but cant build W because it has a cap -- invalid', function () {
    let ruleChecker = new RuleChecker(deepCloneInputBoard(), 'blue1', ['SE', 'W']);
    expect(ruleChecker.executeTurn()).to.equal('no');
  });

  it('white1 can move W, but cant build N because out of bounds -- invalid', function () {
    let ruleChecker = new RuleChecker(deepCloneInputBoard(), 'white1', ['W', 'N']);
    expect(ruleChecker.executeTurn()).to.equal('no');
  });
});

/**
 * TESTING MOVE AND BUILD, BUT MOVE RESULTS IN STANDING ON TOWER 3 AND THIS INVALID BUILD
 */
describe('RuleChecker -- Testing Valid Move, and Valid Build, but Move should result in win', () => {
  it('blue1 tries to move and build, but would have won after moving -- invalid', function () {
    let ruleChecker = new RuleChecker([
      [0, 0, 0, 0, 0],
      [0, 2, 3, 2, 0],
      [0, [0, "blue2"], [2, "blue1"], [0, "white1"], 0],
      [0, 2, [0, "white2"], 2, 0],
      [0, 0, 0, 0, 0]
    ], 'blue1', ['N', 'N']);

    expect(ruleChecker.executeTurn()).to.equal('no');
  });

  it('white2 tries to move and build, but would have won after moving -- invalid', function () {
    let ruleChecker = new RuleChecker([
        [2, 2, 3, 4, 4],
        [2, [2, "blue1"], 3, 4, 4],
        [3, 4, 3, 4, 4],
        [[2, "white2"], [3, "blue2"], 3, 3, 4],
        [2, 0, [1, "white1"], 3, 4]
      ],
      'white2', ['N', 'N']);

    expect(ruleChecker.executeTurn()).to.equal('no');
  });

  it('white1 tries to move and build, but would have won after moving -- invalid', function () {
    let ruleChecker = new RuleChecker([
        [0,[0,"blue1"],0,0,0],
        [0,[2,"blue2"],0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,3,[2,"white1"],[1,"white2"]]
    ],
      'white1', ['W', 'N']);

    expect(ruleChecker.executeTurn()).to.equal('no');
  });
});


/**
 * TESTING MOVE AND BUILD WHERE MOVE IS NOT VALID, BUILD DOESNT MATTER
 */
describe('RuleChecker -- Testing Invalid Move, Any Build', () => {
  it('blue2 cant move SE even though building W after is valid -- invalid', function () {
    let ruleChecker = new RuleChecker(deepCloneInputBoard(), 'blue2', ['SE', 'W']);
    expect(ruleChecker.executeTurn()).to.equal('no');
  });

  it('blue1 cant move S -- invalid', function () {
    let ruleChecker = new RuleChecker(deepCloneInputBoard(), 'blue1', ['S', 'W']);
    expect(ruleChecker.executeTurn()).to.equal('no');
  });

  it('blue1 cant move N because its outside of the board -- invalid', function () {
    let ruleChecker = new RuleChecker(deepCloneInputBoard(), 'blue1', ['N', 'W']);
    expect(ruleChecker.executeTurn()).to.equal('no');
  });
});


/**
 * TESTING MOVE AND BUILD WHERE MOVE AND BUILD VALID
 */
describe('RuleChecker -- Testing Valid Move, Valid Build', () => {
  it('blue1 moves SE and build N to 4 -- valid', function () {
    let ruleChecker = new RuleChecker(deepCloneInputBoard(), 'blue1', ['SE', 'N']);
    expect(ruleChecker.executeTurn()).to.equal('yes');
  });

  it('blue2 moves N to winning tower, but also decided to build W -- invalid', function () {
    let ruleChecker = new RuleChecker(deepCloneInputBoard(), 'blue2', ['N', 'W']);
    expect(ruleChecker.executeTurn()).to.equal('no');
  });
});