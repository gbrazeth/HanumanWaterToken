import hre from "hardhat";

async function main() {
  const NEW_OWNER = "0x466a830492AE1deeF25309BaC52519b6a73A9CCe"; // Novo HWTPresale com HWT correto
  const HWT_ADDRESS = "0x8F2bdA913a6Ac0ad865900C262e1BFc03843Dff1";

  const hwt = await hre.ethers.getContractAt("HanumanWaterToken", HWT_ADDRESS);
  const tx = await hwt.transferOwnership(NEW_OWNER);
  await tx.wait();
  console.log(`Ownership of HWT transferred to HWTPresale: ${NEW_OWNER}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
