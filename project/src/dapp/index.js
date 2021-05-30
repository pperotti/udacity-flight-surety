import Contract from './contract';
import './flightsurety.css';

(async() => {
    let result = null;

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
                display('Oracles', 'Trigger oracles', [ { label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp} ]);
            });
        })
    
    });

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
        //let row = section.appendChild("<div className='row'>");
        var row = document.createElement("div");
        row.className = "row";
        section.appendChild(row);

        //row.appendChild("<div className='col-sm-4 field'>" + result.label + "</div>");
        var labelTag = document.createElement("div");
        labelTag.className = "col-sm-4 field";
        labelTag.innerText = result.label;
        row.appendChild(labelTag);

        //row.appendChild("<div className='col-sm-8 field-value'>" + (result.error ? String(result.error) : String(result.value)) + "</div>");
        var valueTag = document.createElement("div");
        valueTag.className = "col-sm-8 field-value";
        valueTag.innerText = (result.error ? String(result.error) : String(result.value));
        row.appendChild(valueTag);

        section.appendChild(row);
    })
    displayDiv.appendChild(section);

}

