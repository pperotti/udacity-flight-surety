
const Test = require('../config/testConfig.js');
const truffleAssert = require('truffle-assertions');
const FSA = artifacts.require('FlightSuretyApp');
const BigNumber = require('bignumber.js');

contract('Flight Surety - Airline Role Tests', async (accounts) => {

  const TEST_ACCOUNT_COUNT = 10;

  var config;
  var flightSuretyApp;
  var ownerAddress;

  before('setup contract', async () => {
    config = await Test.Config(accounts);
    ownerAddress = config.testAddresses[0];
    flightSuretyApp = await FSA.deployed();
  });

  //*********************************
  // CHECKING AIRLINE-RELATED ROLES 
  //*********************************

  it("Add Airline - Event Emittion Validation", async function () {
    
    console.log("---------------------------")
    console.log("TEST: Add Airline")
    console.log("---------------------------")

    var airlineAddress = accounts[1];

    console.log("-> Owner Address: " + ownerAddress);
    console.log("-> Airline: " + airlineAddress);

    //Add Airline
    truffleAssert.eventEmitted(await flightSuretyApp.addAirline(
        airlineAddress,
        {from:airlineAddress}), 
        "AirlineAdded", 
        (ev) => {
            console.log("EV: " + JSON.stringify(ev));
            assert.equal(ev.account, airlineAddress, "The new account is not the expected one");
            return true;
        }
    );
  });

  it("Remove Airline - Event Emittion Validation", async function () {
    console.log("---------------------------")
    console.log("TEST: Remove Airline")
    console.log("---------------------------")

    var airlineAddress = accounts[1];

    console.log("-> Owner Address: " + ownerAddress);
    console.log("-> Airline: " + airlineAddress);

    //Check if event was properly fired
    truffleAssert.eventEmitted(await flightSuretyApp.removeAirline(
        airlineAddress,
        {from:airlineAddress}), 
        "AirlineRemoved", 
        (ev) => {
            console.log("EV: " + JSON.stringify(ev));
            assert.equal(ev.account, airlineAddress, "The new account is not the expected one");
            return true;
        }
    );
  });
 
  it("Is Airline?", async function () {

    console.log("---------------------------")
    console.log("TEST: Is Airline")
    console.log("---------------------------")

    var airlineAddress = accounts[1];

    console.log("-> Owner Address: " + ownerAddress);
    console.log("-> Airline: " + airlineAddress);

    //Add Airline
    await flightSuretyApp.addAirline(
        airlineAddress,
        {from:airlineAddress});
    
    //Check if the airline was added
    const isAirlineAfterAdd = await flightSuretyApp.isAirline(airlineAddress);
    assert.equal(isAirlineAfterAdd, true, "The expected value should be true");

    //Remove the airline
    await flightSuretyApp.removeAirline(
        airlineAddress,
        {from:airlineAddress});
    
    //Check if the airline was added
    const isAirlineAfterRemove = await flightSuretyApp.isAirline(airlineAddress);
    assert.equal(isAirlineAfterRemove, false, "The expected value should be false");

  });

});
