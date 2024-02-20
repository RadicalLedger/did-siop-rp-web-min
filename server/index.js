import express from 'express';
import CustomDidResolver from './custom-did-resolver.js';
import path from 'path';
import * as SIOP from 'did-siop';
import cors from 'cors';

const app = express();

const PORT = 5001;
const __dirname = path.resolve();

const did = 'did:key:z6MktHAYXRescgkNpienxhBEM5HMysSdQP9UgxiTxx9Tfv6Y';
const pvt_key = '87d5fc062f3258be23ac0af0060d692033d2398c1aebed4cdffd809c12ae5862';
const pub_key = 'cd6d96b6a0a4f25d37c34f39f67477acbb9c7e75e9c4120483f72cc8449ddd85';

app.use(cors());

/* server public folder */
app.use(express.static('public'));

/* page serving */
app.get('/', (req, res) => serve(req, res, 'index.html'));
app.get('/home', (req, res) => serve(req, res, 'home.html'));

/* functions */
function serve(req, res, file) {
    res.sendFile(file, { root: __dirname + '/pages' });
}

app.get('/request', generateRequest);
async function generateRequest(req, res) {
    let url = `${req.query.origin}/home`;

    let data = {
        redirect_uri: url,
        did: did,
        private_key: pvt_key,
        registration: {
            jwks_uri: 'https://uniresolver.io/1.0/identifiers/did:example:0xab;transform-keys=jwks',
            id_token_signed_response_alg: ['ES256K', 'EdDSA', 'RS256']
        },
        claims: { id_token: { did: null } }
    };

    const resolver = new SIOP.Resolvers.CombinedDidResolver('key');
    const customResolver = new CustomDidResolver();
    resolver.removeAllResolvers();
    resolver.addResolver(customResolver);

    let siopRp = await SIOP.RP.getRP(
        data.redirect_uri, // redirect_uri
        data.did, // did
        data.registration, // registration
        undefined,
        [resolver]
    );

    siopRp.addSigningParams(data.private_key);

    let siopRequest = await siopRp.generateRequest({
        response_mode: 'tab-url',
        claims: data.claims
    });

    return res.status(200).json({ request: siopRequest });
}

app.get('/validate', validateRequest);
async function validateRequest(req, res) {
    let url = `${req.query.origin}/home`;
    let token = req.query.code;

    let data = {
        redirect_uri: url,
        did: did,
        private_key: pvt_key,
        registration: {
            jwks_uri: 'https://uniresolver.io/1.0/identifiers/did:example:0xab;transform-keys=jwks',
            id_token_signed_response_alg: ['ES256K', 'EdDSA', 'RS256']
        },
        claims: { id_token: { did: null } }
    };

    const resolver = new SIOP.Resolvers.CombinedDidResolver('key');
    const customResolver = new CustomDidResolver();
    resolver.removeAllResolvers();
    resolver.addResolver(customResolver);

    let rp = await SIOP.RP.getRP(data.redirect_uri, data.did, data.registration);
    let valid = await rp.validateResponse(
        token,
        {
            redirect_uri: data.redirect_uri,
            isExpirable: false
        },
        [resolver]
    );

    return res.status(200).json({ valid: valid?.header && valid?.payload });
}

app.listen(PORT, () => console.log(`Listening on port:`, PORT));
