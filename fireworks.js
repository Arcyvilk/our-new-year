const express = require('express');
const path = require('path');
const http = require('http');
const WS = require('./ws');
const bodyParser = require('body-parser');
const config = require('./config.json');

const app = express();
const server = http.createServer(app);
const ws = new WS(server);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, './build')));

server.listen(config.PORT, 
    () => {
        ws.openWebsocket();
        console.log(`Server listening at port ${ config.PORT }!`);
    }
);