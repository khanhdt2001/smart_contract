// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract SampleNFT is ERC721, Ownable {
   using Counters for Counters.Counter;
    Counters.Counter tokenId; // số thự tự của request

    constructor() ERC721("SampleNFT", "SPNFT") Ownable() {
    }

    function mint(address _reciever) public onlyOwner {
        _safeMint(_reciever, Counters.current(tokenId));
        Counters.increment(tokenId);
    }
}