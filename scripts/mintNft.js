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
    const nft = Nft.attach("0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d")
    const nft1 = Nft.attach("0x8a90cab2b38dba80c64b7734e58ee1db38b8992e")
    await nft.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    
    await nft1.connect(singerAdmin).mint("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC")
    await nft1.connect(singerAdmin).mint("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC")
    await nft1.connect(singerAdmin).mint("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC")
    await nft1.connect(singerAdmin).mint("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC")
    await nft1.connect(singerAdmin).mint("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC")
    await nft1.connect(singerAdmin).mint("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC")
    await nft1.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft1.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft1.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft1.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft1.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft1.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft1.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft1.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft1.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft1.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft1.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft1.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft1.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft1.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft1.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft1.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await nft1.connect(singerAdmin).mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    
    await nft1.connect(singerAdmin).mint("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC")
    await nft1.connect(singerAdmin).mint("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC")
    await nft1.connect(singerAdmin).mint("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC")
    await nft1.connect(singerAdmin).mint("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC")
    await nft1.connect(singerAdmin).mint("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC")
    await nft1.connect(singerAdmin).mint("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
