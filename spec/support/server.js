'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.locals.pretty = true;

// API routes
app.route('/users/:user')
.get((req, res) => {
  const userId = req.params.user;

  if (userId === 'foo4u') {
    res.status(200)
    .json({
      'login': userId
    });
  } else {
    res.status(404).send('Not found');
  }
})
.head((req, res) => {
  res.status(200).send('Ok');
});

app.post('/gists/:gist_id/comments', (req, res) => {
  if (!req.body) {
    throw Error('Bad request, message missing');
  }

  res.status(201)
  .json({
    'id': 2,
    'message': req.body.message
  });
});

app.put('/gists/:gist_id', (req, res) => {
  if (!req.body) {
    throw Error('Bad request, message missing');
  }

  res.status(201)
  .json({
    'id': 2,
    'message': req.body.message
  });
});

var server = app.listen(3001, function () {
  console.log('Listening on port %d', server.address().port);
});

module.exports = server;
