# 🔍 Guia de Verificação no Etherscan

**Problema**: Contratos na mainnet não estão verificados no Etherscan  
**Causa**: Flatten não bate ou arquivo de deploy incorreto  
**Solução**: Este guia passo a passo

---

## 📋 Informações dos Contratos

### HanumanWaterTokenV2
- **Endereço**: `0x86C064635a535Aa681fD5c58ffa3639bD2d09fF8`
- **Arquivo**: `contracts/HanumanWaterTokenV2.sol`
- **Compiler**: Solidity 0.8.20
- **Otimização**: Sim (200 runs)

### HanumanWaterTokenPresale
- **Endereço**: `0x67A506934aA8Bb00E92a706Ba40c373F6269B44d`
- **Arquivo**: `contracts/HanumanWaterTokenPresale.sol`
- **Compiler**: Solidity 0.8.20
- **Otimização**: Sim (200 runs)

---

## 🛠️ Método 1: Verificação via Hardhat (Recomendado)

### Passo 1: Verificar hardhat.config.ts

Certifique-se que tem isso no `hardhat.config.ts`:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    mainnet: {
      url: process.env.MAINNET_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY || "",
    },
  },
};

export default config;
```

### Passo 2: Preparar os Argumentos do Construtor

Crie `scripts/verify-args-token.ts`:

```typescript
// Argumentos usados no deploy do HanumanWaterTokenV2
module.exports = [
  "ENDEREÇO_DEVELOPMENT_TEAM",      // developmentTeamWallet
  "ENDEREÇO_LIQUIDITY_RESERVE",     // liquidityReserveWallet
  "ENDEREÇO_STRATEGIC_PARTNERSHIPS", // strategicPartnershipsWallet
  "ENDEREÇO_COMMUNITY_REWARDS",     // communityRewardsWallet
  "ENDEREÇO_CONSULTANTS"            // consultantsWallet
];
```

Crie `scripts/verify-args-presale.ts`:

```typescript
// Argumentos usados no deploy do HanumanWaterTokenPresale
module.exports = [
  "0x86C064635a535Aa681fD5c58ffa3639bD2d09fF8", // hwtTokenAddress
  "0xdAC17F958D2ee523a2206206994597C13D831ec7", // usdtAddress
  "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // ethUsdPriceFeedAddress
  "ENDEREÇO_TREASURY",                            // treasuryWallet
  365                                             // presaleDurationDays
];
```

### Passo 3: Executar Verificação

```bash
# Verificar HanumanWaterTokenV2
npx hardhat verify --network mainnet \
  --constructor-args scripts/verify-args-token.ts \
  0x86C064635a535Aa681fD5c58ffa3639bD2d09fF8

# Verificar HanumanWaterTokenPresale
npx hardhat verify --network mainnet \
  --constructor-args scripts/verify-args-presale.ts \
  0x67A506934aA8Bb00E92a706Ba40c373F6269B44d
```

---

## 🛠️ Método 2: Verificação Manual no Etherscan

Se o Hardhat não funcionar, use verificação manual:

### Passo 1: Gerar Flatten

```bash
# Instalar hardhat-flatten se não tiver
npm install --save-dev hardhat-flatten

# Gerar flatten do Token
npx hardhat flatten contracts/HanumanWaterTokenV2.sol > flattened/HanumanWaterTokenV2_flat.sol

# Gerar flatten do Presale
npx hardhat flatten contracts/HanumanWaterTokenPresale.sol > flattened/HanumanWaterTokenPresale_flat.sol
```

### Passo 2: Limpar o Flatten

Abra os arquivos gerados e:

1. **Remover duplicatas de licença**: Deixe apenas um `// SPDX-License-Identifier` no topo
2. **Remover duplicatas de pragma**: Deixe apenas um `pragma solidity` no topo
3. **Verificar ordem**: Contratos base devem vir antes dos que herdam

