var nock = require('nock')

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

module.exports = {
  moServer: "http://localhost:3000",
  distFolder: './dist'
}