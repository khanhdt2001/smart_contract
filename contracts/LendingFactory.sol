// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./LendingBank.sol";
import "./Receipt.sol";
import "./Offer.sol";

contract LendingFactory is Receipt, Offer, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter requestNumber;
    address public lendingBank;
    mapping(address => bool) public registerAddresses;
    mapping(address => bool) public registerNFTs;
    mapping(uint256 => ReceiptDetail) public receiptBook;
    mapping(uint256 => mapping(uint256 => OfferDetail)) public offerBook;
    mapping(uint256 => uint256) public offerOrder;
    mapping(address => bool) public registerERC721;

    constructor() Ownable() {
        LendingBank ld = new LendingBank();
        lendingBank = address(ld);
    }

    event VendorMakeRequest(address vendor, ERC721 NFTAddress, uint256 tokenId);
    event LenderMakeOffer(
        address payable lender,
        uint256 requestNumber,
        uint256 offerNumber,
        uint256 offerTokenAmount,
        uint256 offerRate,
        uint256 offerAmountOfTime
    );
    event VendorAcceptOffer(
        uint256 requestNumber,
        uint256 offerNumber
    );
    event VendorReddem(uint256 requestNumber);
    event VendorExtend(uint256 requestNumber, uint256 deadLine);
    event RegisterLending(address _address);
    event RegisterNFT(address NFTAddress);

    modifier onlyRegistered() {
        require(
            registerAddresses[msg.sender] != false,
            "Address must be registered"
        );
        _;
    }
    modifier onlyVendor(uint256 _requestNumber) {
        require(
            receiptBook[_requestNumber].vendor == msg.sender,
            "Lending: Must be Vendor"
        );
        _;
    }

    function getReceiptBook(uint256 _requestNumber)
        public
        view
        returns (ReceiptDetail memory)
    {
        return receiptBook[_requestNumber];
    }

    function getOfferBook(uint256 _requestNumber, uint256 _offerNumber)
        public
        view
        returns (OfferDetail memory)
    {
        return offerBook[_requestNumber][_offerNumber];
    }

    function vendorMakeRequest(ERC721 NFTAddress, uint256 tokenId)
        public
        onlyRegistered
    {
        require(
            NFTAddress.ownerOf(tokenId) == msg.sender,
            "Lending: sender must have NFT"
        );

        receiptBook[Counters.current(requestNumber)] = ReceiptDetail(
            msg.sender,
            address(0),
            NFTAddress,
            tokenId,
            0,
            0,
            0,
            0,
            0
        );
        Counters.increment(requestNumber);
        emit VendorMakeRequest(msg.sender, NFTAddress, tokenId);
    }

    function lenderMakeOffer(
        uint256 _requestNumber,
        uint256 _offerTokenAmount,
        uint256 _offerRate,
        uint256 _amountOfTime
    ) public onlyRegistered {
        uint256 currentOffer = offerOrder[_requestNumber];

        require(
            receiptBook[_requestNumber].vendor != address(0),
            "Lending: receipt must exist"
        );
        offerBook[_requestNumber][currentOffer] = OfferDetail(
            payable(msg.sender),
            _offerTokenAmount,
            _offerRate,
            _amountOfTime
        );
        offerOrder[_requestNumber] += 1;
        emit LenderMakeOffer(
            payable(msg.sender),
            _requestNumber,
            currentOffer,
            _offerTokenAmount,
            _offerRate,
            _amountOfTime
        );
    }

    function vendorAcceptOffer(uint256 _requestNumber, uint256 _offerNumber)
        public onlyRegistered onlyVendor(_requestNumber)
    {
        ReceiptDetail storage rd = receiptBook[_requestNumber];
        OfferDetail memory od = offerBook[_requestNumber][_offerNumber];
        require(od.lender != address(0), "Lending: offer must exist");

        rd.lender = od.lender;
        rd.tokenAmount = od.offerTokenAmount;
        rd.tokenRate = od.offerRate;
        rd.amountOfTime = od.offerAmountOfTime;
        rd.deadLine = block.timestamp + od.offerAmountOfTime;

        ERC721 NFT = rd.NFTAddress;
        NFT.transferFrom(rd.vendor, lendingBank, rd.tokenId);
        od.lender.call{value: od.offerTokenAmount};
        emit VendorAcceptOffer(
            _requestNumber,
            _offerNumber
        );
    }

    /*
calculate method:
A borrow B 100 mil with rate 12% per 12 months
1 month interest        = (100 mil * 12%) /12 = 1.000.000
A has to paid B 1 month = 100.000.000/12 + 1.000.000 = 9.333.333   
*/

    function vendorPayRountine(uint256 _requestNumber) public {
        ReceiptDetail storage rd = receiptBook[_requestNumber];
        uint256 tokenMustPaid = ((rd.tokenAmount * rd.tokenRate) / 100);
        payable(msg.sender).transfer(tokenMustPaid);
        rd.deadLine = rd.deadLine + rd.amountOfTime;
        emit VendorExtend(_requestNumber, rd.deadLine);
    }

    function vendorRedeem(uint256 _requestNumber) public {
        ReceiptDetail memory rd = receiptBook[_requestNumber];
        // check condition
        uint256 tokenMustPaid = rd.tokenAmount * (1 + rd.tokenRate);
        payable(msg.sender).transfer(tokenMustPaid);
        LendingBank ld = LendingBank(rd.lender);
        ld.withdrawNFT(_requestNumber, rd.vendor);
        emit VendorReddem(_requestNumber);
    }

    function registerLending() public {
        require(registerAddresses[msg.sender] != true, "Already registor");
        registerAddresses[msg.sender] = true;
        emit RegisterLending(msg.sender);
    }

    function registerNFT(ERC721 _NFTAddress) public onlyOwner {
        require(registerNFTs[address(_NFTAddress)] != true, "Already registor");
        registerNFTs[address(_NFTAddress)] = true;
        emit RegisterNFT(address(_NFTAddress));
    }
}
