const args = require('minimist')(process.argv.slice(2));
const Express = require('express');
const CORS = require('cors');
const Proxy = require('http-proxy');
const Shell = require('shelljs');
const app = Express();
const ProxyAPI = Proxy.createProxyServer();
const IPFSGateway = 'http://localhost:8080';

if (!Number.isInteger(args['port']) && args['port'] != undefined) {
    console.log('Error: port specified is not an integer!');
    return process.exit(1);
}

app.use(CORS());

app.all('/ipfs/*', (req,res) => {
    let hash = req.originalUrl.split('/')[2];
    if (/^[a-zA-Z0-9]*$/.test(hash) == false || hash.length != 46) {
        res.writeHead(404);
        return res.end();
    }
    Shell.exec('ipfs pin ls -t recursive',{silent: true},(code,stdout) => {
        if (stdout.includes(hash)) {
            ProxyAPI.web(req,res,{target: IPFSGateway});
        } else {
            res.writeHead(404);
            res.end();
        }
    })
});

ProxyAPI.on('error',(err) => console.log(err));

app.listen(args['port'] || 3000);