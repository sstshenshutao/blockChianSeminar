pragma solidity ^0.6.0;

import "./LoveLockAccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract LoveLockBase is LoveLockAccessControl, ERC721 {
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
        int128 slotPos; //-1 for not hung
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
    mapping(int128 => bool) public usedSlot;
    //     the mapper that maintain the   (slot:tokenID), for quick retrieval
    mapping(int128 => uint256) slotToToken;
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
    //  hang LL, -1 for pull down
    function hangLL(uint tokenId, int128 slotId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "you are not the owner or approver");
        // this slot must not be taken by other users
        require(!usedSlot[slotId], "this is already taken by others");
        // remove the previous used slot, if exists
        require(slotId >= - 1, "slotID must >= -1");
        int128 slotIndex = loveLocks[tokenId].slotPos;
        if (slotIndex > - 1) {
            usedSlot[slotIndex] = false;
        }
        // add a new slot
        if (slotId != - 1) {
            usedSlot[slotId] = true;
            loveLocks[tokenId].slotPos = slotId;
            slotToToken[slotId] = tokenId;
        }
    }
    // must use getMethod usedSlot first, and then getLockOnSlot(slotID)
    function getLockOnSlot(int128 slotId) public view returns (uint) {
        require(usedSlot[slotId], "this slot is not used");
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
        _loveLock.slotPos = 0 - 1;
        numLoveLocks++;
        // emit our Create event to show we mint a LoveLock(different with token transfer event above!!!)
        emit Create(owner, newLoveLockID);
        return newLoveLockID;
    }

    /*** EVENTS ***/
    event Create(address owner, uint256 tokenId);
}

contract SaleLoveLock is LoveLockAccessControl {
    constructor() public {
        ceoAddress = msg.sender;
    }
    uint256[] public toSellTokens;
    mapping(uint256 => SaleLock) tokenToSaleLocks;

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
    }
    // user or the other contract must do the approval of this contract firstly
    function createSale(uint tokenId, uint price, address owner) public {
        require(nonFungibleContract.getApproved(tokenId) == address(this), "you didn't approve your lock to the contract");
        tokenToSaleLocks[tokenId].owner = owner;
        tokenToSaleLocks[tokenId].price = price;
        toSellTokens.push(tokenId);
    }
    // how many locks to sell
    function getToSellLength() public view returns (uint){
        return toSellTokens.length;
    }
}