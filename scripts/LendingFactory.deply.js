const hre = require("hardhat");

const main = async () => {
   const ContractLendingFactory = await hre.ethers.getContractFactory(
      "LendingFactory"
   );
   const lendingFactory = await ContractLendingFactory.deploy()
   await lendingFactory.deployed();
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})