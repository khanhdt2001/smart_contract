const hre = require("hardhat");

const main = async () => {
   const SampleNFT = await hre.ethers.getContractFactory(
      "SampleNFT"
   );
   const sampleNFT = await SampleNFT.deploy()
   await sampleNFT.deployed();
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})