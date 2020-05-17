pragma solidity ^0.6.0;
// cited and modified from: https://etherscan.io/address/0x06012c8cf97bead5deae237070f9587f8e7a266d#code
contract LoveLockAccessControl {
    address public ceoAddress;
    address public cooAddress;
    modifier onlyCEO() {
        require(msg.sender == ceoAddress, "sorry, you are not ceo");
        _;
    }
    modifier onlyCOO() {
        require(msg.sender == cooAddress, "sorry, you are not coo");
        _;
    }
    modifier onlyCLevel() {
        require(
            msg.sender == cooAddress ||
            msg.sender == ceoAddress
        , "sorry, you are not ceo or coo"
        );
        _;
    }
    function setCEO(address _newCEO) external onlyCEO {
        require(_newCEO != address(0), "sorry, you are not ceo");

        ceoAddress = _newCEO;
    }
    function setCOO(address _newCOO) external onlyCEO {
        require(_newCOO != address(0), "sorry, you are not ceo");

        cooAddress = _newCOO;
    }
}
