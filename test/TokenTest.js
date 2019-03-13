const BAToken = artifacts.require("../contracts/BAToken.sol");

contract('Fight', function (accounts) {
    
    var appOwner = accounts[0];
    var user = accounts[1];

    let tokenAddress;

    let comment = "London is the capital of GB";
    let amount = 100;

    beforeEach("init", async () => {
        instanceOfBAToken = await BAToken.new(
            comment,
            comment,
            1000,
            {from: appOwner}
        );
    
        tokenAddress = instanceOfBAToken.address;
    });

    it("tests process", async () => {
        web3.eth.sendTransaction({to:tokenAddress, from:user, value:web3.toWei("1", "ether")}, {from: user})
        // assert.equal(await instanceOfBAToken.balanceOf(user).toNumber(), 1000, "update");
    });
});