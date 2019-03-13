pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";

contract BAToken is ERC20Mintable {

    string public name;
    string public symbol;
    
    constructor (
        string memory _name,
        string memory _symbol
    ) public {
        name = _name;
        symbol = _symbol;
    }
}