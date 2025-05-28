import hre from "hardhat";

async function main() {
  // Pegue o endereço do novo HWT do output do deploy-new-hwt.ts
  const HWT_ADDRESS = "0x123a55BFDda355C10a9fb1EdF7f3c80152D5e91c";
  const USDT_ADDRESS = "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06";
  const INITIAL_ETH_PRICE_USD = hre.ethers.utils.parseUnits("3000", 8);

  const Presale = await hre.ethers.getContractFactory("HWTPresale");
  const presale = await Presale.deploy(HWT_ADDRESS, USDT_ADDRESS, INITIAL_ETH_PRICE_USD);
  await presale.deployed();
  console.log("Novo HWTPresale deployado em:", presale.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
