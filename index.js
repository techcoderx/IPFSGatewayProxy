const Express = require('express');
const Proxy = require('http-proxy');
const Shell = require('shelljs');
const app = Express();
const ProxyAPI = Proxy.createProxyServer();
const Config = {
    IPFSGateway: 'http://localhost:8080',
    Port: 3000
}

app.all('/ipfs/*', (req,res) => {
    let hash = req.originalUrl.split('/')[2];
    if (/^[a-zA-Z0-9]*$/.test(hash) == false || hash.length != 46) {
        res.writeHead(404);
        return res.end();
    }
    Shell.exec('ipfs pin ls -t recursive',{silent: true},(code,stdout,stderr) => {
        if (stderr != '') 
            console.log('\n\nError: ' + stderr);
        
        if (stdout.includes(hash)) {
            ProxyAPI.web(req,res,{target: Config.IPFSGateway});
        } else {
            res.writeHead(404);
            res.end();
        }
    })
});

ProxyAPI.on('error',(err) => console.log(error));

app.listen(Config.Port);