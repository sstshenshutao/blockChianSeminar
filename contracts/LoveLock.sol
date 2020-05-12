pragma solidity ^0.5.0;

// todo:  need to handle the role (make protection of who can use which methods.)
// todo:  that should be done by using function modifier(like python's function decorator)
contract LoveLock /*is ERC721*/ {
    //
    struct Lock {
        address ownerAddr;
        string title;
        string[] notes;
    }
    // the mapper that maintain the token Information   (tokenID:Lock)
    mapping(uint256 => Lock) public tokenMapping;
    // for retrieval
    uint256[] usedToken;
    // the mapper that maintain the hang places    (slot:tokenID)
    mapping(uint256 => uint256) public hangMapping;
    // for retrieval
    uint256[] usedSlot;
    //  we provide 381 tokens with 381 slots, firstly, the slot size is limited by the canvas(front-end)
    // todo: later the tokens can be more than 381
    uint256 total;
    // id == 0  is special
    uint256[382] public lockIDs;
    uint256 lockPrice;
    // this is the person who can get the revenue from the contract!!!
    address payable public beneficiary;

    constructor() public {
        beneficiary = msg.sender;
        total = 382;
        lockPrice = 2 ether;
        //init lockIDs
    }
    //todo: delete it (dummy data for test without implement all method in erc721)
    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);

    function buyLock(uint lockID) public payable {
        // the price  offered by the user must be greater than {{lockPrice}}
        require(msg.value >= lockPrice, "you don't pay enough price to buy the lock");
        // 0 is special
        require(lockID >= 1 && lockID <= total - 1, "lockID must between 1 and 381");
        // isUsed
        require(tokenMapping[lockID].ownerAddr == 0x0000000000000000000000000000000000000000, "the lock belongs to another one");
        // the lock is not belong to the msg.sender(user)
        tokenMapping[lockID].ownerAddr = msg.sender;
        // add to usedToken
        usedToken.push(lockID);
        // broadcast this happy thing, change the owner
        emit Transfer(address(this), msg.sender, lockID);
    }

    function hangLock(uint slotId, uint lockID) public payable {
        // the slotId in the picture must in range(0-380)
        require(slotId >= 1 && slotId <= total - 1, "slotId must between 1 and 381");
        // the user must have the lock
        require(tokenMapping[lockID].ownerAddr == msg.sender, "you don't own this lock");
        // this slot must not be taken by other users
        require(hangMapping[slotId] == 0, "this is already taken by others");
        usedSlot.push(slotId);
        hangMapping[slotId] = lockID;
    }

    function getBeneficiary() public view returns (address payable) {
        return beneficiary;
    }
    // for retrieval
    function getUsedLocks() public view returns (uint[] memory) {
        return usedToken;
    }
    // for retrieval
    function getUsedSlots() public view returns (uint[] memory) {
        return usedSlot;
    }

    function addNote(uint lockID, string memory note) public {
        tokenMapping[lockID].notes.push(note);
    }

    function getNotesLen(uint lockID) public view returns (uint) {
        return tokenMapping[lockID].notes.length;
    }

    function getNote(uint lockID, uint index) public view returns (string memory){
        return tokenMapping[lockID].notes[index];
    }

    function modifyNote(uint lockID, uint index, string memory note) public {
        tokenMapping[lockID].notes[index] = note;
    }

    function addTitle(uint lockID, string memory title) public {
        tokenMapping[lockID].title = title;
    }

    function getTitle(uint lockID) public view returns (string memory) {
        return tokenMapping[lockID].title;
    }

}

