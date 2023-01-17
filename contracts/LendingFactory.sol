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
    
    mapping(address => address) public registerAddresses;

    using Counters for Counters.Counter;
    Counters.Counter requestNumber;
    Counters.Counter offerNumber;
    mapping(uint256 => ReceiptDetail) public receiptBook;

    mapping(uint256 => mapping(uint=>OfferDetail)) public offerBook;

    function VendorMakeRequest(ERC721 NFTAddress, 
        uint256 tokenId, ERC20 ERC20Address,
        uint256 ERC20Amount, uint256 ERC20Rate, 
        uint256 amountOfTime) public {

        receiptBook[Counters.current(requestNumber)] = ReceiptDetail(
            msg.sender,
            address(0),
            NFTAddress,
            tokenId,
            ERC20Address,
            ERC20Amount,
            ERC20Rate,
            amountOfTime,
            0
        );
        Counters.increment(requestNumber);
    }

    function LendorMakeOffer(uint256 _requestNumber, uint256 _offerERC20Amount, 
    // 
        uint256 _offerAmountOfTime) public {
            offerBook[_requestNumber][Counters.current(offerNumber)] = OfferDetail(
                _offerERC20Amount,
                _offerAmountOfTime
            );
        // todo: update lại logic lấy số của 1 request 
    }

    function StakeHolderAcceptRequest(uint256 _requestNumber) public {
        
        ReceiptDetail storage rd = receiptBook[_requestNumber];
        address registerAddress = registerAddresses[msg.sender];
        rd.currentOwner = msg.sender;
        rd.deadLine = block.timestamp + rd.amountOfTime;

        ERC20 token = rd.ERC20Address;
        ERC721 NFT = rd.NFTAddress;

        token.transferFrom(msg.sender, rd.originalOwner, rd.ERC20Amount);
        NFT.transferFrom(rd.originalOwner, registerAddress, rd.tokenId);

        Lending ld = Lending(registerAddress);
        ld.updateMyReceiptBook(_requestNumber, rd);
    }

    function RegisterLendingContract() public {
        Lending ld = new Lending(msg.sender);
        registerAddresses[msg.sender] = address(ld);
    }
}
