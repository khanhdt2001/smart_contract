const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
async function main() {
   const Lend = await ethers.getContractFactory("LendingFactory");

   const accounts = await ethers.provider.listAccounts();
   const [admin, address1, address2] = accounts;
   const signer1 = ethers.provider.getSigner(address1);

   // console.log(admin, address1, address2);
   const lend = await Lend.attach("0x5fbdb2315678afecb367f032d93f642f64180aa3");
   await lend.connect(signer1).registerLending();
//    const status = await lend.connect(signer1).registerAddresses("0x5fbdb2315678afecb367f032d93f642f64180aa3")
//    console.log(status);
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   });
