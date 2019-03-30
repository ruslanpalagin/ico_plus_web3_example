pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Ico {
    using SafeMath for uint256;

    uint256 public startDate;
    uint256 public endDate;
    uint8 public initialConversion;
    address payable public owner;
    mapping(address => uint) public balances;

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
        balances[msg.sender] = 1000;
    }

    function getBalance(address userAddress) public view returns(uint) {
        return balances[userAddress];
    }

    function transferMyTokens(uint256 amount, address recipient) public {
        require(
            balances[msg.sender] >= amount &&
            amount > 0 &&
            recipient != address(0)
        );
        balances[msg.sender] -= amount;
        balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
    }

    function () external payable {
        release(msg.sender, msg.value); 
    }

    function release(address user, uint256 value) private {
	    require(now <= endDate);
        uint256 _amount = value.mul(initialConversion);
        balances[user] += _amount;
        owner.transfer(address(this).balance);
        emit Transfer(address(this), user, _amount);
    }
}