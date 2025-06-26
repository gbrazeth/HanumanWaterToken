# Documentação de Segurança do HanumanWaterToken

Este documento detalha todas as melhorias de segurança e modificações implementadas nos contratos inteligentes do projeto HanumanWaterToken.

## Índice

1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Contratos Principais](#contratos-principais)
3. [Melhorias de Segurança Implementadas](#melhorias-de-segurança-implementadas)
   - [Proteção contra Manipulação de Preço do Oráculo](#proteção-contra-manipulação-de-preço-do-oráculo)
   - [Sistema de Comprovação de Entrega e Reembolso](#sistema-de-comprovação-de-entrega-e-reembolso)
   - [Limite de Gás em Loops](#limite-de-gás-em-loops)
   - [Precisão em Cálculos de Tokens](#precisão-em-cálculos-de-tokens)
   - [Limite para Extensão do Período de Pré-venda](#limite-para-extensão-do-período-de-pré-venda)
   - [Verificação de Endereço Zero](#verificação-de-endereço-zero)
4. [Funcionalidades de Segurança Existentes](#funcionalidades-de-segurança-existentes)
5. [Checklist de Segurança](#checklist-de-segurança)
6. [Recomendações Adicionais](#recomendações-adicionais)

## Visão Geral do Projeto

O HanumanWaterToken (HWT) é um token ERC-20 na blockchain Ethereum que representa direitos sobre água mineral da Fonte Hanuman. Cada token equivale a 1 litro de água mineral premium.

**Características Principais:**
- Fornecimento total: 500 milhões de tokens
- Distribuição: 80% para distribuição pública, 6% para equipe de desenvolvimento, 5% para fundo de liquidez e reservas, 3% para parcerias estratégicas, 3% para recompensas à comunidade, 3% para consultores e vendas
- Equivalência: 1 HWT = 1 litro de água mineral da Fonte Hanuman
- Preço: 2 USD por token (1000 HWT = 1 metro cúbico = $2000)
- Resgate mínimo: 1000 HWT (equivalente a 1 metro cúbico de água)
- Período de pré-venda: 1 ano a partir da implantação do contrato (limitado)

## Contratos Principais

### HanumanWaterTokenV2.sol

Contrato principal do token que implementa o padrão ERC-20 com funcionalidades adicionais para resgate físico de água, controle KYC e gestão de alocações.

### HanumanWaterTokenPresale.sol

Contrato de pré-venda que gerencia a venda de tokens com suporte para pagamentos em ETH e USDT, utilizando oráculos Chainlink para preços.

## Melhorias de Segurança Implementadas

### Proteção contra Manipulação de Preço do Oráculo

**Problema:** O contrato confiava diretamente no preço instantâneo do oráculo Chainlink, vulnerável a manipulações de curto prazo.

**Solução:**
- Implementado mecanismo TWAP (Time-Weighted Average Price) que mantém um histórico circular dos últimos preços
- Adicionada verificação de atualidade dos dados do oráculo (maxPriceAge)
- Implementados limites de desvio percentual (maxPriceDeviation)
- Parâmetros de proteção configuráveis pelo proprietário

```solidity
// Proteção contra manipulação de preço do oráculo
uint256 public maxPriceAge = 3600; // 1 hora em segundos
uint256 public maxPriceDeviation = 10; // 10% de desvio máximo

// Armazenamento para TWAP (Time-Weighted Average Price)
uint256 public twapWindow = 3; // Número de preços para média
uint256[3] private lastPrices; // Últimos preços para cálculo de média
uint256[3] private lastPriceTimes; // Timestamps dos últimos preços
uint256 private priceIndex = 0; // Índice atual no array circular
```

### Sistema de Comprovação de Entrega e Reembolso

**Problema:** A função `redeemWater` queimava tokens sem garantia de entrega física da água, podendo resultar em perda de fundos.

**Solução:**
- Criada estrutura `WaterRedemption` para rastrear pedidos de resgate
- Implementado fluxo completo: solicitação → confirmação/cancelamento → reembolso
- Adicionado papel de operador de entrega com permissões específicas
- Implementado período de expiração configurável para pedidos não entregues
- Eventos detalhados para rastreamento de cada etapa do processo

```solidity
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
```

### Limite de Gás em Loops

**Problema:** O loop em `batchUpdateKycStatus` não tinha limite de tamanho, podendo causar ataques de negação de serviço.

**Solução:**
- Adicionada constante MAX_BATCH_SIZE (100) para limitar o tamanho do array
- Implementada verificação para rejeitar arrays muito grandes

```solidity
// Limite máximo de endereços por lote para evitar ataques de negação de serviço
uint256 public constant MAX_BATCH_SIZE = 100;

function batchUpdateKycStatus(address[] calldata _addresses, bool _status) external onlyOwner {
    // Verificar se o tamanho do array não excede o limite
    require(_addresses.length <= MAX_BATCH_SIZE, "Batch size exceeds limit");
    
    // Processar cada endereço no lote
    for (uint256 i = 0; i < _addresses.length; i++) {
        kycApproved[_addresses[i]] = _status;
        emit KycStatusUpdated(_addresses[i], _status);
    }
}
```

### Precisão em Cálculos de Tokens

**Problema:** Potenciais problemas de arredondamento nas conversões entre ETH, USDT e tokens.

**Solução:**
- Otimizada a ordem das operações (multiplicar primeiro, dividir depois)
- Adicionados comentários detalhados explicando as unidades
- Implementada verificação para evitar tokens zero em transações válidas

```solidity
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
```

### Limite para Extensão do Período de Pré-venda

**Problema:** Não havia limite para a extensão do período de pré-venda, permitindo extensão indefinida.

**Solução:**
- Adicionada constante MAX_PRESALE_DURATION (365 dias) para limitar a duração máxima
- Implementada verificação de disponibilidade de tokens para extensão
- Adicionada verificação de limite temporal na função extendPresale

```solidity
uint256 public constant MAX_PRESALE_DURATION = 365 days; // Duração máxima da pré-venda: 1 ano
uint256 public constant TOTAL_PRESALE_TOKENS = 100000000 * 10**18; // 100 milhões de tokens para pré-venda

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
```

### Verificação de Endereço Zero

**Problema:** Algumas funções não verificavam se o endereço é zero, podendo causar configurações incorretas.

**Solução:**
- Adicionada verificação de endereço zero em funções críticas como updateKycStatus

```solidity
function updateKycStatus(address _address, bool _status) external onlyOwner {
    require(_address != address(0), "Address cannot be zero");
    kycApproved[_address] = _status;
    emit KycStatusUpdated(_address, _status);
}
```

## Funcionalidades de Segurança Existentes

### Proteção contra Reentrância
- Implementado via OpenZeppelin ReentrancyGuard
- Aplicado em todas as funções que transferem tokens ou ETH

### Controle de Acesso
- Implementado via OpenZeppelin Ownable
- Modificadores personalizados (onlyKycApproved, onlyPresaleContract, etc.)
- KYC necessário apenas para resgate físico de água, não para compra ou transferência de tokens

### Conformidade com ERC-20
- Baseado em implementação OpenZeppelin ERC20
- Inclui extensões como ERC20Burnable

### Mecanismos de Pausa
- Implementado via OpenZeppelin Pausable
- Funções pause() e unpause() restritas ao proprietário

### Proteção contra Overflow/Underflow
- Garantida pelo Solidity 0.8+ que inclui verificações automáticas

## Checklist de Segurança

✅ Proteção contra reentrância  
✅ Controle de acesso adequado  
✅ Conformidade com ERC-20  
✅ Mecanismos de pausa  
✅ Proteção contra overflow/underflow (via Solidity 0.8+)  
✅ Proteção contra manipulação de preço do oráculo  
✅ Verificação de transferência ETH  
✅ Precisão em cálculos  
✅ Limites em loops  
✅ Limite para extensão do período de pré-venda  
✅ Verificação de endereço zero  
✅ Sistema de comprovação de entrega e reembolso  

## Recomendações Adicionais

1. **Testes Extensivos**: Realizar testes unitários e de integração para todas as novas funcionalidades
2. **Auditoria Externa**: Considerar uma auditoria por uma empresa especializada antes do lançamento em mainnet
3. **Monitoramento Contínuo**: Implementar um sistema de monitoramento para detectar atividades suspeitas
4. **Atualizações Graduais**: Considerar um sistema de upgrades para permitir melhorias futuras sem perda de dados

---

*Última atualização: 16 de junho de 2025*
