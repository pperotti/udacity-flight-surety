pragma solidity ^0.5.16;
//pragma solidity ^0.4.25;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner;                                      // Account used to deploy contract
    bool private operational = true;                                    // Blocks all state changes throughout the contract if false

    // Airline Definition
    struct Airline {
        address airline;
        uint256 votes;
        mapping(address => bool) voters;
        bool    isInvited;
        bool    isAccepted;
    }

    // Airline List
    mapping(address => Airline) fsAirlines;

    // Number of airlines 
    uint256 airlinesCount = 0;

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/
    
    // Event fired to report the amount of votes available in an Airline
    event AirlineStatus(
        address airline,
        uint256 votes,
        bool    isAccepted
    );

    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor
                                (
                                ) 
                                public 
    {
        contractOwner = msg.sender;
    }

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
        require(operational, "Contract is currently not operational");
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

    /**
     * Modifier required to validate is an address has been invited or not
     */
     modifier isAirlineInvited(
                                address airlineAddress
                              ) 
    {
        require(fsAirlines[airlineAddress].isInvited, "This airline hasn't been invited yet.");
        _;
     }

    /**
     * Modifier required to validate is an address has been invited or not
     */
     modifier isAirlineNotInvitedYet(
                                        address airlineAddress
                                    ) 
    {
        require(fsAirlines[airlineAddress].isInvited == false, "This airline has been invited already.");
        _;
     }

    /**
     * Modifier required to validate the address has NOT been fully accepted
     */
    modifier isAirlineNotAcceptedYet(
                                        address airlineAddress
                                    ) 
    {
        require(fsAirlines[airlineAddress].isAccepted == false, "This airline hasn't been already accepted.");
        _;
    }

    /**
     * MOdifier required to validate the address has been fully accepted
     */
    modifier isAirlineAccepted(address airlineAddress) {
        require(fsAirlines[airlineAddress].isAccepted, "This airline has been already accepted.");
        _;
    }

    /**
     * Modifier check if the caller has already voted for the specified airline
     */
    modifier airlineVotedAlready(address airlineAddress) {
        require(fsAirlines[airlineAddress].voters[msg.sender] == true, "This airline already voted");
        _;
    }

    /**
     * Modifier check if the caller has NOT already voted for the specified airline
     */
    modifier airlineNotVotedAlready(address airlineAddress) {
        require(fsAirlines[airlineAddress].voters[msg.sender] == false, "This airline has no votes from caller");
        _;
    } 


    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */      
    function isOperational() 
                            public 
                            view 
                            returns(bool) 
    {
        return operational;
    }


    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */    
    function setOperatingStatus
                            (
                                bool mode
                            ) 
                            external
                            requireContractOwner 
    {
        operational = mode;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

   /**
    * @dev Add an airline to the registration queue
    *      Can only be called from FlightSuretyApp contract
    *
    */   
    /*function registerAirline
                            (   
                            )
                            external
                            pure
    {
        //Removed on purpose. I splitted the functinality in 2 methods in order to improve the design.
    }*/

    /**
     * Invite an airline to be part of the system. This method will fail if the airline has been already invited or accepted
     */
    function createAirline(
                            address airlineAddress
                          )
                          external
                          requireContractOwner()
                          isAirlineNotInvitedYet(airlineAddress)
                          isAirlineNotAcceptedYet(airlineAddress)                          
    {
        // Add the airline to the invitation queue
        fsAirlines[airlineAddress] = Airline({
            airline: airlineAddress,
            votes: 0,
            isInvited: true,
            isAccepted: false
        });
    }

    /**
     * Add a vote for the specified airline if this hasn't been fully accepted yet 
     * but it has been invited.
     */
    function voteAirline(
                            address airlineAddress
                        ) 
                        external
                        requireContractOwner()
                        isAirlineInvited(airlineAddress)
                        isAirlineNotAcceptedYet(airlineAddress)
                        airlineNotVotedAlready(airlineAddress)
    {
        // Add a vote
        fsAirlines[airlineAddress].votes++;

        // Add the caller as valid voter
        fsAirlines[airlineAddress].voters[airlineAddress] = true;
    }

    /**
     * Retrieve the number of airline registered
     */
    function getAcceptedAirlineCount() 
                                        view
                                        external
                                        requireContractOwner()
                                        returns (uint256)
    {
        return airlinesCount;
    }
    
    /**
     * Retrieve the number of accumulated votes
     */
    function getVoteCount(
                            address airlineAddress
                         )
                         external
                         requireContractOwner()
                         isAirlineInvited(airlineAddress)
                         returns (uint256)
    {
        return fsAirlines[airlineAddress].votes;
    }

    /**
     * Accept Airline
     */
    function acceptAirline(
                            address airlineAddress
                          )
                          external
                          requireContractOwner()
                          isAirlineInvited(airlineAddress)
                          isAirlineNotAcceptedYet(airlineAddress)
                          airlineNotVotedAlready(airlineAddress)                         
    {
        
        // Mark airline as accepted
        fsAirlines[airlineAddress].isAccepted = true;

        // Emit event reporting it was directly added
        emit AirlineStatus(
            airlineAddress, 
            fsAirlines[airlineAddress].votes,
            fsAirlines[airlineAddress].isAccepted 
        );
    }

   /**
    * @dev Buy insurance for a flight
    *
    */   
    function buy(                             
                )
                external
                payable
    {

    }

    /**
     *  @dev Credits payouts to insurees
    */
    function creditInsurees
                                (
                                )
                                external
                                pure
    {
    }
    

    /**
     *  @dev Transfers eligible payout funds to insuree
     *
    */
    function pay
                            (
                            )
                            external
                            pure
    {
    }

   /**
    * @dev Initial funding for the insurance. Unless there are too many delayed flights
    *      resulting in insurance payouts, the contract should be self-sustaining
    *
    */   
    function fund
                            (   
                            )
                            public
                            payable
    {
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

    /**
    * @dev Fallback function for funding smart contract.
    *
    */
    function() 
                            external 
                            payable 
    {
        fund();
    }


}

