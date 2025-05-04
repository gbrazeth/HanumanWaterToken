import hre from "hardhat";

async function main() {
  // Endereço correto do HWT
  const HWT_ADDRESS = "0x8F2bdA913a6Ac0ad865900C262e1BFc03843Dff1";
  // Endereço do USDT já utilizado
  const USDT_ADDRESS = "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06";
  // Preço ETH em USD (8 casas decimais)
  const INITIAL_ETH_PRICE_USD = hre.ethers.utils.parseUnits("3000", 8);

  const Presale = await hre.ethers.getContractFactory("HWTPresale");
  const presale = await Presale.deploy(HWT_ADDRESS, USDT_ADDRESS, INITIAL_ETH_PRICE_USD);
  await presale.deployed();
  console.log("Novo HWTPresale (com HWT correto) deployado em:", presale.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
