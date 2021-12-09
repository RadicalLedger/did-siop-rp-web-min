//********************************************************************
//* file : server.js
//* https:localhost:5001
//*
//********************************************************************

const express = require('express');
const http = require('http');
const DID_SIOP = require('@zedeid-sdk/zedeid-did-siop-lib');


var app = express();

app.use('/',express.static(__dirname + '/'));

app.get('/', function (req, res) {
    res.redirect('/index');
});

app.get('/index',indexPage);
app.get('/home',homePage);
app.get('/get_request_object',getRequestObject);

function indexPage(req, res, next) {
    console.log("indexPage Invoked");
    res.sendFile('index.html', { root: __dirname  + '/' });
}

function homePage(req, res, next) {
    console.log("homePage Invoked");
    res.sendFile('home.html', { root: __dirname  + '/' });
}

async function getRequestObject(req, res, next) {
    console.log("getRequestObject Invoked");
    var requestObject;
    requestObject = await generateRequestObject();
    res.send(JSON.stringify({'reqObj':requestObject}));
}

const redirect_uri ='http://localhost:5001/home'
const privateKey = '047a86aed1b431781b7498872f96a355bc3787f1a20cd84755cbd2eeed47be83';
const did = 'did:ethr:0xAAE6a810C497C1Dd79afa4598bA58583939f4384';
const kid = "did:ethr:0xAAE6a810C497C1Dd79afa4598bA58583939f4384#controller";


async function generateRequestObject(){
    console.log('generateRequestObject');
    
    const relyingParty = new DID_SIOP.RP(redirect_uri,did,kid,privateKey);
    await relyingParty.init();
    const request = await relyingParty.generateRequest();

    console.log('Request generated ...', request);
    return request;
}

const port = process.env.PORT || 5001;
http.createServer(app).listen(port, () => {
  console.log('Listening on ', port);
});
