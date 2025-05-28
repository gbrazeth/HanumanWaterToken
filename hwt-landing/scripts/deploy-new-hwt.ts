import hre from "hardhat";

async function main() {
  // Novo deploy do HanumanWaterToken
  const developmentTeamWallet = process.env.DEVELOPMENT_TEAM_WALLET;
const liquidityReserveWallet = process.env.LIQUIDITY_RESERVE_WALLET;
const strategicPartnershipsWallet = process.env.STRATEGIC_PARTNERSHIPS_WALLET;

if (!developmentTeamWallet || !liquidityReserveWallet || !strategicPartnershipsWallet) {
  throw new Error("Endereços das carteiras não configurados no .env");
}

const HanumanWaterToken = await hre.ethers.getContractFactory("HanumanWaterToken");
const hwt = await HanumanWaterToken.deploy(
  developmentTeamWallet,
  liquidityReserveWallet,
  strategicPartnershipsWallet
);
await hwt.deployed();
console.log("Novo HanumanWaterToken deployado em:", hwt.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
