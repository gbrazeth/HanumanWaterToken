const hre = require("hardhat");

async function main() {
  const PRESALE_ADDRESS = "0x67A506934aA8Bb00E92a706Ba40c373F6269B44d"; // Mainnet
  
  console.log("🔧 Ajustando TWAP para usar preços mais atuais...\n");
  
  const Presale = await hre.ethers.getContractAt("HanumanWaterTokenPresale", PRESALE_ADDRESS);
  
  // Valores atuais
  const currentMaxPriceAge = await Presale.maxPriceAge();
  const currentMaxPriceDeviation = await Presale.maxPriceDeviation();
  const currentTwapWindow = await Presale.twapWindow();
  
  console.log("📊 Valores atuais:");
  console.log(`   maxPriceAge       : ${currentMaxPriceAge.toString()} s`);
  console.log(`   maxPriceDeviation : ${currentMaxPriceDeviation.toString()} %`);
  console.log(`   twapWindow        : ${currentTwapWindow.toString()} preços`);
  
  // Verificar preços
  const currentPrice = await Presale.getEthUsdPrice();
  const twapPrice = await Presale.calculateTwapPrice();
  
  console.log("\n💰 Preços:");
  console.log(`   Preço atual ETH/USD: $${(Number(currentPrice) / 1e8).toFixed(2)}`);
  console.log(`   TWAP atual         : $${(Number(twapPrice) / 1e8).toFixed(2)}`);
  
  const priceDiff = ((Number(twapPrice) - Number(currentPrice)) / Number(currentPrice)) * 100;
  console.log(`   Diferença          : ${priceDiff.toFixed(2)}% (TWAP vs atual)`);
  
  if (priceDiff > 5) {
    console.log("\n⚠️  TWAP está significativamente mais alto que o preço atual");
    console.log("   Usuários estão pagando menos ETH do que deveriam");
    
    // Ajustar para usar preços mais atuais
    const NEW_MAX_PRICE_AGE = 1800; // 30 minutos (mais atual)
    const NEW_MAX_PRICE_DEVIATION = 20; // 20% (mais conservador)
    const NEW_TWAP_WINDOW = 1; // Usar apenas preço atual
    
    console.log("\n🆕 Novos valores propostos:");
    console.log(`   maxPriceAge       : ${NEW_MAX_PRICE_AGE} s (30 min - mais atual)`);
    console.log(`   maxPriceDeviation : ${NEW_MAX_PRICE_DEVIATION} % (mais conservador)`);
    console.log(`   twapWindow        : ${NEW_TWAP_WINDOW} preços (só preço atual)`);
    
    const tx = await Presale.updatePriceProtectionParams(
      NEW_MAX_PRICE_AGE,
      NEW_MAX_PRICE_DEVIATION,
      NEW_TWAP_WINDOW
    );
    
    console.log("\n⏳ Enviando transação...");
    console.log(`   Hash: ${tx.hash}`);
    
    await tx.wait();
    
    console.log("\n✅ Parâmetros atualizados!");
    
    // Verificar novo TWAP
    const newTwapPrice = await Presale.calculateTwapPrice();
    console.log(`   Novo TWAP: $${(Number(newTwapPrice) / 1e8).toFixed(2)}`);
    
    // Testar cálculo para 10 tokens
    const tokenAmount = hre.ethers.utils.parseUnits("10", 18);
    const ethAmount = await Presale.getEthAmountForTokens(tokenAmount);
    const ethFormatted = hre.ethers.utils.formatEther(ethAmount);
    const usdValue = Number(ethFormatted) * (Number(newTwapPrice) / 1e8);
    
    console.log("\n🧪 TESTE: 10 HWT após ajuste:");
    console.log(`   ETH necessário: ${ethFormatted} ETH`);
    console.log(`   Valor em USD  : $${usdValue.toFixed(2)}`);
    console.log(`   Esperado      : $20.00`);
    
    if (Math.abs(usdValue - 20) < 1) {
      console.log("   ✅ Cálculo agora está correto!");
    } else {
      console.log("   ⚠️  Ainda há diferença - pode precisar de mais ajustes");
    }
    
  } else {
    console.log("\n✅ TWAP está próximo do preço atual - sem necessidade de ajuste");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erro:", error);
    process.exit(1);
  });
