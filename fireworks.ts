import express from 'express';
import path from 'path';
import http from 'http';
import bodyParser from 'body-parser';
import config from './config.json';

const app = express();
export const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../build')));

server.listen(config.PORT, 
    () => console.log(`Server listening at port ${ config.PORT }!`)
);