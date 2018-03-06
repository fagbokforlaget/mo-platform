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

  describe('default vaules should be set', function () {
    it('should have authUrl set', () => {
      expect(auth.authUrl).to.be.equal('https://moauth.fagbokforlaget.no');
    });

    it('should have userFetchUrl set', () => {
      expect(auth.userFetchUrl).to.be.equal('https://moauth.fagbokforlaget.no/_auth/user?token=');
    });

    it('should have loginUrl set', () => {
      expect(auth.loginUrl).to.be.equal('https://moauth.fagbokforlaget.no/_auth/login');
    });
  });

  describe('should checkToken', function () {
    it('should find token in query string', () => {
      auth.currentUser = {username: 'abc'}
      return auth.checkToken('?token=token&time=something&tag=1').then( (user) => {
        expect(user.username).to.be.equal('abc');
        expect(auth.token).to.be.equal('token');
        auth.currentUser = undefined;
        auth.token = undefined;
      });
    });

    it('should NOT find token in query string', () => {
      return auth.checkToken('#open?time=something&tag=1').then( (user) => {
      }).catch( (err) => {
        expect(err.message).to.be.equal('access token not found');
      });
    });
  });
});
