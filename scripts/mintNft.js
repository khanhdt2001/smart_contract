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
    const nft = Nft.attach("0xe7f1725e7734ce288f8367e1bb143e90bb3f0512")
    await nft.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    const res = await nft.ownerOf(3)
    console.log(res);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
