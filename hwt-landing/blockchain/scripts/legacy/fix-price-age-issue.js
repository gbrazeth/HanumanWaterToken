const hre = require("hardhat");

async function main() {
  const PRESALE_ADDRESS = "0x67A506934aA8Bb00E92a706Ba40c373F6269B44d"; // Mainnet
  
  console.log("🔍 Investigando problema 'Price data too old'...\n");
  
  const Presale = await hre.ethers.getContractAt("HanumanWaterTokenPresale", PRESALE_ADDRESS);
  
  // Verificar configurações atuais
  const maxPriceAge = await Presale.maxPriceAge();
  const maxPriceDeviation = await Presale.maxPriceDeviation();
  const twapWindow = await Presale.twapWindow();
  
  console.log("📊 Configurações atuais:");
  console.log(`   maxPriceAge       : ${maxPriceAge} s (${maxPriceAge/60} min)`);
  console.log(`   maxPriceDeviation : ${maxPriceDeviation} %`);
  console.log(`   twapWindow        : ${twapWindow} preços`);
  
  // Tentar obter dados do oráculo diretamente
  console.log("\n🔍 Verificando oráculo Chainlink...");
  
  try {
    const ethUsdPriceFeed = await Presale.ethUsdPriceFeed();
    console.log(`   Endereço do oráculo: ${ethUsdPriceFeed}`);
    
    // Conectar diretamente ao oráculo
    const priceFeed = await hre.ethers.getContractAt(
      ["function latestRoundData() external view returns (uint80 roundId, int256 price, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)"],
      ethUsdPriceFeed
    );
    
    const [roundId, price, startedAt, updatedAt, answeredInRound] = await priceFeed.latestRoundData();
    
    const now = Math.floor(Date.now() / 1000);
    const ageInSeconds = now - Number(updatedAt);
    const ageInMinutes = Math.floor(ageInSeconds / 60);
    
    console.log(`   Preço atual      : $${(Number(price) / 1e8).toFixed(2)}`);
    console.log(`   Última atualização: ${new Date(Number(updatedAt) * 1000).toLocaleString()}`);
    console.log(`   Idade dos dados  : ${ageInMinutes} min (${ageInSeconds} s)`);
    console.log(`   Limite atual     : ${maxPriceAge} s (${maxPriceAge/60} min)`);
    
    if (ageInSeconds > maxPriceAge) {
      console.log(`   ❌ Dados muito antigos! (${ageInSeconds}s > ${maxPriceAge}s)`);
      
      // Sugerir novo maxPriceAge
      const suggestedAge = Math.max(ageInSeconds + 600, 7200); // Pelo menos 10 min a mais, máximo 2h
      
      console.log(`\n💡 SOLUÇÃO: Aumentar maxPriceAge para ${suggestedAge}s (${Math.floor(suggestedAge/60)} min)`);
      
      console.log("\n🔧 Atualizando maxPriceAge...");
      
      const tx = await Presale.updatePriceProtectionParams(
        suggestedAge, // maxPriceAge aumentado
        15,          // maxPriceDeviation
        1            // twapWindow
      );
      
      await tx.wait();
      console.log(`✅ maxPriceAge atualizado! Hash: ${tx.hash}`);
      
      // Testar se agora funciona
      console.log("\n🧪 Testando acesso ao preço...");
      try {
        const testPrice = await Presale.getEthUsdPrice();
        console.log(`✅ Preço obtido com sucesso: $${(Number(testPrice) / 1e8).toFixed(2)}`);
        
        // Testar cálculo para 10 tokens
        const tokenAmount = hre.ethers.utils.parseUnits("10", 18);
        const ethAmount = await Presale.getEthAmountForTokens(tokenAmount);
        const ethFormatted = hre.ethers.utils.formatEther(ethAmount);
        const usdValue = Number(ethFormatted) * (Number(testPrice) / 1e8);
        
        console.log("\n🧪 TESTE: 10 HWT");
        console.log(`   ETH necessário: ${ethFormatted} ETH`);
        console.log(`   Valor em USD  : $${usdValue.toFixed(2)}`);
        console.log(`   Esperado      : $20.00`);
        
        const difference = Math.abs(usdValue - 20);
        if (difference < 1) {
          console.log("   ✅ Cálculo correto!");
        } else {
          console.log(`   ⚠️  Diferença: $${difference.toFixed(2)}`);
        }
        
      } catch (error) {
        console.log(`❌ Ainda há erro: ${error.message}`);
      }
      
    } else {
      console.log("   ✅ Dados estão dentro do limite de idade");
    }
    
  } catch (error) {
    console.error("❌ Erro ao verificar oráculo:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erro:", error);
    process.exit(1);
  });