Exemplo de estrutura correta:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// OpenZeppelin contracts primeiro
contract Context { ... }
contract Ownable { ... }
contract ERC20 { ... }
// etc...

// Seu contrato por último
contract HanumanWaterTokenV2 is ... { ... }
```

### Passo 3: Verificar no Etherscan

1. Acesse: https://etherscan.io/verifyContract
2. Preencha:
   - **Contract Address**: `0x86C064635a535Aa681fD5c58ffa3639bD2d09fF8`
   - **Compiler Type**: Solidity (Single file)
   - **Compiler Version**: v0.8.20+commit.a1b79de6
   - **Open Source License Type**: MIT
3. Clique "Continue"
4. Cole o código do flatten
5. **Optimization**: Yes
6. **Runs**: 200
7. **Constructor Arguments ABI-encoded**: 
   - Use: https://abi.hashex.org/
   - Encode os argumentos do construtor

### Passo 4: Encode Constructor Arguments

Para HanumanWaterTokenV2:
```
Types: address,address,address,address,address
Values: [endereço1],[endereço2],[endereço3],[endereço4],[endereço5]
```

Para HanumanWaterTokenPresale:
```
Types: address,address,address,address,uint256
Values: [token],[usdt],[oracle],[treasury],365
```

---

## 🛠️ Método 3: Usando Foundry (Alternativo)

Se tiver Foundry instalado:

```bash
# Verificar Token
forge verify-contract \
  --chain mainnet \
  --compiler-version v0.8.20+commit.a1b79de6 \
  --optimizer-runs 200 \
  --constructor-args $(cast abi-encode "constructor(address,address,address,address,address)" ADDR1 ADDR2 ADDR3 ADDR4 ADDR5) \
  0x86C064635a535Aa681fD5c58ffa3639bD2d09fF8 \
  contracts/HanumanWaterTokenV2.sol:HanumanWaterTokenV2 \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

---

## 🔍 Troubleshooting

### Erro: "Bytecode does not match"

**Causa**: Configurações de compilação diferentes

**Solução**:
1. Verificar versão exata do Solidity
2. Verificar optimizer settings (enabled: true, runs: 200)
3. Verificar que usou os mesmos argumentos do deploy

### Erro: "Constructor arguments are invalid"

**Causa**: Argumentos codificados incorretamente

**Solução**:
1. Usar https://abi.hashex.org/ para encode
2. Verificar ordem dos argumentos
3. Verificar tipos (address vs uint256)

### Erro: "Already verified"

**Solução**: Contrato já está verificado! ✅

### Erro: "Invalid API Key"

**Solução**:
1. Verificar ETHERSCAN_API_KEY no .env
2. Criar nova key em: https://etherscan.io/myapikey

---

## 📝 Checklist de Verificação

Antes de tentar verificar:

- [ ] Tenho o ETHERSCAN_API_KEY configurado
- [ ] Sei exatamente quais argumentos foram usados no deploy
- [ ] Tenho a versão exata do Solidity (0.8.20)
- [ ] Sei as configurações do optimizer (enabled: true, runs: 200)
- [ ] Tenho os endereços corretos dos contratos
- [ ] Tenho acesso ao código fonte original

---

## 🎯 Próximos Passos

Depois de verificar:

1. ✅ Contratos verificados aparecem com ✓ verde no Etherscan
2. ✅ Código fonte fica público
3. ✅ Usuários podem ler o contrato
4. ✅ Pode interagir direto pelo Etherscan
5. ✅ Aumenta confiança do projeto

---

## 💡 Dica Final

Se nada funcionar, você pode:

1. **Usar Sourcify**: https://sourcify.dev/
2. **Pedir ajuda no Discord do Hardhat**
3. **Contratar serviço de verificação**

Mas com este guia, deve funcionar! 🚀

---

**Última atualização**: 13 de Novembro de 2025  
**Status**: Aguardando verificação dos contratos
