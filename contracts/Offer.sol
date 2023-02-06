// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface Offer {
    
    struct OfferDetail {
        address payable lender;
        uint256 offerTokenAmount;
        uint256 offerRate;
        uint256 offerAmountOfTime;
        uint256 offerPaymentTime;
    }
    
}
