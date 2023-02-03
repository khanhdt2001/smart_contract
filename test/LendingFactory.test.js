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

      Nft = await ContractNft.deploy();
      await Nft.deployed();

      // mint 4 nft for adr1

      await Nft.mint(address1.address);
      await Nft.mint(address1.address);
      await Nft.mint(address1.address);
      await Nft.mint(address1.address);
      await Nft.mint(address2.address);
   });
   // Testing
   describe("registerLending", () => {
      it("fail", async () => {
         await lendingFactory.connect(address2).registerLending();
         await expect(
            lendingFactory.connect(address2).registerLending()
         ).to.be.revertedWith("Already registor");
      });
      it("successfully", async () => {
         const res = await lendingFactory.connect(address2).registerLending();
         await expect(res)
            .to.emit(lendingFactory, "RegisterLending")
            .withArgs(address2.address);
      });
   });

   describe("registerNFT", () => {
      it("fail", async () => {
         await expect(
            lendingFactory.connect(address1).registerNFT(Nft.address)
         ).to.be.revertedWith("Ownable: caller is not the owner");
      });
      it("fail", async () => {
         await lendingFactory.registerNFT(Nft.address);
         await expect(
            lendingFactory.registerNFT(Nft.address)
         ).to.be.revertedWith("Already registor");
      });
      it("success", async () => {
         const res = await lendingFactory.registerNFT(Nft.address);
         await expect(res)
            .to.emit(lendingFactory, "RegisterNFT")
            .withArgs(Nft.address);
      });
   });

   const setUpForVendorMakeRequest = async () => {
      await lendingFactory.registerNFT(Nft.address);
      await lendingFactory.connect(address1).registerLending();
   };

   describe("vendorMakeRequest", () => {
      it("fail", async () => {
         await expect(
            lendingFactory.connect(address1).vendorMakeRequest(Nft.address, 5)
         ).to.be.revertedWith("Address must be registered");
      });
      it("fail", async () => {
         await setUpForVendorMakeRequest();
         await expect(
            lendingFactory.connect(address1).vendorMakeRequest(Nft.address, 5)
         ).to.be.revertedWith("ERC721: invalid token ID");
      });
      it("fail", async () => {
         await setUpForVendorMakeRequest();
         await expect(
            lendingFactory.connect(address1).vendorMakeRequest(Nft.address, 4)
         ).to.be.revertedWith("Lending: sender must have NFT");
      });
      it("success", async () => {
         await setUpForVendorMakeRequest();
         const res = await lendingFactory
            .connect(address1)
            .vendorMakeRequest(Nft.address, 1);
         await expect(res)
            .to.be.emit(lendingFactory, "VendorMakeRequest")
            .withArgs(address1.address, Nft.address, 1);
      });
   });

   const setUpLenderMakeOffer = async () => {
      await setUpForVendorMakeRequest();
      await lendingFactory.connect(address2).registerLending();
      await lendingFactory.connect(address1).vendorMakeRequest(Nft.address, 1);
   };

   describe("lenderMakeOffer", () => {
      it("fail", async () => {
         await expect(
            lendingFactory.connect(address2).lenderMakeOffer(1, 10, 12, 3600)
         ).to.be.revertedWith("Address must be registered");
      });
      it("fail", async () => {
         await setUpLenderMakeOffer();
         await expect(
            lendingFactory.connect(address2).lenderMakeOffer(1, 10, 12, 3600)
         ).to.be.revertedWith("Lending: receipt must exist");
      });
      it("success", async () => {
         await setUpLenderMakeOffer();
         const res = await lendingFactory
            .connect(address2)
            .lenderMakeOffer(0, 10, 12, 3600);
         await expect(res)
            .to.be.emit(lendingFactory, "LenderMakeOffer")
            .withArgs(address2.address, 0, 0, 10, 12, 3600);
      });
      it("success", async () => {
         await setUpLenderMakeOffer();
         await lendingFactory
            .connect(address2)
            .lenderMakeOffer(0, 10, 12, 3600);
         const res = await lendingFactory
            .connect(address2)
            .lenderMakeOffer(0, 10, 12, 3600);
         await expect(res)
            .to.be.emit(lendingFactory, "LenderMakeOffer")
            .withArgs(address2.address, 0, 1, 10, 12, 3600);
      });
   });

   const setUpForVendorAcceptOffer = async () => {
      await setUpLenderMakeOffer();
      await lendingFactory.connect(address2).lenderMakeOffer(0, 10, 12, 3600);
   };

   describe("vendorAcceptOffer", () => {
      it("fail", async () => {
         await expect(
            lendingFactory.connect(address1).vendorAcceptOffer(1, 20)
         ).to.be.revertedWith("Address must be registered");
      });
      it("fail", async () => {
         await expect(
            lendingFactory.vendorAcceptOffer(1, 20)
         ).to.be.revertedWith("Address must be registered");
      });
      it("fail", async () => {
         await setUpForVendorAcceptOffer();
         await expect(
            lendingFactory.connect(address2).vendorAcceptOffer(0, 0)
         ).to.be.revertedWith("Lending: Must be Vendor");
      });
      it("fail", async () => {
         await setUpForVendorAcceptOffer();
         await expect(
            lendingFactory.connect(address1).vendorAcceptOffer(0, 1)
         ).to.be.revertedWith("Lending: offer must exist");
      });
      it("success", async () => {
         await setUpForVendorAcceptOffer();
         console.log(address2.address);
         
         await Nft.connect(address1).approve(lendingFactory.address, 1)
         const res = await lendingFactory
            .connect(address1)
            .vendorAcceptOffer(0, 0);
         await expect(res)
            .to.be.emit(lendingFactory, "VendorAcceptOffer")
            .withArgs(0, 0);
      });
   });
});
