# did-siop-rp-web-min

Simplest possible Integration of DID-SIOP to vanila HTML/JavaScript App with a Node/Express backend.

## How to test?

* Install DID-SIOP Chrome extension from [here](https://drive.google.com/file/d/1LK8oQrr0Abc1xPTmFPGgc9-XPQ-SmCms/view?usp=sharing)
* Setup the browser extension [Video guide](https://youtu.be/Hd9PwHotU84)
* Clone this repository and run following commands to build and run the server
```
npm install
node server.js
```

* Browse into http://localhost:5001


## How it works?

* index.html is a public page in a website
* As this page get loaded, 
    * Installed did-siop browser extension binds an event to the login button (since it has the custom attribute ```data-did-siop```)
    * Then requests the Authentication Request Object (ARO) from the server
* Server generate the ARO using Relying Party's (RP) DID and Private Key (```server.js/generateRequestObject```)
    * Important to note, the Private Key of the RP is in the backend, so no compromise on the key
* Server returns the ARO as an JSON object to the index.html
* Callback function sets the ARO to custom attribute ```data-did-siop``` of the login button
* User click on the login button,
* did-siop browser extension picks up the request
* On the extension
    * Verify the validity of the RP's request (Using RP's DID & Public Key)
    * Generate a response using Users DID & Private Key (This info is available from extension configurations)
    * Then redirect the user to the secure page home.html
* In the home.html, RP verify the validity of the response received
* If everything looks good, allow the user to the secure area (in this case home.html)



