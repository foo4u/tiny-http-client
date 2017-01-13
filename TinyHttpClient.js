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
  return new Promise((resolve, reject) => {
    const lib = opts.protocol.startsWith('https') ? require('https') : require('http');
    const request = lib.request(opts, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error('HTTP request failed, status code: ${response.statusCode}'));
      }
      resolve(response.headers);
    });
    request.on('error', (err) => reject(err));
    request.end();
  });
};

/**
 * Performs an HTTP POST request.
 *
 * @param options
 * @param data
 */
TinyHttpClient.prototype.post = function (options, data) {
  const opts = Object.assign(this.config, options, {method: 'POST'});
  opts.headers['Content-Type'] = 'application/json';
  return this.exchange(opts, data);
};

TinyHttpClient.prototype.exchange = function (options, data) {
  return new Promise((resolve, reject) => {
    if (options.method === 'POST' && !data) { reject(Error('POST data required')); }
    const lib = options.protocol.startsWith('https') ? require('https') : require('http');
    const request = lib.request(options, (response) => {
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => {
        try {
          response.body = JSON.parse(body.join(''));
        } catch(error) {
          reject(new HttpError('HTTP response is not valid JSON: ' + response.statusCode, response));
        }
        if (response.statusCode < 200 || response.statusCode > 299) {
          reject(new HttpError('HTTP request failed, status code: ' + response.statusCode, response));
        }
        resolve(response.body);
      });
    });
    request.on('error', (err) => reject(err));

    if (data) {
      request.write(JSON.stringify(data));
    }
    request.end();
  });
};

module.exports = TinyHttpClient;
