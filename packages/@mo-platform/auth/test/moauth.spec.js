import chai from 'chai';
import MoAuth from '../src/index.js';

chai.expect();

const expect = chai.expect;
const fakeStorage = {'getItem': function(key) { return false; }};
let auth;

describe('Given an instance of MoAuth', function () {
  before(function () {
    auth = new MoAuth({'storage': fakeStorage});
  });
  describe('isAuthenticated', function () {
    it('should return false', () => {
      expect(auth.isAuthenticated()).to.be.equal(false);
    });
  });
});
