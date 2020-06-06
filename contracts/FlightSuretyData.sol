pragma solidity ^0.4.25;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    address private contractOwner;                                      // Account used to deploy contract
    bool private operational = true;                                    // Blocks all state changes throughout the contract if false
    mapping(address => bool) authorizedContracts;

    struct Airline {
      uint funding;
    }

    uint private airlineCount = 0;
    mapping(address => Airline) private airlines;
    mapping(address => uint) private votes;

    constructor() public {
        contractOwner = msg.sender;
        airlines[msg.sender] = Airline(0);
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
      return airlines[airline].funding >= 10 ether;
    }

    function registerAirline(address airline) external isAuthorized requireIsOperational {
      if( airlineCount < 4 || votes[airline]++ > airlineCount.div(2) )
        airlines[airline] = Airline(0);
    }

   /**
    * @dev Buy insurance for a flight
    *
    */   
    function buy() external payable {

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

