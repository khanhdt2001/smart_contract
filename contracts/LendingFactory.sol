// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Lending.sol";
import "./Receipt.sol";
import "./Offer.sol";

contract LendingFactory is Receipt, Offer {
    

    using Counters for Counters.Counter;
    Counters.Counter requestNumber;
    Counters.Counter offerNumber;

    mapping(address => address) public registerAddresses;
    mapping(uint256 => ReceiptDetail) public receiptBook;
    mapping(uint256 => mapping(uint=>OfferDetail)) public offerBook;

    modifier onlyRegistered(address _address) {
        require(registerAddresses[_address] != address(0), "Lender must registered");
        _;
    }


    function VendorMakeRequest(
        ERC721 NFTAddress,
        uint256 tokenId,
        uint256 tokenAmount,
        uint256 tokenRate,
        uint256 amountOfTime) public {

        require(NFTAddress.ownerOf(tokenId) == msg.sender,
            "Lending: sender must have NFT");

        receiptBook[Counters.current(requestNumber)] = ReceiptDetail(
            msg.sender,
            address(0),
            NFTAddress,
            tokenId,
            tokenAmount,
            tokenRate,
            amountOfTime,
            0
        );
        Counters.increment(requestNumber);
    }

    function LenderMakeOffer(uint256 _requestNumber, uint256 _offerTokenAmount,
        uint256 _offerRate) onlyRegistered(msg.sender) public  {
            offerBook[_requestNumber][Counters.current(offerNumber)] = OfferDetail(
                msg.sender,
                _offerTokenAmount,
                _offerRate
            );
        Counters.increment(offerNumber);
    }

    function VendorAcceptOffer(uint256 _requestNumber, uint256 _offerNumber) public payable {
        ReceiptDetail storage rd = receiptBook[_requestNumber];
        OfferDetail memory od = offerBook[_requestNumber][_offerNumber];
        address registerAddress = registerAddresses[od.lender];
        rd.lender = od.lender;
        rd.tokenAmount = od.offerTokenAmount;
        rd.tokenRate = od.offerRate;

        ERC721 NFT = rd.NFTAddress;
        NFT.transferFrom(rd.vendor, registerAddress, rd.tokenId);
        // od.lender.transfer()
    }

    function StakeHolderAcceptRequest(uint256 _requestNumber) public {
        
        // ReceiptDetail storage rd = receiptBook[_requestNumber];
        // address registerAddress = registerAddresses[msg.sender];
        // rd.currentOwner = msg.sender;
        // rd.deadLine = block.timestamp + rd.amountOfTime;

        // ERC20 token = rd.ERC20Address;
        // ERC721 NFT = rd.NFTAddress;

        // token.transferFrom(msg.sender, rd.originalOwner, rd.ERC20Amount);
        // NFT.transferFrom(rd.originalOwner, registerAddress, rd.tokenId);

        // Lending ld = Lending(registerAddress);
        // ld.updateMyReceiptBook(_requestNumber, rd);
    }

    function RegisterLendingContract() public {
        Lending ld = new Lending(msg.sender);
        registerAddresses[msg.sender] = address(ld);
    }
}
