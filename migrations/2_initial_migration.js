const Ico = artifacts.require("Ico");

module.exports = function(deployer) {
  deployer.deploy(Ico, "BATLOCAL", "BTL", 100);
};
