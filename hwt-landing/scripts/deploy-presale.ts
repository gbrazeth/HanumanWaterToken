import { config as dotenvConfig } from "dotenv";
dotenvConfig();

import hre from "hardhat";
const { ethers } = hre;

async function main() {
  console.log("Iniciando deploy dos contratos na rede Sepolia...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Implantando contratos com a conta:", deployer.address);
  
  // Parâmetros para HanumanWaterTokenV2
  const DEV_TEAM_WALLET = deployer.address; // Wallet da equipe de desenvolvimento
  const LIQUIDITY_RESERVE_WALLET = deployer.address; // Wallet de reserva de liquidez
  const STRATEGIC_PARTNERSHIPS_WALLET = deployer.address; // Wallet de parcerias estratégicas
  const DELIVERY_OPERATOR_WALLET = deployer.address; // Para teste, use o deployer como operador de entrega

  // Deploy HanumanWaterTokenV2
  console.log("Implantando HanumanWaterTokenV2...");
  const HanumanWaterTokenV2 = await ethers.getContractFactory("HanumanWaterTokenV2");
  const hwtToken = await HanumanWaterTokenV2.deploy(
    DEV_TEAM_WALLET,
    LIQUIDITY_RESERVE_WALLET,
    STRATEGIC_PARTNERSHIPS_WALLET,
    DELIVERY_OPERATOR_WALLET
  );
  
  await hwtToken.deployed();
  console.log("HanumanWaterTokenV2 implantado em:", hwtToken.address);
  
  // Parâmetros para HanumanWaterTokenPresale
  const USDT_ADDRESS = "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06"; // USDT Sepolia
  const CHAINLINK_ETH_USD_PRICE_FEED = "0x694AA1769357215DE4FAC081bf1f309aDC325306"; // Sepolia ETH/USD price feed
  const TREASURY_WALLET = deployer.address; // Wallet do tesouro
  const PRESALE_DURATION_DAYS = 30; // Duração da pré-venda em dias
  
  // Deploy HanumanWaterTokenPresale
  console.log("Implantando HanumanWaterTokenPresale...");
  const HanumanWaterTokenPresale = await ethers.getContractFactory("HanumanWaterTokenPresale");
  const presale = await HanumanWaterTokenPresale.deploy(
    hwtToken.address,
    USDT_ADDRESS,
    CHAINLINK_ETH_USD_PRICE_FEED,
    TREASURY_WALLET,
    PRESALE_DURATION_DAYS
  );
  
  await presale.deployed();
  console.log("HanumanWaterTokenPresale implantado em:", presale.address);
  
  // Configurar o contrato de token para reconhecer o contrato de pré-venda
  console.log("Configurando contrato de pré-venda no token HWT...");
  await hwtToken.updatePresaleContract(presale.address);
  console.log("Configuração concluída!");
  
  console.log("\nResumo da implantação:");
  console.log("------------------------");
  console.log("HanumanWaterTokenV2: ", hwtToken.address);
  console.log("HanumanWaterTokenPresale: ", presale.address);
  console.log("------------------------");
  console.log("Implantação completa e contratos configurados com sucesso!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
