const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
async function main() {
   const Lend = await ethers.getContractFactory("LendingFactory");
   const Nft = await ethers.getContractFactory("SampleNFT");
   const accounts = await ethers.provider.listAccounts();
   const [admin, address1, address2] = accounts;
   const signer1 = ethers.provider.getSigner(address1);
   const signer2 = ethers.provider.getSigner(address2);
   const singerAdmin = ethers.provider.getSigner(admin);



   const lend = await Lend.attach("0x5fbdb2315678afecb367f032d93f642f64180aa3");
   const nft = await Nft.attach("0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d");
   await nft.connect(singerAdmin).mint(address1)


   const res = await nft.ownerOf(0);
   await nft.connect(signer1).approve("0x5fbdb2315678afecb367f032d93f642f64180aa3", 0)
   await lend.connect(signer1).vendorMakeRequest("0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d", 0)
   console.log(res);
   console.log(address1);
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   });
