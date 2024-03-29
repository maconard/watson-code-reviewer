// Uncomment following to enable zipkin tracing, tailor to fit your network configuration:
// var appzip = require('appmetrics-zipkin')({
//     host: 'localhost',
//     port: 9411,
//     serviceName:'frontend'
// });

require('appmetrics-dash').attach();
require('appmetrics-prometheus').attach();
const appName = require('./../package').name;
const http = require('http');
const express = require('express');
const log4js = require('log4js');
const localConfig = require('./config/local.json');
const path = require('path');

const logger = log4js.getLogger(appName);
logger.level = process.env.LOG_LEVEL || 'info'
const app = express();
const server = http.createServer(app);

app.use(log4js.connectLogger(logger, { level: logger.level }));
const serviceManager = require('./services/service-manager');
require('./services/index')(app);
require('./routers/index')(app, server);

// Add your code here
var IBMCloudEnv = require('ibm-cloud-env');
IBMCloudEnv.init();

var fs = require('fs');
eval(fs.readFileSync('server/process.js')+'');

const port = process.env.PORT || localConfig.port;
server.listen(port, function(){
  logger.info(`nodejswebapp listening on http://localhost:${port}/appmetrics-dash`);
  logger.info(`nodejswebapp listening on http://localhost:${port}`);
});

app.use(express.json());
app.use(express.urlencoded());

app.route('/analyze').post(function (req, res) {
    var payload = req.body.payload;
    payload = payload.map(Number);
    
    console.log("Sending payload...");
    sendPayload(payload,res);
});

app.route('/analyze-batch').post(function (req, res) {
    var payload = req.body.payload;
    for(let k in payload) {
        payload[k] = payload[k].map(Number);
    }
    
    console.log("Sending batch...");
    sendBatch(JSON.stringify(payload),res);
});

app.use(function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public', '404.html'));
});

app.use(function (err, req, res, next) {
  res.sendFile(path.join(__dirname, '../public', '500.html'));
});

module.exports = server;
