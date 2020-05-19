pragma solidity ^0.6.0;
import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./LoveLockAccessControl.sol";

contract SaleLoveLock is LoveLockAccessControl {
    using EnumerableSet for EnumerableSet.UintSet;
    constructor() public {
        ceoAddress = msg.sender;
    }
    mapping(uint256 => SaleLock) public tokenToSaleLocks;
    // maintain the tokenId
    EnumerableSet.UintSet toSellTokens;

    struct SaleLock {
        address owner;
        uint price;
    }

    ERC721 public nonFungibleContract;

    function setNonFungibleContract(address _nftAddress) public onlyCEO {
        ERC721 candidateContract = ERC721(_nftAddress);
        nonFungibleContract = candidateContract;
    }

    // user can buy Locks from the 'toSellTokens'
    function buyLock(uint256 tokenId) payable public {
        require(tokenToSaleLocks[tokenId].owner != 0x0000000000000000000000000000000000000000, "the token is not there");
        // the price  offered by the user must be greater than {{lockPrice}}
        require(msg.value >= tokenToSaleLocks[tokenId].price, "you don't pay enough price to buy the lock");
        // deal! call the function transfer in the nonFungibleContract, since I have the approval, this won't be failed
        nonFungibleContract.safeTransferFrom(tokenToSaleLocks[tokenId].owner, msg.sender, tokenId);
        //delete it from the list and map
        delete tokenToSaleLocks[tokenId];
        toSellTokens.remove(tokenId);
    }
    // user or the other contract must do the approval of this contract firstly
    function createSale(uint tokenId, uint price, address owner) public {
        require(nonFungibleContract.getApproved(tokenId) == address(this), "you didn't approve your lock to the contract");
        tokenToSaleLocks[tokenId].owner = owner;
        tokenToSaleLocks[tokenId].price = price;
        toSellTokens.add(tokenId);
    }
    // how many locks to sell
    function getToSellLength() public view returns (uint){
        return toSellTokens.length();
    }
    // get the tokenID
    function getSaleLock(uint index) public view returns (uint){
        return toSellTokens.at(index);
    }

    function getContractAddress() public view returns (address) {
        return address(this);
    }
}