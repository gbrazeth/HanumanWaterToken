import hre from "hardhat";

async function main() {
  const PRESALE_ADDRESS = "0x574fbD780fB141F0D1BA84D8eC8952aFf3dF45d3";
  const presale = await hre.ethers.getContractAt("HWTPresale", PRESALE_ADDRESS);
  const hwtAddress = await presale.hwtToken();
  console.log(`HWT address salvo no HWTPresale: ${hwtAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
