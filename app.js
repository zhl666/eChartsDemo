const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const app = express();

const router = require('./src/server/router');

const port = 66;

app.use(express.static('src/static'));
app.use(express.static('src/template'));
app.use(express.static('dist'));
app.set('views', './views');

router(app);

app.listen(port, () => {
  console.log(`The server is listing the port ${port}.`);
});