const hardhat = require("hardhat");
const { ethers } = hardhat;
require("dotenv").config();

async function main() {
  console.log("Iniciando implantação dos contratos HanumanWaterToken V2 na Ethereum Mainnet...");

  // Endereços das carteiras (obtidos do .env)
  const developmentTeamWallet = process.env.DEVELOPMENT_TEAM_WALLET;
  const liquidityReserveWallet = process.env.LIQUIDITY_RESERVE_WALLET;
  const strategicPartnershipsWallet = process.env.STRATEGIC_PARTNERSHIPS_WALLET;
  const communityRewardsWallet = process.env.COMMUNITY_REWARDS_WALLET;
  const consultantsWallet = process.env.CONSULTANTS_WALLET;
  const deliveryOperator = process.env.DELIVERY_OPERATOR;
  const treasuryWallet = process.env.TREASURY_WALLET;

  // Validação básica
  if (!developmentTeamWallet || !liquidityReserveWallet || !strategicPartnershipsWallet || !communityRewardsWallet || !consultantsWallet || !deliveryOperator || !treasuryWallet) {
    throw new Error("Um ou mais endereços de carteira não estão definidos no .env");
  }

  // Endereços dos contratos externos na mainnet
  const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // USDT mainnet
  const ethUsdPriceFeedAddress = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"; // Chainlink ETH/USD mainnet

  // Deploy do token
  console.log("Implantando HanumanWaterTokenV2...");
  const HanumanWaterTokenV2 = await ethers.getContractFactory("HanumanWaterTokenV2");
  const hwtToken = await HanumanWaterTokenV2.deploy(
    developmentTeamWallet,
    liquidityReserveWallet,
    strategicPartnershipsWallet,
    deliveryOperator
  );
  await hwtToken.deployed();
  const hwtTokenDeployTx = hwtToken.deployTransaction;
  const hwtTokenReceipt = await hwtTokenDeployTx.wait();
  console.log(`Gas usado no deploy HanumanWaterTokenV2: ${hwtTokenReceipt.gasUsed.toString()}`);
  const hwtTokenAddress = hwtToken.address;
  console.log(`HanumanWaterTokenV2 implantado em: ${hwtTokenAddress}`);

  // Deploy do contrato de pré-venda
  console.log("Implantando HanumanWaterTokenPresale...");
  const HanumanWaterTokenPresale = await ethers.getContractFactory("HanumanWaterTokenPresale");
  const presaleDurationDays = 365; // 1 ano
  const presaleContract = await HanumanWaterTokenPresale.deploy(
    hwtTokenAddress,
    usdtAddress,
    ethUsdPriceFeedAddress,
    treasuryWallet,
    presaleDurationDays
  );
  await presaleContract.deployed();
  const presaleDeployTx = presaleContract.deployTransaction;
  const presaleReceipt = await presaleDeployTx.wait();
  console.log(`Gas usado no deploy HanumanWaterTokenPresale: ${presaleReceipt.gasUsed.toString()}`);
  const presaleContractAddress = presaleContract.address;
  console.log(`HanumanWaterTokenPresale implantado em: ${presaleContractAddress}`);

  // Configuração do contrato de token para reconhecer o contrato de pré-venda
  console.log("Configurando HanumanWaterTokenV2 para reconhecer o contrato de pré-venda...");
  const updatePresaleTx = await hwtToken.updatePresaleContract(presaleContractAddress);
  await updatePresaleTx.wait();
  console.log("Contrato de pré-venda configurado com sucesso!");

  // Resumo
  console.log("\nResumo da implantação:");
  console.log(`HanumanWaterTokenV2: ${hwtTokenAddress}`);
  console.log(`HanumanWaterTokenPresale: ${presaleContractAddress}`);
  console.log(`Carteira da equipe de desenvolvimento: ${developmentTeamWallet}`);
  console.log(`Carteira de reserva de liquidez: ${liquidityReserveWallet}`);
  console.log(`Carteira de parcerias estratégicas: ${strategicPartnershipsWallet}`);
  console.log(`Carteira de recompensas da comunidade: ${communityRewardsWallet}`);
  console.log(`Carteira de consultores: ${consultantsWallet}`);
  console.log(`Operador de entrega: ${deliveryOperator}`);
  console.log(`Carteira do tesouro: ${treasuryWallet}`);
  console.log(`Duração da pré-venda: ${presaleDurationDays} dias`);
  console.log(`USDT: ${usdtAddress}`);
  console.log(`Oracle ETH/USD: ${ethUsdPriceFeedAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
