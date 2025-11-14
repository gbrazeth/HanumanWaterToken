const hre = require("hardhat");

async function main() {
  const PRESALE_ADDRESS = "0x67A506934aA8Bb00E92a706Ba40c373F6269B44d"; // Mainnet
  
  console.log("🔄 Forçando múltiplas atualizações do TWAP...\n");
  
  const Presale = await hre.ethers.getContractAt("HanumanWaterTokenPresale", PRESALE_ADDRESS);
  
  // Verificar estado inicial
  const initialPrice = await Presale.getEthUsdPrice();
  const initialTwap = await Presale.calculateTwapPrice();
  
  console.log("📊 Estado inicial:");
  console.log(`   Preço atual: $${(Number(initialPrice) / 1e8).toFixed(2)}`);
  console.log(`   TWAP atual : $${(Number(initialTwap) / 1e8).toFixed(2)}`);
  
  // Aumentar temporariamente o maxPriceDeviation para 50%
  console.log("\n🔧 Aumentando maxPriceDeviation para 50%...");
  const tx1 = await Presale.updatePriceProtectionParams(1800, 50, 1);
  await tx1.wait();
  console.log("✅ Parâmetros atualizados");
  
  // Fazer múltiplas atualizações do TWAP
  console.log("\n🔄 Fazendo múltiplas atualizações do TWAP...");
  
  for (let i = 1; i <= 5; i++) {
    console.log(`   Atualização ${i}/5...`);
    const tx = await Presale.updateAndGetTwapPrice();
    await tx.wait();
    
    const currentTwap = await Presale.calculateTwapPrice();
    console.log(`   TWAP após atualização ${i}: $${(Number(currentTwap) / 1e8).toFixed(2)}`);
    
    // Pequena pausa entre atualizações
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Verificar se o TWAP se aproximou do preço atual
  const finalPrice = await Presale.getEthUsdPrice();
  const finalTwap = await Presale.calculateTwapPrice();
  
  console.log("\n📊 Estado final:");
  console.log(`   Preço atual: $${(Number(finalPrice) / 1e8).toFixed(2)}`);
  console.log(`   TWAP final : $${(Number(finalTwap) / 1e8).toFixed(2)}`);
  
  const improvement = ((Number(initialTwap) - Number(finalTwap)) / Number(initialTwap)) * 100;
  console.log(`   Melhoria   : ${improvement.toFixed(2)}% (redução no TWAP)`);
  
  // Reduzir maxPriceDeviation para valor normal
  console.log("\n🔧 Reduzindo maxPriceDeviation para 15%...");
  const tx2 = await Presale.updatePriceProtectionParams(1800, 15, 1);
  await tx2.wait();
  console.log("✅ Parâmetros finais configurados");
  
  // Teste final
  console.log("\n🧪 TESTE FINAL: 10 HWT");
  console.log("=======================");
  
  const tokenAmount = hre.ethers.utils.parseUnits("10", 18);
  const ethAmount = await Presale.getEthAmountForTokens(tokenAmount);
  const ethFormatted = hre.ethers.utils.formatEther(ethAmount);
  const usdValue = Number(ethFormatted) * (Number(finalTwap) / 1e8);
  
  console.log(`ETH necessário: ${ethFormatted} ETH`);
  console.log(`Valor em USD  : $${usdValue.toFixed(2)}`);
  console.log(`Esperado      : $20.00`);
  
  const difference = Math.abs(usdValue - 20);
  const percentDiff = (difference / 20) * 100;
  
  if (difference < 1) {
    console.log(`✅ Cálculo correto! (diferença: $${difference.toFixed(2)})`);
  } else {
    console.log(`⚠️  Ainda há diferença: $${difference.toFixed(2)} (${percentDiff.toFixed(1)}%)`);
    
    if (Number(finalTwap) > Number(finalPrice) * 1.1) {
      console.log("   💡 TWAP ainda está alto - usuários pagam menos ETH que o valor real");
      console.log("   💡 Isso é temporariamente vantajoso para os compradores");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erro:", error);
    process.exit(1);
  });
