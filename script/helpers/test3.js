const { ethers } = require("hardhat");
const {canto} = require("../../config/index");

const Cnote = canto.markets.CNote;



async function main() { 
    [dep] = await ethers.getSigners();
    oracle = await ethers.getContract("BaseV1Router01");
    comptroller = new ethers.Contract(
        (await deployments.get("Unitroller")).address,
        (await deployments.get("Comptroller")).abi,
        dep 
    );
    usdc = await ethers.getContract("USDC");
    usdt =await ethers.getContract("USDT"); 
    weth = await ethers.getContract("WETH");
    note = await ethers.getContract("Note");
    cNote = await ethers.getContract("CNoteDelegator");
    cUsdc = await ethers.getContract("CUsdcDelegator");
    cUsdt = await ethers.getContract("CUsdtDelegator");
    factory = await ethers.getContract("BaseV1Factory");
    cCanto = await ethers.getContract("CCanto");
    noteInterest = await ethers.getContract("NoteRateModel")

    // let resFac = await ethers.getContractFactory("Reservoir");
    // let reservoir = await resFac.deploy(ethers.utils.parseUnits("1", "18"), weth.address, comptroller.address);
    // let reservoir = await ethers.getContractAt("Reservoir", "0x11D0Aeb9ED7Ce1a22b579c0617EE472747f1c15B");
    // // await (await weth.transfer(reservoir.address, ethers.utils.parseUnits("5", "18"))).wait();
    // // console.log("reservoir balance: ", await weth.balanceOf(reservoir.address));
    // await (await reservoir.drip()).wait();
    // console.log("comptroller balance: ", await weth.balanceOf( comptroller.address));
    // console.log("weth balance: ", await weth.balanceOf(dep.address)) 
    // console.log("weth balance: ", await weth.balanceOf(dep.address));
    // console.log("comptroller weth balance: ", await weth.balanceOf(comptroller.address));
    // console.log("comp Accrued: ", await comptroller.compAccrued(dep.address));
    // await (await comptroller.claimComp["claimComp(address)"](dep.address)).wait();
    // console.log("compAccrued: ", await comptroller.compAccrued(dep.address)); 
    // console.log("comptroller balance: ", await comptroller.balanceOf(comptroller.address))
    // console.log("weth balance: ", await weth.balanceOf(dep.address));
    // console.log("cNote supply apy: ", await cNote.supplyRatePerBlock())
    // console.log("Note Interest cUsdc", await noteInterest.cUsdc());
    // console.log("USDC: ", cUsdc.address);

    // console.log("cUsdc price: ", await oracle.getUnderlyingPrice(cUsdc.address));
    // // console.log("supply Rate Per Block: ", await cNote.callStatic.borrowRatePerBlock())
    // await (await noteInterest.getBorrowRate(0,0,0)).wait();
    // await (await noteInterest.getSupplyRate(0,0,0,0)).wait();
    // console.log(await noteInterest.callStatic.getBorrowRate(0,0,0))
    // console.log(await noteInterest.callStatic.getSupplyRate(0,0,0,0))
    // // console.log("adjuster Coefficient: ", await noteInterest.adjusterCoefficient())
    // console.log('interestRateModel: ', await cNote.interestRateModel());
    // console.log("interestRateModel: ", await noteInterest.address);
    console.log("Note/USDC: ", await  oracle.pairFor(note.address, usdc.address, true));
    console.log("USDC/NOTE: ", await oracle.pairFor(usdc.address, note.address, true));
    console.log("cUSDC Price: ", await oracle.getUnderlyingPrice(cUsdc.address));
}   
main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});