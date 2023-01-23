// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./LendingBank.sol";
import "./Receipt.sol";
import "./Offer.sol";

contract LendingFactory is Receipt, Offer {
    

    using Counters for Counters.Counter;
    Counters.Counter requestNumber;
    address public lendingBank;
    mapping(address => bool) public registerAddresses;
    mapping(address => bool) public registerNFTs;
    mapping(uint256 => ReceiptDetail) public receiptBook;
    mapping(uint256 => mapping(uint256=>OfferDetail)) public offerBook;
    mapping(uint256 => uint256) public offerOrder;
    mapping(address => bool) public registerERC721;

    constructor() {
        LendingBank ld = new LendingBank();
        lendingBank = address(ld);
    }

    event VendorMakeRequest(
        address vendor,
        address lender,
        ERC721 NFTAddress,
        uint256 tokenId,
        uint256 tokenAmount,
        uint256 tokenRate,
        uint256 amountOfTime,
        uint256 deadLine
        );
    event LenderMakeOffer(
        address payable lender,
        uint256 offerTokenAmount,
        uint256 offerRate
    );
    event VendorAcceptOffer(
        address vendor,
        address lender,
        ERC721 NFTAddress,
        uint256 tokenId,
        uint256 tokenAmount,
        uint256 tokenRate,
        uint256 amountOfTime,
        uint256 deadLine
    );
    event VendorReddem();

    modifier onlyRegistered() {
        require(registerAddresses[msg.sender] != false, "Lender must registered");
        _;
    }

    function getReceiptBook(uint256 _requestNumber) public view returns(ReceiptDetail memory) {
        return receiptBook[_requestNumber];
    }

    function getOfferBook(uint256 _requestNumber ,uint256 _offerNumber) public view returns(OfferDetail memory) {
        return offerBook[_requestNumber][_offerNumber];
    }

    function vendorMakeRequest(
        ERC721 NFTAddress,
        uint256 tokenId) public {

        require(NFTAddress.ownerOf(tokenId) == msg.sender,
            "Lending: sender must have NFT");

        receiptBook[Counters.current(requestNumber)] = ReceiptDetail(
            msg.sender,
            address(0),
            NFTAddress,
            tokenId,
            0,
            0,
            0,
            0
        );
        Counters.increment(requestNumber);
        emit VendorMakeRequest(msg.sender, address(0), NFTAddress, tokenId, 0, 0, 0, 0);
    }

    function lenderMakeOffer(uint256 _requestNumber, uint256 _offerTokenAmount,
        uint256 _offerRate, uint _amountOfTime) onlyRegistered() public  {
            uint256 currentOffer = offerOrder[_requestNumber];

            offerBook[_requestNumber][currentOffer] = OfferDetail(
                payable(msg.sender),
                _offerTokenAmount,
                _offerRate,
                _amountOfTime
            );
            offerOrder[_requestNumber] += 1;
        emit LenderMakeOffer( payable(msg.sender), _offerTokenAmount, _offerRate);
    }

    function vendorAcceptOffer(uint256 _requestNumber, uint256 _offerNumber) public {
        ReceiptDetail storage rd = receiptBook[_requestNumber];
        OfferDetail memory od = offerBook[_requestNumber][_offerNumber];
        // address registerAddress = registerAddresses[od.lender];

        rd.lender = od.lender;
        rd.tokenAmount = od.offerTokenAmount;
        rd.tokenRate = od.offerRate;
        rd.amountOfTime = od.offerAmountOfTime;
        rd.deadLine = block.timestamp + od.offerAmountOfTime;

        ERC721 NFT = rd.NFTAddress;
        NFT.transferFrom(rd.vendor, lendingBank, rd.tokenId);
        od.lender.transfer(od.offerTokenAmount);
        emit VendorAcceptOffer(rd.vendor, rd.lender, rd.NFTAddress, rd.tokenId, rd.tokenAmount, rd.tokenRate, rd.amountOfTime, rd.deadLine);
    }

    function vendorRedeem(uint256 _requestNumber) public {
        ReceiptDetail memory rd = receiptBook[_requestNumber];
        // check condition
        uint256 tokenMustPaid = rd.tokenAmount * (1 + rd.tokenRate);
        payable(msg.sender).transfer(tokenMustPaid);
        LendingBank ld = LendingBank(rd.lender);
        ld.withDrawNFT(_requestNumber, rd.vendor);
    }

    function registerLending() public {
        require(registerAddresses[msg.sender] == false, "Already registor");
        registerAddresses[msg.sender] = true;
    }
}
