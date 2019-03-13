const BAToken = artifacts.require("../contracts/BAToken.sol");

contract('Fight', function (accounts) {
    
    var appOwner = accounts[0];
    var user = accounts[1];

    var tokenAddress;
    var instanceOfBAToken;
    var instanceOfIco;

    let comment = "London is the capital of GB";
    let amount = 100;

    beforeEach("init", async () => {
        instanceOfIco = await Ico.new(
            "BAToken",
            "GT",
            10,
            {from: appOwner}
        );
    
        instanceOfBAToken = await web3.eth.contract(BAToken.abi).at(await instanceOfIco.token().address);
    });

    it("tests process", async () => {
        await web3.eth.sendTransaction({to: instanceOfIco.address, from: user, value: web3.toWei("1", "ether")})
        assert.equal(await instanceOfBAToken.balanceOf(user).toNumber(), 10, "update");
    });
});