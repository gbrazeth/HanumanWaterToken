import hre from "hardhat";

async function main() {
  const HWT_ADDRESS = "0x8F2bdA913a6Ac0ad865900C262e1BFc03843Dff1";
  const HWTPRESALE_ADDRESS = "0x466a830492AE1deeF25309BaC52519b6a73A9CCe";

  const hwt = await hre.ethers.getContractAt("HanumanWaterToken", HWT_ADDRESS);
  const presale = await hre.ethers.getContractAt("HWTPresale", HWTPRESALE_ADDRESS);

  const owner = await hwt.owner();
  const totalSupply = await hwt.totalSupply();
  const maxSupply = await hwt.MAX_SUPPLY();
  const ethPriceUSD = await presale.ethPriceUSD();

  console.log(`Owner do HWT: ${owner}`);
  console.log(`Total Supply: ${hre.ethers.utils.formatUnits(totalSupply, 18)}`);
  console.log(`Max Supply: ${hre.ethers.utils.formatUnits(maxSupply, 18)}`);
  console.log(`ethPriceUSD: ${ethPriceUSD.toString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
