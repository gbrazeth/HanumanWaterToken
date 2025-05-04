import hre from "hardhat";

async function main() {
  const PRESALE_ADDRESS = "0x574fbD780fB141F0D1BA84D8eC8952aFf3dF45d3";
  const ethPriceUSD = "300000000000"; // $3,000.00, 8 casas decimais

  const presale = await hre.ethers.getContractAt("HWTPresale", PRESALE_ADDRESS);
  const tx = await presale.updateEthPrice(ethPriceUSD);
  await tx.wait();
  console.log(`ethPriceUSD atualizado para ${ethPriceUSD}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
