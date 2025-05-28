import hre from "hardhat";

async function main() {
  const PRESALE_ADDRESS = "0x466a830492AE1deeF25309BaC52519b6a73A9CCe";
  const presale = await hre.ethers.getContractAt("HWTPresale", PRESALE_ADDRESS);
  try {
    const min = await presale.MIN_TOKENS_TO_BUY();
    console.log(`MIN_TOKENS_TO_BUY: ${min.toString()}`);
  } catch (e) {
    console.log('Função MIN_TOKENS_TO_BUY não existe no contrato Presale. Verifique o valor mínimo no front-end ou no contrato.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
