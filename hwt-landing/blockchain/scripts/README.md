# 🛠️ Scripts Blockchain - HWT

Esta pasta contém todos os scripts para interação com os contratos inteligentes do Hanuman Water Token.

## 📁 Estrutura Organizada

### 🚀 `/deployment/`
Scripts para deploy dos contratos:
- `deploy-v2-mainnet.js` - Deploy principal para Mainnet
- `deploy-v2.ts` - Deploy versão TypeScript
- `deploy-v2-security.js` - Deploy com melhorias de segurança

### 🔧 `/maintenance/`
Scripts de manutenção e monitoramento:
- `check-twap-status.js` - Verificar status do TWAP
- `update-price-deviation.js` - Atualizar parâmetros de preço

### 📜 `/legacy/`
Scripts históricos e de debug (manter para referência):
- `deploy.ts` - Deploy original (obsoleto)
- `debug-eth-calculation.js` - Debug de cálculos
- `fix-*.js` - Scripts de correção emergencial
- `force-*.js` - Scripts de força bruta (emergência)
- `reset-*.js` - Scripts de reset (emergência)

## 📋 Scripts Principais (Raiz)

### `distribute-tokenomics.js`
Script para distribuição inicial dos tokens conforme tokenomics.

## 🎯 Como Usar

### Para Deploy:
```bash
cd blockchain
npx hardhat run scripts/deployment/deploy-v2-mainnet.js --network mainnet
```

### Para Manutenção:
```bash
npx hardhat run scripts/maintenance/check-twap-status.js --network mainnet
```

### Para Distribuição:
```bash
npx hardhat run scripts/distribute-tokenomics.js --network mainnet
```

## ⚠️ Importante

- Scripts em `/legacy/` são mantidos apenas para referência histórica
- Use sempre os scripts em `/deployment/` para novos deploys
- Scripts de manutenção devem ser executados com cuidado em produção

## 📝 Notas

Esta organização foi criada para melhor manutenibilidade e clareza do projeto.
