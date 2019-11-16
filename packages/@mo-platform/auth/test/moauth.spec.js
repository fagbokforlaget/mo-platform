import chai from 'chai';
import fetch from 'isomorphic-fetch';
import MoAuth from '../src/index.js';
import fetchMock from 'fetch-mock'

fetchMock.post('https://mo-auth.fagbokforlaget.no/_auth/access', { success: true, products: ['world'] })

chai.expect();

const expect = chai.expect;
const fakeStorage = {'getItem': function(key) { return false; }, 'setItem': function(key) { return key; }};
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
      expect(auth.authUrl).to.be.equal('https://mo-auth.fagbokforlaget.no');
    });

    it('should have userFetchUrl set', () => {
      expect(auth.userFetchUrl).to.be.equal('https://mo-auth.fagbokforlaget.no/_auth/user');
    });

    it('should have loginUrl set', () => {
      expect(auth.loginUrl).to.be.equal('https://mo-auth.fagbokforlaget.no/_auth/login');
    });
  });

  describe('booksyncUser', function () {
    it('should fetchUser from booksync', () => {
      const fakeResponse = {
        objects: [{
          books: ["5782", "4929194219"],
          username: 'someone@ourcompany.com'
        }]
      }

      auth.currentUser = fakeResponse.objects[0];

      return auth.checkToken('?token=token&time=something&tag=1').then( (user) => {
        expect(user.username).to.be.equal('someone@ourcompany.com');
        expect(user.books).to.deep.equal(['5782', '4929194219']);
        auth.currentUser = undefined;
        auth.token = undefined;
      });
    });
  });

  describe('should checkToken and checkAccess', function () {
    it('should find token in query string', () => {
      auth.currentUser = {username: 'abc'}
      return auth.checkToken('?token=token&time=something&tag=1').then( (user) => {
        expect(user.username).to.be.equal('abc');
        expect(auth.token).to.be.equal('token');
        auth.currentUser = undefined;
        auth.token = undefined;
      });
    });

    it('should find access_token in query string', () => {
      auth.currentUser = {username: 'abc'}
      return auth.checkToken('?access_token=accessToken&time=something&tag=1').then( (user) => {
        expect(user.username).to.be.equal('abc');
        expect(auth.token).to.be.equal('accessToken');
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

    it('should NOT resolve promize if token is missing', async () => {
      auth.currentUser = {username: 'abc'}
      try {
        const user = await auth.checkToken('?');
        expect(user).to.be.equal(undefined);
      }
      catch (err) {
        expect(err.message).to.be.equal('access token not found');
      }
    });

    it('should check access', async () => {
      auth.currentUser = {username: 'bac'};
      const user = await auth.checkToken('?token=something2');
      const resp = await auth.checkAccess('hello');

	    expect(auth.token).to.be.equal('something2');
      expect(resp.products.includes('product1'));

      try {
        const resp2 = await auth.checkAccess(['product1', 'product2']);
        expect(resp2.products.includes('product1')).to.be.equal(false);
        expect(resp2.products.includes('product2'));
      }
      catch (err) {
        expect(err.message).to.be.equal('This user does not have access to this product');
      }
    });

    it('should check access with hash', async () => {
      const user = await auth.checkToken('#/path?something=value&token=hash');
      expect(auth.token).to.be.equal('hash');
    });

  });
});

describe('passing values through constructor', function () {
  it('should use passed values', () => {
    const auth2 = new MoAuth({'authUrl': 'https://someurl.com', 'userFetchUrl': 'https://someurl.com/page?=param', 'storage': fakeStorage});

    expect(auth2.authUrl).to.be.equal('https://someurl.com');
    expect(auth2.userFetchUrl).to.be.equal('https://someurl.com/page?=param');
  });
});
