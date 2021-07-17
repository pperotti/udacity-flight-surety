pragma solidity ^0.5.16; //0.4.24;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'ConsumerRole' to manage this role - add, remove, check
contract AirlineRole {

  using Roles for Roles.Role; 

  // Define 2 events, one for Adding, and other for Removing
  event AirlineAdded(address indexed account);
  event AirlineRemoved(address indexed account);

  // Define a struct 'consumers' by inheriting from 'Roles' library, struct Role
  Roles.Role private airlines;

  // In the constructor make the address that deploys this contract the 1st consumer
  constructor() public {
    //TODO: Check if this is really needed?
    _addAirline(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyAirline() {
    require(isAirline(msg.sender));
    _;
  }

  // Define a function 'isAirline' to check this role
  function isAirline(address account) public view returns (bool) {
    return airlines.has(account);
  }

  // Define a function 'addAirline' that adds this role
  function addAirline(address account) public  {
    _addAirline(account);
  }

  // Define a function 'renounceAirline' to renounce this role
  function removeAirline(address account) public {
    _removeAirline(account);
  }

  // Define an internal function '_addAirline' to add this role, called by 'addAirline'
  function _addAirline(address account) internal {
    airlines.add(account);
    emit AirlineAdded(account);
  }

  // Define an internal function '_removeAirline' to remove this role, called by '_removeAirline'
  function _removeAirline(address account) internal {
    airlines.remove(account);
    emit AirlineRemoved(account);
  }
}