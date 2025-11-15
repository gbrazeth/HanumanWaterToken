const hre = require("hardhat");

async function main() {
  const PRESALE_ADDRESS = "0x67A506934aA8Bb00E92a706Ba40c373F6269B44d"; // Mainnet
  
  console.log("🔄 Forçando atualização do TWAP...\n");
  
  const Presale = await hre.ethers.getContractAt("HanumanWaterTokenPresale", PRESALE_ADDRESS);
  
  // Verificar preços antes
  const currentPrice = await Presale.getEthUsdPrice();
  const twapBefore = await Presale.calculateTwapPrice();
  
  console.log("📊 ANTES da atualização:");
  console.log(`   Preço atual: $${(Number(currentPrice) / 1e8).toFixed(2)}`);
  console.log(`   TWAP atual : $${(Number(twapBefore) / 1e8).toFixed(2)}`);
  
  // Forçar atualização do TWAP chamando updateAndGetTwapPrice
  console.log("\n⏳ Atualizando TWAP...");
  const tx = await Presale.updateAndGetTwapPrice();
  await tx.wait();
  
  console.log(`✅ TWAP atualizado! Hash: ${tx.hash}`);
  
  // Verificar preços depois
  const twapAfter = await Presale.calculateTwapPrice();
  
  console.log("\n📊 DEPOIS da atualização:");
  console.log(`   Preço atual: $${(Number(currentPrice) / 1e8).toFixed(2)}`);
  console.log(`   TWAP novo  : $${(Number(twapAfter) / 1e8).toFixed(2)}`);
  
  const improvement = ((Number(twapBefore) - Number(twapAfter)) / Number(twapBefore)) * 100;
  console.log(`   Melhoria   : ${improvement.toFixed(2)}% (redução no TWAP)`);
  
  // Testar cálculo para 10 tokens
  const tokenAmount = hre.ethers.utils.parseUnits("10", 18);
  const ethAmount = await Presale.getEthAmountForTokens(tokenAmount);
  const ethFormatted = hre.ethers.utils.formatEther(ethAmount);
  const usdValue = Number(ethFormatted) * (Number(twapAfter) / 1e8);
  
  console.log("\n🧪 TESTE: 10 HWT após atualização:");
  console.log(`   ETH necessário: ${ethFormatted} ETH`);
  console.log(`   Valor em USD  : $${usdValue.toFixed(2)}`);
  console.log(`   Esperado      : $20.00`);
  
  if (Math.abs(usdValue - 20) < 1) {
    console.log("   ✅ Cálculo agora está mais próximo!");
  } else {
    console.log("   ⚠️  Pode precisar de mais atualizações ou ajuste de parâmetros");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erro:", error);
    process.exit(1);
  });
