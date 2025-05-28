// ABI mínimo para leitura de saldo de tokens ERC20
export const TOKEN_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  }
]

// Configurações da rede Sepolia (Ethereum Testnet)
export const NETWORK_CONFIG = {
  chainId: "0xaa36a7", // 11155111 em hex
  chainName: "Sepolia",
  nativeCurrency: {
    name: "Sepolia ETH",
    symbol: "ETH",
    decimals: 18
  },
  rpcUrls: ["https://rpc.sepolia.org"],
  blockExplorerUrls: ["https://sepolia.etherscan.io"]
}

// Endereços dos contratos na Sepolia Testnet
export const TOKEN_CONTRACT_ADDRESS = "0x123a55BFDda355C10a9fb1EdF7f3c80152D5e91c" // Novo HanumanWaterToken na Sepolia
export const PRESALE_ADDRESS = "0xD490cc38AE9eE28281825c7F4ceAB70B557F3a3C" // Novo HWTPresale na Sepolia
export const USDT_ADDRESS = "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06" // Endereço do USDT na Sepolia
