
const Test = require('../config/testConfig.js');
const truffleAssert = require('truffle-assertions');
const FSA = artifacts.require('FlightSuretyApp');
const BigNumber = require('bignumber.js');

contract('Flight Surety - Consumer Role Tests', async (accounts) => {

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
  // CHECKING CONSUMER-RELATED ROLES 
  //*********************************

  it("Add Consumer - Event Emition Validation", async function () {
    
    console.log("\n---------------------------")
    console.log("TEST: Add Consumer")
    console.log("---------------------------")

    var consumerAddress = accounts[1];

    console.log("-> Owner Address: " + ownerAddress);
    console.log("-> Consumer: " + consumerAddress);

    //Add Admin
    truffleAssert.eventEmitted(await flightSuretyApp.addConsumer(
      consumerAddress,
        {from:consumerAddress}), 
        "ConsumerAdded", 
        (ev) => {
            assert.equal(ev.account, consumerAddress, "The new account is not the expected one");
            return true;
        }
    );
  });

  it("Remove Consumer - Event Emition Validation", async function () {
    console.log("\n---------------------------")
    console.log("TEST: Remove Consumer")
    console.log("---------------------------")

    var consumerAddress = accounts[1];

    console.log("-> Owner Address: " + ownerAddress);
    console.log("-> Consumer: " + consumerAddress);

    //Check if event was properly fired
    truffleAssert.eventEmitted(await flightSuretyApp.removeConsumer(
      consumerAddress,
        {from:consumerAddress}), 
        "ConsumerRemoved", 
        (ev) => {
            assert.equal(ev.account, consumerAddress, "The new account is not the expected one");
            return true;
        }
    );
  });
 
  it("Is Consumer?", async function () {

    console.log("\n---------------------------")
    console.log("TEST: Is Consumer")
    console.log("---------------------------")

    var consumerAddress = accounts[1];

    console.log("-> Owner Address: " + ownerAddress);
    console.log("-> Consumer: " + consumerAddress);

    //Add Airline
    await flightSuretyApp.addConsumer(
      consumerAddress,
        {from:consumerAddress});
    
    //Check if the airline was added
    const isConsumerAfterAdd = await flightSuretyApp.isConsumer(consumerAddress);
    assert.equal(isConsumerAfterAdd, true, "The expected value should be true");

    //Remove the airline
    await flightSuretyApp.removeConsumer(
      consumerAddress,
        {from:consumerAddress});
    
    //Check if the airline was added
    const isConsumerAfterRemove = await flightSuretyApp.isConsumer(consumerAddress);
    assert.equal(isConsumerAfterRemove, false, "The expected value should be false");

  });

});
