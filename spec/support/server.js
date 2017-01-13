'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.locals.pretty = true;

// API routes
app.route("/users/:user")
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

var server = app.listen(3001, function () {
  console.log('Listening on port %d', server.address().port);
});

module.exports = server;
