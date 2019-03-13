const BAToken = artifacts.require("../contracts/BAToken.sol");
const Ico = artifacts.require("../contracts/Ico.sol");

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
    	console.log("00000123");

        instanceOfBAToken = await BAToken.at(await instanceOfIco.token());
	console.log(instanceOfBAToken);
    });

    it("tests process", async () => {
	await instanceOfIco.getTokens({value: 1000000000000000000, from: user})
        assert.equal(await instanceOfBAToken.balanceOf(user), 10, "update");
    });
});