export default class AirlinesHelper {
    constructor(sourceContract) {
        this.contract = sourceContract;
    }

    createAirlinesPanel(displayDiv) {

        var section = document.createElement("div");
    
        var row = document.createElement("div");
        row.className = "row";
        section.appendChild(row);
        row.appendChild(document.createElement("br"));
        row.appendChild(document.createElement("hr"));
        row.appendChild(document.createElement("br"));
    
        var labelTag = document.createElement("div");
        labelTag.className = "positive";
        labelTag.innerText = "AIRLINES' OPTIONS";
        row.appendChild(labelTag);
    
        //Table
        var table = document.createElement("table");
        table.style = "width:100%;border=5;bordercolor='white'";
        table.cellPadding=10;
    
        var row = document.createElement("tr");
    
        // Left Column
        var leftColumn = document.createElement("td");
        leftColumn.style="width:50%";
        //createOracleList(leftColumn);
        
        var airlineLeftValue = document.createElement("div");
        airlineLeftValue.innerText = "AIRLINE LEFT COLUMN";
        leftColumn.appendChild(airlineLeftValue);
    
        // Right Column
        var rightColumn = document.createElement("td");
        rightColumn.style="width:50%";
        //createNewOracle(rightColumn);
        var airlineRightValue = document.createElement("div");
        airlineRightValue.innerText = "AIRLINE RIGHT COLUMN";
        rightColumn.appendChild(airlineRightValue);
    
    
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
}