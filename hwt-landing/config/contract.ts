// ABI do HanumanWaterTokenV2 (versão atualizada com melhorias de segurança)
export const TOKEN_ABI = [
  // Funções de visualização básicas
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  // Funções específicas do HanumanWaterTokenV2
  {
    "inputs": [],
    "name": "TOKEN_PRICE_USD",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalPublicAllocation",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_address", "type": "address"}],
    "name": "kycApproved",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MAX_PRESALE_DURATION",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "presaleEndTime",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "amount", "type": "uint256"}, {"name": "deliveryDetails", "type": "string"}],
    "name": "requestWaterRedemption",
    "outputs": [{"name": "redemptionId", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "redemptionId", "type": "uint256"}],
    "name": "getWaterRedemptionStatus",
    "outputs": [
      {"name": "redeemer", "type": "address"},
      {"name": "amount", "type": "uint256"},
      {"name": "requestTime", "type": "uint256"},
      {"name": "expiryTime", "type": "uint256"},
      {"name": "delivered", "type": "bool"},
      {"name": "cancelled", "type": "bool"},
      {"name": "refunded", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

// ABI do HanumanWaterTokenPresale (versão atualizada com melhorias de segurança)
export const PRESALE_ABI = [
  // Funções de compra
  {
    "inputs": [],
    "name": "buyWithETH",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"name": "usdtAmount", "type": "uint256"}],
    "name": "buyWithUSDT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Funções de visualização
  {
    "inputs": [],
    "name": "getEthUsdPrice",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "calculateTwapPrice",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "ethAmount", "type": "uint256"}],
    "name": "calculateTokensForEth",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "usdtAmount", "type": "uint256"}],
    "name": "calculateTokensForUsdt",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalTokensSold",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "presaleEndTime",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MIN_PURCHASE_USD",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MAX_PURCHASE_USD",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
]

// ABI do USDT (ERC-20 padrão)
export const USDT_ABI = [
  {
    "inputs": [{"name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "spender", "type": "address"}, {"name": "amount", "type": "uint256"}],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
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

// Endereços dos contratos atualizados na Sepolia Testnet (após melhorias de segurança)
export const TOKEN_CONTRACT_ADDRESS = "0x5244adeB890F905dDa286Dc510afb1a8d63DE5AD" // HanumanWaterTokenV2 (novo deploy)
export const PRESALE_ADDRESS = "0x16949Ae5d2C06393246353883522642A2D999C4b" // HanumanWaterTokenPresale (novo deploy)
export const USDT_ADDRESS = "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06" // USDT na Sepolia
