# JS client for MoAuth

MoAuth provides an OAuth proxy to various providers. For the time being it only supports [Fagbokforlaget e-portal](https://eportal.fagbokforlaget.no) or FEIDE. This js library provides necessary abstraction for authentication from various services.

NOTE: Mo-Auth lib replies on modern browsers and does not includes polyfills for `fetch` and `Promise`. You may include them yourself and if you use it inside vue then edit `vue.config.js` and add `transpileDependencies:['@mo-platform/auth']` to options

## Install
```bash
npm install @mo-platform/auth
```

### Use
```javascript
import MoAuth from '@mo-platform/auth'
let auth = new MoAuth()
// do something with auth
```

### Install browser method
```html
// Include polyfills if desired
<script crossorigin="anonymous" src="https://polyfill.io/v3/polyfill.min.js?features=fetch%2Ces2017"></script>
<script
src="https://unpkg.com/@mo-platform/auth@0.6.0/dist/moauth.bundle.js"></script>

<script>
let auth = new moauth()

// initate oauth workflow
auth.authorize({redirectUrl: 'http://locahost:8000', scope: 'mo_apps'}); // url redirect (optional)

// listen to access token in url query
auth
.checkToken()
.then(user) {
  console.log(user);
  //do something with user
}
.catch(err) {
  console.error(err);
}

// To check product access
auth
  .checkToken()
  .then((user) => {
    // Do something
    return auth.checkAccess(['product1'])
  })
  .then((resp) => {
    if (resp.products.includes('product1)) {
      // Success
    }
    else {
      // failure
    }
  })
  .catch((err) => {
    // Handle error
  })


// async await

const user = await auth.checkToken()
const resp = await auth.checkAccess(['product1'])

if (resp.products.includes('product1') {
  // success
}
else {
  // failure
}

// clears localstorage for access token
auth.logout();
</script>
```
