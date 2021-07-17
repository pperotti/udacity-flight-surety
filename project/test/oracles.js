
const Test = require('../config/testConfig.js');
const truffleAssert = require('truffle-assertions');
//var BigNumber = require('bignumber.js');

const FSA = artifacts.require('FlightSuretyApp');

contract('Oracles', async (accounts) => {

  const TEST_ORACLES_COUNT = 10;

  // Watch contract events
  const STATUS_CODE_ON_TIME = 10;
  
  var config;
  var flightSuretyApp;
  var lastIndexUsed;
  var initialTimestamp;

  before('setup contract', async () => {
    config = await Test.Config(accounts);

    flightSuretyApp = await FSA.deployed();
    initialTimestamp = Math.floor(Date.now() / 1000);
  });


  it('can register oracles', async () => {
    
    console.log("-------------------------------");
    console.log("TEST: Oracle registration");
    console.log("-------------------------------");

    // ARRANGE
    let fee = await flightSuretyApp.REGISTRATION_FEE.call();
    let feeInEther = web3.utils.fromWei(fee, 'ether');
    console.log("Fee: " + fee + " Fee in Ether: " + feeInEther);

    // Print Accounts
    console.log("ACCOUNT FROM 1-9")
    for(let i=1; i<TEST_ORACLES_COUNT; i++) {      
      console.log("Account #" + i + " " + accounts[i])
    }

    // Check whether the contract is operational or not.  
    let isOperational = await flightSuretyApp.isOperational();
    console.log("Is Operational: " + isOperational);
    assert.equal(isOperational, true, "The contact must be operational");

    // ACT
    for(let a=1; a<TEST_ORACLES_COUNT; a++) {      
      await flightSuretyApp.registerOracle({ from:accounts[a], value:fee });

      let isRegistered = await flightSuretyApp.isOracleRegistered({ from:accounts[a] });
      console.log("Is Oracle (" + accounts[a] + ") registered: " + isRegistered);

      let result = await flightSuretyApp.getOracleIndexes({from: accounts[a]});
      console.log(`Oracle Registered: ${result[0]}, ${result[1]}, ${result[2]}`);
    }
  });

  
  it('can request flight status', async () => {
    
    console.log("\n-------------------------------");
    console.log("TEST: Request Flight Status");
    console.log("-------------------------------");

    // ARRANGE
    var callerAccount = accounts[10];
    let flight = 'FLT0001'; // Course number
    let timestamp = initialTimestamp;
    let airlineAccount = accounts[1];
    console.log("timstamp: " + airlineAccount);

    // ACT
    
    // Submit a request for oracles to get status information for a flight
    truffleAssert.eventEmitted(await flightSuretyApp.fetchFlightStatus(
      airlineAccount, 
      flight, 
      timestamp,
      { from:callerAccount }), 'OracleRequest', (ev) => {
       
        console.log("airline: " + ev.airline);
        console.log("flight: " + ev.flight);
        console.log("timstamp: " + ev.timestamp);
        lastIndexUsed = ev.index;
        console.log("index: " + ev.index);
        
        assert.equal(airlineAccount, ev.airline, 'Airline is not the expected one');
        assert.equal(flight, ev.flight, 'Flight is not the expected one');
        assert.equal(timestamp, ev.timestamp, "The timeline is not the expected one")

        flightSuretyApp.getResponseInfo.call(
          ev.index,
          ev.airline,
          ev.flight,
          ev.timestamp,
          { from:callerAccount }).then(function(r2) {
            console.log("- Requester: " + r2.requester);
            console.log("- isOpen: " + r2.isOpen);
            assert.equal(callerAccount, r2.requester, "The requester ");
          }); 
        
        return true;
    });
  });
  
  it('Check Registered Oracle Info After OracleRequest', async () => {

    console.log("\n--------------------------------------------------");
    console.log("TEST: Check Registered Oracle After OracleRequest");
    console.log("--------------------------------------------------");

    console.log("Index:" + lastIndexUsed);

    let callerAccount = accounts[10];
    let airlineAccount = accounts[1];
    let flight = 'FLT0001'; // Course number
    let timestamp = initialTimestamp;
    
    let key = await flightSuretyApp.getResponseKey.call(
      lastIndexUsed,
      airlineAccount, 
      flight, 
      timestamp,
      { from:callerAccount });

    console.log("KEY: " + key);
    
    let r = await flightSuretyApp.getResponseInfo.call(
      lastIndexUsed, 
      airlineAccount, 
      flight,
      timestamp,
      { from:callerAccount });

    console.log("- Requester: " + r.requester);
    console.log("- isOpen: " + r.isOpen);

    let r2 = await flightSuretyApp.getResponseInfoByKey.call(
      key,
      { from:callerAccount });

    console.log("- Requester: " + r2.requester);
    console.log("- isOpen: " + r2.isOpen);

    assert.equal(callerAccount, r.requester, "Method getResponseInfo does NOT works as expected!");
    assert.equal(callerAccount, r2.requester, "Method getResponseInfoByKey does NOT works as expected!");

  });

  it('Validate Callback after Fetch', async () => {

    console.log("\n--------------------------------------------------");
    console.log("TEST: Validate Callback after Fetch");
    console.log("--------------------------------------------------");

    // ARRANGE
    var callerAccount;
    let flight = 'FLT0001'; // Course number
    let timestamp = initialTimestamp;
    let airlineAccount = accounts[1];
    let responseStatus = STATUS_CODE_ON_TIME;
    let key = await flightSuretyApp.getResponseKey.call(
      lastIndexUsed,
      airlineAccount,
      flight,
      timestamp,
      {from: callerAccount}
    );
        
    console.log("index:" + lastIndexUsed);
    console.log("airlineAccount: " + airlineAccount);
    console.log("flight: " + flight);
    console.log("timestamp: " + timestamp);
    console.log("key: " + key);

    let rc3 = await flightSuretyApp.getResponseInfoByKey.call(key);
    console.log("requester: " + rc3.requester);
    console.log("isOpen: " + rc3.isOpen);

    /* 
    Find the first account that matches with the last index value and assign it
    to the callerAccount variable
    */
   for(let a=1; a<TEST_ORACLES_COUNT; a++) {      
      let result = await flightSuretyApp.getOracleIndexes.call({from: accounts[a]});
      console.log("Oracle #∫" + a + ": " + result[0] + ", " + result[1] + ", " + result[2]);
      if (Number(result[0])==lastIndexUsed 
        || Number(result[1])==lastIndexUsed
        || Number(result[2])==lastIndexUsed ) {
        callerAccount = accounts[a];
        break;
      }
    }

    console.log("CallerAccount: " + callerAccount);
    
    // ACT and Submit a request for oracles to get status information for a flight
    truffleAssert.eventEmitted(await flightSuretyApp.submitOracleResponse(
      lastIndexUsed,
      airlineAccount, 
      flight, 
      timestamp,
      responseStatus,
      { from:callerAccount }), 'OracleReport', (ev) => {
       
        console.log("airline: " + ev.airline);
        console.log("flight: " + ev.flight);
        console.log("timstamp: " + ev.timestamp);
        console.log("status: " + ev.status);
                
        return true;
    });

  });

  it('Validate Callback after Fetch', async () => {

    console.log("\n--------------------------------------------------");
    console.log("TEST: Validate Callback after Fetch");
    console.log("--------------------------------------------------");

    // ARRANGE
    var callerAccount;
    let flight = 'FLT0001'; // Course number
    let timestamp = initialTimestamp;
    let airlineAccount = accounts[1];
    let responseStatus = STATUS_CODE_ON_TIME;
    let key = await flightSuretyApp.getResponseKey.call(
      lastIndexUsed,
      airlineAccount,
      flight,
      timestamp,
      {from: callerAccount}
    );
        
    console.log("index:" + lastIndexUsed);
    console.log("airlineAccount: " + airlineAccount);
    console.log("flight: " + flight);
    console.log("timestamp: " + timestamp);
    console.log("key: " + key);

    let rc3 = await flightSuretyApp.getResponseInfoByKey.call(key);
    console.log("requester: " + rc3.requester);
    console.log("isOpen: " + rc3.isOpen);

    /* 
    Find the first account that matches with the last index value and assign it
    to the callerAccount variable
    */
   for(let a=1; a<TEST_ORACLES_COUNT; a++) {      
      let result = await flightSuretyApp.getOracleIndexes.call({from: accounts[a]});
      console.log("Oracle #∫" + a + ": " + result[0] + ", " + result[1] + ", " + result[2]);
      if (Number(result[0])==lastIndexUsed 
        || Number(result[1])==lastIndexUsed
        || Number(result[2])==lastIndexUsed ) {
        callerAccount = accounts[a];
        break;
      }
    }

    console.log("CallerAccount: " + callerAccount);
    
    //This continue submitting responses from the previous test
    await flightSuretyApp.submitOracleResponse(
      lastIndexUsed,
      airlineAccount, 
      flight, 
      timestamp,
      responseStatus,
      { from:callerAccount })

    // ACT final submit response. Waiting for FlightStatusInfo event
    truffleAssert.eventEmitted(await flightSuretyApp.submitOracleResponse(
      lastIndexUsed,
      airlineAccount, 
      flight, 
      timestamp,
      responseStatus,
      { from:callerAccount }), 'FlightStatusInfo', (ev) => {
      
        console.log("\n\nFLIGHT STATUS INFO RESULT ");
        console.log("----------------------------------");
        console.log("airline: " + ev.airline);
        console.log("flight: " + ev.flight);
        console.log("timstamp: " + ev.timestamp);
        console.log("status: " + ev.status);
                
        flightSuretyApp.getResponseInfoByKey.call(key).then(function(ri) {
          console.log("requester: " + ri.requester);
          console.log("isOpen: " + ri.isOpen);
          assert.equal(false, ri.isOpen, "No more responses are accepted");
          console.log("No more responses are allowed now...");
        });
        
        return true;
    });

  });


});
