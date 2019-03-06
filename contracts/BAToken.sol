pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract BAToken is ERC20Mintable {
    using SafeMath for uint256;

    string public name;
    string public symbol;
    uint256 public startDate;
    uint256 public endDate;
    uint8 public initialConversion;
    address payable public owner;
    
    constructor (
        string memory _name,
        string memory _symbol,
        uint8 _initialConversion
    ) public {
        require(
            initialConversion > 0
        );
        name = _name;
        symbol = _symbol;
        startDate = now;
        endDate = now+100000;
        initialConversion = _initialConversion;
        owner = msg.sender;
    }

    function getTokens() public payable {
        require(now <= endDate);

        uint256 _amount = msg.value.mul(initialConversion);
        mint(msg.sender, _amount);

        owner.transfer(address(this).balance);
        emit Transfer(address(this), msg.sender, _amount);
    }
}