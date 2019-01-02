const Express = require('express');
const Proxy = require('http-proxy');
const Shell = require('shelljs');
const app = Express();
const ProxyAPI = Proxy.createProxyServer();
const Config = {
    IPFSGateway: 'http://localhost:8080',
    Redirect404: 'https://uploader.oneloved.tube/404',
    Port: 3000
}

app.all('/ipfs/*', (req,res) => {
    let hash = req.originalUrl.split('/')[2];
    Shell.exec('ipfs pin ls -t recursive',{silent: true},(code,stdout,stderr) => {
        if (stderr != '')
            console.log('\n\nError: ' + stderr);
        
        if (stdout.includes(hash)) {
            ProxyAPI.web(req,res,{target: Config.IPFSGateway});
        } else {
            res.status(404).redirect(Config.Redirect404);
        }
    })
});

ProxyAPI.on('error',(err) => {
    console.log(err);
});

app.listen(Config.Port);