// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./HanumanWaterToken.sol";

/**
 * @title HWT Presale Contract
 * @dev Manages the presale of Hanuman Water Tokens
 */
contract HWTPresale is Ownable {
    // HWT token contract
    HanumanWaterToken public hwtToken;
    
    // USDT token contract
    IERC20 public usdtToken;
    
    // Price of 1 HWT in USD (2 USD)
    uint256 public constant TOKEN_PRICE_USD = 2;
    
    // ETH price feed (would use Chainlink in production)
    uint256 public ethPriceUSD;
    
    // Events
    event TokensPurchasedWithETH(address indexed buyer, uint256 ethAmount, uint256 tokenAmount);
    event TokensPurchasedWithUSDT(address indexed buyer, uint256 usdtAmount, uint256 tokenAmount);
    
    constructor(
        address _hwtToken,
        address _usdtToken,
        uint256 _initialEthPriceUSD
    ) Ownable(msg.sender) {
        require(_hwtToken != address(0), "HWT token address cannot be zero");
        require(_usdtToken != address(0), "USDT token address cannot be zero");
        
        hwtToken = HanumanWaterToken(_hwtToken);
        usdtToken = IERC20(_usdtToken);
        ethPriceUSD = _initialEthPriceUSD;
    }
    
    /**
     * @dev Update ETH price in USD
     * @param _newPrice New ETH price in USD
     */
    function updateEthPrice(uint256 _newPrice) external onlyOwner {
        require(_newPrice > 0, "ETH price must be greater than zero");
        ethPriceUSD = _newPrice;
    }
    
    /**
     * @dev Buy tokens with ETH
     */
    function buyWithETH() external payable {
        require(msg.value > 0, "ETH amount must be greater than zero");
        // Corrigir cálculo: msg.value (wei), ethPriceUSD (8 casas decimais)
        // 1. Calcule valor em USD (8 casas decimais)
        uint256 usdValue = (msg.value * ethPriceUSD) / 1e18;
        // 2. Calcule quantos tokens HWT podem ser comprados (2 USD/token)
        uint256 tokenAmount = (usdValue * 1e18) / (TOKEN_PRICE_USD * 1e8);
        // Mint tokens ao comprador
        hwtToken.mintPresaleTokens(msg.sender, tokenAmount);
        emit TokensPurchasedWithETH(msg.sender, msg.value, tokenAmount);
    }
    
    /**
     * @dev Buy tokens with USDT
     * @param usdtAmount Amount of USDT to spend
     */
    function buyWithUSDT(uint256 usdtAmount) external {
        require(usdtAmount > 0, "USDT amount must be greater than zero");
        
        // Transfer USDT from buyer to this contract
        require(usdtToken.transferFrom(msg.sender, address(this), usdtAmount), "USDT transfer failed");
        
        // Calcule quantos tokens HWT podem ser comprados com USDT
        // usdtAmount (6 decimais), TOKEN_PRICE_USD (2 USD/token)
        // 1. Converter USDT para 18 decimais
        uint256 usdtAmount18 = usdtAmount * 1e12;
        // 2. Calcular tokens: usdtAmount18 / (TOKEN_PRICE_USD * 1e18)
        uint256 tokenAmount = usdtAmount18 / (TOKEN_PRICE_USD * 1e18 / 1e18);
        // Mint tokens ao comprador
        hwtToken.mintPresaleTokens(msg.sender, tokenAmount);
        emit TokensPurchasedWithUSDT(msg.sender, usdtAmount, tokenAmount);
    }
    
    /**
     * @dev Withdraw ETH from contract
     */
    function withdrawETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    /**
     * @dev Withdraw USDT from contract
     */
    function withdrawUSDT() external onlyOwner {
        usdtToken.transfer(owner(), usdtToken.balanceOf(address(this)));
    }
}

