# Tiny HTTP Client

Zero dependency, native promise based HTTP/HTTPS client for Node.js 4+. 

## Installation

``` bash
  $ npm install tiny-http-client -save
```

## Usage

This client is primarily promise style wrapper around Node.js's [HTTP library][0]. Therefore,
all [options][1] supported by HTTP's request are supported. However, to simplify verbosity,
you can pass an initial set of options to the `TinyHttpClient` constructor and they will be
applied on any request made using this object.

### Initialization

    const httpClient = new TinyHttpClient({
      protocol: 'https:',                 // set the default protocol
      hostname: 'api.github.com',         // set the default host
       headers: {                         // set the default request headers
        'Accept': 'application/json'
      }
    });

### GET

HTTP GET requests will internally buffer the body and return it once the promise resolves.

    client.get({path: '/users/foo4u'})
    .then(JSON.parse)
    .then((jsonBody) => {
      console.log(jsonBody);
    });
    .catch((err) => {
      console.log(err);
    });

### HEAD

HTTP HEAD requests will return a promise resolving response headers if the request is successful.

    client.head({path: '/users/foo4u'})
        .then((headers) => {
          console.log(headers);
        });
        .catch((err) => {
          console.log(err);
        });

## Contributing

Found a bug or want add a feature? Please create an issue or send a pull request.

### Author

[Scott Rossillo](https://github.com/foo4u)

## License

Apache 2.0


[0]: https://nodejs.org/api/http.html
[1]: https://nodejs.org/api/http.html#http_http_request_options_callback