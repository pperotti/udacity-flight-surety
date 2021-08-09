
const Test = require('../config/testConfig.js');
const truffleAssert = require('truffle-assertions');
//var BigNumber = require('bignumber.js');

const FSA = artifacts.require('FlightSuretyApp');

contract('OraclesList', async (accounts) => {

  const TEST_ORACLES_COUNT = 5;

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

  it('List Existing Oracles', async () => {

    console.log("\n--------------------------------------------------");
    console.log("TEST: List Existing Oracles");
    console.log("--------------------------------------------------");

    let oracleCount = await flightSuretyApp.getRegisteredOracleCount({from:accounts[0]});
    console.log("Oracle Count: " + oracleCount);

    //let oracleList = await flightSuretyApp.getOracleList({from:account[0]})
    for(let i=0;i<oracleCount;i++) {
      let currentAddress = await flightSuretyApp.getOracleAddress(i, {from:accounts[0]});
      console.log("Address: " + currentAddress);

      assert.equal(currentAddress, accounts[i+1], "Addresses don't match!");
    }

  });

});
