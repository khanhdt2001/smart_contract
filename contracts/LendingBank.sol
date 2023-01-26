// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


// import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Receipt.sol";
import "./LendingFactory.sol";

contract LendingBank is Ownable, Receipt {
    

    event WithDrawNFT(uint256 _requestNumber,address _reciever);

    function withdrawNFT(uint256 _requestNumber, address _reciever) onlyOwner public {
        LendingFactory ld = LendingFactory(msg.sender);
        ReceiptDetail memory rd = ld.getReceiptBook(_requestNumber);
        ERC721 nft= ERC721(rd.NFTAddress);
        nft.transferFrom(address(this), _reciever, rd.tokenId);
        emit WithDrawNFT(_requestNumber, _reciever);
    }
    
}
