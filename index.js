const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const server = express();
const port = 8000;

server.listen(port, () => {
  console.warn('we are ready :)');
});


