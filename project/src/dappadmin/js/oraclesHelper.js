// This file contains public functions required to render HTML 
export default class OracleHelper {
    constructor(sourceContract) {
        this.contract = sourceContract;
    }

    createOraclePanel(displayDiv) {
        var section = document.createElement("div");
    
        var row = document.createElement("div");
        row.className = "row";
        section.appendChild(row);
        row.appendChild(document.createElement("br"));
        row.appendChild(document.createElement("hr"));
        row.appendChild(document.createElement("br"));
    
        var labelTag = document.createElement("div");
        labelTag.className = "positive";
        labelTag.innerText = "ORACLE'S OPTIONS";
        row.appendChild(labelTag);
    
        //Table
        var table = document.createElement("table");
        table.style = "width:100%;border=5;bordercolor='white'";
        table.cellPadding=10;
    
        var row = document.createElement("tr");
    
        // Left Column
        var leftColumn = document.createElement("td");
        leftColumn.style="width:50%";
        this.createOracleList(leftColumn);
    
        // Right Column
        var rightColumn = document.createElement("td");
        rightColumn.style="width:50%";
        this.createNewOracle(rightColumn);
    
        // Adding Columns to the Row
        row.appendChild(leftColumn);
        row.appendChild(rightColumn);
    
        // Adding Row to the Table
        table.appendChild(row);
    
        // Adding the Table to Section
        section.appendChild(table);
        
        //section.appendChild(document.createElement("br"));
        //section.appendChild(document.createElement("hr"));
        //section.appendChild(document.createElement("br"));
    
        // Adding Section to the Container
        displayDiv.appendChild(section);
    }

    createOracleList(leftColumn) {

        var selectTag = document.createElement("select");
        selectTag.name="oracleList";
        selectTag.id="oracleList";
        selectTag.style="width:100%;";
    
        //Get the amount of registered oracles
        this.loadOracleList(selectTag);

        /*this.contract.getOracleList((oracleList) => {
            for (let i=0;i<10;i++ ) {
                var option = document.createElement("option");
                let oracleAddress = oracleList[i];
                option.value=oracleAddress;
                option.text ="Oracle #" + i + " (..." + oracleAddress.substring(oracleAddress.length()-4) + ")";
                selectTag.appendChild(option);
            }
        })*/

        leftColumn.appendChild(selectTag);
    
        var deleteOracleButton = document.createElement("button");
        deleteOracleButton.style="width:100%;";
        deleteOracleButton.innerText = "Remove Oracle";
        leftColumn.appendChild(deleteOracleButton);
    }

    createNewOracle(rightColumn) {

        var inputTag = document.createElement("input");

        inputTag.style="width:100%;";
        inputTag.type = "text"
        inputTag.id="oracle-address";
        inputTag.name="oracle-address";
    
        rightColumn.appendChild(inputTag)
    
        var addOracleButton = document.createElement("button");
        addOracleButton.style="width:100%;";
        addOracleButton.innerText = "Add Oracle";
        var dataIdAttribute = document.createAttribute("data-id");
        dataIdAttribute.value = "1";
        addOracleButton.setAttributeNode(dataIdAttribute);
    
        rightColumn.appendChild(addOracleButton);
    }

    registerOracleAddress() {
        let self = this;
        let address = $("#oracle-address").val();
        console.log("Add Oracle Address: " + address);
        this.contract.addOracleAddress(address, () => {
            console.log("Oracle Added!");
            self.loadOracleList();
        })
    }

    handleOracleButtonClicks(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        console.log('ProcessId: ' + processId);

        switch(processId) {
            case 1:
                this.registerOracleAddress();
                break;
        }
    }

    loadOracleList(selectTag) {
        console.log("loadoraclelist ...");

        this.contract.getOracleCount((count) => {
            console.log("Count: " + count);

            //var selectTag = $("oracleList");

            for (let i=0;i<count;i++ ) {
                var option = document.createElement("option");
                option.value=i;
                option.text ="Oracle #" + i;
                selectTag.appendChild(option);
            }
        });
    }
    
}
