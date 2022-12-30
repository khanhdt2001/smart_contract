// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


// import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Receipt.sol";

contract Lending is Ownable, Receipt {
    
    address public creater;
    mapping(uint256 => ReceiptDetail) public myReceiptBook;
    
    modifier onlyCreater() {
        require(msg.sender == creater);
        _;
    }

    constructor(address newOwner) {
        creater = msg.sender;
        transferOwnership(newOwner);
    }

    function updateMyReceiptBook(uint256 _requestNumber, 
        ReceiptDetail calldata rd) onlyCreater public {
        myReceiptBook[_requestNumber] = rd;
    }


    function claimNFT(uint256 _requestNumber) onlyOwner public {
        ReceiptDetail memory rd = myReceiptBook[_requestNumber];
        ERC721 NFT = rd.NFTAddress;
        NFT.transferFrom(address(this), owner(), rd.tokenId);
    }









    
}
