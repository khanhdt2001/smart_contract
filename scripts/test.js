const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
async function main() {
   const Lend = await ethers.getContractFactory("LendingFactory");
   const Nft = await ethers.getContractFactory("SampleNFT");
   const accounts = await ethers.provider.listAccounts();
   const [admin, address1, address2] = accounts;
   const signer1 = ethers.provider.getSigner(address1);
   const signer2 = ethers.provider.getSigner(address2);


   const lend = await Lend.attach("0x5fbdb2315678afecb367f032d93f642f64180aa3");
   const nft = await Nft.attach("0xe7f1725e7734ce288f8367e1bb143e90bb3f0512");

   const res = await nft.ownerOf(0);
   await nft.connect(signer1).approve("0x5fbdb2315678afecb367f032d93f642f64180aa3", 0)
   await lend.connect(signer1).vendorMakeRequest("0xe7f1725e7734ce288f8367e1bb143e90bb3f0512", 0)
   console.log(res);
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   });
