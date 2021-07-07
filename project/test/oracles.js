
const Test = require('../config/testConfig.js');
const truffleAssert = require('truffle-assertions');
//var BigNumber = require('bignumber.js');

var FlightSuretyApp = artifacts.require('FlightSuretyApp')

contract('Oracles', async (accounts) => {

  const TEST_ORACLES_COUNT = 10;

  // Watch contract events
  const STATUS_CODE_UNKNOWN = 0;
  const STATUS_CODE_ON_TIME = 10;
  const STATUS_CODE_LATE_AIRLINE = 20;
  const STATUS_CODE_LATE_WEATHER = 30;
  const STATUS_CODE_LATE_TECHNICAL = 40;
  const STATUS_CODE_LATE_OTHER = 50;

  var config;

  before('setup contract', async () => {
    config = await Test.Config(accounts);
  });

/*
  it('can register oracles', async () => {
    
    console.log("TEST: Oracle registration");

    // ARRANGE
    let fee = await config.flightSuretyApp.REGISTRATION_FEE.call();
    let feeInEther = web3.utils.fromWei(fee, 'ether');
    console.log("Fee: " + fee + " Fee in Ether: " + feeInEther);

    // Print Accounts
    console.log("ACCOUNT FROM 1-9")
    for(let i=1; i<TEST_ORACLES_COUNT; i++) {      
      console.log("Account #" + i + " " + accounts[i])
    }

    // Check whether the contract is operational or not.  
    let isOperational = await config.flightSuretyApp.isOperational();
    console.log("Is Operational: " + isOperational);
    assert.equal(isOperational, true, "The contact must be operational");

    // ACT
    for(let a=1; a<TEST_ORACLES_COUNT; a++) {      
      await config.flightSuretyApp.registerOracle({ from:accounts[a], value:fee });
      let result = await config.flightSuretyApp.getOracleIndexes({from: accounts[a]});
      console.log(`Oracle Registered: ${result[0]}, ${result[1]}, ${result[2]}`);
    }
  });
  
  it('can request flight status', async () => {
    
    console.log("TEST: Request Flight Status");

    // ARRANGE
    let flight = 'ND1309'; // Course number
    let timestamp = Math.floor(Date.now() / 1000);
    let airlineAccount = accounts[1];
    console.log("timstamp: " + airlineAccount);
    // ACT
    
    // Submit a request for oracles to get status information for a flight
    truffleAssert.eventEmitted(await config.flightSuretyApp.fetchFlightStatus(
      airlineAccount, 
      flight, 
      timestamp), 'OracleRequest', (ev) => {
       
        console.log("airline: " + ev.airline);
        console.log("flight: " + ev.flight);
        console.log("timstamp: " + ev.timestamp);
        
        assert.equal(airlineAccount, ev.airline, 'Airline is not the expected one');
        assert.equal(flight, ev.flight, 'Flight is not the expected one');
        assert.equal(timestamp, ev.timestamp, "The timeline is not the expected one")

        return true;
    });
  });
  */
 
  //TODO: Implement test for the callback when there is not enough responses
  it('Validate Flight Status Callback', async () => { 

    //TODO: Validate operations after an ORACLE invoke submitOracleResponse
    console.log("TEST: Validate Flight Status Callback Invocation");

    // ARRANGE

    // Precondition #1: Register new Oracle and obtain the indexes
    let fee = await config.flightSuretyApp.REGISTRATION_FEE.call();
    let mockAirlineAddr = accounts[1];
    console.log("- FEE: " + fee);
    console.log("- AIRLINE: " + mockAirlineAddr);
    await config.flightSuretyApp.registerOracle({ from:mockAirlineAddr, value:fee });
    let oracleIndexes = await config.flightSuretyApp.getOracleIndexes(
      {from:mockAirlineAddr}
    );
    console.log("- ORACLE INDEXES: " + oracleIndexes);
    let isOracleRegistered = await config.flightSuretyApp.isOracleRegistered(
      {from:mockAirlineAddr}
    );
    console.log("- Is Oracle Registered: " + isOracleRegistered);
    let oracleIndex = oracleIndexes[0]; 
    console.log("- ORACLE INDEX: " + oracleIndex);
    let flight = 'ND1309'; // Course number
    console.log("- FLIGHT NUMBER: " + flight);
    let timestamp = Math.floor(Date.now() / 1000);
    console.log("- TIMESTAMP: " + timestamp);
    let expectedStatusCode = 20;
    console.log("- STATUS CODE:" + expectedStatusCode);

    //Precondition #2: Ask for a flight status
    
    truffleAssert.eventEmitted(await config.flightSuretyApp.fetchFlightStatus(
      mockAirlineAddr, 
      flight, 
      timestamp, 
      {from:mockAirlineAddr}), 'OracleRequest', (ev) => {
        /*let areResponsesAllowed = config.flightSuretyApp.areResponsesAllowed(
          oracleIndex,
          mockAirlineAddr, 
          flight, 
          timestamp,
          {from:mockAirlineAddr}
        );
        console.log("- ARE RESPONSES ALLOWED: " + areResponsesAllowed);
        */

        //TODO: Check responses asynchronously here

        return true;
      });

    let areResponsesAllowed = await config.flightSuretyApp.areResponsesAllowed(
        oracleIndex,
        mockAirlineAddr, 
        flight, 
        timestamp,
        {from:mockAirlineAddr}
      );
    console.log("- ARE RESPONSES ALLOWED: " + areResponsesAllowed);
    
    // ACT 
    truffleAssert.eventEmitted(await config.flightSuretyApp.submitOracleResponse(
      oracleIndex,
      mockAirlineAddr,
      flight, 
      timestamp,
      expectedStatusCode,
      {from:mockAirlineAddr}), 'OracleReport', (ev) => {

      console.log("ev:" + ev);

      return true;
    });

    // ASSERT

    //a#1: There is an Oracle with at least 1 index 

    //a#2: The oracle still accepts responses

    //a#3: OracleReport event is emitted

    //a#4: Oracle is registered
    assert.equal(true, isOracleRegistered, "Oracle must be open for registration");

  });

});
