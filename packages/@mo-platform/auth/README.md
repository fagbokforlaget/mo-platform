# JS client for MoAuth

MoAuth provides an OAuth proxy to various providers. For the time being it only supports [Fagbokforlaget e-portal](https://eportal.fagbokforlaget.no) or FEIDE. This js library provides necessary abstraction for authentication from various services.

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
<script
src="https://unpkg.com/@mo-platform/auth@0.6.0/dist/moauth.bundle.js"></script>

<script>
let auth = new moauth()

// initate oauth workflow
auth.authorize({redirectUrl: 'http://locahost:8000'}); // url redirect (optional)

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
.checkAccess('productId')
.then(product) {
  console.log(product)
}
.catch(err) {
  console.log(err);
  // No access
}

// clears localstorage for access token
auth.logout();
</script>
```
