var request = require('superagent');

export default class Authentication {
  constructor(opts = {}) {
    let {authUrl, clientId, storage, loginUrl, userFetchUrl} = opts;

    this.authUrl = authUrl || 'https://moauth.fagbokforlaget.no';
    this.currentUser = undefined;
    this.token = undefined;
    this.clientId = clientId;
    this.storage = storage || window.localStorage;
    this.loginUrl = loginUrl || this.authUrl + '/_auth/login';
    this.userFetchUrl = userFetchUrl || this.authUrl + '/_auth/user?token=';
  }

  _loginUrl(redirectUrl, scope = undefined) {
    if (!this.loginUrl.includes('?')) {
      this.loginUrl += '?';
    }
    return this.loginUrl + '&client_id=' + (this.clientId || 'generic') + '&redirect_url=' + encodeURIComponent(redirectUrl) + '&scope=' + (scope || 'dbok');
  }

  _parseQueryString(loc) {
    let urlParams,
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

    window.location = this._loginUrl(redirectUrl || window.location, scope);
  }

  getUser() {
    return this.currentUser || JSON.parse(this.storage.getItem('user')) || undefined;
  }

  checkToken(loc = window.location.search) {
    let params = this._parseQueryString(loc);
    let self = this;
    self.token = params.token || this.storage.getItem('token') || undefined;

    return new Promise((resolve, reject) => {
      if (self.isAuthenticated()) {
        resolve(self.getUser());
      }

      if (self.token) {
        if (window) {
          window.history.replaceState({}, '', window.location.pathname + window.location.hash || '');
        }
        self.storage.setItem('token', self.token);
        self.fetchUser(this.userFetchUrl + encodeURIComponent(self.token))
        .then((user) => {
          resolve(user);
        })
        .catch((err) => {
          self.storage.removeItem('token');
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
    this.storage.removeItem('token');
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
