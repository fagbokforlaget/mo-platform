var request = require('superagent');

export default class Authentication {
  constructor(redirectUrl, storage = undefined, authUrl = 'https://moauth.fagbokforlaget.no') {
    this.redirectUrl = redirectUrl;
    this.authUrl = authUrl;
    this.currentUser = undefined;
    this.token = undefined;
    this.storage = storage || window.localStorage;
  }

  get loginUrl() {
    return this.authUrl + '/_auth/login?redirect_url=' + this.redirectUrl;
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

  authorize() {
    window.location = this.loginUrl;
  }

  getUser() {
    return this.currentUser || JSON.parse(this.storage.getItem('user')) || undefined;
  }

  checkToken(loc = window.location.search, callback) {
    var params = this._parseQueryString(loc);

    if (this.isAuthenticated()) {
      callback(null, this.getUser());
      return;
    }

    if (params.token) {
      this.token = params.token;
      window.history.replaceState({}, '', this.redirectUrl);
      this.fetchUser(this.authUrl + '/_auth/user?token=' + this.token, callback);
    } else {
      callback(true, null);
    }
  }

  fetchUser(url, next) {
    let resp;
    let self = this;

    request('GET', url)
    .end(function (error, response) {
      if (!error && response.statusCode === 200 && response.body) {
        resp = response.body;
        self.storage.setItem('user', JSON.stringify(resp.user));
        next(false, resp.user);
      } else {
        next(error, null);
      }
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
