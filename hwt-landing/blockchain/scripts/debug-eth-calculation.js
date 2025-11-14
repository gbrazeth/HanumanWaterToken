const hre = require("hardhat");

async function main() {
  const PRESALE_ADDRESS = "0x67A506934aA8Bb00E92a706Ba40c373F6269B44d"; // Mainnet
  
  console.log("🔍 Debugando cálculo de ETH para tokens...\n");
  
  const Presale = await hre.ethers.getContractAt("HanumanWaterTokenPresale", PRESALE_ADDRESS);
  
  try {
    // Testar para 10 tokens HWT
    const tokenAmount = hre.ethers.utils.parseUnits("10", 18); // 10 HWT
    
    console.log("📊 TESTE: 10 HWT");
    console.log("================");
    
    // 1. Obter preço atual do ETH
    const currentEthPrice = await Presale.getEthUsdPrice();
    console.log(`Preço ETH/USD atual: $${(Number(currentEthPrice) / 1e8).toFixed(2)}`);
    
    // 2. Obter TWAP
    const twapPrice = await Presale.calculateTwapPrice();
    console.log(`TWAP: $${(Number(twapPrice) / 1e8).toFixed(2)}`);
    
    // 3. Calcular ETH necessário usando a função do contrato
    const ethAmountWei = await Presale.getEthAmountForTokens(tokenAmount);
    const ethAmountFormatted = hre.ethers.utils.formatEther(ethAmountWei);
    
    console.log(`ETH necessário: ${ethAmountFormatted} ETH`);
    
    // 4. Calcular valor em USD
    const ethPriceForCalculation = Number(twapPrice) / 1e8; // Usar TWAP
    const ethAmountNum = Number(ethAmountFormatted);
    const usdValue = ethAmountNum * ethPriceForCalculation;
    
    console.log(`Valor em USD: $${usdValue.toFixed(2)}`);
    
    // 5. Verificar se está correto (deveria ser ~$20 para 10 tokens)
    const expectedUsd = 10 * 2; // 10 tokens × $2 cada
    console.log(`Valor esperado: $${expectedUsd.toFixed(2)}`);
    
    const difference = Math.abs(usdValue - expectedUsd);
    const percentDiff = (difference / expectedUsd) * 100;
    
    if (percentDiff < 5) {
      console.log(`✅ Cálculo correto (diferença: ${percentDiff.toFixed(2)}%)`);
    } else {
      console.log(`❌ Cálculo incorreto (diferença: ${percentDiff.toFixed(2)}%)`);
      
      // Debug adicional
      console.log("\n🔧 DEBUG ADICIONAL:");
      console.log("===================");
      
      // Testar cálculo manual
      const TOKEN_PRICE_USD = 2;
      const manualUsdAmount = 10 * TOKEN_PRICE_USD; // $20
      const manualEthAmount = manualUsdAmount / ethPriceForCalculation;
      
      console.log(`Cálculo manual:`);
      console.log(`  USD necessário: $${manualUsdAmount}`);
      console.log(`  ETH necessário: ${manualEthAmount.toFixed(6)} ETH`);
      console.log(`  Diferença: ${(ethAmountNum - manualEthAmount).toFixed(6)} ETH`);
    }
    
    // 6. Testar função calculateTokensForEth (inversa)
    console.log("\n🔄 TESTE INVERSO:");
    console.log("==================");
    
    const tokensForEth = await Presale.calculateTokensForEth(ethAmountWei);
    const tokensFormatted = hre.ethers.utils.formatEther(tokensForEth);
    
    console.log(`${ethAmountFormatted} ETH compra: ${tokensFormatted} HWT`);
    console.log(`Deveria comprar: 10.0 HWT`);
    
    const tokenDiff = Math.abs(Number(tokensFormatted) - 10);
    if (tokenDiff < 0.01) {
      console.log(`✅ Cálculo inverso correto`);
    } else {
      console.log(`❌ Cálculo inverso incorreto (diferença: ${tokenDiff.toFixed(4)} HWT)`);
    }
    
  } catch (error) {
    console.error("❌ Erro ao debugar cálculo:");
    console.error(error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
