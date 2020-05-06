//********************************************************************
//* file : server.js
//* https:localhost:5001
//*
//********************************************************************

const express = require('express');
const http = require('http');


var app = express();

app.use('/',express.static(__dirname + '/'));

app.get('/', function (req, res) {
    res.redirect('/index');
});

app.get('/index',indexPage);
app.get('/home',homePage);

function indexPage(req, res, next) {
    console.log("indexPage Invoked");
    res.sendFile('index.html', { root: __dirname  + '/' });
}

function homePage(req, res, next) {
    console.log("homePage Invoked");
    res.sendFile('home.html', { root: __dirname  + '/' });
}

const port = process.env.PORT || 5001;
http.createServer(app).listen(port, () => {
  console.log('Listening on ', port);
});
