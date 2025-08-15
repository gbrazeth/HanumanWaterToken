// Sources flattened with hardhat v2.26.1 https://hardhat.org

// SPDX-License-Identifier: MIT

// File @openzeppelin/contracts/utils/Context.sol@v5.4.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.1) (utils/Context.sol)

pragma solidity ^0.8.20;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}


// File @openzeppelin/contracts/access/Ownable.sol@v5.4.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (access/Ownable.sol)

pragma solidity ^0.8.20;

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * The initial owner is set to the address provided by the deployer. This can
 * later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev The owner is not a valid owner account. (eg. `address(0)`)
     */
    error OwnableInvalidOwner(address owner);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     */
    constructor(address initialOwner) {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        if (owner() != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}


// File @openzeppelin/contracts/utils/Pausable.sol@v5.4.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.3.0) (utils/Pausable.sol)

pragma solidity ^0.8.20;

/**
 * @dev Contract module which allows children to implement an emergency stop
 * mechanism that can be triggered by an authorized account.
 *
 * This module is used through inheritance. It will make available the
 * modifiers `whenNotPaused` and `whenPaused`, which can be applied to
 * the functions of your contract. Note that they will not be pausable by
 * simply including this module, only once the modifiers are put in place.
 */
abstract contract Pausable is Context {
    bool private _paused;

    /**
     * @dev Emitted when the pause is triggered by `account`.
     */
    event Paused(address account);

    /**
     * @dev Emitted when the pause is lifted by `account`.
     */
    event Unpaused(address account);

    /**
     * @dev The operation failed because the contract is paused.
     */
    error EnforcedPause();

    /**
     * @dev The operation failed because the contract is not paused.
     */
    error ExpectedPause();

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    modifier whenNotPaused() {
        _requireNotPaused();
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    modifier whenPaused() {
        _requirePaused();
        _;
    }

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function paused() public view virtual returns (bool) {
        return _paused;
    }

    /**
     * @dev Throws if the contract is paused.
     */
    function _requireNotPaused() internal view virtual {
        if (paused()) {
            revert EnforcedPause();
        }
    }

    /**
     * @dev Throws if the contract is not paused.
     */
    function _requirePaused() internal view virtual {
        if (!paused()) {
            revert ExpectedPause();
        }
    }

    /**
     * @dev Triggers stopped state.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    function _pause() internal virtual whenNotPaused {
        _paused = true;
        emit Paused(_msgSender());
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function _unpause() internal virtual whenPaused {
        _paused = false;
        emit Unpaused(_msgSender());
    }
}


// File @chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol@v1.4.0

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.0;

// solhint-disable-next-line interface-starts-with-i
interface AggregatorV3Interface {
  function decimals() external view returns (uint8);

  function description() external view returns (string memory);

  function version() external view returns (uint256);

  function getRoundData(
    uint80 _roundId
  ) external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);

  function latestRoundData()
    external
    view
    returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
}


// File @openzeppelin/contracts/token/ERC20/IERC20.sol@v5.4.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC20/IERC20.sol)

pragma solidity >=0.4.16;

/**
 * @dev Interface of the ERC-20 standard as defined in the ERC.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the value of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 value) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}


// File @openzeppelin/contracts/utils/ReentrancyGuard.sol@v5.4.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.1.0) (utils/ReentrancyGuard.sol)

pragma solidity ^0.8.20;

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If EIP-1153 (transient storage) is available on the chain you're deploying at,
 * consider using {ReentrancyGuardTransient} instead.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;

    uint256 private _status;

    /**
     * @dev Unauthorized reentrant call.
     */
    error ReentrancyGuardReentrantCall();

    constructor() {
        _status = NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be NOT_ENTERED
        if (_status == ENTERED) {
            revert ReentrancyGuardReentrantCall();
        }

        // Any calls to nonReentrant after this point will fail
        _status = ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _status == ENTERED;
    }
}


// File contracts/HanumanWaterTokenPresale.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.20;





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
    uint256 public constant MAX_PRESALE_DURATION = 365 days; // Duração máxima da pré-venda: 1 ano
    uint256 public constant TOTAL_PRESALE_TOKENS = 100000000 * 10**18; // 100 milhões de tokens para pré-venda
    
    // Variáveis de estado
    uint256 public totalTokensSold;
    uint256 public presaleEndTime;
    address public treasuryWallet;
    
    // Controle de fundos pendentes para retirada
    uint256 public pendingETHWithdrawals;
    
    // Proteção contra manipulação de preço do oráculo
    uint256 public maxPriceAge = 3600; // 1 hora em segundos
    uint256 public maxPriceDeviation = 10; // 10% de desvio máximo
    
    // Armazenamento para TWAP (Time-Weighted Average Price)
    uint256 public twapWindow = 3; // Número de preços para média
    uint256[3] private lastPrices; // Últimos preços para cálculo de média
    uint256[3] private lastPriceTimes; // Timestamps dos últimos preços
    uint256 private priceIndex = 0; // Índice atual no array circular
    
    // Eventos
    event TokensPurchasedWithETH(address indexed buyer, uint256 ethAmount, uint256 tokenAmount, uint256 ethPrice);
    event TokensPurchasedWithUSDT(address indexed buyer, uint256 usdtAmount, uint256 tokenAmount);
    event PresaleExtended(uint256 oldEndTime, uint256 newEndTime);
    event TreasuryWalletUpdated(address oldWallet, address newWallet);
    event PriceFeedUpdated(address oldPriceFeed, address newPriceFeed);
    event ETHWithdrawn(address indexed to, uint256 amount);
    event ETHDeposited(uint256 amount);

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
        
        // Definir o fim da pré-venda (limitado a 1 ano)
        uint256 requestedDuration = _presaleDurationDays * 1 days;
        uint256 actualDuration = requestedDuration > MAX_PRESALE_DURATION ? MAX_PRESALE_DURATION : requestedDuration;
        presaleEndTime = block.timestamp + actualDuration;
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
     * @dev Estende o período de pré-venda, limitado a 1 ano a partir da implantação
     * @param _newEndTime Novo timestamp de fim da pré-venda
     */
    function extendPresale(uint256 _newEndTime) external onlyOwner {
        require(_newEndTime > presaleEndTime, "New end time must be later than current");
        
        // Calcular o limite máximo permitido para a extensão
        uint256 maxAllowedEndTime = block.timestamp + MAX_PRESALE_DURATION;
        
        // Verificar se a nova data está dentro do limite máximo
        require(_newEndTime <= maxAllowedEndTime, "Cannot extend beyond maximum presale duration");
        
        // Verificar se ainda há tokens disponíveis para venda
        require(totalTokensSold < TOTAL_PRESALE_TOKENS, "All presale tokens have been sold");
        
        uint256 oldEndTime = presaleEndTime;
        presaleEndTime = _newEndTime;
        
        emit PresaleExtended(oldEndTime, _newEndTime);
    }
    
    /**
     * @dev Atualiza os parâmetros de proteção contra manipulação de preço
     * @param _maxPriceAge Idade máxima do preço em segundos
     * @param _maxPriceDeviation Desvio máximo de preço em porcentagem
     * @param _twapWindow Tamanho da janela TWAP (1-3)
     */
    function updatePriceProtectionParams(
        uint256 _maxPriceAge,
        uint256 _maxPriceDeviation,
        uint256 _twapWindow
    ) external onlyOwner {
        require(_maxPriceAge > 0, "Price age must be positive");
        require(_maxPriceDeviation > 0 && _maxPriceDeviation <= 50, "Deviation must be between 1-50%");
        require(_twapWindow > 0 && _twapWindow <= 3, "TWAP window must be between 1-3");
        
        maxPriceAge = _maxPriceAge;
        maxPriceDeviation = _maxPriceDeviation;
        twapWindow = _twapWindow;
    }
    
    /**
     * @dev Obtém o preço atual do ETH em USD do oráculo Chainlink com proteções
     * @return Preço do ETH em USD com 8 casas decimais
     */
    function getEthUsdPrice() public view returns (uint256) {
        // Obter dados do oráculo
        (, int256 price, , uint256 updatedAt, ) = ethUsdPriceFeed.latestRoundData();
        
        // Verificar se o preço é válido
        require(price > 0, "Invalid ETH price");
        // A checagem de "stale price" via answeredInRound >= roundId foi removida pois roundId não está mais disponível.
        
        // Verificar a atualidade do preço
        require(block.timestamp - updatedAt <= maxPriceAge, "Price data too old");
        
        return uint256(price);
    }
    
    /**
     * @dev Atualiza e retorna o preço TWAP do ETH em USD
     * @return Preço TWAP do ETH em USD com 8 casas decimais
     */
    function updateAndGetTwapPrice() public returns (uint256) {
        uint256 currentPrice = getEthUsdPrice();
        
        // Atualizar o array circular de preços
        lastPrices[priceIndex] = currentPrice;
        lastPriceTimes[priceIndex] = block.timestamp;
        
        // Avançar o índice no array circular
        priceIndex = (priceIndex + 1) % twapWindow;
        
        // Calcular o preço TWAP
        uint256 twapPrice = calculateTwapPrice();
        
        // Verificar desvio máximo permitido
        uint256 deviation;
        if (twapPrice > currentPrice) {
            deviation = ((twapPrice - currentPrice) * 100) / twapPrice;
        } else {
            deviation = ((currentPrice - twapPrice) * 100) / twapPrice;
        }
        
        require(deviation <= maxPriceDeviation, "Price deviation too high");
        
        return twapPrice;
    }
    
    /**
     * @dev Calcula o preço TWAP com base nos preços armazenados
     * @return Preço TWAP calculado
     */
    function calculateTwapPrice() public view returns (uint256) {
        uint256 sum = 0;
        uint256 count = 0;
        
        for (uint256 i = 0; i < twapWindow; i++) {
            if (lastPriceTimes[i] > 0) {
                sum += lastPrices[i];
                count++;
            }
        }
        
        // Se não houver preços armazenados, retornar o preço atual
        if (count == 0) {
            return getEthUsdPrice();
        }
        
        return sum / count;
    }
    
    /**
     * @dev Retorna a quantidade de tokens HWT que serão recebidos por um valor exato de ETH
     * @param ethAmount Quantidade de ETH (em wei)
     * @return Quantidade de tokens HWT (18 casas decimais)
     */
    function getTokensForEthAmount(uint256 ethAmount) public view returns (uint256) {
        return calculateTokensForEth(ethAmount);
    }

    /**
     * @dev Retorna a quantidade de tokens HWT que serão recebidos por um valor exato de USDT
     * @param usdtAmount Quantidade de USDT (6 casas decimais)
     * @return Quantidade de tokens HWT (18 casas decimais)
     */
    function getTokensForUsdtAmount(uint256 usdtAmount) public pure returns (uint256) {
        return calculateTokensForUsdt(usdtAmount);
    }

    /**
     * @dev Retorna o valor de ETH necessário para comprar uma quantidade exata de tokens HWT
     * @param tokenAmount Quantidade de tokens HWT (18 casas decimais)
     * @return Quantidade de ETH (em wei)
     */
    function getEthAmountForTokens(uint256 tokenAmount) public view returns (uint256) {
        uint256 ethUsdPrice = calculateTwapPrice(); // 8 casas decimais
        // Preço do token em USD: TOKEN_PRICE_USD (sem casas decimais)
        // tokenAmount tem 18 casas decimais
        // Valor em USD (8 casas decimais):
        uint256 usdAmount = (tokenAmount * TOKEN_PRICE_USD);
        // usdAmount tem 18 casas decimais, queremos 8 casas decimais
        // usdAmount (18) / 1e10 = usdAmount (8)
        usdAmount = usdAmount / 1e10;
        // Calcular ETH necessário: (usdAmount * 1e18) / ethUsdPrice
        uint256 ethAmount = (usdAmount * 1e18) / ethUsdPrice;
        return ethAmount;
    }

    /**
     * @dev Retorna o valor de USDT necessário para comprar uma quantidade exata de tokens HWT
     * @param tokenAmount Quantidade de tokens HWT (18 casas decimais)
     * @return Quantidade de USDT (6 casas decimais)
     */
    function getUsdtAmountForTokens(uint256 tokenAmount) public pure returns (uint256) {
        // USDT tem 6 casas decimais, tokenAmount 18 casas decimais, TOKEN_PRICE_USD sem casas decimais
        // usdtAmount = tokenAmount * TOKEN_PRICE_USD * 1e6 / 1e18
        uint256 usdtAmount = (tokenAmount * TOKEN_PRICE_USD * 1e6) / 1e18;
        return usdtAmount;
    }

    /**
     * @dev Calcula a quantidade de tokens a serem comprados com ETH
     * @param ethAmount Quantidade de ETH
     * @return Quantidade de tokens HWT
     */
    function calculateTokensForEth(uint256 ethAmount) public view returns (uint256) {
        // Usar o preço TWAP em vez do preço instantâneo
        uint256 ethUsdPrice = calculateTwapPrice();
        
        // Calcular o valor em USD com maior precisão
        // ethAmount (18 decimais) * ethUsdPrice (8 decimais) = valor em USD (26 decimais)
        // Dividir por 1e18 para obter o valor em USD com 8 decimais
        uint256 ethValueInUsd = (ethAmount * ethUsdPrice) / 1e18;
        
        // Calcular a quantidade de tokens com maior precisão
        // Multiplicar por 1e18 primeiro para manter a precisão durante a divisão
        // ethValueInUsd (8 decimais) * 1e18 = valor em USD (26 decimais)
        // Dividir por TOKEN_PRICE_USD (2) * 1e8 para obter tokens com 18 decimais
        uint256 tokenAmount = (ethValueInUsd * 1e18) / (TOKEN_PRICE_USD * 1e8);
        
        // Verificar que o usuário recebe pelo menos 1 wei de token
        require(tokenAmount > 0, "Amount too small to purchase any tokens");
        
        return tokenAmount;
    }
    
    /**
     * @dev Calcula a quantidade de tokens a serem comprados com USDT
     * @param usdtAmount Quantidade de USDT (6 decimais)
     * @return Quantidade de tokens HWT (18 decimais)
     */
    function calculateTokensForUsdt(uint256 usdtAmount) public pure returns (uint256) {
        // USDT tem 6 casas decimais, TOKEN_PRICE_USD = 2 USD por token, HWT tem 18 casas decimais
        
        // Abordagem de alta precisão: multiplicar primeiro, depois dividir
        // Multiplicar usdtAmount (6 decimais) por 1e18 para obter 24 decimais de precisão
        // Depois dividir por 1e6 (decimais USDT) * TOKEN_PRICE_USD (2) para obter tokens com 18 decimais
        uint256 tokenAmount = (usdtAmount * 1e18) / (TOKEN_PRICE_USD * 1e6);
        
        // Verificar que o usuário recebe pelo menos 1 wei de token
        require(tokenAmount > 0, "Amount too small to purchase any tokens");
        
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
        
        // Atualizar e obter o preço TWAP para proteção contra manipulação
        uint256 ethUsdPrice = updateAndGetTwapPrice();
        uint256 tokenAmount = calculateTokensForEth(msg.value);
        
        // Verificar limites de compra
        uint256 purchaseValueUsd = (msg.value * ethUsdPrice) / 1e18;
        require(purchaseValueUsd >= MIN_PURCHASE_AMOUNT_USD * 1e8, "Purchase below minimum amount");
        require(purchaseValueUsd <= MAX_PURCHASE_AMOUNT_USD * 1e8, "Purchase above maximum amount");
        
        // Armazenar ETH no contrato para retirada posterior
        pendingETHWithdrawals += msg.value;
        emit ETHDeposited(msg.value);
        
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
     * @dev Permite que o proprietário retire ETH acumulado para a carteira do tesouro
     */
    function withdrawETH() external onlyOwner nonReentrant {
        uint256 amount = pendingETHWithdrawals;
        require(amount > 0, "No ETH available for withdrawal");
        
        // Zerar o saldo pendente antes da transferência para prevenir reentrância
        pendingETHWithdrawals = 0;
        
        // Transferir ETH para a carteira do tesouro
        (bool success, ) = treasuryWallet.call{value: amount}("");
        
        // Se a transferência falhar, restaurar o saldo pendente
        if (!success) {
            pendingETHWithdrawals = amount;
            revert("ETH transfer failed");
        }
        
        emit ETHWithdrawn(treasuryWallet, amount);
    }
    
    /**
     * @dev Retorna o saldo de ETH pendente para retirada
     */
    function getPendingETHWithdrawals() external view returns (uint256) {
        return pendingETHWithdrawals;
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
