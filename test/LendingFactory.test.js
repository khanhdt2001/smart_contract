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

    // -------------------------------------------------------------------------
    describe("function registerNFT", () => {
        it("should fail with Ownable: caller is not the owner", async () => {
            await expect(
                lendingFactory
                    .connect(address2)
                    .registerNFT("0x8a90cab2b38dba80c64b7734e58ee1db38b8992e")
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
        it("should fail with Ownable: caller is not the owner", async () => {
            await expect(
                lendingFactory
                    .connect(address1)
                    .registerNFT("0x8a90cab2b38dba80c64b7734e58ee1db38b8992e")
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
        it("should fail with Already registor", async () => {
            await lendingFactory.registerNFT(
                "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e"
            );
            await expect(
                lendingFactory.registerNFT(
                    "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e"
                )
            ).to.be.revertedWith("Already registor");
        });
        it("should fail with Already registor", async () => {
            await lendingFactory.registerNFT(
                "0x8a90cab2b38dba80c64b7734e58ee1db38b8992a"
            );
            await expect(
                lendingFactory.registerNFT(
                    "0x8a90cab2b38dba80c64b7734e58ee1db38b8992a"
                )
            ).to.be.revertedWith("Already registor");
        });
        it("should pass", async () => {
            const res = await lendingFactory.registerNFT(
                "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e"
            );
            await expect(res)
                .to.emit(lendingFactory, "RegisterNFT")
                .withArgs("0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e");
        });
        it("should pass", async () => {
            await lendingFactory.registerNFT(
                "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e"
            );
            const res = await lendingFactory.registerNFT(
                "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"
            );
            await expect(res)
                .to.emit(lendingFactory, "RegisterNFT")
                .withArgs("0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D");
        });
    });
    describe("funtion unRegisterNFT", () => {
        it("should fail with Ownable: caller is not the owner", async () => {
            await expect(
                lendingFactory
                    .connect(address2)
                    .unRegisterNFT("0x8a90cab2b38dba80c64b7734e58ee1db38b8992e")
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
        it("should fail with Ownable: caller is not the owner", async () => {
            await expect(
                lendingFactory
                    .connect(address1)
                    .unRegisterNFT("0x8a90cab2b38dba80c64b7734e58ee1db38b8992e")
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
        it("should fail with Already un-registor", async () => {
            await expect(
                lendingFactory.unRegisterNFT(
                    "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e"
                )
            ).to.be.revertedWith("Already un-registor");
        });
        it("should fail with Already un-registor", async () => {
            await expect(
                lendingFactory.unRegisterNFT(
                    "0x8a90cab2b38dba80c64b7734e58ee1db38b8992a"
                )
            ).to.be.revertedWith("Already un-registor");
        });
        it("should pass", async () => {
            await lendingFactory.registerNFT(
                "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e"
            );
            const res = await lendingFactory.unRegisterNFT(
                "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e"
            );
            await expect(res)
                .to.emit(lendingFactory, "UnRegisterNFT")
                .withArgs("0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e");
        });
        it("should pass", async () => {
            await lendingFactory.registerNFT(
                "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e"
            );
            await lendingFactory.registerNFT(
                "0x8a90cab2b38dba80c64b7734e58ee1db38b8992a"
            );
            const res = await lendingFactory.unRegisterNFT(
                "0x8a90cab2b38dba80c64b7734e58ee1db38b8992a"
            );
            await expect(res)
                .to.emit(lendingFactory, "UnRegisterNFT")
                .withArgs("0x8A90CAb2B38DbA80c64b7734e58EE1DB38b8992a");
        });
    });
    describe("function vendorMakeRequest", () => {
        it("should fail with ERC721: invalid token ID", async () => {
            await expect(
                lendingFactory.vendorMakeRequest(Nft.address, 6)
            ).to.be.revertedWith("ERC721: invalid token ID");
        });
        it("should fail with ERC721: invalid token ID", async () => {
            await expect(
                lendingFactory
                    .connect(address1)
                    .vendorMakeRequest(Nft.address, 6)
            ).to.be.revertedWith("ERC721: invalid token ID");
        });
        it("should fail with Lending: sender must have NFT", async () => {
            await expect(
                lendingFactory.vendorMakeRequest(Nft.address, 1)
            ).to.be.revertedWith("Lending: sender must have NFT");
        });
        it("should fail with Lending: sender must have NFT", async () => {
            await expect(
                lendingFactory
                    .connect(address1)
                    .vendorMakeRequest(Nft.address, 4)
            ).to.be.revertedWith("Lending: sender must have NFT");
        });
        it("should fail with Lending: nft already in market", async () => {
            await lendingFactory
                .connect(address1)
                .vendorMakeRequest(Nft.address, 1);
            await expect(
                lendingFactory
                    .connect(address1)
                    .vendorMakeRequest(Nft.address, 1)
            ).to.be.revertedWith("Lending: nft already in market");
        });
        it("should fail with Lending: nft already in market", async () => {
            await lendingFactory
                .connect(address2)
                .vendorMakeRequest(Nft.address, 4);
            await expect(
                lendingFactory
                    .connect(address2)
                    .vendorMakeRequest(Nft.address, 4)
            ).to.be.revertedWith("Lending: nft already in market");
        });
        it("should pass", async () => {
            const res = await lendingFactory
                .connect(address1)
                .vendorMakeRequest(Nft.address, 1);
            await expect(res)
                .to.emit(lendingFactory, "VendorMakeRequest")
                .withArgs(address1.address, Nft.address, 1, 0);
        });
        it("should pass", async () => {
            await lendingFactory
                .connect(address1)
                .vendorMakeRequest(Nft.address, 1);
            const res = await lendingFactory
                .connect(address1)
                .vendorMakeRequest(Nft.address, 2);
            await expect(res)
                .to.emit(lendingFactory, "VendorMakeRequest")
                .withArgs(address1.address, Nft.address, 2, 1);
        });
    });

    const setUpLenderMakeOffer = async () => {
        await Nft.connect(address1).approve(lendingFactory.address, 0);
        await Nft.connect(address1).approve(lendingFactory.address, 1);
        await Nft.connect(address1).approve(lendingFactory.address, 2);

        await lendingFactory
            .connect(address1)
            .vendorMakeRequest(Nft.address, 0);
        await lendingFactory
            .connect(address1)
            .vendorMakeRequest(Nft.address, 1);
        await lendingFactory
            .connect(address1)
            .vendorMakeRequest(Nft.address, 2);
    };
    describe("function lenderMakeOffer", () => {
        it("should fail with Lending: receipt must exist", async () => {
            await expect(
                lendingFactory.lenderMakeOffer(0, 0, 0, 0)
            ).to.be.revertedWith("Lending: receipt must exist");
        });
        it("should fail with Lending: receipt must exist", async () => {
            await expect(
                lendingFactory.connect(address2).lenderMakeOffer(0, 0, 0, 0)
            ).to.be.revertedWith("Lending: receipt must exist");
        });
        it("should fail with Lending: offer time and payment time are not valid", async () => {
            await setUpLenderMakeOffer();
            await expect(
                lendingFactory.connect(address2).lenderMakeOffer(0, 5, 1, 1)
            ).to.be.revertedWith(
                "Lending: offer time and payment time are not valid"
            );
        });
        it("should fail with Lending: offer time and payment time are not valid", async () => {
            await setUpLenderMakeOffer();
            await expect(
                lendingFactory.lenderMakeOffer(0, 5, 1, 1)
            ).to.be.revertedWith(
                "Lending: offer time and payment time are not valid"
            );
        });
        it("should fail with Lending: receipt must still available", async () => {
            await setUpLenderMakeOffer();
            const ethToSend = ethers.utils.parseEther("20.0");
            await lendingFactory
                .connect(address2)
                .lenderMakeOffer(0, 10, 691200, 1, { value: ethToSend });
            await lendingFactory.connect(address1).vendorAcceptOffer(0, 0);
            await expect(
                lendingFactory
                    .connect(address2)
                    .lenderMakeOffer(0, 10, 691200, 1, { value: ethToSend })
            ).to.be.revertedWith("Lending: receipt must still available");
        });
        it("should fail with Lending: receipt must still available", async () => {
            await setUpLenderMakeOffer();
            const ethToSend = ethers.utils.parseEther("20.0");
            await lendingFactory
                .connect(address2)
                .lenderMakeOffer(0, 10, 691200, 1, { value: ethToSend });
            await lendingFactory.connect(address1).vendorAcceptOffer(0, 0);
            await expect(
                lendingFactory
                    .connect(address1)
                    .lenderMakeOffer(0, 10, 691200, 1, { value: ethToSend })
            ).to.be.revertedWith("Lending: receipt must still available");
        });
        it("should pass", async () => {
            await setUpLenderMakeOffer();
            const ethToSend = ethers.utils.parseEther("20.0");
            const res = await lendingFactory
                .connect(address2)
                .lenderMakeOffer(0, 10, 691200, 1, { value: ethToSend });
            await expect(res)
                .to.emit(lendingFactory, "LenderMakeOffer")
                .withArgs(address2.address, 0, 0, ethToSend, 10, 691200, 1);
        });
        it("should pass", async () => {
            await setUpLenderMakeOffer();
            const ethToSend = ethers.utils.parseEther("20.0");
            const res = await lendingFactory.lenderMakeOffer(0, 10, 691200, 1, {
                value: ethToSend,
            });
            await expect(res)
                .to.emit(lendingFactory, "LenderMakeOffer")
                .withArgs(admin.address, 0, 0, ethToSend, 10, 691200, 1);
        });
    });
    const setUpForVendorAcceptOffer = async () => {
        await setUpLenderMakeOffer();
        const ethToSend = ethers.utils.parseEther("20.0");
        await lendingFactory
            .connect(address2)
            .lenderMakeOffer(0, 12, 1814400, 3, { value: ethToSend });
    };
    describe("function vendorAcceptOffer", () => {
        it("should fail with Lending: Must be Vendor", async () => {
            await expect(
                lendingFactory.connect(admin).vendorAcceptOffer(0, 0)
            ).to.be.revertedWith("Lending: Must be Vendor");
        });
        it("should fail with Lending: Must be Vendor", async () => {
            await expect(
                lendingFactory.connect(address2).vendorAcceptOffer(0, 0)
            ).to.be.revertedWith("Lending: Must be Vendor");
        });
        it("should fail with Lending: Must be Vendor", async () => {
            await expect(
                lendingFactory.connect(address2).vendorAcceptOffer(0, 1)
            ).to.be.revertedWith("Lending: Must be Vendor");
        });
        it("should fail with Lending: offer must exist", async () => {
            await setUpForVendorAcceptOffer();
            await expect(
                lendingFactory.connect(address1).vendorAcceptOffer(0, 1)
            ).to.be.revertedWith("Lending: offer must exist");
        });
        it("should fail with Lending: offer must exist", async () => {
            await setUpForVendorAcceptOffer();
            await expect(
                lendingFactory.connect(address1).vendorAcceptOffer(0, 2)
            ).to.be.revertedWith("Lending: offer must exist");
        });
        it("should fail with Lending: Lender balance does not support", async () => {
            await setUpForVendorAcceptOffer();
            await lendingFactory.connect(address2).withdrawEth(10);
            await expect(
                lendingFactory.connect(address1).vendorAcceptOffer(0, 0)
            ).to.be.revertedWith("Lending: Lender balance does not support");
        });
        it("should fail with Lending: Lender balance does not support", async () => {
            await setUpForVendorAcceptOffer();
            await lendingFactory.connect(address2).withdrawEth(11);
            await expect(
                lendingFactory.connect(address1).vendorAcceptOffer(0, 0)
            ).to.be.revertedWith("Lending: Lender balance does not support");
        });
        it("should pass", async () => {
            await setUpForVendorAcceptOffer();
            const res = await lendingFactory
                .connect(address1)
                .vendorAcceptOffer(0, 0);
            await expect(res).to.emit(lendingFactory, "VendorAcceptOffer");
        });
    });

    const setUpForVendorPayRountine = async () => {
        await setUpForVendorAcceptOffer();
        await lendingFactory.connect(address1).vendorAcceptOffer(0, 0);
    };

    describe("function vendorPayRountine", () => {
        it("should fail with Lending: Not enough eth", async () => {
            await setUpForVendorPayRountine();
            const ethToSend = ethers.utils.parseEther("1.0");
            await expect(
                lendingFactory
                    .connect(address1)
                    .vendorPayRountine(0, { value: ethToSend })
            ).to.be.revertedWith("Lending: Not enough eth");
        });
        it("should fail with Lending: Not enough eth", async () => {
            await setUpForVendorPayRountine();
            const ethToSend = ethers.utils.parseEther("5.0");
            await expect(
                lendingFactory
                    .connect(address1)
                    .vendorPayRountine(0, { value: ethToSend })
            ).to.be.revertedWith("Lending: Not enough eth");
        });
        it("should fail with Lending: Request time out", async () => {
            await setUpForVendorPayRountine();
            const ethToSend = ethers.utils.parseEther("5.0");
            await ethers.provider.send("evm_increaseTime", [12273800]);
            await expect(
                lendingFactory
                    .connect(address1)
                    .vendorPayRountine(0, { value: ethToSend })
            ).to.be.revertedWith("Lending: Request time out");
        });
        it("should fail with Lending: Paid done", async () => {
            await setUpForVendorPayRountine();
            const ethToSend = ethers.utils.parseEther("10.0");
            await lendingFactory
                .connect(address1)
                .vendorPayRountine(0, { value: ethToSend });
            await lendingFactory
                .connect(address1)
                .vendorPayRountine(0, { value: ethToSend });
            await lendingFactory
                .connect(address1)
                .vendorPayRountine(0, { value: ethToSend });
            await expect(
                lendingFactory
                    .connect(address1)
                    .vendorPayRountine(0, { value: ethToSend })
            ).to.be.revertedWith("Lending: Paid done");
        });
        it("should pass", async () => {
            await setUpForVendorPayRountine();
            const ethToSend = ethers.utils.parseEther("10.0");
            const res = await lendingFactory
                .connect(address1)
                .vendorPayRountine(0, { value: ethToSend });
            await expect(res).to.emit(lendingFactory, "VendorPayRountine");
        });
        it("should pass", async () => {
            await setUpForVendorPayRountine();
            const ethToSend = ethers.utils.parseEther("10.0");
            await lendingFactory
                .connect(address1)
                .vendorPayRountine(0, { value: ethToSend });
            const res = await lendingFactory
                .connect(address1)
                .vendorPayRountine(0, { value: ethToSend });
            await expect(res).to.emit(lendingFactory, "VendorPayRountine");
        });
    });
    describe("function withdrawNFT", () => {
        it("should fail with Lending: not able to access", async () => {
            await setUpForVendorPayRountine();
            await expect(lendingFactory.withdrawNFT(0)).to.be.revertedWith(
                "Lending: not able to access"
            );
        });
        it("should fail with Lending: Request on time || lender site", async () => {
            await setUpForVendorPayRountine();
            await expect(
                lendingFactory.connect(address2).withdrawNFT(0)
            ).to.be.revertedWith("Lending: Request on time");
        });
        it("should fail with Lending: Request on time || vendor site", async () => {
            await setUpForVendorPayRountine();
            await expect(
                lendingFactory.connect(address1).withdrawNFT(0)
            ).to.be.revertedWith("Lending: Request on time");
        });
        it("should pass || vendor site", async () => {
            await setUpForVendorPayRountine();
            const ethToSend = ethers.utils.parseEther("10.0");
            await lendingFactory
                .connect(address1)
                .vendorPayRountine(0, { value: ethToSend });
            await lendingFactory
                .connect(address1)
                .vendorPayRountine(0, { value: ethToSend });
            await lendingFactory
                .connect(address1)
                .vendorPayRountine(0, { value: ethToSend });

            const res = await lendingFactory.connect(address1).withdrawNFT(0);
            await expect(res).to.emit(lendingFactory, "WithDrawNFT");
        });
        it("should pass || lender site", async () => {
            await setUpForVendorPayRountine();
            const ethToSend = ethers.utils.parseEther("10.0");
            await lendingFactory
                .connect(address1)
                .vendorPayRountine(0, { value: ethToSend });

            await ethers.provider.send("evm_increaseTime", [12273800]);
            const res = await lendingFactory.connect(address2).withdrawNFT(0);
            await expect(res).to.emit(lendingFactory, "WithDrawNFT");
        });
    });
});
