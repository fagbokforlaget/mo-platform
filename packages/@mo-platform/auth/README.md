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
```
<script
src="https://unpkg.com/@mo-platform/auth@0.5.0/dist/moauth.umd.js"></script>

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

## Process

```
ES6 source files
       |
       |
    webpack
       |
       +--- babel, eslint
       |
  ready to use
     library
  in umd format
```

*Have in mind that you have to build your library before publishing. The files under the `lib` folder are the ones that should be distributed.*

## Getting started

1. Setting up the name of your library
  * Open `webpack.config.js` file and change the value of `libraryName` variable.
  * Open `package.json` file and change the value of `main` property so it matches the name of your library.
2. Build your library
  * Run `npm install` to get the project's dependencies
  * Run `npm run build` to produce minified version of your library.
3. Development mode
  * Having all the dependencies installed run `npm run dev`. This command will generate an non-minified version of your library and will run a watcher so you get the compilation on file change.
4. Running the tests
  * Run `npm run test`

## Scripts

* `npm run build` - produces production version of your library under the `lib` folder
* `npm run dev` - produces development version of your library and runs a watcher
* `npm run test` - well ... it runs the tests :)
* `npm run test:watch` - same as above but in a watch mode

## Acknowledgements

* [Start your own JavaScript library using webpack and ES6](http://krasimirtsonev.com/blog/article/javascript-library-starter-using-webpack-es6)
