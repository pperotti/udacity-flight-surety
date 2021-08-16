import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    constructor(network) {
        let config = Config[network];
        this.web3Provider = null;
        this.flightSuretyApp = null;
        this.contractAddress = config.appAddress;
        this.owner = null;
        this.caller = null;
        this.airlines = [];
        this.passengers = [];
    }

    initialize(callback) {

        console.log("Owner: " + this.owner);

        this.loadWeb3();
        this.loadContract();
        this.loadCaller(callback);       
    }

    loadWeb3() {
        // Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            console.log("window.ethereum");
            this.web3Provider = window.ethereum;
            try {
                // Request account access
                window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            console.log("window.web3");
            this.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            console.log("Incompatible Browser!");
            //Web3 is NOT imported. 
            console.error("It looks you don't have Metamask Wallet plugin installed.");
            $("#ftc-error").append("<h1 style='text-align:center;color:red'>It looks you don't have Metamask Wallet plugin installed.<br>Please check the setup instructions to run the project.</h1>")
            return;
        }

        this.web3 = new Web3(this.web3Provider);
    }

    loadContract() {
        this.flightSuretyApp = new this.web3.eth.Contract(
            FlightSuretyApp.abi, 
            this.contractAddress
        );
        this.flightSuretyApp.configureDataContract(config.dataAddress);
    }

    loadCaller(callback) {
        this.web3.eth.getAccounts((error, accts) => {
            this.caller = accts[0];
            this.owner = accts[0];
            console.log("Caller: " + this.caller + " Owner: " + this.owner);
            callback(error, accts);
        });
    }

    isOperational(callback) {
       let self = this;
       self.flightSuretyApp.methods
            .isOperational()
            .call({from: self.owner}, callback);
    }

    getContractOwner(callback) {
        this.flightSuretyApp.methods
            .getContractOwner()
            .call(callback);
    }

    isOwner(callback) {
        let self = this;
        self.flightSuretyApp.methods
            .isOwner()
            .call({from: self.owner}, callback)
    }

    getOracleCount(callback) {
        let self = this;
        self.flightSuretyApp.methods
            .getRegisteredOracleCount()
            .call({from: self.owner})
            .then(c => 
                {
                    callback(c);
                }
            );
    }

    getOracleAddressById(id, callback) {
        let self = this;
        self.flightSuretyApp.methods
            .getOracleAddress(id)
            .call({from: self.owner})
            .then((addr) => {
                console.log("Oracle Address: " + addr);
                callback(addr);
            })
    }

    addOracleAddress(oracleAddress, callback) {
        let self = this;
        self.flightSuretyApp.methods
            .registerOracle(oracleAddress)
            .send({from: self.owner, value:1000000000000000000, gas:200000}, 
                (error, result) => {
                    console.log("Error: " + error + "\nResult: " + result);
                    callback();
                });
    }

}