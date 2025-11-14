const hre = require("hardhat");

async function main() {
  const PRESALE_ADDRESS = "0x67A506934aA8Bb00E92a706Ba40c373F6269B44d"; // Mainnet
  
  console.log("🔍 Verificando status do TWAP...\n");
  
  const Presale = await hre.ethers.getContractAt("HanumanWaterTokenPresale", PRESALE_ADDRESS);
  
  try {
    // Obter valores atuais
    const currentPrice = await Presale.getEthUsdPrice();
    const twapPrice = await Presale.calculateTwapPrice();
    const maxDeviation = await Presale.maxPriceDeviation();
    
    // Calcular desvio
    const currentPriceNum = Number(currentPrice) / 1e8;
    const twapPriceNum = Number(twapPrice) / 1e8;
    const deviation = Math.abs(currentPriceNum - twapPriceNum) * 100 / twapPriceNum;
    
    console.log("📊 DADOS ATUAIS:");
    console.log("================");
    console.log(`Preço ETH/USD atual: $${currentPriceNum.toFixed(2)}`);
    console.log(`TWAP (média): $${twapPriceNum.toFixed(2)}`);
    console.log(`Desvio calculado: ${deviation.toFixed(2)}%`);
    console.log(`Desvio máximo permitido: ${maxDeviation}%`);
    console.log("");
    
    // Status
    if (deviation <= maxDeviation) {
      console.log("✅ STATUS: COMPRAS PERMITIDAS");
      console.log(`   O desvio (${deviation.toFixed(2)}%) está dentro do limite (${maxDeviation}%)`);
    } else {
      console.log("❌ STATUS: COMPRAS BLOQUEADAS");
      console.log(`   O desvio (${deviation.toFixed(2)}%) excede o limite (${maxDeviation}%)`);
      console.log("");
      console.log("🔧 SOLUÇÕES:");
      console.log("   1. Aguardar estabilização do preço");
      console.log("   2. Owner pode aumentar maxPriceDeviation");
      console.log("   3. Usuários podem comprar com USDT");
    }
    
    console.log("");
    console.log("📈 ANÁLISE:");
    console.log("===========");
    
    if (twapPriceNum === 0) {
      console.log("⚠️  TWAP não inicializado (sem histórico de preços)");
      console.log("   Primeira compra vai popular o TWAP");
    } else if (deviation > 20) {
      console.log("⚠️  Desvio muito alto - mercado volátil");
      console.log("   Recomendado aumentar maxPriceDeviation para 20-30%");
    } else if (deviation > 10 && deviation <= 20) {
      console.log("⚠️  Desvio moderado");
      console.log("   Considerar aumentar maxPriceDeviation para 15-20%");
    } else {
      console.log("✅ Desvio normal - sistema funcionando corretamente");
    }
    
  } catch (error) {
    console.error("❌ Erro ao verificar status:");
    console.error(error.message);
    
    if (error.message.includes("Price deviation too high")) {
      console.log("\n⚠️  O contrato está rejeitando transações devido ao desvio de preço");
      console.log("   Isso confirma o problema reportado pelos usuários");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
