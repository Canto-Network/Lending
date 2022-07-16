import{expect} from "chai"
import{ethers, deployments, getNamedAccounts} from "hardhat";

let oracle: any;
let comptroller: any;
let weth: any;
let note: any;
let factory: any;   
let usdc: any;
let cCanto: any;
let usdt: any;
let cNote: any;
let cUsdc: any;
let cUsdt: any;
let noteRate: any; 
let cLPToken: any;
let WethLPToken: any; 
let USDCLPToken: any;
let cUsdcLPToken: any;
let cWethLPToken: any;

describe("Test with token of different decimals", async () => {
    let dep: any;
    before(async() => {
            dep  = await getNamedAccounts();
            [dep] = await ethers.getSigners();
            await deployments.fixture("Protocol");
            oracle = await ethers.getContract("BaseV1Router01");
            comptroller = new ethers.Contract(
                (await deployments.get("Unitroller")).address,
                (await deployments.get("Comptroller")).abi,
                dep 
            );
            weth = await ethers.getContract("WETH");
            usdt = await ethers.getContract("USDT");
            usdc = await ethers.getContract("USDC");
            note = await ethers.getContract("Note");
            cNote = await ethers.getContract("CNoteDelegator");
            cUsdc = await ethers.getContract("CUsdcDelegator");
            factory = await ethers.getContract("BaseV1Factory");
            cCanto = await ethers.getContract("CCanto");
            noteRate = await ethers.getContract("NoteRateModel");
    });

    describe("Borrow Note using USDC As Collateral", async () => {
        let mintBal = ethers.utils.parseUnits("200", "6");

        it("retrieve Note", async () => {
            await (await comptroller._supportMarket(cNote.address)).wait();
            await (await comptroller._supportMarket(cUsdc.address)).wait();
            await (await comptroller._supportMarket(cUsdt.address)).wait();
            await (await comptroller._setCollateralFactor(cNote.address, "900000000000000000")).wait();
            await (await comptroller._setCollateralFactor(cUsdc.address, "900000000000000000")).wait();
            await (await comptroller._setCollateralFactor(cUsdc.address, "900000000000000000")).wait();
            await (await comptroller.enterMarkets([cUsdc.address,cNote.address, cUsdt.address])).wait();
            await (await usdc.approve(cUsdc.address, mintBal)).wait();
            await (await usdc.approve(cUsdt.address, mintBal)).wait();
            await (await cUsdc.mint(mintBal)).wait();
            await (await cUsdt.mint(mintBal)).wait();
            let accLiquidity = (await comptroller.callStatic.getAccountLiquidity(dep.address))[1].toBigInt();
            await (await cNote.borrow(accLiquidity)).wait();
            expect((await note.balanceOf(dep.address)).toBigInt() > 0).to.be.true;
            console.log("USDC Balance: ", await usdc.balanceOf(dep.address)); 
            console.log("USDC Balance: ", await usdc.balanceOf(dep.address))
        });
    })

    it("Adds liquidit to the Note/USDC pair and swaps", async () => {

        await (await oracle.addLiquidity(
            note.address, usdc.address,true,
            ethers.utils.parseUnits("10", "18"), 
            ethers.utils.parseUnits("10", "6"),  
            0, 0,
            dep.address, 99999999999
        )).wait();
    });
}); 