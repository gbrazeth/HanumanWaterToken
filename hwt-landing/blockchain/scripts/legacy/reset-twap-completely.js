const hre = require("hardhat");

async function main() {
  const PRESALE_ADDRESS = "0x67A506934aA8Bb00E92a706Ba40c373F6269B44d"; // Mainnet
  
  console.log("🔄 Resetando TWAP completamente...\n");
  
  const Presale = await hre.ethers.getContractAt("HanumanWaterTokenPresale", PRESALE_ADDRESS);
  
  // Verificar diferença atual
  const currentPrice = await Presale.getEthUsdPrice();
  const twapPrice = await Presale.calculateTwapPrice();
  const priceDiff = Math.abs(Number(twapPrice) - Number(currentPrice)) / Number(currentPrice) * 100;
  
  console.log("📊 Estado atual:");
  console.log(`   Preço atual: $${(Number(currentPrice) / 1e8).toFixed(2)}`);
  console.log(`   TWAP atual : $${(Number(twapPrice) / 1e8).toFixed(2)}`);
  console.log(`   Diferença  : ${priceDiff.toFixed(2)}%`);
  
  // Passo 1: Aumentar temporariamente maxPriceDeviation para 50%
  console.log("\n🔧 Passo 1: Aumentando maxPriceDeviation para 50% temporariamente...");
  
  const tx1 = await Presale.updatePriceProtectionParams(
    1800, // maxPriceAge = 30 min
    50,   // maxPriceDeviation = 50% (temporário)
    1     // twapWindow = 1
  );
  await tx1.wait();
  console.log(`✅ Parâmetros atualizados. Hash: ${tx1.hash}`);
  
  // Passo 2: Forçar atualização do TWAP (agora deve funcionar)
  console.log("\n🔄 Passo 2: Forçando atualização do TWAP...");
  
  const tx2 = await Presale.updateAndGetTwapPrice();
  await tx2.wait();
  console.log(`✅ TWAP atualizado. Hash: ${tx2.hash}`);
  
  // Verificar novo TWAP
  const newTwapPrice = await Presale.calculateTwapPrice();
  console.log(`   Novo TWAP: $${(Number(newTwapPrice) / 1e8).toFixed(2)}`);
  
  // Passo 3: Reduzir maxPriceDeviation para valor normal (15%)
  console.log("\n🔧 Passo 3: Reduzindo maxPriceDeviation para 15%...");
  
  const tx3 = await Presale.updatePriceProtectionParams(
    1800, // maxPriceAge = 30 min
    15,   // maxPriceDeviation = 15% (valor normal)
    1     // twapWindow = 1
  );
  await tx3.wait();
  console.log(`✅ Parâmetros finais configurados. Hash: ${tx3.hash}`);
  
  // Teste final
  console.log("\n🧪 TESTE FINAL: 10 HWT");
  console.log("=======================");
  
  const tokenAmount = hre.ethers.utils.parseUnits("10", 18);
  const ethAmount = await Presale.getEthAmountForTokens(tokenAmount);
  const ethFormatted = hre.ethers.utils.formatEther(ethAmount);
  const usdValue = Number(ethFormatted) * (Number(newTwapPrice) / 1e8);
  
  console.log(`ETH necessário: ${ethFormatted} ETH`);
  console.log(`Valor em USD  : $${usdValue.toFixed(2)}`);
  console.log(`Esperado      : $20.00`);
  
  const difference = Math.abs(usdValue - 20);
  if (difference < 0.5) {
    console.log("✅ Cálculo agora está correto!");
  } else {
    console.log(`⚠️  Ainda há diferença de $${difference.toFixed(2)}`);
  }
  
  // Mostrar configuração final
  const finalMaxPriceAge = await Presale.maxPriceAge();
  const finalMaxPriceDeviation = await Presale.maxPriceDeviation();
  const finalTwapWindow = await Presale.twapWindow();
  
  console.log("\n📊 Configuração final:");
  console.log(`   maxPriceAge       : ${finalMaxPriceAge} s`);
  console.log(`   maxPriceDeviation : ${finalMaxPriceDeviation} %`);
  console.log(`   twapWindow        : ${finalTwapWindow} preços`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erro:", error);
    process.exit(1);
  });
