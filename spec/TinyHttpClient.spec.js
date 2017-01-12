/**
 * Tiny HTTP client specification.
 */
const clientOptions = {
  protocol: 'https:',
  hostname: 'api.github.com',
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'tiny-http-client'
  }
};

describe('TinyHttpClient', () => {
  const TinyHttpClient = require('../TinyHttpClient');
  var client;

  beforeEach(() => {
    client = new TinyHttpClient(clientOptions);
  });

  describe('#get', () => {
    it('should get an existing document', (done) => {
      client.get({path: '/users/foo4u'})
      .then(JSON.parse)
      .then((user) => {
        expect(user.login).toEqual('foo4u');
        done();
      })
      .catch((err) => {
        expect(error).toBeUndefined();
        done(err);
      });
    });

    it('should fail when not found', (done) => {
      client.get({path: '/users/foo4u-super-awesome-non-existing'})
      .then(JSON.parse)
      .then((user) => {
        expect(user).toBeUndefined();
        done();
      })
      .catch((err) => {
        expect(err).toBeDefined();
        done();
      });
    });
  });

  describe('#head', () => {
    it('should get response headers', (done) => {
      client.head({path: '/users/foo4u'})
      .then((headers) => {
        expect(headers).toBeDefined();
        done();
      })
      .catch((err) => {
        expect(error).toBeUndefined();
        done(err);
      });
    });

    it('should fail when not found', (done) => {
      client.head({path: '/users/foo4u-super-awesome-non-existing-user'})
      .then((headers) => {
        expect(headers).toBeUndefined();
        done();
      })
      .catch((err) => {
        expect(err).toBeDefined();
        done(err);
      });
    });
  });
});
