import Contract from './contract';
import OwnerHelper from './js/ownerHelper';
import './style.css';

var flightContract = null;
var ownerHelper = null;

(async() => {
    //LOCALHOST? This should point to the app config address.
    let contract = new Contract('localhost');
    flightContract = contract;
    ownerHelper = new OwnerHelper(contract);
    ownerHelper.initialize((error, result) => {
        
        // This can be moved inside the initialization method
        ownerHelper.display(
            'Operational Status', 
            'Check if contract is operational', 
            [ 
                {
                    label: 'Operational Status', 
                    error: error, 
                    value: result
                } 
            ]
        );

        // This can be moved inside the initialization method
        contract.getContractOwner((error, result) => {
            console.log(
                "Caller: " + contract.caller + 
                "\nOwner: " + result + 
                "\nError: " + error);
        });
        
        // This can be moved inside the initialization method.
        // Load Panel for Oracles & Airlines
        ownerHelper.loadPanels(() => {
            console.log("Oracles Loaded!");
        });

        // Start listening UI events
        ownerHelper.bindEvents();
    });

})();
