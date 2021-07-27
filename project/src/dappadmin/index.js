import Contract from './contract';
import './style.css';

var flightContract = null;

(async() => {
    //LOCALHOST? This should point to the app config address.
    let contract = new Contract('localhost', () => {
        // Read transaction
        contract.isOperational((error, result) => {
            console.log(error,result);
            display('Operational Status', 'Check if contract is operational', [ { label: 'Operational Status', error: error, value: result} ]);
        });
    
        contract.getContractOwner((error, result) => {
            console.log(error, result);

            //TODO: Display Option Panel or else
            console.log(
                "\nCaller: " + contract.caller + 
                "\nOwner: " + result);
        });
        
        contract.isOwner((error, result) => {
            console.log(error, result);
            if (result) {
                showOwnerPanel();
            } else {
                showNotOwnerPanel();
            }
        });
    });
    flightContract = contract;
})();

function display(title, description, results) {

    var displayDiv = document.getElementById("display-wrapper");
    var section = document.createElement("div");
    var titleTag = document.createElement("h2");
    titleTag.innerText = title;
    section.appendChild(titleTag);

    //var descriptionTag = document.createElement("h5");
    //descriptionTag.innerText = description;
    //section.appendChild(descriptionTag);
    
    results.map((result) => {

        var row = document.createElement("div");
        row.className = "row";
        section.appendChild(row);

        //var labelTag = document.createElement("div");
        //labelTag.className = "col-sm-4 field";
        //labelTag.innerText = result.label;
        //row.appendChild(labelTag);

        var valueTag = document.createElement("div");
        valueTag.className = "col-sm-8 field-value";
        valueTag.innerText = (result.error ? String(result.error) : "Active");
        row.appendChild(valueTag);

        section.appendChild(row);
    })
    displayDiv.appendChild(section);

}

function showNotOwnerPanel() {
    var displayDiv = document.getElementById("display-wrapper");
    var section = document.createElement("div");
    
    var row = document.createElement("div");
    row.className = "row";
    section.appendChild(row);
    row.appendChild(document.createElement("br"));
    row.appendChild(document.createElement("hr"));
    row.appendChild(document.createElement("br"));

    var labelTag = document.createElement("div");
    labelTag.className = "error";
    labelTag.innerText = "You are NOT the owner of the contract!!!!";
    row.appendChild(labelTag);

    displayDiv.appendChild(section);
}

function showOwnerPanel() {
    var displayDiv = document.getElementById("display-wrapper");
    var section = document.createElement("div");

    var row = document.createElement("div");
    row.className = "row";
    section.appendChild(row);
    row.appendChild(document.createElement("br"));
    row.appendChild(document.createElement("hr"));
    row.appendChild(document.createElement("br"));

    var labelTag = document.createElement("div");
    labelTag.className = "positive";
    labelTag.innerText = "Welcome! Here are the owner's options";
    row.appendChild(labelTag);

    displayDiv.appendChild(section);
}

