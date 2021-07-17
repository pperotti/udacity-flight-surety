pragma solidity ^0.5.16; //0.4.24;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'OwnerRole' to manage this role - add, remove, check
contract AdminRole {

  using Roles for Roles.Role; 

  // Define 2 events, one for Adding, and other for Removing
  event AdminAdded(address indexed account);
  event AdminRemoved(address indexed account);

  // Define a struct 'consumers' by inheriting from 'Roles' library, struct Role
  Roles.Role private admins;

  // In the constructor make the address that deploys this contract the 1st consumer
  constructor() public {
    //TODO: Check if this is really needed?
    _addAdmin(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyAdmin() {
    require(isAdmin(msg.sender));
    _;
  }

  // Define a function 'isConsumer' to check this role
  function isAdmin(address account) public view returns (bool) {
    return admins.has(account);
  }

  // Define a function 'addAdmin' that adds this role
  function addAdmin(address account) public  { //onlyAdmin
    _addAdmin(account);
  }

  // Define a function 'renounceAdmin' to renounce this role
  function removeAdmin(address account) public {
    _removeAdmin(account);
  }

  // Define an internal function '_addAdmin' to add this role, called by 'addAdmin'
  function _addAdmin(address account) internal {
    admins.add(account);
    emit AdminAdded(account);
  }

  // Define an internal function '_removeConsumer' to remove this role, called by 'removeConsumer'
  function _removeAdmin(address account) internal {
    admins.remove(account);
    emit AdminRemoved(account);
  }
}