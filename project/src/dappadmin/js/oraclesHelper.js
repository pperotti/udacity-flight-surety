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

        var leftColumnContainer = document.createElement("div");
        leftColumnContainer.name="leftColumnContainer";
        leftColumnContainer.id="leftColumnContainer";
        
        leftColumn.appendChild(leftColumnContainer);
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
        
        // Adding Section to the Container
        displayDiv.appendChild(section);
    }

    createOracleList(leftColumn) {

        var showOracleButton = document.createElement("button");
        showOracleButton.style="width:100%;";
        showOracleButton.innerText = "Show Oracle's Address";

        var dataIdAttribute = document.createAttribute("data-id");
        dataIdAttribute.value = "1002";
        showOracleButton.setAttributeNode(dataIdAttribute);

        leftColumn.appendChild(showOracleButton);
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
        dataIdAttribute.value = "1001";
        addOracleButton.setAttributeNode(dataIdAttribute);
    
        rightColumn.appendChild(addOracleButton);
    }

    handleOracleButtonClicks(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        console.log('ProcessId: ' + processId);

        switch(processId) {
            case 1001:
                this.registerOracleAddress();
                break;
            case 1002:
                this.showAddress();
                break;
        }
    }

    registerOracleAddress() {
        let self = this;
        let address = $("#oracle-address").val();
        console.log("Add Oracle Address: " + address);
        self.contract.addOracleAddress(address, () => {
            console.log("Oracle Added!");
            this.contract.getOracleCount((count) => {
               console.log("Accounts Available: " + count);
               self.loadOracleList(); 
            });
        })
    }

    loadOracleList() {
        console.log("loadoraclelist ...");
        var leftColumnContainer = document.getElementById("leftColumnContainer");
        var selectTag = document.getElementById("oracleList");
        if (selectTag !== undefined && leftColumnContainer.contains(selectTag)) {
            leftColumnContainer.removeChild(selectTag);
        }

        //Add Select Tag
        var selectTag = document.createElement("select");
        selectTag.name="oracleList";
        selectTag.id="oracleList";
        selectTag.style="width:100%;";
        leftColumnContainer.appendChild(selectTag);
        
        // Add items
        this.contract.getOracleCount((count) => {
            console.log("Count: " + count);
            for (let i=0;i<count;i++ ) {
                var option = document.createElement("option");
                option.value=i;
                option.text ="Oracle #" + i;
                selectTag.appendChild(option);
            }
        });
    }

    showAddress() {
        var currentAddressIndex = document.getElementById("oracleList").value;
        console.log("get address index: " + currentAddressIndex);

        this.contract.getOracleAddressById(currentAddressIndex, (address) => {
            console.log("Received Address:" + address);
            alert("The complete address for the selected oracle is: " + address);
        })
    }

}
