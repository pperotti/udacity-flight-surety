import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';


let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
web3.eth.defaultAccount = web3.eth.accounts[0];
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);


flightSuretyApp.events.OracleRequest({
    fromBlock: 0
  }, function (error, event) {
    if (error) console.log(error)
    console.log(event)
});

const app = express();
app.get('/api', (req, res) => {
    res.send({
      message: 'An API for use with your Dapp!'
    })
});
app.get('/listFlights', (req, res) => {

  var currentdate = new Date(); 
  var datetime = currentdate.getDate() + "/" 
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() 
                + "@"  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

  res.send({
    "flights": [
      {
        "code": "FLT-0001",
        "airline": "ARL0001"
      },
      {
        "code": "FLT-0002",
        "airline": "ARL0002"
      }
    ],
    "datetime": datetime
  })
})

export default app;


