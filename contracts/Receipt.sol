// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


interface Receipt {
    
    struct ReceiptDetail {
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
    
}
