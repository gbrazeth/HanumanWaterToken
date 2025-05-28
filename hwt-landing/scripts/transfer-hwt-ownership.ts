import hre from "hardhat";

async function main() {
  const NEW_OWNER = "0xD490cc38AE9eE28281825c7F4ceAB70B557F3a3C"; // Novo HWTPresale
  const HWT_ADDRESS = "0x123a55BFDda355C10a9fb1EdF7f3c80152D5e91c";

  const hwt = await hre.ethers.getContractAt("HanumanWaterToken", HWT_ADDRESS);
  const tx = await hwt.transferOwnership(NEW_OWNER);
  await tx.wait();
  console.log(`Ownership of HWT transferred to HWTPresale: ${NEW_OWNER}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
