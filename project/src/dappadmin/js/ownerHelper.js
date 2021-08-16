import OracleHelper from './oraclesHelper.js';
import AirlinesHelper from './airlinesHelper.js';

// Encapsulate Owner's Functionalities.
export default class OwnerHelper {

    constructor(sourceContract) {
        this.contract = sourceContract;
        this.oraclesHelper = new OracleHelper(this.contract);
        this.airlinesHelper = new AirlinesHelper(this.contract);
    }

    initialize(initializationCallback) {
        this.contract.initialize(initializationCallback)
    }

    display(title, description, results) {
        var displayDiv = document.getElementById("display-wrapper");
        var section = document.createElement("div");
        var titleTag = document.createElement("h2");
        titleTag.innerText = title;
        section.appendChild(titleTag);
        
        results.map((result) => {

            var row = document.createElement("div");
            row.className = "row";
            section.appendChild(row);

            var valueTag = document.createElement("div");
            valueTag.className = "col-sm-8 field-value";
            valueTag.innerText = (result.error ? String(result.error) : "Active");
            row.appendChild(valueTag);

            section.appendChild(row);
        })
        displayDiv.appendChild(section);
    }

    loadPanels(loadingCallback) {
        this.contract.isOwner((error, result) => {
            console.log(error, result);
            if (result) {
                this.showOwnerPanel();
            } else {
                this.showNotOwnerPanel();
            }
            loadingCallback();
        });
    }

    showOwnerPanel() {
        var displayDiv = document.getElementById("display-wrapper");
        
        // Create UI for oracle list
        this.oraclesHelper.createOraclePanel(displayDiv);
        this.oraclesHelper.loadOracleList();

        // Create UI for Airlines
        this.airlinesHelper.createAirlinesPanel(displayDiv);
    }

    showNotOwnerPanel() {
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

    bindEvents() {
        var self = this;
        $(document).on('click', (event) => {
            self.oraclesHelper.handleOracleButtonClicks(event);
        });

        //Register to listen for an event

    }

}