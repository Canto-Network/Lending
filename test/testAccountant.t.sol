pragma solidity ^0.8.11;

import "forge-std/Test.sol";
import "./utils.sol";


contract test is Helpers {
    uint256 testNumber;

    function setUp() public {
        setUpComptroller();
    }

    function testNumberIs42() public {
        bool isEqual = unitroller_.comptrollerImplementation() == address(comptroller_);
        assertEq(isEqual, true);
    }
}