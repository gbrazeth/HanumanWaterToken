# Dependency Cleanup Plan

## 🎯 Objetivo
Remover dependências não utilizadas de forma segura, mantendo funcionalidades essenciais.

## 📊 Análise de Dependências

### ✅ SEGURO PARA REMOVER:
```json
{
  "dependencies": {
    "@hookform/resolvers": "^3.9.1",  // Não usado no código
    "zod": "^3.24.1"                  // Não usado no código
  }
}
```

### ⚠️ MANTER (Necessárias para contratos):
```json
{
  "dependencies": {
    "@chainlink/contracts": "^1.4.0",    // Usado em contratos blockchain
    "@openzeppelin/contracts": "^5.0.0", // Usado em contratos blockchain
    "autoprefixer": "^10.4.20"           // Usado pelo Tailwind CSS
  }
}
```

### 🔧 DEV DEPENDENCIES - ANÁLISE:
```json
{
  "devDependencies": {
    "@nomicfoundation/hardhat-ethers": "MANTER - usado pelo hardhat.config.js",
    "@nomicfoundation/hardhat-ignition": "REMOVER - não usado",
    "@nomicfoundation/hardhat-ignition-ethers": "REMOVER - não usado", 
    "@nomicfoundation/hardhat-verify": "MANTER - útil para verificação",
    "@nomicfoundation/ignition-core": "REMOVER - não usado",
    "@typechain/ethers-v6": "MANTER - será usado na migração ethers",
    "postcss": "MANTER - usado pelo Tailwind CSS"
  }
}
```

## 🚨 Dependências com Conflito Ethers

### Problemáticas (remover com cuidado):
- `@nomicfoundation/hardhat-ignition`
- `@nomicfoundation/hardhat-ignition-ethers`
- `@nomicfoundation/ignition-core`

Estas dependências estão causando conflitos com ethers v5/v6.

## 📋 Plano de Execução

### Fase 1: Remoções Seguras
```bash
npm uninstall @hookform/resolvers zod
npm uninstall @nomicfoundation/hardhat-ignition
npm uninstall @nomicfoundation/hardhat-ignition-ethers  
npm uninstall @nomicfoundation/ignition-core
```

### Fase 2: Teste e Validação
```bash
npm run build
npm run security:audit
npm run deps:check
```

### Fase 3: Limpeza de Cache
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## 🎯 Resultados Esperados

### Benefícios:
- ✅ Redução do tamanho do node_modules
- ✅ Menos conflitos de dependências
- ✅ Build mais rápido
- ✅ Menos vulnerabilidades potenciais

### Riscos:
- ⚠️ Quebra de scripts de desenvolvimento
- ⚠️ Problemas com deploy de contratos
- ⚠️ Incompatibilidades futuras

## 🛡️ Rollback Plan

Se algo der errado:
```bash
git checkout package.json package-lock.json
npm install --legacy-peer-deps
```

---
*Status: PRONTO PARA EXECUÇÃO*
*Data: 2025-11-15*
