
const Test = require('../config/testConfig.js');
const truffleAssert = require('truffle-assertions');
const FSA = artifacts.require('FlightSuretyApp');
const BigNumber = require('bignumber.js');

contract('Flight Surety - Admin Role Tests', async (accounts) => {

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
  // CHECKING ADMIN-RELATED ROLES 
  //*********************************

  it("Add Admin - Event Emition Validation", async function () {
    
    console.log("---------------------------")
    console.log("TEST: Add Admin")
    console.log("---------------------------")

    var adminAddress = accounts[1];

    console.log("-> Owner Address: " + ownerAddress);
    console.log("-> Admin: " + adminAddress);

    //Add Admin
    truffleAssert.eventEmitted(await flightSuretyApp.addAdmin(
      adminAddress,
        {from:adminAddress}), 
        "AdminAdded", 
        (ev) => {
            assert.equal(ev.account, adminAddress, "The new account is not the expected one");
            return true;
        }
    );
  });

  it("Remove Admin - Event Emition Validation", async function () {
    console.log("---------------------------")
    console.log("TEST: Remove Admin")
    console.log("---------------------------")

    var adminAddress = accounts[1];

    console.log("-> Owner Address: " + ownerAddress);
    console.log("-> Admin: " + adminAddress);

    //Check if event was properly fired
    truffleAssert.eventEmitted(await flightSuretyApp.removeAdmin(
      adminAddress,
        {from:adminAddress}), 
        "AdminRemoved", 
        (ev) => {
            assert.equal(ev.account, adminAddress, "The new account is not the expected one");
            return true;
        }
    );
  });
 
  it("Is Admin?", async function () {

    console.log("---------------------------")
    console.log("TEST: Is Admin")
    console.log("---------------------------")

    var adminAddress = accounts[1];

    console.log("-> Owner Address: " + ownerAddress);
    console.log("-> Admin: " + adminAddress);

    //Add Airline
    await flightSuretyApp.addAdmin(
      adminAddress,
        {from:adminAddress});
    
    //Check if the airline was added
    const isAdminAfterAdd = await flightSuretyApp.isAdmin(adminAddress);
    assert.equal(isAdminAfterAdd, true, "The expected value should be true");

    //Remove the airline
    await flightSuretyApp.removeAdmin(
      adminAddress,
        {from:adminAddress});
    
    //Check if the airline was added
    const isAdminAfterRemove = await flightSuretyApp.isAdmin(adminAddress);
    assert.equal(isAdminAfterRemove, false, "The expected value should be false");

  });

});
