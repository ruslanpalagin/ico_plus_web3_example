pragma solidity 0.5.0;

import "./BAToken.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract Ico {
    using SafeMath for uint256;

    uint256 public startDate;
    uint256 public endDate;
    uint8 public initialConversion;
    address payable public owner;
    BAToken public token;

    event Transfer(
        address from,
        address to,
        uint256 amount
    );
    
    constructor (
        string memory _name,
        string memory _symbol,
        uint8 _initialConversion
    ) public {
        require(
            _initialConversion > 0
        );
        startDate = now;
        endDate = now+1000000;
        initialConversion = _initialConversion;
        owner = msg.sender;
        token = new BAToken(
            _name, 
            _symbol
        );
    }

    function getTokens() public payable {
        require(now <= endDate);

        uint256 _amount = msg.value.mul(initialConversion);
        token.mint(msg.sender, _amount);

        owner.transfer(address(this).balance);
        emit Transfer(address(this), msg.sender, _amount);
    }
}