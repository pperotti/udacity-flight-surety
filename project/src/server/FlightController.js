const FlightBlock = require('./Flight.js');

/**
 * Provides an interface to provide the list of flights plus 
 */
class FlightController {

    constructor() {
        console.log("Create Flight List");

        this.flights = {};

        this.flights["FLT0003"] = new FlightBlock.Flight("FLT0003", "ALN0001");
        this.flights["FLT0004"] = new FlightBlock.Flight("FLT0004", "ALN0001");

    }

    getFlights() {
        return this.flights;
    }

    updateFlightStatus(code, newStatus) {
        let currentFlight = this.flights[code];
        if (currentFlight != undefined) {
            currentFlight.updateStatus(newStatus);
        }
    }

    getFlight(code) {
        return this.flights[code];
    }

}

module.exports.FlightController = FlightController;

