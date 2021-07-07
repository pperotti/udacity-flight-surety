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

//.on("data",

// Listen to Events
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
flightSuretyApp.events.OracleRequest({
    fromBlock: 0
  }, function (error, event) {
    if (error) console.log(error)
    
    //console.log(event);
    //console.log("Address: " + config.appAddress);
    //console.log(flightSuretyApp);
    
    // Execute WEB REQUEST TO THE ACTUAL SERVICE
    const index = event.returnValues.index;
    const airline = event.returnValues.airline;
    const flightLabel = event.returnValues.flight;
    const timestamp = event.returnValues.timestamp;
    var flightStatus = 0;

    console.log("-----------------------")
    console.log("INDEX: " + index);
    console.log("AIRLINE: " + airline);
    console.log("FLIGHT: " + flightLabel);
    console.log("TIMESTAMP: " + timestamp);

    const flight = flightController.getFlight(flightLabel);
    
    if (flight == undefined) {
      console.log("RESPONSE: FLIGHT NOT FOUND");
      flightStatus = 0;
    } else {
      console.log("RESPONSE; " + JSON.stringify(flight));
      flightStatus = flight.status;
    }
    console.log("FLIGHT STATUS: " + flightStatus);
    
    // Invoke the callback method in the contract
    flightSuretyApp.methods.submitOracleResponse(
      index,
      airline,
      flightLabel,
      timestamp,
      flightStatus
    );
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
      res.status(404).send("No info available about that flight!");
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

app.get('/airlines', (req, res) => {
    res.send(flightController.getAirlines());
  });

  app.get('/airline/:code/flights', (req, res) => {
    const code = req.params.code;
    const flight = flightController.getFlightsByAirline(code);
    if (flight == undefined) {
      res.status(404).send("No flights available that airline!");
    } else {
      res.send(flight);
    }
  });


export default app;
