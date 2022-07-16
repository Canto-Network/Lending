pragma solidity ^0.8.10;

import "./BaseV1-periphery.t.sol";
import "forge-std/Test.sol";
import "src/Comptroller.sol";
import "src/NoteInterest.sol";
import "src/JumpRateModel.sol";


contract BaseV1FactoryTest is Test {    
    BaseV1Factory public factory;
    address public admin = address(1);
    address public comptroller;


    function setUp() public {
        vm.prank(admin);
        factory = new BaseV1Factory();
        comptroller = new Comptroller();
    }

}