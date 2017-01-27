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
      .then((response) => {
        expect(response).to.be.an('object');
        expect(response.body).to.be.an('object');
        expect(response.body.login).to.equal('foo4u');
      })
    });

    it('should fail on error', () => {
      return client.get({path: '/no/route'})
      .then((response) => { throw new Error('should not be called'); })
      .catch((err) => {
        expect(err.name).to.equal('HttpError');
        expect(err).to.have.property('message');
        expect(err).to.have.property('response');
      });
    });
  });

  describe('#head', () => {

    it('should receive HTTP headers', () => {
      return client.head({path: '/users/foo4u'})
      .then((response) => {
        expect(response).to.be.an('object');
        expect(response.headers).to.be.an('object');
        expect(response).not.to.have.property('body');
      })
    });

    it('should fail when not found', () => {
      return client.head({path: '/no/route'})
      .then((response) => { throw new Error('then should not be called'); })
      .catch((err) => {
        expect(err).to.be.an('Error');
      });
    });
  });

  describe('#post', () => {

    it('should reject with an error if the POST body is missing', () => {
      return client.post({path: '/users/foo4u/status'})
      .then((response) => { throw new Error('then should not be called'); })
      .catch((err) => {
        expect(err).to.be.an('Error');
      });
    });

    it('should POST data and resolve the response', () => {
      const postData = {message: 'Just a comment'};
      return client.post({path: '/gists/some/comments'}, postData)
      .then((response) => {
        expect(response).to.be.an('object');
        expect(response.body).to.be.an('object');
        expect(response.body.id).to.equal(2);
        expect(response.body.message).to.equal(postData.message);
      })
    });

    it('should fail on error', () => {
      const postData = {foo: 'bar'};
      return client.post({path: '/users/foo4u/status'}, postData)
      .then((response) => { throw new Error('then should not be called'); })
      .catch((err) => {
        expect(err.name).to.equal('HttpError');
        expect(err).to.have.property('message');
        expect(err).to.have.property('response');
        expect(err.response).not.to.have.property('body');
      });
    });
  });

  describe('#put', () => {

    it('should reject with an error if the PUT body is missing', () => {
      return client.put({path: '/gists/some'})
      .then((response) => { throw new Error('then should not be called'); })
      .catch((err) => {
        expect(err).to.be.an('Error');
      });
    });

    it('should PUT data and resolve the response', () => {
      const data = {message: 'Just a comment'};
      return client.put({path: '/gists/some'}, data)
      .then((response) => {
        expect(response).to.be.an('object');
        expect(response.body).to.be.an('object');
        expect(response.body.id).to.equal(2);
        expect(response.body.message).to.equal(data.message);
      })
    });

    it('should fail on error', () => {
      const data = {foo: 'bar'};
      return client.put({path: '/users/foo4u/status'}, data)
      .then((response) => { throw new Error('then should not be called'); })
      .catch((err) => {
        expect(err.name).to.equal('HttpError');
        expect(err).to.have.property('message');
        expect(err).to.have.property('response');
        expect(err.response).not.to.have.property('body');
      });
    });
  });

  describe('#exchange', () => {

    it('should reject with an HttpError if the response body is not JSON', () => {
      const postData = {message: 'Just a comment'};
      return client.post({path: '/gists/some/oops'}, postData)
      .then((response) => {
        expect(response).to.be.an('object');
        expect(response.body).to.be.an('object');
        expect(response.body.id).to.equal(2);
        expect(response.body.message).to.equal(postData.message);
      })
      .catch((err) => {
        expect(err.name).to.equal('HttpError');
        expect(err).to.have.property('message');
        expect(err).to.have.property('response');
        expect(err.response).not.to.have.property('body');
      });
    });
  });
});
