pragma solidity ^0.4.25;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    address private contractOwner;                                      // Account used to deploy contract
    bool private operational = true;                                    // Blocks all state changes throughout the contract if false
    mapping(address => bool) authorizedContracts;

    struct Airline {
      uint funding;
      mapping(address => bool) voters;
      uint votes;
      bool isRegistered;
    }

    uint private airlineCount = 0;
    mapping(address => Airline) private airlines;

    struct Insurance {
      string flight;
      uint256 timestamp;
      uint payment;
    }
    mapping(address => Insurance[]) private insurances;

    constructor(address airline) public {
        contractOwner = msg.sender;
        airlines[airline].isRegistered = true;
        airlineCount = 1;
    }

    modifier requireIsOperational() {
        require(operational, "Contract is currently not operational");
        _;
    }

    modifier requireContractOwner() {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    modifier isAuthorized() {
      require(authorizedContracts[msg.sender]);
      _;
    }

    modifier canParticipate(address airline) {
      require(airlines[airline].isRegistered && airlines[airline].funding >= 10 ether);
      _;
    }

    modifier allowMax1Ether() {
      require(msg.value <= 1 ether);
      _;
    }

    function isOperational() public view returns(bool) {
        return operational;
    }

    function setOperatingStatus(bool mode) external requireContractOwner {
        operational = mode;
    }

    function authorizeCaller(address caller) external requireContractOwner {
      authorizedContracts[caller] = true;
    }

    function deauthorizeCaller(address caller) external requireContractOwner {
      delete authorizedContracts[caller];
    }

    function isAirline(address airline) external view returns(bool) {
      return airlines[airline].isRegistered;
    }

    function registerAirline(address newAirline, address voter) external isAuthorized requireIsOperational canParticipate(voter) returns(bool, uint){
      require(this.isAirline(voter));
      Airline storage airline = airlines[newAirline];
      if(airline.voters[voter] == false) {
        airline.voters[voter] = true;
        airline.votes++;
      }
      if ( airlineCount <= 4 || airline.votes >= airlineCount.div(2) ) {
        airline.isRegistered = true;
        airlineCount++;
      }
      return (airline.isRegistered, airline.votes);
    }

    function buy(string flight, uint256 timestamp) external payable requireIsOperational allowMax1Ether {
      insurances[msg.sender].push(Insurance({ flight: flight, timestamp: timestamp, payment: msg.value }));
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

    function fund() public payable requireIsOperational {
      airlines[msg.sender].funding += msg.value;
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

