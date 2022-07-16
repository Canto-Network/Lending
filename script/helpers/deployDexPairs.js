const {ethers} = require("hardhat");
const { address, etherMantissa } = require('../../tests/Utils/Ethereum');
const { test } = require("mocha");
const {canto} = require("../../config/index");


const testnetAddress = {
  Unitroller: "0xAE8A689c851373f3E8C560A051635150dCA57293",
  Note: "0x61cBB6b576f4Dd9fA5A785dC427F51AaF55057f2",
  USDC: "0x673098aeC6D2D76899Edf5e8d51dBa6139fD79e3",
  USDT: "0x033E1A115F7179a782b26Bc26Cff08394a4C39Ae",
  ATOM: "0x59C84D5F064c8089D52E3C7e9b7C0D41AAcf92Fb",
  ETH: "0x89e02E3D5Cb30d6e965d2E79cc90A144f36DCc5b",
  CNote: "0x21e53398bE9f76B0FF9367d8c03AEa00d7bf22e2",
  CUsdc: "0xA21c7AD1b9F0d78Aa8DBB33bB5b42B507eDfe103",
  CUsdt: "0x9FFaCb2E15c5aBe67FA3A5E5750d00b2C5979E42",
  CATOM: "0x533679D8ceFBa88669882B8A92bf0c7f4286b438",
  CETH: "0x8Da7C68e20f0173074ad52AcCfF981DA248aa4b4",
  CCanto: "0x2dBA152f6Bd3822F088BA190AA0Bdc183682dE11",
  WETH: "0x14E32aDCe6bEA9c5a60328838EAC739B2fb15C4e",
  Reservoir: "0x07FeF0C4da2638d96F792C10376fF6F800c85F77",
  BaseV1Factory: "0xdBEED569aa25F380FF6eb17F78b02784D32db2C5",
  BaseV1Router01: "0x8a075a3689a3D9e5Ed9443156573077Fa9175AAD",
  }

  async function main() {
    const [dep] = await ethers.getSigners();
    const half = etherMantissa(0.5);


    const deployer = dep.address;
    const USDC = await ethers.getContractAt("ERC20", testnetAddress.USDC, dep);
    const Note = await ethers.getContractAt("ERC20", testnetAddress.Note, dep);
    const USDT = await ethers.getContractAt("ERC20", testnetAddress.USDT, dep);
    const ATOM = await ethers.getContractAt("ERC20", testnetAddress.ATOM, dep);
    const ETH = await ethers.getContractAt("ERC20", testnetAddress.ETH, dep);
    const WETH = await ethers.getContractAt("WETH", testnetAddress.WETH, dep);

   
    const cUSDC = await ethers.getContractAt("CErc20", testnetAddress.CUsdc, dep);
    const cNote = await ethers.getContractAt("CErc20", testnetAddress.CNote, dep);

    const Unitroller = await ethers.getContractAt("Comptroller", testnetAddress.Unitroller, dep);
    const Reservoir = await ethers.getContractAt("Reservoir", testnetAddress.Reservoir, dep);  
    const oracle = await ethers.getContractAt("BaseV1Router01", testnetAddress.BaseV1Router01, dep);
    const BaseV1Factory = await ethers.getContractAt("BaseV1Factory", testnetAddress.BaseV1Factory, dep);
    
    // await (await Reservoir.drip()).wait()
    // console.log(await WETH.balanceOf(Unitroller.address));
    // console.log(await WETH.balanceOf(Reservoir.address));
   

    await (await Unitroller._supportMarket(cUSDC.address)).wait();
    (await Unitroller.enterMarkets([cUSDC.address])).wait()
    await (await Unitroller._supportMarket(cNote.address)).wait();
    await (await Unitroller._setCollateralFactor(cUSDC.address, half.toString())).wait();
    await (await USDC.approve(cUSDC.address, "10000000000000000000000000")).wait()
    await (await cUSDC.mint(ethers.utils.parseUnits("5000000", "6"))).wait()
    await (await cNote.borrow(ethers.utils.parseUnits("1000000", "18"))).wait()
    await (await WETH.deposit({value: ethers.utils.parseUnits("500000", "18") })).wait()


   
    await addLiquidity(Note, WETH, oracle, deployer, false);
    await addLiquidity(ETH, WETH, oracle, deployer, false);
    await addLiquidity(WETH, ATOM, oracle, deployer, false);
    await addLiquidity(Note, USDC, oracle, deployer, true);
    await addLiquidity(Note, USDT, oracle, deployer, true);
    // await addLiquidity(Note, ATOM, oracle, deployer, false);
    // await addLiquidity(Note, ETH, oracle, deployer, false);
    console.log(await BaseV1Factory.allPairs(0));
    console.log(await BaseV1Factory.allPairs(1));
    console.log(await BaseV1Factory.allPairs(2));
    console.log(await BaseV1Factory.allPairs(3));
    console.log(await BaseV1Factory.allPairs(4));

    await ((await BaseV1Factory.setPeriodSize(0)).wait());

    for (let i=0; i < 10; i++) {
      await swapTokens(Note, WETH, oracle, deployer, false);
      await swapTokens(ETH, WETH, oracle, deployer, false);
      await swapTokens(WETH, ATOM, oracle, deployer, false);
      await swapTokens(Note, USDC, oracle, deployer, true);
      await swapTokens(Note, USDT, oracle, deployer, true);
      // await swapTokens(Note, ATOM, oracle, deployer, false);
      // await swapTokens(Note, ETH, oracle, deployer, false);
    }
  }

  async function addLiquidity(t1, t2, oracle, deployer, stable) {
    console.log("ADD LIQUIDITY:")
    await (await t1.approve(oracle.address, "10000000000000000000000000")).wait();
    await (await t2.approve(oracle.address, "10000000000000000000000000")).wait();


    let t1BalanceBefore = await t1.balanceOf(deployer);
    let t2BalanceBefore = await t2.balanceOf(deployer);
    await (await oracle.addLiquidity(
        t1.address, t2.address, stable, 
        ethers.utils.parseUnits("1000", await t1.decimals()),
        ethers.utils.parseUnits("1000", await t2.decimals()),
        0, 0, deployer, ethers.BigNumber.from("9999999999999999999999999999999")
    )).wait();
    let t1BalanceAfter = await t1.balanceOf(deployer);
    let t2BalanceAfter = await t2.balanceOf(deployer);
    console.log(t1BalanceBefore.toString() + "----->", t1BalanceAfter.toString());
    console.log(t2BalanceBefore.toString() + "----->", t2BalanceAfter.toString());
    
  }
  async function swapTokens(t1, t2, oracle, deployer, stable) {
    let t1BalanceBefore = await t1.balanceOf(deployer);
    let t2BalanceBefore = await t2.balanceOf(deployer);
    console.log("SWAP: ")
    await (await oracle.swapExactTokensForTokensSimple(
        ethers.utils.parseUnits("10", await t1.decimals()),
        ethers.utils.parseUnits("0",  await t2.decimals()),
        t1.address, 
        t2.address,
        stable,
        deployer,
        ethers.BigNumber.from("9999999999999999999999999999999")
    )).wait();
    let t1BalanceAfter = await t1.balanceOf(deployer);
    let t2BalanceAfter = await t2.balanceOf(deployer);
    console.log(t1BalanceBefore.toString() + "----->", t1BalanceAfter.toString());
    console.log(t2BalanceBefore.toString() + "----->", t2BalanceAfter.toString());

  }






  main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});