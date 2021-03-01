// const express = require("express")

// const server = express()

// // DO YOUR MAGIC

// module.exports = server



const express = require('express');
const helmet = require('helmet');
const carsRouter = require('./cars/carsRouter');

const server = express();

server.use(express.json(), logger, helmet());

server.use('/api/cars', carsRouter);

server.get('/', (req, res) => {
    res.status(200).send(`<h1>Welcome to the car dealer API.</h1>`);
});

function logger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url} ${req.get('Origin')}`);
    next();
}

module.exports = server;