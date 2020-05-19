pragma solidity ^0.6.0;

import "./LoveLockAccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "./SaleLoveLock.sol";

contract LoveLockBase is LoveLockAccessControl, ERC721 {
    using EnumerableSet for EnumerableSet.UintSet;
    /*** DEFINE THE STRUCT OF LOVELOCK ***/
    constructor() ERC721("Love Lock", "LL") public {
        ceoAddress = msg.sender;
        _setBaseURI("https://sstshenshutao.github.io/");
        // the defaultCreationPrice
        defaultPrice = 1 finney;
    }
    struct LoveLock {
        string title;
        string[] notes;
        uint32 currentLength;
        uint32 notesLimit;
        uint32 styleId;
        uint256 slotPos; //0 for not hung, slot index start from 1
    }

    //    struct Couple {
    //        address me;
    //        address lover;
    //    }

    /*** STORAGE ***/

    // save all of the LLs
    mapping(uint256 => LoveLock) public loveLocks;
    uint256 public numLoveLocks; // An integer storing the total number of LLs, use for create the LLs(together with mapping)
    //     the mapper that maintain the usedSlot   (slot:true/false)
    //    mapping(int128 => bool) public usedSlot;
    // slot index start from 1 , eg: [1,3,5,7,....]
    EnumerableSet.UintSet usedSlot;
    //     the mapper that maintain the   (slot:tokenID), for quick retrieval
    mapping(uint256 => uint256) slotToToken;
    // LLs => address(owner)
    // replaced by ownerOf:   mapping(uint256 => address) public loveLockIndexToOwner;
    //the count of LLs this address has.
    // replaced by balanceOf:   mapping(address => uint256) ownershipTokenCount;
    // the Lock can be transferred from one of the couple.
    //    mapping(uint256 => Couple) public lockIndexToApproved;
    /*** modifier ***/

    /*** FUNCTIONS ***/
    // todo: expose the public functions based on the internal functions
    // todo: the convenient methods(form LoveLock.sol need to integrate here)
    /*** those functions have no requirement, need to be implemented in the layer -- finished, they are public and safe***/
    function getContractAddress() public view returns (address) {
        return address(this);
    }

    function deleteLock(uint256 tokenId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "you are not the owner or approver");
        _burn(tokenId);
        delete loveLocks[tokenId];
    }
    //  add note to a love lock
    function addNote(uint256 tokenId, string memory note) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "you are not the owner or approver");
        require(loveLocks[tokenId].currentLength < loveLocks[tokenId].notesLimit, "you are not the owner or approver");
        loveLocks[tokenId].notes.push(note);
        loveLocks[tokenId].currentLength++;
    }
    //  getNote of the ll
    function getNote(uint tokenId, uint index) public view returns (string memory) {
        return loveLocks[tokenId].notes[index];
    }
    //  hang LL, 0 for pull down
    function hangLL(uint tokenId, uint256 slotId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "you are not the owner or approver");
        // this slot must not be taken by other users
        require(!usedSlot.contains(slotId), "this is already taken by others");
        // remove the previous used slot, if exists
        require(slotId >= 0, "slotID must >= 0, normal slot starts from 1");
        uint256 previousSlot = loveLocks[tokenId].slotPos;
        // if the previousSlot exists
        if (previousSlot > 0) {
            usedSlot.remove(previousSlot);
            delete slotToToken[previousSlot];
            loveLocks[tokenId].slotPos = 0;
        }
        // add a new slot
        if (slotId != 0) {
            usedSlot.add(slotId);
            loveLocks[tokenId].slotPos = slotId;
            slotToToken[slotId] = tokenId;
        }
    }

    function getUsedSlotLength() public view returns (uint) {
        return usedSlot.length();
    }
    // return the n-th used slot
    function getUsedSlot(uint nth) public view returns (uint) {
        return usedSlot.at(nth);
    }
    // get the lock on a specific slot
    function getLockOnSlot(uint slotId) public view returns (uint) {
        require(usedSlot.contains(slotId), "this slot is not used");
        return slotToToken[slotId];
    }
    /*** sale method***/
    // ------------------sale storage --------------
    // the smart contract of selling the LLs
    SaleLoveLock public saleContract;
    // the defaultCreationPrice
    uint256 public defaultPrice;

    function setSaleContractAddress(address _address) public onlyCEO {
        SaleLoveLock newSaleContract = SaleLoveLock(_address);
        // Set the new contract address
        saleContract = newSaleContract;
    }
    // the smart contract creates LLs for sell
    function createLLtoSell(uint32 styleId, uint32 notesLimit) payable public onlyCLevel {
        require(msg.value >= defaultPrice, "Hi, ceo/coo, you must give 1 finney to start the creation of the LL");
        // save the LoveLock temporally in CLevel account
        uint newTokenID = createLL(styleId, notesLimit, _msgSender());
        // give the approval to the saleContract, so that the saleContract can transfer it
        approve(address(saleContract), newTokenID);
        // let saleContract sell the tokens
        saleContract.createSale(newTokenID, 2 ether, _msgSender());
    }

    // create love lock, return the new ID of token LL, use for generate ll, or directly give ll to one user.
    function createLL(uint32 styleId, uint32 notesLimit, address owner) public onlyCLevel returns (uint){
        // to ensure our data structures are always valid.
        require(styleId == uint256(uint32(styleId)));
        require(notesLimit == uint256(uint32(notesLimit)));
        //create process:
        //create token
        uint256 newLoveLockID = numLoveLocks;
        require(newLoveLockID == uint256(uint32(newLoveLockID)));
        //here !! call transfer from address(0) to _owner, which means creation of token
        _safeMint(owner, newLoveLockID);
        //create LL
        LoveLock storage _loveLock = loveLocks[numLoveLocks];
        _loveLock.notesLimit = notesLimit;
        _loveLock.styleId = styleId;
        numLoveLocks++;
        // emit our Create event to show we mint a LoveLock(different with token transfer event above!!!)
        emit Create(owner, newLoveLockID);
        return newLoveLockID;
    }
    //get the money out
    function ceoPullMoney(uint amountRequested) public onlyCEO {
        msg.sender.transfer(amountRequested);
    }
    function getContractBalance() public onlyCEO view returns (uint){
        return address(this).balance;
    }
    /*** EVENTS ***/
    event Create(address owner, uint256 tokenId);
}
