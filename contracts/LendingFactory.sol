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

    mapping(address => address) public registerAddresses;
    mapping(uint256 => ReceiptDetail) public receiptBook;
    mapping(uint256 => mapping(uint256=>OfferDetail)) public offerBook;
    mapping(uint256 => uint256) public offerOrder;
    mapping(address => bool) public registerERC721;

    modifier onlyRegistered() {
        require(registerAddresses[msg.sender] != address(0), "Lender must registered");
        _;
    }

    function getReceiptBook(uint256 _requestNumber) public view returns(ReceiptDetail memory) {
        return receiptBook[_requestNumber];
    }

    function getOfferBook(uint256 _requestNumber ,uint256 _offerNumber) public view returns(OfferDetail memory) {
        return offerBook[_requestNumber][_offerNumber];
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
        uint256 _offerRate) onlyRegistered() public  {
            uint256 currentOffer = offerOrder[_requestNumber];

            offerBook[_requestNumber][currentOffer] = OfferDetail(
                payable(msg.sender),
                _offerTokenAmount,
                _offerRate
            );
            offerOrder[_requestNumber] += 1;
      
    }

    function VendorAcceptOffer(uint256 _requestNumber, uint256 _offerNumber) public {
        ReceiptDetail storage rd = receiptBook[_requestNumber];
        OfferDetail memory od = offerBook[_requestNumber][_offerNumber];
        address registerAddress = registerAddresses[od.lender];

        rd.lender = od.lender;
        rd.tokenAmount = od.offerTokenAmount;
        rd.tokenRate = od.offerRate;

        ERC721 NFT = rd.NFTAddress;
        NFT.transferFrom(rd.vendor, registerAddress, rd.tokenId);
        od.lender.transfer(od.offerTokenAmount);
    }

    function VendorRedeem(uint256 _requestNumber) public {
        ReceiptDetail memory rd = receiptBook[_requestNumber];
        // check condition
        uint256 tokenMustPaid = rd.tokenAmount * (1 + rd.tokenRate);
        payable(msg.sender).transfer(tokenMustPaid);
        Lending ld = Lending(rd.lender);
        ld.vendorRedeem(_requestNumber);
    }

    function RegisterLendingContract() public {
        Lending ld = new Lending(msg.sender);
        registerAddresses[msg.sender] = address(ld);
    }
}
