# Contratos Legados do HanumanWaterToken

Esta pasta contém versões legadas dos contratos do projeto HanumanWaterToken que foram substituídas por versões mais recentes e seguras.

## Contratos Incluídos

1. **HanumanWaterToken.sol** - Versão original do token ERC-20, substituída por `HanumanWaterTokenV2.sol`
2. **HWTPresale.sol** - Versão original do contrato de pré-venda, substituída por `HanumanWaterTokenPresale.sol`

## Aviso Importante

**NÃO USE ESTES CONTRATOS PARA NOVAS IMPLANTAÇÕES**

Estes contratos são mantidos apenas para referência histórica e não devem ser usados para novas implantações. As versões mais recentes incluem melhorias significativas de segurança, como:

- Implementação de pausabilidade (Pausable)
- Proteção contra reentrância (ReentrancyGuard)
- Uso de oráculos Chainlink para preços
- Melhor gerenciamento de permissões
- Validação KYC
- Limites de alocação

## Contratos Atuais

Os contratos atuais que devem ser usados para implantações são:

- `HanumanWaterTokenV2.sol` - Versão atual do token
- `HanumanWaterTokenPresale.sol` - Versão atual do contrato de pré-venda

Estes contratos estão localizados no diretório principal de contratos.
