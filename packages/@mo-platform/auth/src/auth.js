/* eslint-disable no-async-promise-executor */
import EventEmitter from './eventemitter';
import jwtDecode from "./jwt-decode";

export default class Authentication {
  constructor (opts = {}) {
    const { authUrl, clientId, storage, loginUrl, logoutUrl, userFetchUrl, accessCheckUrl, refreshTokenUrl } = opts

    this.authUrl = authUrl || 'https://mo-auth.fagbokforlaget.no'
    this.currentUser = undefined
    this.token = undefined
    this.clientId = clientId
    this.storage = storage || window.localStorage
    this.loginUrl = loginUrl || this.authUrl + '/_auth/login'
    this.logoutUrl = logoutUrl
    this.userFetchUrl = userFetchUrl || this.authUrl + '/_auth/user'
    this.accessCheckUrl = accessCheckUrl || this.authUrl + '/_auth/access'
    this.refreshTokenUrl = refreshTokenUrl || ''
    this.EventEmitter = new EventEmitter()
  }

  _loginUrl (redirectUrl, scope = undefined, namespaceConfigId = undefined, namespaceId = undefined) {
    if (!this.loginUrl.includes('?')) {
      this.loginUrl += '?'
    }
    
     this.loginUrl += '&client_id=' + (this.clientId || 'generic') + '&redirect_url=' + encodeURIComponent(redirectUrl) + '&scope=' + (scope || 'dbok')
     if(this.configId) this.loginUrl += `&config_id=${namespaceConfigId}`
     if(this.namespaceId) this.loginUrl += `&namespace_id=${namespaceId}`
     return this.loginUrl;
  }

  _parseQueryString (loc) {
    const pl = /\+/g
    const search = /([^&=]+)=?([^&]*)/g
    const decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')) }
    const urlParams = {}
    let query = loc.substring(1)

    if (/\?/.test(query)) {
      query = query.split('?')[1]
    }

    while (1) {
      const match = search.exec(query)

      if (!match) {
        break
      }
      urlParams[decode(match[1])] = decode(match[2])
    }

    return urlParams
  }

  authorize (obj = {}) {
    const { redirectUrl, scope, namespaceConfigId, namespaceId } = obj

    window.location = this._loginUrl(redirectUrl || window.location, scope, namespaceConfigId, namespaceId)
  }

  async refreshTokenTimer (refreshTime = 15 * 60000) {
    this.silentRefresh = setInterval(async () => {
      return new Promise(async (resolve, reject) => {
        this.getRefreshToken().then((token) => {
          resolve(token)
        }).catch(e => {
          reject(e)
        })
      })
    }, refreshTime)
  }

  async getRefreshToken () {
    return new Promise(async (resolve, reject) => {
      let response, resp
      try {
        response = await fetch(this.refreshTokenUrl, {
          method: 'POST',
          credentials: 'include'
        })
        resp = await response.json()
        if (resp && resp.success) {
          this.storage.setItem('token', resp.idToken);
          this.token = resp.idToken
          this.EventEmitter.emit('accessTokenUpdated', resp.idToken);
          resolve(resp.idToken);
        } else {
          throw new Error('Failed to refresh access token')
        }
      } catch (err) {
        reject(err)
      }
    });
  }

  stopRefreshTimer () {
    clearInterval(this.silentRefresh)
  }

  getUser () {
    const storeUser = this.storage.getItem('user')

    if (this.currentUser) {
      return this.currentUser
    }
    if (storeUser) {
      return JSON.parse(storeUser)
    }
    return undefined
  }

  async jwtExpiryCheck(token) {
    try {
      let decodedToken = jwtDecode(token)
      if (decodedToken.exp * 1000 < Date.now()) {
        throw new Error("Token Expired")
      }
    }
    catch(err) {
      await this.getRefreshToken()
      this.stopRefreshTimer()
      if (decodedToken.exp && decodedToken.iat) {
        this.refreshTokenTimer((decodedToken.exp - decodedToken.iat) * 1000)
      } else {
        this.refreshTokenTimer()
      }
    }
  }

  checkToken (loc = window.location.search) {
    const params = this._parseQueryString(loc)
    const self = this

    self.token = params.token || params.access_token || this.storage.getItem('token') || undefined

    return new Promise(async (resolve, reject) => {
      if (self.isAuthenticated() && self.token && typeof self.token !== 'undefined') {
        resolve(self.getUser())
      }

      if (self.token && typeof self.token !== 'undefined') {
        if (window) {
          window.history.replaceState({}, '', window.location.pathname + window.location.hash || '')
        }
        self.storage.setItem('token', self.token)
        await self.jwtExpiryCheck(self.token).catch((err) => {
          reject(err)
        })
        self.fetchUser(this.userFetchUrl)
          .then((user) => {
            resolve(user)
          })
          .catch((err) => {
            reject(err)
          })
      } else {
        reject(new Error('access token not found'))
      }
    })
  }

  checkAccess (productIds = []) {
    const token = this.token || this.storage.getItem('token') || undefined
    const products = Array.isArray(productIds) ? productIds : [productIds]
    const user = this.getUser()

    return new Promise(async (resolve, reject) => {
      if (token && typeof token !== 'undefined') {
        try {
          await this.jwtExpiryCheck(token).catch((err) => {
            reject(err)
          })
          const allowedProducts = await this.fetchAccess(this.accessCheckUrl, { productIds: products })
          resolve({ success: true, user: user, products: allowedProducts })
        } catch (err) {
          reject(err)
        }
      } else {
        reject(new Error('access token not found'))
      }
    })
  }

  fetchUser (url) {
    const self = this

    return new Promise(async (resolve, reject) => {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Token': self.token || this.storage.getItem('token')
        }
      })

      if (response.status === 200) {
        const resp = await response.json()
        const user = resp.user || resp.objects[0]

        self.storage.setItem('user', JSON.stringify(user))
        resolve(user)
      } else {
        reject(new Error('authentication failed: Invalid response'))
      }
    })
  }

  fetchAccess (url, body) {
    const self = this

    return new Promise(async (resolve, reject) => {
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Access-Token': self.token || this.storage.getItem('token')
        },
        body: JSON.stringify(body)
      })

      if (response.status === 200) {
        const resp = await response.json()
        if (resp.success) {
          resolve(resp.products)
        } else {
          reject(new Error('This user does not have access to this product'))
        }
      } else if (response.status === 401) {
        reject(new Error('access token not found'))
      } else {
        reject(new Error('invalid response from server'))
      }
    })
  }

  async logout (url) {
    this.storage.removeItem('user')
    this.storage.removeItem('token')
    this.stopRefreshTimer()

    url = url || this.logoutUrl

    if (url) window.location = url
  }

  isAuthenticated () {
    const user = this.getUser()

    if (user) {
      return true
    }
    return false
  }
}
