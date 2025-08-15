// withdraw-eth.js
require('dotenv').config();
const { ethers } = require("ethers");

// --- CONFIGURAÇÕES ---
// Endereço do contrato de presale (Mainnet)
const PRESALE_ADDRESS = "0x67A506934aA8Bb00E92a706Ba40c373F6269B44d";
// ABI mínima só com a função de saque
const PRESALE_ABI = [
  {
    "inputs": [],
    "name": "withdrawETH",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// RPC da Mainnet (exemplo: Infura, Alchemy, ou outro)
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL;
// Chave privada da carteira owner (NUNCA compartilhe ou suba para repositório público)
const PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY;

async function main() {
  if (!PRIVATE_KEY) {
    throw new Error("Defina a variável de ambiente OWNER_PRIVATE_KEY com a chave privada do owner.");
  }

  const provider = new ethers.providers.JsonRpcProvider(MAINNET_RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const presale = new ethers.Contract(PRESALE_ADDRESS, PRESALE_ABI, wallet);

  console.log("Enviando transação de saque (withdrawETH)...");
  const tx = await presale.withdrawETH();
  console.log("Transação enviada! Hash:", tx.hash);

  const receipt = await tx.wait();
  console.log("Saque concluído! Bloco:", receipt.blockNumber);
}

main().catch((err) => {
  console.error("Erro ao sacar ETH:", err);
});