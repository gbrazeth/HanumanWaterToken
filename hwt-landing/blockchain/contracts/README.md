# Contratos do HanumanWaterToken

Esta pasta contém os contratos inteligentes do projeto HanumanWaterToken.

## Contratos Ativos

Os seguintes contratos são as versões atuais e devem ser usados para novas implantações:

1. **HanumanWaterTokenV2.sol** - Versão atual do token ERC-20 com recursos avançados de segurança
   - Implementa pausabilidade (Pausable)
   - Inclui validação KYC
   - Possui limites de alocação
   - Permite resgate de água física

2. **HanumanWaterTokenPresale.sol** - Versão atual do contrato de pré-venda
   - Usa oráculos Chainlink para preços ETH/USD
   - Implementa proteção contra reentrância (ReentrancyGuard)
   - Inclui pausabilidade para emergências
   - Suporta compras com ETH e USDT

## Contratos Legados

Os contratos legados foram movidos para a pasta `legacy/`. Consulte o README nessa pasta para mais informações.

## Endereços de Implantação

Os endereços de implantação dos contratos na rede Sepolia estão definidos no arquivo `config/contract.ts`:

- **HanumanWaterTokenV2**: 0x123a55BFDda355C10a9fb1EdF7f3c80152D5e91c
- **HanumanWaterTokenPresale**: 0xD490cc38AE9eE28281825c7F4ceAB70B557F3a3C
- **USDT (Sepolia)**: 0x7169D38820dfd117C3FA1f22a697dBA58d90BA06

## ABIs

As ABIs atualizadas dos contratos estão disponíveis no arquivo `config/contract.ts` e devem ser usadas para interação com os contratos.
