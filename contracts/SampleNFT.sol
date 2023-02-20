// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract SampleNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter tokenId; // số thự tự của request
    using Strings for uint256;
    string private _baseURIextended;

    constructor() ERC721("SampleNFT", "SPNFT") Ownable() {
    }

    function setBaseURI(string memory baseURI_) external onlyOwner {
        _baseURIextended = baseURI_;
    }
    function getBaseURI() public view returns (string memory) {
        return _baseURIextended;
    }
    function mint(address _receiver) public onlyOwner {
        _safeMint(_receiver, Counters.current(tokenId));
        Counters.increment(tokenId);
    }
    function tokenURI(uint256 _tokenID) public override view returns (string memory) {
        require(
            _exists(_tokenID),
            "ERC721Metadata: URI query for nonexistent token"
        );
        string memory base = getBaseURI();
        return string(abi.encodePacked(base, "/", _tokenID.toString()));
    }
}