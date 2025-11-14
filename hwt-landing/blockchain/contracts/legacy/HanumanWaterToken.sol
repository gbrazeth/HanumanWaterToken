// SPDX-License-Identifier: MIT
// ====================================================================
// VERSÃO LEGADA - NÃO USAR PARA NOVAS IMPLANTAÇÕES
// Este contrato foi substituído por HanumanWaterTokenV2.sol
// Mantido apenas para referência histórica
// ====================================================================
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Hanuman Water Token (HWT)
 * @dev ERC20 token representing water from the Hanuman source
 * 1 HWT = 1 liter of water
 * 1000 HWT = 1 cubic meter of water = $2000
 */
contract HanumanWaterToken is ERC20, ERC20Burnable, Ownable {
    // Token price in USD (2 USD per token)
    uint256 public constant TOKEN_PRICE_USD = 2;
    
    // Minimum tokens required to redeem water (1000 tokens = 1 cubic meter)
    uint256 public constant MIN_REDEMPTION_AMOUNT = 1000;
    
    // Maximum supply (500 million tokens)
    uint256 public constant MAX_SUPPLY = 500_000_000 * 10**18;
    
    // Presale end timestamp (5 years from deployment)
    uint256 public presaleEndTime;
    
    // Addresses for token distribution
    address public developmentTeamWallet;
    address public liquidityReserveWallet;
    address public strategicPartnershipsWallet;
    
    // Events
    event TokensPurchased(address indexed buyer, uint256 amount, string paymentMethod);
    event WaterRedeemed(address indexed redeemer, uint256 tokenAmount, uint256 waterAmount);
    
    constructor(
        address _developmentTeamWallet,
        address _liquidityReserveWallet,
        address _strategicPartnershipsWallet
    ) ERC20("Hanuman Water Token", "HWT") Ownable(msg.sender) {
        require(_developmentTeamWallet != address(0), "Development team wallet cannot be zero address");
        require(_liquidityReserveWallet != address(0), "Liquidity reserve wallet cannot be zero address");
        require(_strategicPartnershipsWallet != address(0), "Strategic partnerships wallet cannot be zero address");
        
        developmentTeamWallet = _developmentTeamWallet;
        liquidityReserveWallet = _liquidityReserveWallet;
        strategicPartnershipsWallet = _strategicPartnershipsWallet;
        
        // Set presale end time to 5 years from now
        presaleEndTime = block.timestamp + 5 * 365 days;
        
        // Mint and distribute tokens according to tokenomics
        
        // Development Team: 6%
        _mint(developmentTeamWallet, (MAX_SUPPLY * 6) / 100);
        
        // Liquidity and Reserves: 5%
        _mint(liquidityReserveWallet, (MAX_SUPPLY * 5) / 100);
        
        // Strategic Partnerships, Community Rewards, and Sales: 9%
        _mint(strategicPartnershipsWallet, (MAX_SUPPLY * 9) / 100);
        
        // Public Distribution: 80% - These will be minted as they are purchased
        // No need to mint these now
    }
    
    /**
     * @dev Mint tokens for a buyer during the presale
     * @param to Address receiving the tokens
     * @param amount Amount of tokens to mint
     */
    function mintPresaleTokens(address to, uint256 amount) external onlyOwner {
        require(block.timestamp <= presaleEndTime, "Presale has ended");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds maximum supply");
        
        _mint(to, amount);
        emit TokensPurchased(to, amount, "presale");
    }
    
    /**
     * @dev Record a token purchase (for off-chain payments like PIX or credit card)
     * @param buyer Address of the token buyer
     * @param amount Amount of tokens purchased
     * @param paymentMethod Method used for payment (e.g., "pix", "credit_card")
     */
    function recordPurchase(address buyer, uint256 amount, string calldata paymentMethod) external onlyOwner {
        require(block.timestamp <= presaleEndTime, "Presale has ended");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds maximum supply");
        
        _mint(buyer, amount);
        emit TokensPurchased(buyer, amount, paymentMethod);
    }
    
    /**
     * @dev Allow users to redeem water with their tokens
     * @param amount Amount of tokens to redeem for water
     */
    function redeemWater(uint256 amount) external {
        require(amount >= MIN_REDEMPTION_AMOUNT, "Minimum redemption is 1000 HWT (1 cubic meter)");
        require(balanceOf(msg.sender) >= amount, "Insufficient token balance");
        
        // Burn the tokens when redeemed for water
        _burn(msg.sender, amount);
        
        // Calculate water amount in liters (1 token = 1 liter)
        uint256 waterAmount = amount / 10**18;
        
        emit WaterRedeemed(msg.sender, amount, waterAmount);
        
        // Note: The actual water delivery would be handled off-chain
    }
    
    /**
     * @dev Update wallet addresses
     */
    function updateWallets(
        address _developmentTeamWallet,
        address _liquidityReserveWallet,
        address _strategicPartnershipsWallet
    ) external onlyOwner {
        require(_developmentTeamWallet != address(0), "Development team wallet cannot be zero address");
        require(_liquidityReserveWallet != address(0), "Liquidity reserve wallet cannot be zero address");
        require(_strategicPartnershipsWallet != address(0), "Strategic partnerships wallet cannot be zero address");
        
        developmentTeamWallet = _developmentTeamWallet;
        liquidityReserveWallet = _liquidityReserveWallet;
        strategicPartnershipsWallet = _strategicPartnershipsWallet;
    }
    
    /**
     * @dev Extend the presale period if needed
     * @param _newEndTime New end time for the presale
     */
    function extendPresale(uint256 _newEndTime) external onlyOwner {
        require(_newEndTime > presaleEndTime, "New end time must be later than current end time");
        presaleEndTime = _newEndTime;
    }
}

