/*
const AdminApp = {

    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",

    handleButtonClick: function(event) {
        event.preventDefault();

        var processId = parseInt($(event.target).data('id'));
        console.log('ProcessId: ' + processId);
/ *
        switch(processId) {
            case 11:
                return AdminApp.registerAccount(event);
            case 12:
                return AdminApp.returnToRegistration(event);
            }
            * /
    },

    fetchEvents: async function () {
        if (typeof AdminApp.contracts.FlightSuretyApp.currentProvider.sendAsync !== "function") {
            AdminApp.contracts.FlightSuretyApp.currentProvider.sendAsync = function () {
                return App.contracts.FlightSuretyApp.currentProvider.send.apply(
                    App.contracts.FlightSuretyApp.currentProvider,
                    arguments
                );
            };
        }

        AdminApp.contracts.FlightSuretyApp.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log) {
            console.log("Err: " + err + " Log: " + log);
            if (!err)
              $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
            console.log(err.message);
        });  
    },

    /*
    checkAccountRoles: function() {
        console.log("checkAccountRoles() - Address: " + App.metamaskAccountID);
        
        App.contracts.FlightSuretyApp.deployed().then(function(instance) {
            return instance.requireRegistration(App.metamaskAccountID);
        }).then(function(result) {
            console.log("requireRegistration: " + result);
            if (result == true || result === undefined) {
                return App.showRegistrationError();
            }
        });
    },
    * /

    /*
    registerAccount: async function() {
        const sc = await App.contracts.FlightSuretyApp.deployed();
        sc.getSender().then(function(res) {
            console.log("Sender: " + res);
        }); 
        return sc.addAdmin(App.metamaskAccountID, {from: App.metamaskAccountID})
            .then(() => App.showAdminOps(sc))
            .catch(function(err) {
                console.log(err);
            });
    },
    * /

    showRegistrationError: function() {
        console.log("We cannot register at this time!");
    },

    showAdminOps: function() {
        console.log("Show Admin Options!");     
    },
    
    returnToRegistration: function(event) {
        console.log("Return to Registration!");
    },
};
*/

/*
$(function () {
    $(window).load(function () {
        console.log("loadng admin app...");
    });
});
*/
