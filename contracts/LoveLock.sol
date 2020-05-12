pragma solidity ^0.5.0;

contract LoveLock {
    address[381] public locks;
    address payable public beneficiary;

    constructor() public {
        beneficiary = msg.sender;
    }

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

}