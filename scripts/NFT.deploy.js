const hre = require("hardhat");
const nft = require("../artifacts/contracts/SampleNFT.sol/SampleNFT.json")
const main = async () => {
   const SampleNFT = await hre.ethers.getContractFactory(
      "SampleNFT"
   );
   const sampleNFT = await SampleNFT.deploy()
   await sampleNFT.deployed();
   await network.provider.send("hardhat_setCode", [
      "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
      nft.deployedBytecode
    ]);
   
    const SampleNFT1 = await hre.ethers.getContractFactory(
      "SampleNFT"
   );
   const sampleNFT1 = await SampleNFT1.deploy()
   await sampleNFT1.deployed();
   await network.provider.send("hardhat_setCode", [
      "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e",
      nft.deployedBytecode
    ]);
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})