import { ethers } from "hardhat";

async function main() {
  console.log("Iniciando implantação dos contratos HanumanWaterToken V2 (Versão Atualizada)...");

  // Endereços das carteiras (usando a carteira do deployer para testes)
  const [deployer] = await ethers.getSigners();
  const developmentTeamWallet = deployer.address;
  const liquidityReserveWallet = deployer.address;
  const strategicPartnershipsWallet = deployer.address;
  const treasuryWallet = deployer.address;
  const consultantsWallet = deployer.address;
  const communityRewardsWallet = deployer.address;

  // Endereços dos contratos externos para Sepolia Testnet
  const usdtAddress = "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06"; // Mock USDT na Sepolia
  const ethUsdPriceFeedAddress = "0x694AA1769357215DE4FAC081bf1f309aDC325306"; // ETH/USD Chainlink na Sepolia

  console.log("Implantando o contrato HanumanWaterTokenV2...");
  const HanumanWaterTokenV2 = await ethers.getContractFactory("HanumanWaterTokenV2");
  const hwtToken = await HanumanWaterTokenV2.deploy(
    developmentTeamWallet,
    liquidityReserveWallet,
    strategicPartnershipsWallet,
    communityRewardsWallet,
    consultantsWallet
  );

  await hwtToken.deploymentTransaction().wait();
  const hwtTokenAddress = hwtToken.target.toString();
  console.log(`HanumanWaterTokenV2 implantado em: ${hwtTokenAddress}`);

  console.log("Implantando o contrato HanumanWaterTokenPresale...");
  const HanumanWaterTokenPresale = await ethers.getContractFactory("HanumanWaterTokenPresale");
  
  // A duração da pré-venda agora está limitada a 1 ano (365 dias) conforme as melhorias de segurança
  const presaleDurationDays = 365;
  
  const presaleContract = await HanumanWaterTokenPresale.deploy(
    hwtTokenAddress,
    usdtAddress,
    ethUsdPriceFeedAddress,
    treasuryWallet,
    presaleDurationDays
  );

  await presaleContract.deploymentTransaction().wait();
  const presaleContractAddress = presaleContract.target.toString();
  console.log(`HanumanWaterTokenPresale implantado em: ${presaleContractAddress}`);

  // Configurar o contrato de token para reconhecer o contrato de pré-venda
  console.log("Configurando o contrato HanumanWaterTokenV2 para reconhecer o contrato de pré-venda...");
  const updatePresaleTx = await hwtToken.updatePresaleContract(presaleContractAddress);
  await updatePresaleTx.wait();
  console.log("Contrato de pré-venda configurado com sucesso!");

  // Aprovar o contrato de pré-venda para gastar tokens
  console.log("Aprovando o contrato de pré-venda para gastar tokens...");
  // 100 milhões de tokens (18 casas decimais)
  const totalPresaleTokens = BigInt("100000000000000000000000000");
  const approveTx = await hwtToken.approve(presaleContractAddress, totalPresaleTokens);
  await approveTx.wait();
  console.log(`Aprovação de 100.000.000 tokens para o contrato de pré-venda concluída!`);

  console.log("\nResumo da implantação:");
  console.log(`HanumanWaterTokenV2: ${hwtTokenAddress}`);
  console.log(`HanumanWaterTokenPresale: ${presaleContractAddress}`);
  console.log(`Carteira da equipe de desenvolvimento: ${developmentTeamWallet}`);
  console.log(`Carteira de reserva de liquidez: ${liquidityReserveWallet}`);
  console.log(`Carteira de parcerias estratégicas: ${strategicPartnershipsWallet}`);
  console.log(`Carteira de recompensas da comunidade: ${communityRewardsWallet}`);
  console.log(`Carteira de consultores: ${consultantsWallet}`);
  console.log(`Carteira do tesouro: ${treasuryWallet}`);
  console.log(`Duração da pré-venda: ${presaleDurationDays} dias (limitado conforme melhorias de segurança)`);
  console.log(`USDT: ${usdtAddress}`);
  console.log(`Oracle ETH/USD: ${ethUsdPriceFeedAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
