// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title HanumanWaterToken
 * @dev Token ERC-20 representando direitos sobre água mineral da Fonte Hanuman
 * Cada token equivale a 1 litro de água mineral premium
 */
contract HanumanWaterTokenV2 is ERC20, ERC20Burnable, Ownable, Pausable, ReentrancyGuard {
    // Constantes
    uint256 public constant TOKEN_PRICE_USD = 2;
    uint256 public constant MIN_REDEMPTION_AMOUNT = 100; // 100 litros
    uint256 public constant MAX_SUPPLY = 500_000_000 * 10**18; // 500 milhões de tokens
    uint256 public constant PUBLIC_ALLOCATION_PERCENTAGE = 80; // 80% para distribuição pública
    
    // Variáveis de estado
    uint256 public presaleEndTime;
    address public developmentTeamWallet;
    address public liquidityReserveWallet;
    address public strategicPartnershipsWallet;
    address public presaleContractAddress;
    
    // Contadores para controle de distribuição
    uint256 public totalPublicAllocation;
    uint256 public totalTeamAllocation;
    uint256 public totalLiquidityAllocation;
    uint256 public totalPartnershipsAllocation;
    uint256 public totalCommunityAllocation;
    uint256 public totalConsultantsAllocation;
    
    // Limites máximos para cada categoria
    uint256 public constant MAX_PUBLIC_ALLOCATION = (MAX_SUPPLY * PUBLIC_ALLOCATION_PERCENTAGE) / 100;
    uint256 public constant MAX_TEAM_ALLOCATION = (MAX_SUPPLY * 6) / 100; // 6%
    uint256 public constant MAX_LIQUIDITY_ALLOCATION = (MAX_SUPPLY * 5) / 100; // 5%
    uint256 public constant MAX_PARTNERSHIPS_ALLOCATION = (MAX_SUPPLY * 3) / 100; // 3%
    uint256 public constant MAX_COMMUNITY_ALLOCATION = (MAX_SUPPLY * 3) / 100; // 3%
    uint256 public constant MAX_CONSULTANTS_ALLOCATION = (MAX_SUPPLY * 3) / 100; // 3%
    
    // Limites da pré-venda
    uint256 public constant MAX_PRESALE_DURATION = 365 days; // Duração máxima da pré-venda: 1 ano
    uint256 public constant TOTAL_PRESALE_TOKENS = 100000000 * 10**18; // 100 milhões de tokens para pré-venda
    
    // Mapeamento para controle KYC
    mapping(address => bool) public kycApproved;
    
    // Estrutura para rastrear resgates de água
    struct WaterRedemption {
        address redeemer;
        uint256 amount;
        uint256 requestTime;
        uint256 expiryTime;
        bool delivered;
        bool cancelled;
        bool refunded;
        string deliveryDetails;
    }
    
    // Contador e mapeamento para resgates
    uint256 public nextRedemptionId = 1;
    mapping(uint256 => WaterRedemption) public waterRedemptions;
    
    // Período de tempo para confirmação de entrega (30 dias por padrão)
    uint256 public redemptionExpiryPeriod = 30 days;
    
    // Endereço do operador de entrega (pode confirmar entregas)
    address public deliveryOperator;
    
    // Eventos
    event TokensPurchased(address indexed buyer, uint256 amount, string paymentMethod);
    event WaterRedeemed(address indexed redeemer, uint256 tokenAmount, uint256 waterAmount, uint256 redemptionId);
    event WaterRedemptionConfirmed(uint256 indexed redemptionId, address indexed redeemer, uint256 amount);
    event WaterRedemptionCancelled(uint256 indexed redemptionId, address indexed redeemer, uint256 amount, string reason);
    event WaterRedemptionRefunded(uint256 indexed redemptionId, address indexed redeemer, uint256 amount);
    event WalletsUpdated(address newDevelopmentTeamWallet, address newLiquidityReserveWallet, address newStrategicPartnershipsWallet);
    event PresaleExtended(uint256 oldEndTime, uint256 newEndTime);
    event PresaleContractUpdated(address oldPresaleContract, address newPresaleContract);
    event KycStatusUpdated(address indexed user, bool status);

    /**
     * @dev Construtor do contrato
     * @param _developmentTeamWallet Carteira da equipe de desenvolvimento
     * @param _liquidityReserveWallet Carteira de reserva de liquidez
     * @param _strategicPartnershipsWallet Carteira de parcerias estratégicas
     * @param _deliveryOperator Operador responsável por confirmar entregas
     */
    constructor(
        address _developmentTeamWallet,
        address _liquidityReserveWallet,
        address _strategicPartnershipsWallet,
        address _deliveryOperator
    ) ERC20("Hanuman Water Token", "HWT") Ownable(msg.sender) {
        require(_developmentTeamWallet != address(0), "Development team wallet cannot be zero address");
        require(_liquidityReserveWallet != address(0), "Liquidity reserve wallet cannot be zero address");
        require(_strategicPartnershipsWallet != address(0), "Strategic partnerships wallet cannot be zero address");
        require(_deliveryOperator != address(0), "Delivery operator cannot be zero address");
        
        developmentTeamWallet = _developmentTeamWallet;
        liquidityReserveWallet = _liquidityReserveWallet;
        strategicPartnershipsWallet = _strategicPartnershipsWallet;
        deliveryOperator = _deliveryOperator;
        
        // Definir o fim da pré-venda para 1 ano a partir da implantação
        presaleEndTime = block.timestamp + MAX_PRESALE_DURATION;
    }
    
    /**
     * @dev Modificador para verificar se o endereço está aprovado no KYC
     */
    modifier onlyKycApproved(address _address) {
        require(kycApproved[_address], "Address not KYC approved");
        _;
    }
    
    /**
     * @dev Modificador para verificar se o contrato está em período de pré-venda
     */
    modifier duringPresale() {
        require(block.timestamp <= presaleEndTime, "Presale period has ended");
        _;
    }
    
    /**
     * @dev Modificador para verificar se o chamador é o contrato de pré-venda
     */
    modifier onlyPresaleContract() {
        require(msg.sender == presaleContractAddress, "Caller is not the presale contract");
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
     * @dev Atualiza o endereço do contrato de pré-venda
     * @param _presaleContractAddress Novo endereço do contrato de pré-venda
     */
    function updatePresaleContract(address _presaleContractAddress) external onlyOwner {
        require(_presaleContractAddress != address(0), "Presale contract cannot be zero address");
        emit PresaleContractUpdated(presaleContractAddress, _presaleContractAddress);
        presaleContractAddress = _presaleContractAddress;
    }
    
    /**
     * @dev Atualiza o status KYC de um endereço
     * @param _address Endereço a ser atualizado
     * @param _status Novo status KYC
     */
    function updateKycStatus(address _address, bool _status) external onlyOwner {
        require(_address != address(0), "Address cannot be zero");
        kycApproved[_address] = _status;
        emit KycStatusUpdated(_address, _status);
    }
    
    // Limite máximo de endereços por lote para evitar ataques de negação de serviço
    uint256 public constant MAX_BATCH_SIZE = 100;
    
    /**
     * @dev Atualiza o status KYC de múltiplos endereços
     * @param _addresses Lista de endereços (limitado a MAX_BATCH_SIZE)
     * @param _status Status KYC a ser aplicado
     */
    function batchUpdateKycStatus(address[] calldata _addresses, bool _status) external onlyOwner {
        // Verificar se o tamanho do array não excede o limite
        require(_addresses.length <= MAX_BATCH_SIZE, "Batch size exceeds limit");
        
        // Processar cada endereço no lote
        for (uint256 i = 0; i < _addresses.length; i++) {
            kycApproved[_addresses[i]] = _status;
            emit KycStatusUpdated(_addresses[i], _status);
        }
    }

    /**
     * @dev Emite tokens durante o período de pré-venda
     * @param to Endereço do destinatário
     * @param amount Quantidade de tokens a serem emitidos
     */
    function mintPresaleTokens(address to, uint256 amount) 
        external 
        onlyPresaleContract 
        duringPresale 
        whenNotPaused 
        nonReentrant 
    {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than zero");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        
        // Verificar se não excede a alocação pública
        require(totalPublicAllocation + amount <= MAX_PUBLIC_ALLOCATION, "Exceeds public allocation");
        
        totalPublicAllocation += amount;
        _mint(to, amount);
    }
    
    /**
     * @dev Emite tokens para a equipe de desenvolvimento
     * @param amount Quantidade de tokens a serem emitidos
     */
    function mintTeamTokens(uint256 amount) external onlyOwner whenNotPaused nonReentrant {
        require(amount > 0, "Amount must be greater than zero");
        require(totalTeamAllocation + amount <= MAX_TEAM_ALLOCATION, "Exceeds team allocation");
        
        totalTeamAllocation += amount;
        _mint(developmentTeamWallet, amount);
    }
    
    /**
     * @dev Emite tokens para o fundo de liquidez
     * @param amount Quantidade de tokens a serem emitidos
     */
    function mintLiquidityTokens(uint256 amount) external onlyOwner whenNotPaused nonReentrant {
        require(amount > 0, "Amount must be greater than zero");
        require(totalLiquidityAllocation + amount <= MAX_LIQUIDITY_ALLOCATION, "Exceeds liquidity allocation");
        
        totalLiquidityAllocation += amount;
        _mint(liquidityReserveWallet, amount);
    }
    
    /**
     * @dev Emite tokens para parcerias estratégicas
     * @param amount Quantidade de tokens a serem emitidos
     */
    function mintPartnershipsTokens(uint256 amount) external onlyOwner whenNotPaused nonReentrant {
        require(amount > 0, "Amount must be greater than zero");
        require(totalPartnershipsAllocation + amount <= MAX_PARTNERSHIPS_ALLOCATION, "Exceeds partnerships allocation");
        
        totalPartnershipsAllocation += amount;
        _mint(strategicPartnershipsWallet, amount);
    }
    
    /**
     * @dev Emite tokens para recompensas à comunidade
     * @param to Endereço do destinatário
     * @param amount Quantidade de tokens a serem emitidos
     */
    function mintCommunityTokens(address to, uint256 amount) external onlyOwner whenNotPaused nonReentrant {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than zero");
        require(totalCommunityAllocation + amount <= MAX_COMMUNITY_ALLOCATION, "Exceeds community allocation");
        
        totalCommunityAllocation += amount;
        _mint(to, amount);
    }
    
    /**
     * @dev Emite tokens para consultores e vendas
     * @param to Endereço do destinatário
     * @param amount Quantidade de tokens a serem emitidos
     */
    function mintConsultantsTokens(address to, uint256 amount) external onlyOwner whenNotPaused nonReentrant {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than zero");
        require(totalConsultantsAllocation + amount <= MAX_CONSULTANTS_ALLOCATION, "Exceeds consultants allocation");
        
        totalConsultantsAllocation += amount;
        _mint(to, amount);
    }

    /**
     * @dev Registra uma compra de tokens (para compras off-chain)
     * @param buyer Endereço do comprador
     * @param amount Quantidade de tokens comprados
     * @param paymentMethod Método de pagamento utilizado
     */
    function recordPurchase(address buyer, uint256 amount, string calldata paymentMethod) 
        external 
        onlyOwner 
        duringPresale 
        whenNotPaused 
        nonReentrant 
    {
        require(buyer != address(0), "Buyer cannot be zero address");
        require(amount > 0, "Amount must be greater than zero");
        
        emit TokensPurchased(buyer, amount, paymentMethod);
    }

    /**
     * @dev Modificador para verificar se o chamador é o operador de entrega
     */
    modifier onlyDeliveryOperator() {
        require(msg.sender == deliveryOperator, "Caller is not the delivery operator");
        _;
    }
    
    /**
     * @dev Atualiza o endereço do operador de entrega
     * @param _newDeliveryOperator Novo endereço do operador de entrega
     */
    function updateDeliveryOperator(address _newDeliveryOperator) external onlyOwner {
        require(_newDeliveryOperator != address(0), "Delivery operator cannot be zero address");
        deliveryOperator = _newDeliveryOperator;
    }
    
    /**
     * @dev Atualiza o período de expiração para resgates
     * @param _newPeriod Novo período em segundos
     */
    function updateRedemptionExpiryPeriod(uint256 _newPeriod) external onlyOwner {
        require(_newPeriod >= 7 days, "Period must be at least 7 days");
        redemptionExpiryPeriod = _newPeriod;
    }
    
    /**
     * @dev Permite que um usuário solicite o resgate de água
     * @param amount Quantidade de tokens a serem reservados para resgate
     * @param deliveryDetails Detalhes para entrega (endereço, contato, etc.)
     * @notice Requer aprovação KYC para resgate físico
     * @return redemptionId ID único do resgate solicitado
     */
    function requestWaterRedemption(uint256 amount, string calldata deliveryDetails) 
        external 
        whenNotPaused 
        nonReentrant 
        onlyKycApproved(msg.sender) 
        returns (uint256 redemptionId)
    {
        require(amount >= MIN_REDEMPTION_AMOUNT, "Amount below minimum redemption");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(bytes(deliveryDetails).length > 0, "Delivery details required");
        
        // Reservar o ID do resgate
        redemptionId = nextRedemptionId;
        nextRedemptionId++;
        
        // Queimar os tokens
        _burn(msg.sender, amount);
        
        // Registrar o resgate
        waterRedemptions[redemptionId] = WaterRedemption({
            redeemer: msg.sender,
            amount: amount,
            requestTime: block.timestamp,
            expiryTime: block.timestamp + redemptionExpiryPeriod,
            delivered: false,
            cancelled: false,
            refunded: false,
            deliveryDetails: deliveryDetails
        });
        
        // Emitir evento de resgate
        emit WaterRedeemed(msg.sender, amount, amount, redemptionId);
        
        return redemptionId;
    }
    
    /**
     * @dev Permite que o operador confirme a entrega de água
     * @param redemptionId ID do resgate a ser confirmado
     */
    function confirmWaterDelivery(uint256 redemptionId) 
        external 
        whenNotPaused 
        nonReentrant 
        onlyDeliveryOperator 
    {
        WaterRedemption storage redemption = waterRedemptions[redemptionId];
        
        require(redemption.redeemer != address(0), "Redemption does not exist");
        require(!redemption.delivered, "Redemption already confirmed");
        require(!redemption.cancelled, "Redemption was cancelled");
        require(!redemption.refunded, "Redemption was refunded");
        require(block.timestamp <= redemption.expiryTime, "Redemption expired");
        
        // Marcar como entregue
        redemption.delivered = true;
        
        // Emitir evento de confirmação
        emit WaterRedemptionConfirmed(redemptionId, redemption.redeemer, redemption.amount);
    }
    
    /**
     * @dev Permite que o operador cancele um resgate (por exemplo, se a entrega for impossível)
     * @param redemptionId ID do resgate a ser cancelado
     * @param reason Motivo do cancelamento
     */
    function cancelWaterRedemption(uint256 redemptionId, string calldata reason) 
        external 
        whenNotPaused 
        nonReentrant 
        onlyDeliveryOperator 
    {
        WaterRedemption storage redemption = waterRedemptions[redemptionId];
        
        require(redemption.redeemer != address(0), "Redemption does not exist");
        require(!redemption.delivered, "Redemption already confirmed");
        require(!redemption.cancelled, "Redemption already cancelled");
        require(!redemption.refunded, "Redemption already refunded");
        
        // Marcar como cancelado
        redemption.cancelled = true;
        
        // Emitir evento de cancelamento
        emit WaterRedemptionCancelled(redemptionId, redemption.redeemer, redemption.amount, reason);
    }
    
    /**
     * @dev Permite que o usuário solicite reembolso de um resgate cancelado ou expirado
     * @param redemptionId ID do resgate a ser reembolsado
     */
    function refundWaterRedemption(uint256 redemptionId) 
        external 
        whenNotPaused 
        nonReentrant 
    {
        WaterRedemption storage redemption = waterRedemptions[redemptionId];
        
        require(redemption.redeemer == msg.sender, "Not the redeemer");
        require(!redemption.delivered, "Redemption already confirmed");
        require(!redemption.refunded, "Already refunded");
        require(redemption.cancelled || block.timestamp > redemption.expiryTime, "Can only refund cancelled or expired redemptions");
        
        // Marcar como reembolsado
        redemption.refunded = true;
        
        // Reemitir os tokens para o usuário
        _mint(redemption.redeemer, redemption.amount);
        
        // Emitir evento de reembolso
        emit WaterRedemptionRefunded(redemptionId, redemption.redeemer, redemption.amount);
    }
    
    /**
     * @dev Permite que um usuário verifique o status de um resgate
     * @param redemptionId ID do resgate a ser verificado
     * @return redeemer Endereço do solicitante
     * @return amount Quantidade de tokens
     * @return requestTime Timestamp da solicitação
     * @return expiryTime Timestamp de expiração
     * @return delivered Status de entrega
     * @return cancelled Status de cancelamento
     * @return refunded Status de reembolso
     */
    function getWaterRedemptionStatus(uint256 redemptionId) 
        external 
        view 
        returns (
            address redeemer,
            uint256 amount,
            uint256 requestTime,
            uint256 expiryTime,
            bool delivered,
            bool cancelled,
            bool refunded
        ) 
    {
        WaterRedemption storage redemption = waterRedemptions[redemptionId];
        require(redemption.redeemer != address(0), "Redemption does not exist");
        
        return (
            redemption.redeemer,
            redemption.amount,
            redemption.requestTime,
            redemption.expiryTime,
            redemption.delivered,
            redemption.cancelled,
            redemption.refunded
        );
    }

    /**
     * @dev Atualiza os endereços das carteiras administrativas
     * @param _developmentTeamWallet Nova carteira da equipe de desenvolvimento
     * @param _liquidityReserveWallet Nova carteira de reserva de liquidez
     * @param _strategicPartnershipsWallet Nova carteira de parcerias estratégicas
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
        
        emit WalletsUpdated(_developmentTeamWallet, _liquidityReserveWallet, _strategicPartnershipsWallet);
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
        require(totalPublicAllocation < TOTAL_PRESALE_TOKENS, "All presale tokens have been sold");
        
        uint256 oldEndTime = presaleEndTime;
        presaleEndTime = _newEndTime;
        
        emit PresaleExtended(oldEndTime, _newEndTime);
    }
    
    /**
     * @dev Sobrescreve a função _update para implementar pausabilidade
     */
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override whenNotPaused {
        super._update(from, to, amount);
    }
}
