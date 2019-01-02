# IPFSGatewayProxy

Node.js reverse proxy that allows only pinned IPFS hashes to be served over local IPFS gateway.

## Installation

1. Clone this repository
```
git clone https://github.com/techcoderx/IPFSGatewayProxy.git
```

2. Install required node modules
```
npm install
```

3. Run the app.
```
node index.js
```
App will listen to port 3000.

#### Options

* `--port=3456` will run the app on a different port specified.