// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

interface IHanumanWaterToken {
    function mintPresaleTokens(address to, uint256 amount) external;
}

/**
 * @title HanumanWaterTokenPresale
 * @dev Contrato para gerenciar a pré-venda do HanumanWaterToken
 * Inclui suporte para compras com ETH e USDT, usando oráculos Chainlink para preços
 */
contract HanumanWaterTokenPresale is Ownable, ReentrancyGuard, Pausable {
    // Interfaces
    IHanumanWaterToken public hwtToken;
    IERC20 public usdtToken;
    AggregatorV3Interface public ethUsdPriceFeed;
    
    // Constantes
    uint256 public constant TOKEN_PRICE_USD = 2; // $2 por token
    uint256 public constant MIN_PURCHASE_AMOUNT_USD = 10; // Mínimo $10 USD
    uint256 public constant MAX_PURCHASE_AMOUNT_USD = 100000; // Máximo $100,000 USD
    
    // Variáveis de estado
    uint256 public totalTokensSold;
    uint256 public presaleEndTime;
    address public treasuryWallet;
    
    // Eventos
    event TokensPurchasedWithETH(address indexed buyer, uint256 ethAmount, uint256 tokenAmount, uint256 ethPrice);
    event TokensPurchasedWithUSDT(address indexed buyer, uint256 usdtAmount, uint256 tokenAmount);
    event PresaleExtended(uint256 oldEndTime, uint256 newEndTime);
    event TreasuryWalletUpdated(address oldWallet, address newWallet);
    event PriceFeedUpdated(address oldPriceFeed, address newPriceFeed);

    /**
     * @dev Construtor do contrato
     * @param _hwtToken Endereço do contrato HanumanWaterToken
     * @param _usdtToken Endereço do contrato USDT
     * @param _ethUsdPriceFeed Endereço do oráculo Chainlink ETH/USD
     * @param _treasuryWallet Carteira para receber os fundos
     * @param _presaleDurationDays Duração da pré-venda em dias
     */
    constructor(
        address _hwtToken,
        address _usdtToken,
        address _ethUsdPriceFeed,
        address _treasuryWallet,
        uint256 _presaleDurationDays
    ) Ownable(msg.sender) {
        require(_hwtToken != address(0), "HWT token address cannot be zero");
        require(_usdtToken != address(0), "USDT token address cannot be zero");
        require(_ethUsdPriceFeed != address(0), "Price feed address cannot be zero");
        require(_treasuryWallet != address(0), "Treasury wallet cannot be zero");
        
        hwtToken = IHanumanWaterToken(_hwtToken);
        usdtToken = IERC20(_usdtToken);
        ethUsdPriceFeed = AggregatorV3Interface(_ethUsdPriceFeed);
        treasuryWallet = _treasuryWallet;
        
        // Definir o fim da pré-venda
        presaleEndTime = block.timestamp + _presaleDurationDays * 1 days;
    }
    
    /**
     * @dev Modificador para verificar se o contrato está em período de pré-venda
     */
    modifier duringPresale() {
        require(block.timestamp <= presaleEndTime, "Presale period has ended");
        _;
    }
    
    /**
     * @dev Função para pausar o contrato (apenas owner)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Função para despausar o contrato (apenas owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Atualiza o endereço do oráculo de preço ETH/USD
     * @param _newPriceFeed Novo endereço do oráculo
     */
    function updatePriceFeed(address _newPriceFeed) external onlyOwner {
        require(_newPriceFeed != address(0), "Price feed cannot be zero address");
        address oldPriceFeed = address(ethUsdPriceFeed);
        ethUsdPriceFeed = AggregatorV3Interface(_newPriceFeed);
        emit PriceFeedUpdated(oldPriceFeed, _newPriceFeed);
    }
    
    /**
     * @dev Atualiza o endereço da carteira do tesouro
     * @param _newTreasuryWallet Novo endereço da carteira
     */
    function updateTreasuryWallet(address _newTreasuryWallet) external onlyOwner {
        require(_newTreasuryWallet != address(0), "Treasury wallet cannot be zero address");
        address oldWallet = treasuryWallet;
        treasuryWallet = _newTreasuryWallet;
        emit TreasuryWalletUpdated(oldWallet, _newTreasuryWallet);
    }
    
    /**
     * @dev Estende o período de pré-venda
     * @param _newEndTime Novo timestamp de fim da pré-venda
     */
    function extendPresale(uint256 _newEndTime) external onlyOwner {
        require(_newEndTime > presaleEndTime, "New end time must be later than current");
        
        uint256 oldEndTime = presaleEndTime;
        presaleEndTime = _newEndTime;
        
        emit PresaleExtended(oldEndTime, _newEndTime);
    }
    
    /**
     * @dev Obtém o preço atual do ETH em USD do oráculo Chainlink
     * @return Preço do ETH em USD com 8 casas decimais
     */
    function getEthUsdPrice() public view returns (uint256) {
        (, int256 price, , , ) = ethUsdPriceFeed.latestRoundData();
        require(price > 0, "Invalid ETH price");
        return uint256(price);
    }
    
    /**
     * @dev Calcula a quantidade de tokens a serem comprados com ETH
     * @param ethAmount Quantidade de ETH
     * @return Quantidade de tokens HWT
     */
    function calculateTokensForEth(uint256 ethAmount) public view returns (uint256) {
        uint256 ethUsdPrice = getEthUsdPrice();
        uint256 ethValueInUsd = (ethAmount * ethUsdPrice) / 1e18; // Ajuste para 8 casas decimais do oráculo
        uint256 tokenAmount = (ethValueInUsd * 1e18) / (TOKEN_PRICE_USD * 1e8); // Ajuste para 18 decimais do token
        return tokenAmount;
    }
    
    /**
     * @dev Calcula a quantidade de tokens a serem comprados com USDT
     * @param usdtAmount Quantidade de USDT (6 decimais)
     * @return Quantidade de tokens HWT (18 decimais)
     */
    function calculateTokensForUsdt(uint256 usdtAmount) public pure returns (uint256) {
        // USDT tem 6 casas decimais, HWT tem 18 casas decimais
        uint256 usdtAmountInUsd = usdtAmount / 1e6; // Converter para unidades de USD
        uint256 tokenAmount = (usdtAmountInUsd * 1e18) / TOKEN_PRICE_USD; // Converter para tokens com 18 decimais
        return tokenAmount;
    }
    
    /**
     * @dev Compra tokens com ETH
     */
    function buyWithETH() 
        external 
        payable 
        duringPresale 
        whenNotPaused 
        nonReentrant 
    {
        require(msg.value > 0, "ETH amount must be greater than 0");
        
        uint256 tokenAmount = calculateTokensForEth(msg.value);
        uint256 ethUsdPrice = getEthUsdPrice();
        
        // Verificar limites de compra
        uint256 purchaseValueUsd = (msg.value * ethUsdPrice) / 1e18;
        require(purchaseValueUsd >= MIN_PURCHASE_AMOUNT_USD * 1e8, "Purchase below minimum amount");
        require(purchaseValueUsd <= MAX_PURCHASE_AMOUNT_USD * 1e8, "Purchase above maximum amount");
        
        // Transferir ETH para a carteira do tesouro
        (bool success, ) = treasuryWallet.call{value: msg.value}("");
        require(success, "ETH transfer failed");
        
        // Emitir tokens para o comprador
        hwtToken.mintPresaleTokens(msg.sender, tokenAmount);
        totalTokensSold += tokenAmount;
        
        emit TokensPurchasedWithETH(msg.sender, msg.value, tokenAmount, ethUsdPrice);
    }
    
    /**
     * @dev Compra tokens com USDT
     * @param usdtAmount Quantidade de USDT a ser gasta
     */
    function buyWithUSDT(uint256 usdtAmount) 
        external 
        duringPresale 
        whenNotPaused 
        nonReentrant 
    {
        require(usdtAmount > 0, "USDT amount must be greater than 0");
        
        uint256 tokenAmount = calculateTokensForUsdt(usdtAmount);
        
        // Verificar limites de compra
        uint256 purchaseValueUsd = usdtAmount / 1e6; // USDT tem 6 casas decimais
        require(purchaseValueUsd >= MIN_PURCHASE_AMOUNT_USD, "Purchase below minimum amount");
        require(purchaseValueUsd <= MAX_PURCHASE_AMOUNT_USD, "Purchase above maximum amount");
        
        // Transferir USDT do comprador para a carteira do tesouro
        require(usdtToken.transferFrom(msg.sender, treasuryWallet, usdtAmount), "USDT transfer failed");
        
        // Emitir tokens para o comprador
        hwtToken.mintPresaleTokens(msg.sender, tokenAmount);
        totalTokensSold += tokenAmount;
        
        emit TokensPurchasedWithUSDT(msg.sender, usdtAmount, tokenAmount);
    }
    
    /**
     * @dev Função de fallback para rejeitar ETH enviado diretamente
     */
    receive() external payable {
        revert("Use buyWithETH function to purchase tokens");
    }
    
    /**
     * @dev Função de fallback para rejeitar chamadas desconhecidas
     */
    fallback() external payable {
        revert("Function not supported");
    }
}
