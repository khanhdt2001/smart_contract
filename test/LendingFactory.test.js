const {
   time,
   loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LendingFactory", function () {
   let [admin, address1, address2] = [];

   beforeEach(async () => {
      [admin, address1, address2] = await ethers.getSigners();
      const ContractLendingFactory = await ethers.getContractFactory(
         "LendingFactory"
      );
      const ContractNft = await ethers.getContractFactory("SampleNFT");
      // depoly contract
      lendingFactory = await ContractLendingFactory.deploy();
      await lendingFactory.deployed();

      contractNft = await ContractNft.deploy();
      await contractNft.deployed();

      // mint 4 nft for adr1

      contractNft.mint(address1);
      contractNft.mint(address1);
      contractNft.mint(address1);
      contractNft.mint(address1);
   });
   // Testing
   describe("registerLending", () => {
      it("successfully", async () => {
         const res = await lendingFactory.connect(address2).registerLending();
         await expect(res).to.emit(lendingFactory, "RegisterLending").withArgs(address2.address)
      });
   });
});
