'use strict';

const HttpError = require('./HttpError');

/**
 * Creates a new tiny http client with the given options.
 * @param config
 * @constructor
 */
function TinyHttpClient (config) {
  this.config = Object.assign({headers: {'User-Agent': 'tiny-http-client'}}, config);
}

/**
 * Performs an HTTP GET request.
 *
 * @param options standard Node.js HTTP options
 * @returns {Promise} resolving the response body
 */
TinyHttpClient.prototype.get = function (options) {
  const opts = Object.assign(this.config, options, {method: 'GET'});
  return this.exchange(opts);
};

/**
 * Performs an HTTP HEAD request.
 *
 * @param options standard Node.js HTTP options
 * @returns {Promise} resolving the response headers
 */
TinyHttpClient.prototype.head = function (options) {
  const opts = Object.assign(this.config, options, {method: 'HEAD'});
  return this.exchange(opts);
};

/**
 * Performs an HTTP POST request.
 *
 * @param options standard Node.js HTTP options
 * @param data the JSON object to POST
 */
TinyHttpClient.prototype.post = function (options, data) {
  const opts = Object.assign(this.config, options, {method: 'POST'});
  opts.headers['Content-Type'] = 'application/json';
  return this.exchange(opts, data);
};

/**
 * Performs an HTTP PUT request.
 *
 * @param options standard Node.js HTTP options
 * @param data the JSON object to PUT
 */
TinyHttpClient.prototype.put = function (options, data) {
  const opts = Object.assign({}, this.config, options, {method: 'PUT'});
  if (!opts.headers['Content-Type']) {
    opts.headers['Content-Type'] = 'application/json';
  }
  return this.exchange(opts, data);
};

TinyHttpClient.prototype.exchange = function (options, data) {
  return new Promise((resolve, reject) => {
    if (['POST', 'PUT'].indexOf(options.method) > 0 && !data) { reject(Error(options.method + ' data required')); }
    const lib = options.protocol.startsWith('https') ? require('https') : require('http');
    const request = lib.request(options, (response) => {
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => {
        if (options.method === 'HEAD') {
          resolve(response);
        }
        try {
          response.body = JSON.parse(body.join(''));
        } catch(error) {
          reject(new HttpError('HTTP response is not valid JSON: ' + response.statusCode, response));
        }
        if (response.statusCode < 200 || response.statusCode > 299) {
          reject(new HttpError('HTTP request failed, status code: ' + response.statusCode, response));
        }
        resolve(response);
      });
    });
    request.on('aborted', (err) => reject(err));
    request.on('error', (err) => reject(err));

    if (data) {
      request.write(JSON.stringify(data));
    }
    request.end();
  });
};

module.exports = TinyHttpClient;
