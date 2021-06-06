//Valid Statuses
const STATUS_CODE_UNKNOWN = 0;
const STATUS_CODE_ON_TIME = 10;
const STATUS_CODE_LATE_AIRLINE = 20;
const STATUS_CODE_LATE_WEATHER = 30;
const STATUS_CODE_LATE_TECHNICAL = 40;
const STATUS_CODE_LATE_OTHER = 50;

class Flight {

    constructor(code, airlineCode) {
        this.code = code;
        this.airlineCode = airlineCode;
        this.status = STATUS_CODE_UNKNOWN;
    }

    //Update Status to a valid new
    updateStatus(newStatus) {
        // Determine if the new status is valid
        if (newStatus == STATUS_CODE_UNKNOWN ||  
            newStatus == STATUS_CODE_ON_TIME || 
            newStatus == STATUS_CODE_LATE_AIRLINE || 
            newStatus == STATUS_CODE_LATE_WEATHER || 
            newStatus == STATUS_CODE_LATE_TECHNICAL || 
            newStatus == STATUS_CODE_LATE_OTHER
            ) {
            this.status = newStatus;
        }
    }

}

module.exports.Flight = Flight;
