const {canto} = require("../../config/index");


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
    noteInterest = await ethers.getContract("NoteRateModel");


    console.log("Note SUpply Ratre: ", await noteInterest.callStatic.getSupplyRate(0,0,0,0));



}     

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});