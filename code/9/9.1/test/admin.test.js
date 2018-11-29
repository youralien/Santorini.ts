// import {Admin} from "../ts/admin";
const expect = require('chai').expect;
const Admin = require('../src/admin').Admin;

describe('Admin round robin pairings', function() {
  it('rr of 4', function () {
    var players = [1, 2, 3, 4];
    var robin = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];

    expect(Admin.roundRobinGameList(players.length)).to.deep.equal(robin);
  });

  it('rr of 2', function () {
    var players = [1, 2];
    var robin = [[0, 1]];

    expect(Admin.roundRobinGameList(players.length)).to.deep.equal(robin);
  });

  it('rr of 8', function () {
    var players = [1, 2, 3, 4, 5, 6, 7, 8];
    var robin = [ [ 0, 1 ],
      [ 0, 2 ],
      [ 0, 3 ],
      [ 0, 4 ],
      [ 0, 5 ],
      [ 0, 6 ],
      [ 0, 7 ],
      [ 1, 2 ],
      [ 1, 3 ],
      [ 1, 4 ],
      [ 1, 5 ],
      [ 1, 6 ],
      [ 1, 7 ],
      [ 2, 3 ],
      [ 2, 4 ],
      [ 2, 5 ],
      [ 2, 6 ],
      [ 2, 7 ],
      [ 3, 4 ],
      [ 3, 5 ],
      [ 3, 6 ],
      [ 3, 7 ],
      [ 4, 5 ],
      [ 4, 6 ],
      [ 4, 7 ],
      [ 5, 6 ],
      [ 5, 7 ],
      [ 6, 7 ] ];

    expect(Admin.roundRobinGameList(players.length)).to.deep.equal(robin);
  });

});

