// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


// import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Receipt.sol";

contract Lending is Ownable, Receipt {
    
    address public creater;
    
    modifier onlyCreater() {
        require(msg.sender == creater);
        _;
    }

    constructor(address newOwner) {
        creater = newOwner;
    }

    function vendorRedeem(uint256 _requestNumber) onlyOwner public {
        //  lấy ra offer theo quest number
        //  check điều kiện 
        //  chuyển nft về cho vendor 
    }



    function withDraw(uint256 _requestNumber) onlyOwner public {

    }









    
}
