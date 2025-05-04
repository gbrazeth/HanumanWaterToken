import { config as dotenvConfig } from "dotenv";
dotenvConfig();

import hre from "hardhat";
const { ethers } = hre;

async function main() {
  // Parâmetros do construtor
  const HWT_ADDRESS = "0xE03CBA5b5818Ae164D098f349809DA0567F31038"; // HWT Sepolia
  const USDT_ADDRESS = "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06"; // USDT Sepolia
  const INITIAL_ETH_PRICE_USD = ethers.utils.parseUnits("3000", 8); // Exemplo: 3000 USD (8 casas decimais)

  const Presale = await ethers.getContractFactory("HWTPresale");
  const presale = await Presale.deploy(HWT_ADDRESS, USDT_ADDRESS, INITIAL_ETH_PRICE_USD);

  await presale.deployed();

  console.log("HWTPresale deployed to:", presale.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
