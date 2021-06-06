import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';

const FlightControllerBlock = require('./FlightController.js');

let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
web3.eth.defaultAccount = web3.eth.accounts[0];

// Register 
const flightController = new FlightControllerBlock.FlightController();

// Listen to Events
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
flightSuretyApp.events.OracleRequest({
    fromBlock: 0
  }, function (error, event) {
    if (error) console.log(error)
    console.log(event)
});

// Setup Express
const app = express();
app.get('/api', (req, res) => {
  res.send({
    message: 'An API for use with your Dapp!'
  })
});

app.get('/flights', (req, res) => {
    res.send(flightController.getFlights());
  });

app.get('/flight/:code', (req, res) => {
    const code = req.params.code;
    const flight = flightController.getFlight(code);
    if (flight == undefined) {
      res.status(404).send("No flight wtih that code!");
    } else {
      res.send(flight);
    }
  });

app.patch('/flight/:code/status/:newstatus', (req, res) => {
    const code = req.params.code;
    const status = req.params.newstatus;
    console.log("Body -> Code: " + code + " New Status: " + status);
    flightController.updateFlightStatus(code, status);
    res.send(flightController.getFlight(code));
  });

export default app;
