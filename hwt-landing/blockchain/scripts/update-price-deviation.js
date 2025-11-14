const hre = require("hardhat");

async function main() {
  const PRESALE_ADDRESS = "0x67A506934aA8Bb00E92a706Ba40c373F6269B44d"; // Mainnet
  
  console.log("Atualizando maxPriceDeviation do contrato de presale...");
  
  const Presale = await hre.ethers.getContractAt("HanumanWaterTokenPresale", PRESALE_ADDRESS);
  
  // Verificar valor atual
  const currentDeviation = await Presale.maxPriceDeviation();
  console.log(`Desvio atual: ${currentDeviation}%`);
  
  // Atualizar para 20% (mais permissivo)
  const newDeviation = 20;
  console.log(`Atualizando para: ${newDeviation}%`);
  
  const tx = await Presale.updateMaxPriceDeviation(newDeviation);
  await tx.wait();
  
  console.log(`✅ maxPriceDeviation atualizado para ${newDeviation}%`);
  console.log(`Transaction hash: ${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
