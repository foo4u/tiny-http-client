/**
 * Tiny HTTP client specification.
 */
'use strict';

const server = require('./support/server');
const TinyHttpClient = require('../TinyHttpClient');
const expect = require('chai').expect;
const clientOptions = {
  protocol: 'http:',
  hostname: 'localhost',
  port: 3001,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'tiny-http-client'
  }
};

describe('TinyHttpClient', () => {

  var client;

  beforeEach(() => {
    client = new TinyHttpClient(clientOptions);
  });

  describe('#get', () => {

    it('should get a body on success', () => {
      return client.get({path: '/users/foo4u'})
      .then(JSON.parse)
      .then((body) => {
        expect(body).to.be.an('object');
        expect(body.login).to.equal('foo4u');
      })
    });

    it('should fail on error', () => {
      return client.get({path: '/no/route'})
      .then((body) => { throw new Error('should not be called'); })
      .catch((err) => {
        expect(err).to.be.an('Error');
      });
    });
  });

  describe('#head', () => {

    it('should receive HTTP headers', () => {
      return client.head({path: '/users/foo4u'})
      .then((headers) => {
        expect(headers).to.be.an('object');
      })
    });

    it('should fail when not found', () => {
      return client.head({path: '/no/route'})
      .then((body) => { throw new Error('then should not be called'); })
      .catch((err) => {
        expect(err).to.be.an('Error');
      });
    });
  });

      .catch((err) => {
        expect(err).toBeDefined();
        done(err);
      });
    });
  });
});
