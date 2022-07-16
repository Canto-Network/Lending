pragma solidity ^0.8.10;

import "../IProposal.sol";
import "../EIP20Interface.sol";
import "../Lens/CompoundLens.sol";
import "../Comptroller.sol";
import "./TreasuryInterfaces.sol";
import "../CTokenInterfaces.sol";

contract TreasuryDelegate is TreasuryInterface {

    bytes32 constant cantoDenom = keccak256(bytes("CANTO"));
    bytes32 constant noteDenom = keccak256(bytes("NOTE")); //cache hashed values to reduce unnecessary gas costs

    /**
     * @notice Initializes the note contract
     * @param note_ The address of note ERC20 contract
     */
    function initialize(address note_) public {
        if (msg.sender != admin) {
            revert SenderNotAdmin(msg.sender);
        }
        if(note_ == address(0) || address(note) != address(0)) {
            revert FailedInitialization();  //initialize should be called once, and with a valid Note address
        }
	    note = EIP20Interface(note_);
    }

    /**
     * @notice Method to query current balance of CANTO in the treasury
     * @return treasuryCantoBalance the canto balance
     */
    function queryCantoBalance() external view override returns (uint) {
        uint treasuryCantoBalance = address(this).balance;
        return treasuryCantoBalance;
    }

    /**
     * @notice Method to query current balance of NOTE in the treasury 
     * @return treasuryNoteBalance the note balance 
     */
    function queryNoteBalance() external view override returns (uint) {
        uint treasuryNoteBalance = note.balanceOf(address(this));
        return treasuryNoteBalance;
    }

    // function to call redeem on the cnote lending Market
    function redeem(address cNote, uint cTokens) external override {
        if (cNote == address(0)) {
            revert InvalidAddress();
        }
        CErc20Interface cnote = CErc20Interface(cNote); //initialize cNote
        uint err = cnote.redeem(cTokens); //
        if (err != 0) {
            revert SendFundError(cTokens);
        }
    }
    
    /**
     * @notice Method to send treasury funds to recipient
     * @dev Only the admin can call this method (Timelock contract)
     * @param recipient Address receiving funds
     * @param amount Amount to send
     * @param denom Denomination of fund to send 
     */
    function sendFund(address recipient, uint amount, string calldata denom) external override {
        if (msg.sender != admin ) {
            revert SenderNotAdmin(msg.sender);
        }
        bool success;

        bytes32 encodeDenom = keccak256(bytes(denom));
        //sending CANTO
        if (encodeDenom == cantoDenom) {
            if (address(this).balance < amount) {
                revert InsufficientFunds(address(this).balance, amount);
            }
            (success, ) = recipient.call{value: amount}(""); //use call instead of transfer
        } 
        // sending NOTE
        else if (encodeDenom == noteDenom) {
            uint bal = note.balanceOf(address(this));
            if (bal < amount) {
                revert InsufficientFunds(bal, amount);
            } 
            note.transfer(recipient, amount);
            assembly {
                switch returndatasize()
                case 0 {success := not(0)}
                case 32 {
                    returndatacopy(0,0,32)
                    success := mload(0) //retrieve boolean return value from ERC20 transfer
                }
                default {
                    revert(0,0)
                }
            }
        }
        if (!success) {
            revert SendFundError(amount);
        }
    }
}
