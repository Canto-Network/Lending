const {ethers} = require("hardhat");

const CNote = {
    initialExchangeRateMantissa: "1000000000000000000",
    name: "CNote",
    symbol: "cNOTE",
    decimals: "18",
    stable: 1,
    InterestRateModel: "NoteRateModel",
    UnderlyingPrice: "1000000000000000000",
    CollateralFactor: "5000000000000000000",
    becomeImplementation: [],
};

const CEther = {
    initialExchangeRateMantissa: "1000000000000000000",
    name: "CCanto",
    symbol: "cCANTO",
    decimals: "18",
    stable: 0,
    InterestRateModel: "JumpRate",   
    UnderlyingPrice: "1000000000000000000",
    CollateralFactor: "500000000000000000"
};  

module.exports= {
    "canto" : {CNote, CEther}, 
}