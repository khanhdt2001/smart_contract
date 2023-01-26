// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


interface Receipt {
    
    struct ReceiptDetail {
        address vendor;
        address lender;
        ERC721 NFTAddress;
        uint256 tokenId;
        uint256 tokenAmount;
        uint256 paidAmount;
        uint256 tokenRate;
        uint256 amountOfTime;
        uint256 deadLine;
    }
    
}
