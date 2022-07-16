pragma solidity ^0.8.10;

import "src/Comptroller.sol";
import "src/Unitroller.sol";
import "src/Swap/BaseV1-core.sol";
import "forge-std/Test.sol";

abstract contract Helpers is Test {
    Comptroller public comptroller_ = new Comptroller();
    Unitroller public unitroller_ = new Unitroller();
    BaseV1Factory public factory_ = new BaseV1Factory();

    function setUpComptroller() internal {
        unitroller_._setPendingImplementation(address(comptroller_));
        comptroller_._become(unitroller_);
    }
}
