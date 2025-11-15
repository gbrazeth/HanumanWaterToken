import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  // Obter endereços das carteiras do ambiente
  const developmentTeamWallet = process.env.DEVELOPMENT_TEAM_WALLET;
  const liquidityReserveWallet = process.env.LIQUIDITY_RESERVE_WALLET;
  const strategicPartnershipsWallet = process.env.STRATEGIC_PARTNERSHIPS_WALLET;

  if (!developmentTeamWallet || !liquidityReserveWallet || !strategicPartnershipsWallet) {
    throw new Error("Endereços das carteiras não configurados no .env");
  }

  console.log("Implantando contrato HanumanWaterToken...");

  const [deployer] = await ethers.getSigners();
  console.log("Implantando com a conta:", deployer.address);

  const HanumanWaterToken = await ethers.getContractFactory("HanumanWaterToken");
  const token = await HanumanWaterToken.deploy(
    developmentTeamWallet,
    liquidityReserveWallet,
    strategicPartnershipsWallet
  );

  await token.deployed();

  const address = token.address;
  console.log(`HanumanWaterToken implantado em: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
