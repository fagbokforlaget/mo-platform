const fetch = require('isomorphic-fetch')

export default class Authentication {
  constructor (opts = {}) {
    let { authUrl, clientId, storage, loginUrl, logoutUrl, userFetchUrl, accessCheckUrl } = opts

    this.authUrl = authUrl || 'https://moauth.fagbokforlaget.no'
    this.currentUser = undefined
    this.token = undefined
    this.clientId = clientId
    this.storage = storage || window.localStorage
    this.loginUrl = loginUrl || this.authUrl + '/_auth/login'
    this.logoutUrl = logoutUrl
    this.userFetchUrl = userFetchUrl || this.authUrl + '/_auth/user'
    this.accessCheckUrl = accessCheckUrl || this.authUrl + '/_auth/access'
  }

  _loginUrl (redirectUrl, scope = undefined) {
    if (!this.loginUrl.includes('?')) {
      this.loginUrl += '?'
    }
    return this.loginUrl + '&client_id=' + (this.clientId || 'generic') + '&redirect_url=' + encodeURIComponent(redirectUrl) + '&scope=' + (scope || 'dbok')
  }

  _parseQueryString (loc) {
    const pl = /\+/g
    const search = /([^&=]+)=?([^&]*)/g
    const decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')) }
    let urlParams = {}
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
    let { redirectUrl, scope } = obj

    window.location = this._loginUrl(redirectUrl || window.location, scope)
  }

  getUser () {
    let storeUser = this.storage.getItem('user')

    if (this.currentUser) {
      return this.currentUser
    }
    if (storeUser) {
      return JSON.parse(storeUser)
    }
    return undefined
  }

  checkToken (loc = window.location.search) {
    let params = this._parseQueryString(loc)
    let self = this

    self.token = params.token || params.access_token || this.storage.getItem('token') || undefined

    return new Promise((resolve, reject) => {
      if (self.isAuthenticated() && self.token && typeof self.token !== 'undefined') {
        resolve(self.getUser())
      }

      if (self.token && typeof self.token !== 'undefined') {
        if (window) {
          window.history.replaceState({}, '', window.location.pathname + window.location.hash || '')
        }
        self.storage.setItem('token', self.token)
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
    let self = this

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
          'Accept': 'application/json',
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
      }
    })
  }

  async logout (url) {
    this.storage.removeItem('user')
    this.storage.removeItem('token')

    url = url || this.logoutUrl

    if (url) window.location = url
  }

  isAuthenticated () {
    let user = this.getUser()

    if (user) {
      return true
    }
    return false
  }
}
