// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Lending.sol";

contract LendingFactory {
    
    struct Receipt {
        address originalOwner;
        address currentOwner;
        ERC721 NFTAddress;
        uint256 tokenId;
        ERC20 ERC20Address;
        uint256 ERC20Amount;
        uint256 ERC20Rate;
        uint256 amountOfTime;
        uint256 deadLine;
    }

    mapping(address => address) public registerAddresses;

    using Counters for Counters.Counter;
    Counters.Counter requestNumber;

    mapping(uint256 => Receipt) public receiptBook;

    function LenderMakeRequest(ERC721 NFTAddress, 
        uint256 tokenId, ERC20 ERC20Address,
        uint256 ERC20Amount, uint256 ERC20Rate, 
        uint256 amountOfTime) public {

        receiptBook[Counters.current(requestNumber)] = Receipt(
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

    function StakeHolderAcceptRequest(uint256 _requestNumber) public {
        
        Receipt storage rp = receiptBook[_requestNumber];
        address tmpAddress = registerAddresses[msg.sender];
        rp.currentOwner = msg.sender;
        rp.deadLine = block.timestamp + rp.amountOfTime;

        ERC20 token = rp.ERC20Address;
        ERC721 NFT = rp.NFTAddress;

        token.transferFrom(msg.sender, rp.originalOwner, rp.ERC20Amount);
        NFT.transferFrom(rp.originalOwner, tmpAddress, rp.tokenId);




    }

    function RegisterLendingContract() public {
        Lending ld = new Lending();
        registerAddresses[msg.sender] = address(ld);
        ld.transferOwnership(msg.sender);
    }
}
