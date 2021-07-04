const FlightBlock = require('./Flight.js');

/**
 * Provides an interface to provide the list of flights plus 
 */
class FlightController {

    constructor() {
        console.log("Create Flight List");

        //Dictionary that holds a flat structure with all the flights available regardless the airline.
        this.flights = {};

        //Dictionary that holds the flights grouped by airline
        this.airlines = {};

        // Data initialization - Setting up the flights
        this.flights["FLT0001"] = new FlightBlock.Flight("FLT0001", "ALN0001");
        this.flights["FLT0002"] = new FlightBlock.Flight("FLT0002", "ALN0001");
        this.flights["FLT0003"] = new FlightBlock.Flight("FLT0003", "ALN0002");
        this.flights["FLT0004"] = new FlightBlock.Flight("FLT0004", "ALN0002");

        // Data initialization - Setting up the airlines
        this.airlines['ALN0001'] = [
            this.flights["FLT0001"],
            this.flights["FLT0002"]
        ];
        this.airlines['ALN0002'] = [
            this.flights["FLT0003"],
            this.flights["FLT0004"]
        ];
        
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

    getAirlines() {
        return this.airlines;
    }

    getFlightsByAirline(code) {
        return this.airlines[code];
    }
}

module.exports.FlightController = FlightController;

