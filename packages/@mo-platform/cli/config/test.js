var nock = require('nock')

var postRolback = nock('http://localhost:3000')
                .post('/api/packages/test-app/rollback/0.0.1')
                .reply(200, {
                  name: "test-app",
                  version: "0.0.1",
                  data: {
                    "name": "test-app",
                    "version": "0.0.1"
                  }
            });

var post = nock('http://localhost:3000')
                .post('/api/packages')
                .reply(200, {
                  name: "test-app",
                  version: "0.0.1",
                  data: {
                    "name": "test-app",
                    "version": "0.0.1"
                  }
            });

var put = nock('http://localhost:3000')
                .put('/api/packages/test-app/0.0.1')
                .reply(200, {
                    status: 'ok'
            });

var del = nock('http://localhost:3000')
                .delete('/api/packages/test-app')
                .reply(200, {
                    status: 'ok',
                    n: 1
            });

var auth = nock('http://localhost:3000')
                .post('/api/authenticate')
                .reply(200, {
                  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImZhZ2Jva2ZvcmxhZ2V0IiwiaWF0IjoxNDkzMDI5MTE2LCJleHAiOjE0OTMwMjk3MTZ9.tGep2H-EH7k-P146oxCM6Ugpin-XxsSoNJeNXqMora0'
                })

var search = nock('http://localhost:3000')
                .get('/api/packages')
                .reply(200, [])

var searchRegEx = nock('http://localhost:3000')
                  .get('/api/packages')
                  .query({name: '/app/gi'})
                  .reply(200, [])


var searchQuery = nock('http://localhost:3000')
                .get('/api/packages')
                .query({name: 'matt'})
                .reply(200, [{"_id":"55fbf2fc0b74415f0cf8e9b1","_vs":"000000001","name":"matt","version":"0.0.1","data":{"name":"matt","version":"0.0.1","description":"","main":"index.html","module":"globals","license":"MIT","ignore":["**/.*","node_modules","bower_components","test","tests"]},"__v":0,"url":"https://matt.app.fagbokforlaget.no","created_at":"2015-09-18T11:18:20.401Z","previousVersions":[]}])

var searchQueryFailed = nock('http://localhost:3000')
                .get('/api/packages')
                .query({name: 'abcdefghijkl'})
                .reply(200, [])


var searchQueryDouble = nock('http://localhost:3000')
                .get('/api/packages')
                .query({name: 'matt,app'})
                .reply(200, [{"_id":"55fbf2fc0b74415f0cf8e9b1","_vs":"000000001","name":"matt","version":"0.0.1","data":{"name":"matt","version":"0.0.1","description":"","main":"index.html","module":"globals","license":"MIT","ignore":["**/.*","node_modules","bower_components","test","tests"]},"__v":0,"url":"https://matt.app.fagbokforlaget.no","created_at":"2015-09-18T11:18:20.401Z","previousVersions":[]}])



module.exports = {
  moServer: "http://localhost:3000",
  distFolder: './dist'
}
