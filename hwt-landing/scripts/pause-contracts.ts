import { ethers } from "hardhat";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const contractName = process.env.PAUSE_CONTRACT_NAME!; // "HanumanWaterTokenV2" ou "HanumanWaterTokenPresale"
  const contractAddress = process.env.PAUSE_CONTRACT_ADDRESS!;

  if (!contractName || !contractAddress) {
    throw new Error("Defina PAUSE_CONTRACT_NAME e PAUSE_CONTRACT_ADDRESS no .env");
  }

  const ContractFactory = await ethers.getContractFactory(contractName);
  const contract = ContractFactory.attach(contractAddress);

  console.log(`Pausando contrato ${contractName} em ${contractAddress}...`);
  const tx = await contract.pause();
  await tx.wait();
  console.log("Contrato pausado com sucesso!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
