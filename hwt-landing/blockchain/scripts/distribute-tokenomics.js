// Script para distribuir tokens conforme a tokenomics do Hanuman Water Token V2
// Execute: npx hardhat run scripts/distribute-tokenomics.js --network mainnet

require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const tokenAddress = process.env.HWT_TOKEN_ADDRESS;
  if (!tokenAddress) throw new Error("Defina HWT_TOKEN_ADDRESS no .env");

  // Valores e carteiras conforme sua tokenomics
  const TEAM_WALLET = process.env.DEVELOPMENT_TEAM_WALLET;
  const LIQUIDITY_WALLET = process.env.LIQUIDITY_RESERVE_WALLET;
  const PARTNERSHIPS_WALLET = process.env.STRATEGIC_PARTNERSHIPS_WALLET;
  const COMMUNITY_WALLET = process.env.COMMUNITY_REWARDS_WALLET;
  const CONSULTANTS_WALLET = process.env.CONSULTANTS_WALLET;

  // Valores em tokens (ajuste para 18 casas decimais)
  const teamAmount = hre.ethers.utils.parseUnits("6000000", 18); // 6% de 100M
  const liquidityAmount = hre.ethers.utils.parseUnits("5000000", 18); // 5%
  const partnershipsAmount = hre.ethers.utils.parseUnits("3000000", 18); // 3%
  const communityAmount = hre.ethers.utils.parseUnits("3000000", 18); // 3%
  const consultantsAmount = hre.ethers.utils.parseUnits("3000000", 18); // 3%

  const HanumanWaterTokenV2 = await hre.ethers.getContractFactory("HanumanWaterTokenV2");
  const token = HanumanWaterTokenV2.attach(tokenAddress);

  // Mint para cada carteira usando funções onlyOwner
  console.log("Distribuindo para equipe de desenvolvimento...");
  await (await token.mintTeamTokens(teamAmount)).wait();

  console.log("Distribuindo para reserva de liquidez...");
  await (await token.mintLiquidityTokens(liquidityAmount)).wait();

  console.log("Distribuindo para parcerias estratégicas...");
  await (await token.mintPartnershipsTokens(partnershipsAmount)).wait();

  console.log("Distribuindo para recompensas da comunidade...");
  await (await token.mintCommunityTokens(COMMUNITY_WALLET, communityAmount)).wait();

  console.log("Distribuindo para consultores...");
  await (await token.mintConsultantsTokens(CONSULTANTS_WALLET, consultantsAmount)).wait();

  console.log("Distribuição concluída!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
