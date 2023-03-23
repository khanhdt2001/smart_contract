// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Receipt.sol";
import "./Offer.sol";

contract LendingFactory is Receipt, Offer, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter requestNumber;
    mapping(address => bool) public registerNFTs;
    mapping(uint256 => ReceiptDetail) public receiptBook;
    mapping(uint256 => mapping(uint256 => OfferDetail)) public offerBook;
    mapping(uint256 => uint256) public offerOrder;
    mapping(address => uint256) public addressBalance;
    mapping(ERC721 => mapping(address => mapping(uint256 => bool)))
        public nftStatus;

    constructor() Ownable() {}

    event VendorMakeRequest(
        address vendor,
        ERC721 NFTAddress,
        uint256 tokenId,
        uint256 requestNumber
    );
    event LenderMakeOffer(
        address payable lender,
        uint256 requestNumber,
        uint256 offerNumber,
        uint256 offerTokenAmount,
        uint256 offerRate,
        uint256 offerAmountOfTime,
        uint256 offerPaymenTime
    );
    event VendorAcceptOffer(
        uint256 requestNumber,
        uint256 offerNumber,
        address vendor,
        address lender,
        ERC721 NFTAddress,
        uint256 tokenId,
        uint256 tokenAmount,
        uint256 tokenRate,
        uint256 amountOfTime,
        uint256 deadLine,
        uint256 paymentTime,
        uint256 paymentCount
    );
    event VendorReddem(uint256 requestNumber);
    event VendorPayRountine(uint256 requestNumber, uint256 paidCounter);
    event RegisterNFT(address NFTAddress);
    event UnRegisterNFT(address NFTAddress);
    event WithDrawNFT(uint256 requestNumber, address _reciever);
    modifier onlyVendor(uint256 _requestNumber) {
        require(
            receiptBook[_requestNumber].vendor == msg.sender,
            "Lending: Must be Vendor"
        );
        _;
    }

    function getReceiptBook(
        uint256 _requestNumber
    ) public view returns (ReceiptDetail memory) {
        return receiptBook[_requestNumber];
    }

    function getOfferBook(
        uint256 _requestNumber,
        uint256 _offerNumber
    ) public view returns (OfferDetail memory) {
        return offerBook[_requestNumber][_offerNumber];
    }

    function vendorMakeRequest(ERC721 NFTAddress, uint256 tokenId) public {
        require(
            NFTAddress.ownerOf(tokenId) == msg.sender,
            "Lending: sender must have NFT"
        );
        require(
            nftStatus[NFTAddress][msg.sender][tokenId] == false,
            "Lending: nft already in market"
        );
        receiptBook[Counters.current(requestNumber)] = ReceiptDetail(
            msg.sender,
            address(0),
            NFTAddress,
            tokenId,
            0,
            0,
            0,
            0,
            0,
            0
        );
        nftStatus[NFTAddress][msg.sender][tokenId] = true;
        emit VendorMakeRequest(
            msg.sender,
            NFTAddress,
            tokenId,
            Counters.current(requestNumber)
        );
        Counters.increment(requestNumber);
    }

    function lenderMakeOffer(
        uint256 _requestNumber,
        uint256 _offerRate,
        uint256 _amountOfTime,
        uint256 _paymentTime
    ) public payable {
        uint256 currentOffer = offerOrder[_requestNumber];
        ReceiptDetail storage rd = receiptBook[_requestNumber];
        require(rd.vendor != address(0), "Lending: receipt must exist");
        require(rd.tokenAmount == 0, "Lending: receipt must still available");
        require(
            _amountOfTime / _paymentTime >= 7 days && _amountOfTime < 30 days,
            "Lending: offer time and payment time are not valid"
        );
        offerBook[_requestNumber][currentOffer] = OfferDetail(
            payable(msg.sender),
            msg.value,
            _offerRate,
            _amountOfTime,
            _paymentTime
        );
        offerOrder[_requestNumber] += 1;
        addressBalance[msg.sender] += msg.value;
        emit LenderMakeOffer(
            payable(msg.sender),
            _requestNumber,
            currentOffer,
            msg.value,
            _offerRate,
            _amountOfTime,
            _paymentTime
        );
    }

    function vendorAcceptOffer(
        uint256 _requestNumber,
        uint256 _offerNumber
    ) public onlyVendor(_requestNumber) {
        // get data
        ReceiptDetail storage rd = receiptBook[_requestNumber];
        OfferDetail memory od = offerBook[_requestNumber][_offerNumber];
        require(od.lender != address(0), "Lending: offer must exist");
        require(
            addressBalance[od.lender] >= od.offerTokenAmount,
            "Lending: Lender balance does not support"
        );
        // update data
        rd.lender = od.lender;
        rd.tokenAmount = od.offerTokenAmount;
        rd.tokenRate = od.offerRate;
        rd.amountOfTime = od.offerAmountOfTime;
        rd.deadLine = block.timestamp + od.offerAmountOfTime;
        rd.paymentTime = od.offerPaymentTime;
        // transfer nft and eth
        ERC721 NFT = rd.NFTAddress;
        NFT.transferFrom(rd.vendor, address(this), rd.tokenId);
        address payable to = payable(msg.sender);
        to.transfer(od.offerTokenAmount);
        addressBalance[od.lender] -= od.offerTokenAmount;
        emit VendorAcceptOffer(
            _requestNumber,
            _offerNumber,
            rd.vendor,
            rd.lender,
            rd.NFTAddress,
            rd.tokenId,
            rd.tokenAmount,
            rd.tokenRate,
            rd.amountOfTime,
            rd.deadLine,
            rd.paymentTime,
            0
        );
    }

    /*
calculate method:
A borrow B 100 mil with rate 12% per 12 months
1 month interest        = (100 mil * 12%) /12 = 1.000.000
A has to paid B 1 month = 100.000.000/12 + 1.000.000 = 9.333.333   
*/

    function getTokenMustPaidPerTime(
        uint256 _requestNumber
    ) public view returns (uint256) {
        ReceiptDetail storage rd = receiptBook[_requestNumber];
        uint256 tokenMustPaid = rd.tokenAmount /
            rd.paymentTime +
            ((rd.tokenAmount * rd.tokenRate) / 100) /
            rd.paymentTime;
        return tokenMustPaid;
    }

    function vendorPayRountine(uint256 _requestNumber) public payable {
        // get value
        ReceiptDetail storage rd = receiptBook[_requestNumber];
        // calculate
        uint256 startTime = rd.deadLine - rd.amountOfTime;
        uint256 duration = rd.amountOfTime / rd.paymentTime;
        uint256 checker = (block.timestamp - startTime) / duration;
        console.log(rd.paymentTime);
        console.log(rd.paymentCount);
        require(rd.paymentTime != rd.paymentCount, "Lending: Paid done");
        require(rd.paymentCount >= checker, "Lending: Request time out");

        uint256 tokenMustPaid = getTokenMustPaidPerTime(_requestNumber);
        require(msg.value >= tokenMustPaid, "Lending: Not enough eth");
        addressBalance[msg.sender] += msg.value - tokenMustPaid;
        console.log("tokenAmount", rd.tokenAmount);
        console.log(" addressBalance[msg.sender]", addressBalance[msg.sender]);

        console.log("tokenMustPaid", tokenMustPaid);
        address payable to = payable(rd.lender);
        to.transfer(tokenMustPaid);

        rd.paymentCount++;
        console.log("rd.paymentCount", rd.paymentCount);
        emit VendorPayRountine(_requestNumber, rd.paymentCount);
    }

    function withdrawNFT(uint256 _requestNumber) public {
        ReceiptDetail memory rd = getReceiptBook(_requestNumber);
        ERC721 nft = ERC721(rd.NFTAddress);

        require(
            msg.sender == rd.vendor || msg.sender == rd.lender,
            "Lending: not able to access"
        );
        if (msg.sender == rd.lender) {
            uint256 startTime = rd.deadLine - rd.amountOfTime;
            uint256 duration = rd.amountOfTime / rd.paymentTime;
            uint256 checker = (block.timestamp - startTime) / duration;
            require(rd.paymentCount < checker, "Lending: Request on time");
        } else {
            require(
                rd.paymentCount == rd.paymentTime,
                "Lending: Request on time"
            );
        }
        nftStatus[rd.NFTAddress][rd.vendor][rd.tokenId] = false;
        nft.transferFrom(address(this), msg.sender, rd.tokenId);
        emit WithDrawNFT(_requestNumber, msg.sender);
    }

    function registerNFT(ERC721 _NFTAddress) public onlyOwner {
        require(registerNFTs[address(_NFTAddress)] != true, "Already registor");
        registerNFTs[address(_NFTAddress)] = true;
        emit RegisterNFT(address(_NFTAddress));
    }

    function unRegisterNFT(ERC721 _NFTAddress) public onlyOwner {
        require(
            registerNFTs[address(_NFTAddress)] != true,
            "Already un-registor"
        );
        registerNFTs[address(_NFTAddress)] = false;
        emit UnRegisterNFT(address(_NFTAddress));
    }

    function getAddressBalance(
        address checker
    ) public view returns (uint256) {
        return addressBalance[checker];
    }

    function withdrawEth(uint256 token) public payable {
        console.log(addressBalance[msg.sender]);

        uint256 balance = addressBalance[msg.sender];
        require(balance >= token, "Invalid eth amount");
        payable(msg.sender).transfer(token);
        addressBalance[msg.sender] = balance - token;
        console.log(addressBalance[msg.sender]);
    }
    function depositEth() public payable {
        addressBalance[msg.sender] += msg.value;   
    }
}
