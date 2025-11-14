// Configurações para interação com contratos Ethereum

// Endereços dos contratos (seriam substituídos pelos endereços reais em produção)
export const HWT_ADDRESS = "0x86C064635a535Aa681fD5c58ffa3639bD2d09fF8" // Endereço do HWT na Mainnet
export const PRESALE_ADDRESS = "0x0000000000000000000000000000000000000000" // Placeholder
export const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7" // Endereço real do USDT na Ethereum mainnet

// ABIs dos contratos
export const HWT_ABI = [
  "function mintPresaleTokens(address to, uint256 amount) external",
  "function balanceOf(address account) external view returns (uint256)",
  "function symbol() external view returns (string)",
  "function decimals() external view returns (uint8)",
]

export const PRESALE_ABI = [
  "function buyWithETH() external payable",
  "function buyWithUSDT(uint256 usdtAmount) external",
]

export const USDT_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
]

// Preço do ETH em USD (em produção, seria obtido de uma API)
export const ETH_PRICE_USD = 2000

