pragma solidity ^0.5.16;
//pragma solidity ^0.4.25;

// It's important to avoid vulnerabilities due to numeric overflow bugs
// OpenZeppelin's SafeMath library, when used correctly, protects agains such bugs
// More info: https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2018/november/smart-contract-insecurity-bad-arithmetic/

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./core/Ownable.sol";
import "./accesscontrol/AdminRole.sol";
import "./accesscontrol/AirlineRole.sol";
import "./accesscontrol/ConsumerRole.sol";

/************************************************** */
/* FlightSurety Smart Contract                      */
/************************************************** */
contract FlightSuretyApp is Ownable, AdminRole, AirlineRole, ConsumerRole {
    using SafeMath for uint256; // Allow SafeMath functions to be called for all uint256 types (similar to "prototype" in Javascript)

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    // Flight status codees
    uint8 private constant STATUS_CODE_UNKNOWN = 0;
    uint8 private constant STATUS_CODE_ON_TIME = 10;
    uint8 private constant STATUS_CODE_LATE_AIRLINE = 20;
    uint8 private constant STATUS_CODE_LATE_WEATHER = 30;
    uint8 private constant STATUS_CODE_LATE_TECHNICAL = 40;
    uint8 private constant STATUS_CODE_LATE_OTHER = 50;

    address private contractOwner;          // Account used to deploy contract

    struct Flight {
        bool isRegistered;
        uint8 statusCode;
        uint256 updatedTimestamp;
        address airline;
    }
    mapping(bytes32 => Flight) flights;

    // Incremented to add pseudo-randomness at various points
    uint8 private nonce = 0;    

    // Fee to be paid when registering oracle
    uint256 public constant REGISTRATION_FEE = 1 ether;

    // Number of oracles that must respond for valid status
    uint256 private constant MIN_RESPONSES = 3;

    struct Oracle {
        bool isRegistered;
        uint8[3] indexes;        
    }

    // Track all registered oracles
    mapping(address => Oracle) oracles;

    // Number of registered oracles
    uint8 registeredOracleCount = 0;

    uint256 private constant MAX_ORACLE_COUNT = 10;

    // List of registered oracles
    address[] registeredAddressList = new address[](MAX_ORACLE_COUNT);

    // Model for responses from oracles
    struct ResponseInfo {
        address requester;                              // Account that requested status
        bool isOpen;                                    // If open, oracle responses are accepted
        mapping(uint8 => address[]) responses;          // Mapping key is the status code reported
                                                        // This lets us group responses and identify
                                                        // the response that majority of the oracles
    }

    // Track all oracle responses
    mapping(uint256 => ResponseInfo) oracleResponses;
    mapping(uint256 => uint256) requesterKeys;

    // Event fired each time an oracle submits a response
    event FlightStatusInfo(
        address airline, 
        string flight, 
        uint256 timestamp, 
        uint8 status);

    // TODO: Event fired to indicate a response was received

    // Event fired to indicate the callback was invoked
    event OracleReport(
        address airline, 
        string flight, 
        uint256 timestamp, 
        uint8 status);

    // Event fired when flight status request is submitted
    // Oracles track this and if they have a matching index
    // they fetch data and submit a response
    event OracleRequest(
        uint8 index, 
        address airline, 
        string flight, 
        uint256 timestamp);

    // ------------------------
    uint requestCount = 0;
    
    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in 
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational() 
    {
         // Modify to call data contract's status
        require(true, "Contract is currently not operational");  
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    modifier isOracleNotRegistered(address newAddress) {
        require(oracles[newAddress].isRegistered == false, "The provided address is already registered");
        _;
    }

    modifier isOracleRegistrationAllowed() {
        require(registeredOracleCount < (MAX_ORACLE_COUNT-1), "Oracle registration is no longer allowed!");
        _;
    }

    /********************************************************************************************/
    /*                                       CONSTRUCTOR                                        */
    /********************************************************************************************/

    /**
    * @dev Contract constructor
    *
    */
    constructor() 
                public 
    {
        contractOwner = msg.sender;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    function isOperational() 
                            public 
                            pure 
                            returns(bool) 
    {
        return true;  // Modify to call data contract's status
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

  
   /**
    * @dev Add an airline to the registration queue
    *
    */   
    function registerAirline
                            (   
                            )
                            external
                            pure
                            returns(bool success, uint256 votes)
    {
        return (success, 0);
    }


   /**
    * @dev Register a future flight for insuring.
    *
    */  
    function registerFlight
                                (
                                )
                                external
                                pure
    {

    }

    //*****************************************************************
    //                   ORACLE REGISTRATION                          *
    //*****************************************************************

    // Register an oracle with the contract
    function registerOracle(address newOracleAddress)
                            public
                            payable
                            requireContractOwner()
                            isOracleRegistrationAllowed()
                            isOracleNotRegistered(newOracleAddress)
    {
        // Require registration fee
        require(msg.value >= REGISTRATION_FEE, "Registration fee is required");

        // Generate Unique Indexes for the new oracle
        uint8[3] memory indexes = generateIndexes(newOracleAddress);

        // Create the proper Oracla object in the Contract with its assigned indexes.
        oracles[newOracleAddress] = Oracle({
                                        isRegistered: true,
                                        indexes: indexes
                                    });

        // Save the address 
        registeredAddressList[registeredOracleCount] = newOracleAddress;

        // Increase Number 
        registeredOracleCount++;
    }

    function getOracleIndexes()
                            view
                            public
                            returns(uint8[3] memory)
    {
        require(oracles[msg.sender].isRegistered, "Not registered as an oracle");
        return oracles[msg.sender].indexes;
    }

    function isOracleRegistered() 
                            view
                            public
                            returns(bool)
    {
        return oracles[msg.sender].isRegistered;
    }

    //***********************************************************
    //                   FLIGHT STATUS                          *
    //***********************************************************
 
    // Generate a request for oracles to fetch flight information
    function fetchFlightStatus
                        (
                            address airline,
                            string memory flight,
                            uint256 timestamp                            
                        )
                        public
    {
        uint8 index = getRandomIndex(msg.sender);

        // Generate a unique key for storing the request
        //bytes32 key = keccak256(abi.encodePacked(index, airline, flight, timestamp));
        uint256 key = getResponseKey(index, airline, flight, timestamp);
        oracleResponses[key] = ResponseInfo({
            requester: msg.sender,
            isOpen: true
        });

        requesterKeys[requestCount] = key;

        //TODO: improve how to store the responses
        requestCount++;
        
        emit OracleRequest(index, airline, flight, timestamp);
    }

    function getRequestCount()
                        view
                        public
                        returns (uint)
    {
        return requestCount;
    }

    function getResponseInfo
                        (
                            uint8 index,
                            address airline,
                            string memory flight,
                            uint256 timestamp 
                        )
                        view
                        public
                        returns 
                        (
                            address requester,
                            bool    isOpen,
                            uint256 retKey
                        )
    {
        uint256 key = getResponseKey(index, airline, flight, timestamp);
        return getResponseInfoByKey(key);
    }

    function getResponseInfoByKey(uint256 key)
                        view
                        public
                        returns 
                        (
                            address requester,
                            bool    isOpen,
                            uint256 retKey
                        )
    {
        ResponseInfo memory responseInfo = oracleResponses[key];
        return 
        (
            responseInfo.requester,
            responseInfo.isOpen,
            key
        );
    }

    // Called by oracle when a response is available to an outstanding request
    // For the response to be accepted, there must be a pending request that is open
    // and matches one of the three Indexes randomly assigned to the oracle at the
    // time of registration (i.e. uninvited oracles are not welcome)
    function submitOracleResponse
                        (
                            uint8 index,
                            address airline,
                            string memory flight,
                            uint256 timestamp,
                            uint8 statusCode
                        )
                        public
    {
        //Validate the specified indexes is authorized to submit responses.
        require((oracles[msg.sender].indexes[0] == index) 
            || (oracles[msg.sender].indexes[1] == index) 
            || (oracles[msg.sender].indexes[2] == index),
            "Index does not match oracle request");

        // Identify the key needed to 
        //bytes32 key = keccak256(abi.encodePacked(index, airline, flight, timestamp)); 
        uint256 key = getResponseKey(index, airline, flight, timestamp);
        require(oracleResponses[key].isOpen, "Flight or timestamp do not match oracle request");
        
        // Persist the repsonse in the contract
        oracleResponses[key].responses[statusCode].push(msg.sender);

        // Information isn't considered verified until at least MIN_RESPONSES
        // oracles respond with the *** same *** information
        emit OracleReport(airline, flight, timestamp, statusCode);

        // The contract will notify ONLY when there are 3 responses with the same STATUS CODE.
        if (oracleResponses[key].responses[statusCode].length >= MIN_RESPONSES) {
            
            // Save the flight information for posterity
            //bytes32 flightKey = keccak256(abi.encodePacked(flight, timestamp));
            
            // Prevent any more responses since MIN_RESPONSE threshold has been reached
            oracleResponses[key].isOpen = false;
            
            // Save the filght for posterity. (TODO: check timestamp value)
            //flights[flightKey] = Flight(true, statusCode, timestamp, airline);

            //Emit Status
            emit FlightStatusInfo(airline, flight, timestamp, statusCode);
        }
    }

    function getResponseKey
                        (
                            uint8 index,
                            address airline,
                            string memory flight,
                            uint256 timestamp
                        )
                        pure
                        public
                        returns(uint256)
    {
        return uint256(keccak256(abi.encodePacked(index, airline, flight, timestamp)));
    }

    function getFlightKey
                        (
                            address airline,
                            string memory flight,
                            uint256 timestamp
                        )
                        pure
                        internal
                        returns(bytes32) 
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    // Returns array of three non-duplicating integers from 0-9
    function generateIndexes
                            (                       
                                address account         
                            )
                            internal
                            returns(uint8[3] memory)
    {
        uint8[3] memory indexes;
        indexes[0] = getRandomIndex(account);
        
        indexes[1] = indexes[0];
        while(indexes[1] == indexes[0]) {
            indexes[1] = getRandomIndex(account);
        }

        indexes[2] = indexes[1];
        while((indexes[2] == indexes[0]) || (indexes[2] == indexes[1])) {
            indexes[2] = getRandomIndex(account);
        }

        return indexes;
    }

    // Returns array of three non-duplicating integers from 0-9
    function getRandomIndex
                            (
                                address account
                            )
                            internal
                            returns (uint8)
    {
        uint8 maxValue = 10;

        // Pseudo random number...the incrementing nonce adds variation
        uint8 random = uint8(uint256(keccak256(abi.encodePacked(blockhash(block.number - nonce++), account))) % maxValue);

        if (nonce > 250) {
            nonce = 0;  // Can only fetch blockhashes for last 256 blocks so we adapt
        }

        return random;
    }

    function getRequesters() view public returns (address[] memory) {
        address[] memory all = new address[](requestCount);
        for(uint i=0;i<requestCount;i++) {
            ResponseInfo memory ri = oracleResponses[requesterKeys[i]];
            all[i] = ri.requester;
        }
        return all;
    }

    function getContractOwner() public view returns (address) {
        return contractOwner;
    } 

    function getRegisteredOracleCount() 
                                    public 
                                    view 
                                    onlyOwner()
                                    returns (uint8) 
    {
        return registeredOracleCount;
    }

    function getOracleAddress(uint8 index) 
                                    public 
                                    view 
                                    onlyOwner()
                                    returns(address) 
    {
        return registeredAddressList[index];
    }

/*
    function requireRegistration(address _address) public view returns (bool) {
        if (isFarmer(_address)) {
        return false;
        } else if (isDistributor(_address)) {
        return false;
        } else if (isRetailer(_address)) {
        return false;
        } else if (isConsumer(_address)) {
        return false;
        } else {
        return true;
        }
    }
    */

}   
