import Contract from './contract';
import './flightsurety.css';

var flightContract = null;

(async() => {
    let result = null;

    //LOCALHOST? This should point to the app config address.
    let contract = new Contract('localhost', () => {
        // Read transaction
        contract.isOperational((error, result) => {
            console.log(error,result);
            display('Operational Status', 'Check if contract is operational', [ { label: 'Operational Status', error: error, value: result} ]);
        });
    
        // User-submitted transaction
        document.getElementById('submit-oracle').addEventListener('click', () => {
            let flight = document.getElementById('flight-number').value;
            // Write transaction
            contract.fetchFlightStatus(flight, (error, result) => {
                console.log("Result:");
                console.log(result);

                display('Oracles', 'Trigger oracles', [ { label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp + ' ' + result.airline} ]);
            });
        })
    });
    flightContract = contract;
})();

function display(title, description, results) {

    var displayDiv = document.getElementById("display-wrapper");
    var section = document.createElement("div");
    var titleTag = document.createElement("h2");
    titleTag.innerText = title;
    section.appendChild(titleTag);

    var descriptionTag = document.createElement("h5");
    descriptionTag.innerText = description;
    section.appendChild(descriptionTag);
    
    results.map((result) => {

        var row = document.createElement("div");
        row.className = "row";
        section.appendChild(row);

        var labelTag = document.createElement("div");
        labelTag.className = "col-sm-4 field";
        labelTag.innerText = result.label;
        row.appendChild(labelTag);

        var valueTag = document.createElement("div");
        valueTag.className = "col-sm-8 field-value";
        valueTag.innerText = (result.error ? String(result.error) : String(result.value));
        row.appendChild(valueTag);

        section.appendChild(row);
    })
    displayDiv.appendChild(section);

}

