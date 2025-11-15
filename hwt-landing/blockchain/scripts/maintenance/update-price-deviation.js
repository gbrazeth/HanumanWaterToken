const hre = require("hardhat");

/**
 * Script para ajustar os parâmetros de proteção de preço do contrato de presale.
 *
 * Usa a função:
 *   updatePriceProtectionParams(_maxPriceAge, _maxPriceDeviation, _twapWindow)
 *
 * Compatível com as redes definidas no hardhat.config.js (sepolia, mainnet).
 *
 * IMPORTANTE:
 * - A conta configurada em PRIVATE_KEY deve ser o owner do contrato de presale.
 * - Sempre teste primeiro em sepolia com um endereço de presale de teste.
 */

async function main() {
  // ⚙️ CONFIGURAÇÃO
  // Use este endereço para MAINNET (presale oficial):
  const MAINNET_PRESALE_ADDRESS = "0x67A506934aA8Bb00E92a706Ba40c373F6269B44d";

  // Opcional: endereço de teste para Sepolia (substitua se tiver um contrato de teste)
  const SEPOLIA_PRESALE_ADDRESS = process.env.SEPOLIA_PRESALE_ADDRESS || MAINNET_PRESALE_ADDRESS;

  // Valores recomendados para destravar compras em momentos de volatilidade:
  const NEW_MAX_PRICE_AGE = 3600; // 1 hora (em segundos)
  const NEW_MAX_PRICE_DEVIATION = 30; // 30% de desvio máximo permitido
  const NEW_TWAP_WINDOW = 1; // Usa apenas o preço atual (reseta o efeito do histórico antigo)

  const network = hre.network.name;

  console.log("\n🔧 Atualizando parâmetros de proteção de preço do contrato de presale...");
  console.log(`🌐 Rede: ${network}`);

  const presaleAddress = network === "sepolia" ? SEPOLIA_PRESALE_ADDRESS : MAINNET_PRESALE_ADDRESS;

  console.log(`📍 Endereço do contrato de presale: ${presaleAddress}`);

  const [signer] = await hre.ethers.getSigners();
  console.log(`👤 Usando signer: ${await signer.getAddress()}`);

  const Presale = await hre.ethers.getContractAt("HanumanWaterTokenPresale", presaleAddress, signer);

  // Ler valores atuais
  const currentMaxPriceAge = await Presale.maxPriceAge();
  const currentMaxPriceDeviation = await Presale.maxPriceDeviation();
  const currentTwapWindow = await Presale.twapWindow();

  console.log("\n📊 Valores atuais:");
  console.log(`   maxPriceAge       : ${currentMaxPriceAge.toString()} s`);
  console.log(`   maxPriceDeviation : ${currentMaxPriceDeviation.toString()} %`);
  console.log(`   twapWindow        : ${currentTwapWindow.toString()} preços`);

  console.log("\n🆕 Novos valores propostos:");
  console.log(`   maxPriceAge       : ${NEW_MAX_PRICE_AGE} s`);
  console.log(`   maxPriceDeviation : ${NEW_MAX_PRICE_DEVIATION} %`);
  console.log(`   twapWindow        : ${NEW_TWAP_WINDOW} preços`);

  // Confirmação visual
  console.log("\n🚨 Certifique-se de que você é o OWNER do contrato antes de continuar.");

  const tx = await Presale.updatePriceProtectionParams(
    NEW_MAX_PRICE_AGE,
    NEW_MAX_PRICE_DEVIATION,
    NEW_TWAP_WINDOW
  );

  console.log("\n⏳ Enviando transação...");
  console.log(`   Hash: ${tx.hash}`);

  await tx.wait();

  console.log("\n✅ Parâmetros atualizados com sucesso!\n");

  const updatedMaxPriceAge = await Presale.maxPriceAge();
  const updatedMaxPriceDeviation = await Presale.maxPriceDeviation();
  const updatedTwapWindow = await Presale.twapWindow();

  console.log("📊 Valores após atualização:");
  console.log(`   maxPriceAge       : ${updatedMaxPriceAge.toString()} s`);
  console.log(`   maxPriceDeviation : ${updatedMaxPriceDeviation.toString()} %`);
  console.log(`   twapWindow        : ${updatedTwapWindow.toString()} preços`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erro ao atualizar parâmetros:");
    console.error(error);
    process.exit(1);
  });
