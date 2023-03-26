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

    const setUpForVendorMakeRequest = async () => {
        await lendingFactory.registerNFT(Nft.address);
    };

    const setUpLenderMakeOffer = async () => {
        await setUpForVendorMakeRequest();

        await lendingFactory
            .connect(address1)
            .vendorMakeRequest(Nft.address, 1);
    };

    const setUpForVendorAcceptOffer = async () => {
        await setUpLenderMakeOffer();
        const ethToSend = ethers.utils.parseEther("20.0");
        await lendingFactory
            .connect(address2)
            .lenderMakeOffer(0, 12, 1814400, 3, { value: ethToSend });
    };

    const setUpForVendorPayRountine = async () => {
        await setUpForVendorAcceptOffer();
        await Nft.connect(address1).approve(lendingFactory.address, 1);
        await lendingFactory.connect(address1).vendorAcceptOffer(0, 0);
    };
    describe("vendorPayRountine", () => {
        // it("fail", async () => {
        //     await setUpForVendorPayRountine();
        //     await ethers.provider.send("evm_increaseTime", [12273800]);
        //     await expect(
        //         lendingFactory.connect(address1).vendorPayRountine(0)
        //     ).to.be.rejectedWith("Lending: Request time out");
        // });
        // it("fail", async () => {
        //     await setUpForVendorPayRountine();
        //     await expect(
        //         lendingFactory.connect(address1).vendorPayRountine(0)
        //     ).to.be.rejectedWith("Lending: Not enough eth");
        // });
        it("success", async () => {
            await setUpForVendorPayRountine();
            const ethToSend = ethers.utils.parseEther("20.0");
            const res = await lendingFactory
                .connect(address1)
                .vendorPayRountine(0, { value: ethToSend });
            await expect(res)
                .to.be.emit(lendingFactory, "VendorPayRountine")
                .withArgs(0, 1);
        });
    });
    const setUpForVendorRedeem = async () => {
        await setUpForVendorPayRountine();
    };
    describe("depositEth", () => {
        it("success", async () => {
            const res = await lendingFactory
                .connect(address1)
                .depositEth({ value: 100 });
        });
    });
    describe("withdrawEth", () => {
        it("success", async () => {
            await lendingFactory.connect(address1).depositEth({ value: 100 });
            const res = await lendingFactory.connect(address1).withdrawEth(10);
        });
    });
    describe("checkAbleToWithDrawNft", () => {
        it("should fail", async () => {
            await setUpForVendorPayRountine();

            await expect(
                
                lendingFactory.connect(address1).checkAbleToWithDrawNft(0)
            ).to.be.revertedWith("Lending: Request vendor on time");
        });
        it("should fail 123", async () => {
            await setUpForVendorPayRountine();
            await time.increase(674800)

            await expect(
                lendingFactory.connect(address2).checkAbleToWithDrawNft(0)
            ).to.be.revertedWith("Lending: Request lender on time");
        })
    });
});
