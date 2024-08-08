import chai from 'chai';
import fetchMock from 'fetch-mock';
import sinon from 'sinon';
import MoAuth from '../src/index.js';

fetchMock.post('https://mo-auth.fagbokforlaget.no/_auth/access', { success: true, products: ['world'] })
fetchMock.post('https://someurl.com/refresh_token', { success: true, idToken: 'newToken' })
fetchMock.post('https://someurl.com/refresh_token2', { success: false })

chai.expect();

const expect = chai.expect;
const fakeStorage = {'getItem': function(key) { return false; }, 'setItem': function(key) { return key; }};
const nonExpiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.Gfx6VO9tcxwk6xqx9yYzSfebfeakZp5JYIgP_edcw_A'
const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjoxNTE2MjM5MDIyfQ.E9bQ6QAil4HpH825QC5PtjNGEDQTtMpcj0SO2W8vmag'
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
    before(function () {
      this.jsdom = require('jsdom-global')()
    })
    
    after(function () {
      this.jsdom()
    })

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

    it('should NOT resolve promize if token is expired and the refresh token is failed', async () => {
      const auth = new MoAuth({'refreshTokenUrl': 'https://someurl.com/refresh_token2', 'storage': fakeStorage})
      auth.currentUser = {username: 'abc'}

      try {
        const user = await auth.checkToken(expiredToken);
        expect(user).to.be.equal(undefined);
      }
      catch (err) {
        expect(err.message).to.be.equal('access token not found');
      }
    });

    it('should check access', async () => {
      auth.currentUser = {username: 'bac'};
      const user = await auth.checkToken(`?token=${nonExpiredToken}`);
      const resp = await auth.checkAccess('hello');

	    expect(auth.token).to.be.equal(nonExpiredToken);
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

    it('should check access even the token is expired with a refreshed token', async () => {
      this.clock = sinon.useFakeTimers();
      this.clock.tick(1);
      const auth = new MoAuth({'refreshTokenUrl': 'https://someurl.com/refresh_token', 'storage': fakeStorage})

      auth.currentUser = {username: 'bac'};
      const user = await auth.checkToken(`?token=${expiredToken}`);
      const resp = await auth.checkAccess('hello');

	    expect(auth.token).to.be.equal(expiredToken);
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
    const auth2 = new MoAuth({'authUrl': 'https://someurl.com', 'userFetchUrl': 'https://someurl.com/page?=param', 'refreshTokenUrl': 'https://someurl.com/refresh_token', 'storage': fakeStorage});

    expect(auth2.authUrl).to.be.equal('https://someurl.com');
    expect(auth2.userFetchUrl).to.be.equal('https://someurl.com/page?=param');
    expect(auth2.refreshTokenUrl).to.be.equal('https://someurl.com/refresh_token');
  });
  
  it('should emit accessTokenUpdated event with new token', () => {
    this.clock = sinon.useFakeTimers();
    const auth = new MoAuth({'refreshTokenUrl': 'https://someurl.com/refresh_token', 'storage': fakeStorage})
    auth.EventEmitter.on('accessTokenUpdated', (newAccessToken) => {
      expect(newAccessToken).to.be.equal('newToken')
      this.clock = sinon.restore()
    })
    auth.refreshTokenTimer(1).then((token) => {
      expect(token).to.be.equal('newToken')
    })
    this.clock.tick(1);
  });

  it('should throw failed failed message when token is not successfully returned from the refresh token endpoint', async () => {
    const auth = new MoAuth({'refreshTokenUrl': 'https://someurl.com/refresh_token2', 'storage': fakeStorage})
    this.clock = sinon.useFakeTimers();

    auth.refreshTokenTimer(1).catch((error) => {
      expect(error.message).to.be.equal('Failed to refresh the token')
    });
    this.clock.tick(1)
  });
});
