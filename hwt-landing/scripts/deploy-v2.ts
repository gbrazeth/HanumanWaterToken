import { ethers } from "hardhat";

async function main() {
  console.log("Iniciando implantação dos contratos HanumanWaterToken V2...");

  // Endereços das carteiras (substitua pelos endereços reais)
  const [deployer] = await ethers.getSigners();
  const developmentTeamWallet = deployer.address;
  const liquidityReserveWallet = deployer.address;
  const strategicPartnershipsWallet = deployer.address;
  const treasuryWallet = deployer.address;

  // Endereços dos contratos externos (substitua pelos endereços reais da rede desejada)
  // Mainnet Ethereum
  const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // USDT na Ethereum Mainnet
  const ethUsdPriceFeedAddress = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"; // ETH/USD Chainlink na Ethereum Mainnet
  
  // Sepolia Testnet (para testes)
  // const usdtAddress = "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06"; // Mock USDT na Sepolia
  // const ethUsdPriceFeedAddress = "0x694AA1769357215DE4FAC081bf1f309aDC325306"; // ETH/USD Chainlink na Sepolia

  console.log("Implantando o contrato HanumanWaterTokenV2...");
  const HanumanWaterTokenV2 = await ethers.getContractFactory("HanumanWaterTokenV2");
  const hwtToken = await HanumanWaterTokenV2.deploy(
    developmentTeamWallet,
    liquidityReserveWallet,
    strategicPartnershipsWallet
  );

  await hwtToken.waitForDeployment();
  const hwtTokenAddress = await hwtToken.getAddress();
  console.log(`HanumanWaterTokenV2 implantado em: ${hwtTokenAddress}`);

  console.log("Implantando o contrato HanumanWaterTokenPresale...");
  const HanumanWaterTokenPresale = await ethers.getContractFactory("HanumanWaterTokenPresale");
  
  // Duração da pré-venda: 5 anos (1825 dias)
  const presaleDurationDays = 1825;
  
  const presaleContract = await HanumanWaterTokenPresale.deploy(
    hwtTokenAddress,
    usdtAddress,
    ethUsdPriceFeedAddress,
    treasuryWallet,
    presaleDurationDays
  );

  await presaleContract.waitForDeployment();
  const presaleContractAddress = await presaleContract.getAddress();
  console.log(`HanumanWaterTokenPresale implantado em: ${presaleContractAddress}`);

  // Configurar o contrato de token para reconhecer o contrato de pré-venda
  console.log("Configurando o contrato HanumanWaterTokenV2 para reconhecer o contrato de pré-venda...");
  const updatePresaleTx = await hwtToken.updatePresaleContract(presaleContractAddress);
  await updatePresaleTx.wait();
  console.log("Contrato de pré-venda configurado com sucesso!");

  console.log("\nResumo da implantação:");
  console.log(`HanumanWaterTokenV2: ${hwtTokenAddress}`);
  console.log(`HanumanWaterTokenPresale: ${presaleContractAddress}`);
  console.log(`Carteira da equipe de desenvolvimento: ${developmentTeamWallet}`);
  console.log(`Carteira de reserva de liquidez: ${liquidityReserveWallet}`);
  console.log(`Carteira de parcerias estratégicas: ${strategicPartnershipsWallet}`);
  console.log(`Carteira do tesouro: ${treasuryWallet}`);
  console.log(`Duração da pré-venda: ${presaleDurationDays} dias`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