/// @title ERC-721 Non-Fungible Token Standard
/// @dev See https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
///  Note: the ERC-165 identifier for this interface is 0x80ac58cd
interface ERC721 /* is ERC165 */ {
    /// @dev This emits when ownership of any NFT changes by any mechanism.
    ///  This event emits when NFTs are created (`from` == 0) and destroyed
    ///  (`to` == 0). Exception: during contract creation, any number of NFTs
    ///  may be created and assigned without emitting Transfer. At the time of
    ///  any transfer, the approved address for that NFT (if any) is reset to none.
    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);

    /// @dev This emits when the approved address for an NFT is changed or
    ///  reaffirmed. The zero address indicates there is no approved address.
    ///  When a Transfer event emits, this also indicates that the approved
    ///  address for that NFT (if any) is reset to none.
    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);

    /// @dev This emits when an operator is enabled or disabled for an owner.
    ///  The operator can manage all NFTs of the owner.
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

    /// @notice Count all NFTs assigned to an owner
    /// @dev NFTs assigned to the zero address are considered invalid, and this
    ///  function throws for queries about the zero address.
    /// @param _owner An address for whom to query the balance
    /// @return The number of NFTs owned by `_owner`, possibly zero
    function balanceOf(address _owner) external view returns (uint256);

    /// @notice Find the owner of an NFT
    /// @dev NFTs assigned to zero address are considered invalid, and queries
    ///  about them do throw.
    /// @param _tokenId The identifier for an NFT
    /// @return The address of the owner of the NFT
    function ownerOf(uint256 _tokenId) external view returns (address);

    /// @notice Transfers the ownership of an NFT from one address to another address
    /// @dev Throws unless `msg.sender` is the current owner, an authorized
    ///  operator, or the approved address for this NFT. Throws if `_from` is
    ///  not the current owner. Throws if `_to` is the zero address. Throws if
    ///  `_tokenId` is not a valid NFT. When transfer is complete, this function
    ///  checks if `_to` is a smart contract (code size > 0). If so, it calls
    ///  `onERC721Received` on `_to` and throws if the return value is not
    ///  `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`.
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    /// @param data Additional data with no specified format, sent in call to `_to`
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable;

    /// @notice Transfers the ownership of an NFT from one address to another address
    /// @dev This works identically to the other function with an extra data parameter,
    ///  except this function just sets data to ""
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable;

    /// @notice Transfer ownership of an NFT -- THE CALLER IS RESPONSIBLE
    ///  TO CONFIRM THAT `_to` IS CAPABLE OF RECEIVING NFTS OR ELSE
    ///  THEY MAY BE PERMANENTLY LOST
    /// @dev Throws unless `msg.sender` is the current owner, an authorized
    ///  operator, or the approved address for this NFT. Throws if `_from` is
    ///  not the current owner. Throws if `_to` is the zero address. Throws if
    ///  `_tokenId` is not a valid NFT.
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    function transferFrom(address _from, address _to, uint256 _tokenId) external payable;

    /// @notice Set or reaffirm the approved address for an NFT
    /// @dev The zero address indicates there is no approved address.
    /// @dev Throws unless `msg.sender` is the current NFT owner, or an authorized
    ///  operator of the current owner.
    /// @param _approved The new approved NFT controller
    /// @param _tokenId The NFT to approve
    function approve(address _approved, uint256 _tokenId) external payable;

    /// @notice Enable or disable approval for a third party ("operator") to manage
    ///  all of `msg.sender`'s assets.
    /// @dev Emits the ApprovalForAll event. The contract MUST allow
    ///  multiple operators per owner.
    /// @param _operator Address to add to the set of authorized operators.
    /// @param _approved True if the operator is approved, false to revoke approval
    function setApprovalForAll(address _operator, bool _approved) external;

    /// @notice Get the approved address for a single NFT
    /// @dev Throws if `_tokenId` is not a valid NFT
    /// @param _tokenId The NFT to find the approved address for
    /// @return The approved address for this NFT, or the zero address if there is none
    function getApproved(uint256 _tokenId) external view returns (address);

    /// @notice Query if an address is an authorized operator for another address
    /// @param _owner The address that owns the NFTs
    /// @param _operator The address that acts on behalf of the owner
    /// @return True if `_operator` is an approved operator for `_owner`, false otherwise
    function isApprovedForAll(address _owner, address _operator) external view returns (bool);
}