pragma solidity ^0.5.0;

contract LoveLock {

    mapping(address => string [] ) public notes;
    mapping(address => string ) public titles;
    address[381] public locks;   
    address payable public beneficiary; 

    constructor() public {
        beneficiary = msg.sender;
    }

    event NewNote(address, string note);
    event ModifyNote(address, uint index);

    function drawLock(uint lockLocationId) public payable returns (uint) {
        require(msg.value>=2 ether);
        require(lockLocationId >= 0 && lockLocationId <= 380);
        require(locks[lockLocationId] == 0x0000000000000000000000000000000000000000,"this is already taken by others");  
        locks[lockLocationId] = msg.sender;  
        return lockLocationId;  
    }

    function getBeneficiary() public view returns (address payable) {
        return beneficiary;
    }

    function getLocks() public view returns (address[381] memory) {
        return locks;
    }

    function addNote( string memory note) public {
        notes[beneficiary].push(note);
        emit NewNote(beneficiary, note);
    }

    function getNotesLen(address own) public view returns (uint) {
        return notes[own].length;
    }
    
    function getNote(address own) public view returns (string){
    	return notes[own];
    }
    
    function modifyNote(address own, uint index, string memory note) public {
        notes[own][index] = note;
        emit ModifyNote(own, index);
    }
    function addTitle(address own, string memory title) public {
	titles[own] = title;    
    }
    function getTitle(address own) public returns (string) {
        return titles[own];
    }

}
