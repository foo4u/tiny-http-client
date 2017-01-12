/**
 * Creates a new tiny http client with the given options.
 * @param config
 * @constructor
 */
function TinyHttpClient (config) {
  this.config = Object.assign({headers: {'User-Agent': 'tiny-http-client'}}, config);
}

TinyHttpClient.prototype.get = function (options) {
  const opts = Object.assign(this.config, options, {method: 'GET'});
  return new Promise((resolve, reject) => {
    const lib = opts.protocol.startsWith('https') ? require('https') : require('http');
    const request = lib.request(opts, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error('HTTP GET request failed, status code: ' + response.statusCode));
      }
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => resolve(body.join('')));
    });
    request.on('error', (err) => reject(err));
    request.end();
  });
};

TinyHttpClient.prototype.head = function (options) {
  const opts = Object.assign(this.config, options, {method: 'HEAD'});
  return new Promise((resolve, reject) => {
    const lib = opts.protocol.startsWith('https') ? require('https') : require('http');
    const request = lib.request(opts, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error('HTTP GET request failed, status code: ' + response.statusCode));
      }
      resolve(response.headers);
    });
    request.on('error', (err) => reject(err));
    request.end();
  });
};

module.exports = TinyHttpClient;
