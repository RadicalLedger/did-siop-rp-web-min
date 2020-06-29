//********************************************************************
//* file : server.js
//* https:localhost:5001
//*
//********************************************************************

const express = require('express');
const http = require('http');
const DID_SIOP = require('did-siop');

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

async function generateRequestObject(){
    console.log('startProcess');
    var request;
    
    siop_rp = await DID_SIOP.RP.getRP(
        'localhost:5001/home', // RP's redirect_uri
        'did:ethr:0xA51E8281c201cd6Ed488C3701882A44B1871DAd6', // RP's did
        {
            "jwks_uri": "https://uniresolver.io/1.0/identifiers/did:example:0xab;transform-keys=jwks",
            "id_token_signed_response_alg": ["ES256K-R", "EdDSA", "RS256"]
        }
    )
    console.log('Got RP instance ....');
    siop_rp.addSigningParams(
        '8329a21d9ce86fa08e75354469fb8d78834f126415d5b00eef55c2f587f3abca', // Private key
        'did:ethr:0xA51E8281c201cd6Ed488C3701882A44B1871DAd6#owner', // Corresponding authentication method in RP's did document (to be used as kid value for key)
        DID_SIOP.KEY_FORMATS.HEX, //Format in which the key is supplied. List of values is given below
        DID_SIOP.ALGORITHMS['ES256K-R']
    );

    console.log('RP SigningParams added ...');
    request = await siop_rp.generateRequest();

    console.log('Request generated ...', request);
    return request;
}

const port = process.env.PORT || 5001;
http.createServer(app).listen(port, () => {
  console.log('Listening on ', port);
});
