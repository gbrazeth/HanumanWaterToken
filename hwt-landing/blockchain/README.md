# 🔗 Blockchain - HanumanWaterToken

Smart contracts, scripts de deploy e ferramentas relacionadas à blockchain do projeto HWT.

---

## 📁 **Estrutura:**

```
blockchain/
├── contracts/              # Contratos Solidity
│   ├── HanumanWaterTokenV2.sol
│   ├── HanumanWaterTokenPresale.sol
│   ├── legacy/            # Versões antigas
│   └── mocks/             # Contratos de teste
│
├── scripts/               # Scripts de deploy
│   ├── deploy-v2.ts
│   ├── deploy-v2-mainnet.js
│   ├── deploy-v2-security.js
│   └── distribute-tokenomics.js
│
├── flattened/             # Contratos flattened para Etherscan
│   ├── HanumanWaterTokenV2_flattened.sol
│   ├── HanumanWaterTokenPresale_flattened.sol
│   └── README.md
│
├── artifacts/             # Contratos compilados (gerado)
├── cache/                 # Cache do Hardhat (gerado)
│
├── hardhat.config.js      # Configuração do Hardhat
├── compile-contracts.sh   # Script de compilação
├── run-tests.sh          # Script de testes
└── withdraw-eth.js       # Utilitário de withdraw
```

---

## 🚀 **Como Usar:**

### **1. Compilar Contratos**

```bash
cd blockchain
npx hardhat compile
```

Ou use o script:
```bash
./compile-contracts.sh
```

### **2. Deploy em Testnet (Sepolia)**

```bash
cd blockchain
npx hardhat run scripts/deploy-v2.ts --network sepolia
```

### **3. Deploy em Mainnet**

```bash
cd blockchain
npx hardhat run scripts/deploy-v2-mainnet.js --network mainnet
```

⚠️ **ATENÇÃO**: Sempre teste em testnet primeiro!

### **4. Verificar no Etherscan**

```bash
npx hardhat verify --network mainnet ENDEREÇO_CONTRATO "ARG1" "ARG2"
```

Ou use os arquivos flattened em `flattened/` para verificação manual.

### **5. Rodar Testes**

```bash
npx hardhat test
```

Ou use o script:
```bash
./run-tests.sh
```

---

## 📋 **Contratos Principais:**

### **HanumanWaterTokenV2.sol**
- Token ERC-20 principal
- Fornecimento: 500 milhões HWT
- Funcionalidades: mint, burn, pausable
- Integração com sistema KYC

### **HanumanWaterTokenPresale.sol**
- Contrato de pré-venda
- Aceita ETH e USDT
- Integração com Chainlink Oracle
- Sistema de resgates de água

---

## 🔐 **Segurança:**

### **Variáveis de Ambiente Necessárias:**

```bash
# .env (na raiz do hwt-landing)
PRIVATE_KEY=0x...                    # Chave privada do deployer
ETHERSCAN_API_KEY=...                # Para verificação
INFURA_API_KEY=...                   # RPC provider
SEPOLIA_RPC_URL=...                  # Testnet RPC
MAINNET_RPC_URL=...                  # Mainnet RPC
```

⚠️ **NUNCA commite o arquivo .env!**

### **Endereços dos Contratos:**

#### **Mainnet (Ethereum)**
- **HWT Token**: `0x86C064635a535Aa681fD5c58ffa3639bD2d09fF8`
- **Presale**: `0x67A506934aA8Bb00E92a706Ba40c373F6269B44d`

#### **Sepolia Testnet**
- **HWT Token**: `0x...` (adicionar após deploy)
- **Presale**: `0x...` (adicionar após deploy)

---

## 🛠️ **Comandos Úteis:**

### **Compilar**
```bash
npx hardhat compile
```

### **Limpar cache**
```bash
npx hardhat clean
```

### **Flatten para Etherscan**
```bash
npx hardhat flatten contracts/HanumanWaterTokenV2.sol > flattened/HanumanWaterTokenV2_flattened.sol
```

### **Console Hardhat**
```bash
npx hardhat console --network sepolia
```

### **Verificar gas**
```bash
npx hardhat test --gas-reporter
```

---

## 📚 **Documentação:**

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Chainlink Price Feeds](https://docs.chain.link/data-feeds/price-feeds)
- [Etherscan Verification](https://docs.etherscan.io/tutorials/verifying-contracts-programmatically)

---

## ⚠️ **Importante:**

### **Não Commitar:**
- `artifacts/` - Gerado automaticamente
- `cache/` - Cache do Hardhat
- `.env` - Contém chaves privadas
- `typechain-types/` - Gerado automaticamente

### **Sempre Commitar:**
- `contracts/` - Código fonte dos contratos
- `scripts/` - Scripts de deploy
- `flattened/` - Contratos flattened
- `hardhat.config.js` - Configuração
- Este README

---

## 🔄 **Workflow de Deploy:**

1. **Desenvolver** contrato em `contracts/`
2. **Compilar** com `npx hardhat compile`
3. **Testar** em testnet (Sepolia)
4. **Verificar** no Etherscan testnet
5. **Auditar** código (se necessário)
6. **Deploy** na mainnet
7. **Verificar** no Etherscan mainnet
8. **Documentar** endereços neste README

---

## 📞 **Suporte:**

Para questões sobre os contratos:
- Consulte a [documentação de segurança](../docs/security/)
- Revise os [testes](./test/)
- Verifique o [código fonte](./contracts/)

---

**Última Atualização**: 13 de Novembro de 2025  
**Versão dos Contratos**: V2  
**Status**: ✅ Deployado na Mainnet
