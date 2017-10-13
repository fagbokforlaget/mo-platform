var request = require('superagent');

export default class Authentication {
  constructor(opts = {}) {
    let {authUrl, clientId, storage} = opts;

    this.authUrl = authUrl || 'https://moauth.fagbokforlaget.no';
    this.currentUser = undefined;
    this.token = undefined;
    this.clientId = clientId;
    this.storage = storage || window.localStorage;
  }

  loginUrl(redirectUrl, scope = undefined) {
    return this.authUrl + '/_auth/login?client_id=' + (this.clientId || 'generic') + '&redirect_url=' + redirectUrl + '&scope=' + (scope || 'dbok');
  }

  _parseQueryString(loc) {
    var urlParams,
      match,
      pl = /\+/g,
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); },
      query = loc.substring(1);

    urlParams = {};

    while (1) {
      match = search.exec(query);
      if (!match) {
        break;
      }
      urlParams[decode(match[1])] = decode(match[2]);
    }
    return urlParams;
  }

  authorize(obj = {}) {
    let {redirectUrl, scope} = obj;

    window.location = this.loginUrl(redirectUrl || window.location, scope);
  }

  getUser() {
    return this.currentUser || JSON.parse(this.storage.getItem('user')) || undefined;
  }

  checkToken(loc = window.location.search) {
    let params = this._parseQueryString(loc);
    let self = this;

    return new Promise((resolve, reject) => {
      if (self.isAuthenticated()) {
        resolve(self.getUser());
      }

      if (params.token) {
        self.token = params.token;
        if (window) {
          window.history.replaceState({}, '', self.redirectUrl);
        }
        self.fetchUser(this.authUrl + '/_auth/user?token=' + self.token)
        .then((user) => {
          resolve(user);
        })
        .catch((err) => {
          reject(err);
        });
      } else {
        reject(new Error('access token not found'));
      }
    });
  }

  fetchUser(url) {
    let resp;
    let self = this;

    return new Promise((resolve, reject) => {
      request('GET', url)
      .end(function (error, response) {
        if (!error && response.statusCode === 200 && response.body) {
          resp = response.body;
          self.storage.setItem('user', JSON.stringify(resp.user));
          resolve(resp.user);
        } else {
          reject(new Error('authentication failed:' + error));
        }
      });
    });
  }

  logout(url) {
    this.storage.removeItem('user');
    if (url) {
      window.location = url;
    }
  }

  isAuthenticated() {
    let user = this.getUser();

    if (user) {
      return true;
    }
    return false;
  }
}
