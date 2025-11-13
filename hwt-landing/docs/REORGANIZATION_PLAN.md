# 🗂️ Plano de Reorganização do Projeto HWT-Landing

**Data**: 13 de Novembro de 2025  
**Status**: 📋 PLANEJAMENTO  
**Risco**: 🟢 CONTROLADO

---

## 📊 **Análise do package.json:**

### **Dependências Frontend (Produção):**
- Next.js, React, React-DOM
- Radix UI (componentes)
- Wagmi, Viem, Web3Modal (Web3)
- TailwindCSS, Lucide (UI)
- React Hook Form, Zod (forms)
- Resend (email)
- **Total**: ~40 pacotes

### **Dependências Blockchain (Dev):**
- Hardhat + plugins (~15 pacotes)
- Ethers, TypeChain
- Chai, Mocha (testes)
- OpenZeppelin, Chainlink (contratos)
- **Total**: ~25 pacotes

### **Problema Identificado:**
- ⚠️ **65 dependências** no mesmo package.json
- ⚠️ Hardhat não é usado em produção
- ⚠️ Build do Next.js processa arquivos Solidity
- ⚠️ node_modules gigante (~500MB)

---

## 🎯 **Plano de Ação (3 Fases):**

---

## **FASE 1: Limpeza Segura** ✅ (AGORA - 10 min)

### **Objetivo:** Organizar sem quebrar nada

### **Ações:**

#### **1.1. Criar pasta `flattened/`**
```bash
mkdir hwt-landing/flattened
```

#### **1.2. Mover contratos flattened**
```bash
mv hwt-landing/HanumanWaterTokenPresale_flattened.sol hwt-landing/flattened/
mv hwt-landing/HanumanWaterTokenV2_flattened.sol hwt-landing/flattened/
```

#### **1.3. Criar README em flattened/**
```markdown
# Contratos Flattened

Estes são os contratos compilados e "achatados" (flattened) para verificação no Etherscan.

## Arquivos:
- `HanumanWaterTokenV2_flattened.sol` - Token principal
- `HanumanWaterTokenPresale_flattened.sol` - Contrato de pré-venda

## Como usar:
1. Acesse Etherscan
2. Vá em "Verify Contract"
3. Cole o conteúdo do arquivo
4. Configure os parâmetros de compilação

## Não edite estes arquivos!
Eles são gerados automaticamente pelo Hardhat.
```

#### **1.4. Atualizar .gitignore**
```
# Hardhat
artifacts/
cache/
typechain-types/

# Next.js
.next/
out/

# Misc
.DS_Store
*.log
node_modules/
```

#### **1.5. Remover pastas vazias**
```bash
# Verificar se estão vazias primeiro
ls -la hwt-landing/test/
ls -la hwt-landing/context/
ls -la hwt-landing/locales/

# Se vazias, remover
rmdir hwt-landing/test/
rmdir hwt-landing/context/
rmdir hwt-landing/locales/
```

### **Verificações de Segurança:**
```bash
# 1. Verificar imports
grep -r "flattened" app/ components/ config/ lib/
# Deve retornar vazio (ninguém importa esses arquivos)

# 2. Testar build
npm run build

# 3. Testar dev
npm run dev

# 4. Verificar Git
git status
```

### **Commit:**
```bash
git add .
git commit -m "refactor: organizar contratos flattened e limpar pastas vazias

- Criar pasta flattened/ para contratos achatados
- Mover HanumanWaterToken*_flattened.sol para flattened/
- Remover pastas vazias (test, context, locales)
- Atualizar .gitignore
- Adicionar README em flattened/

Sem mudanças funcionais - apenas organização"
git push origin main
```

**Risco**: 🟢 ZERO  
**Tempo**: 10 minutos  
**Benefício**: Raiz mais limpa

---

## **FASE 2: Organização Blockchain** 🟡 (DEPOIS - 30 min)

### **Objetivo:** Agrupar arquivos blockchain sem separar dependências

### **Ações:**

#### **2.1. Criar pasta `blockchain/`**
```bash
mkdir hwt-landing/blockchain
```

#### **2.2. Mover arquivos blockchain**
```bash
# Contratos
mv hwt-landing/contracts/ hwt-landing/blockchain/

# Scripts
mv hwt-landing/scripts/ hwt-landing/blockchain/

# Flattened
mv hwt-landing/flattened/ hwt-landing/blockchain/

# Artifacts e cache
mv hwt-landing/artifacts/ hwt-landing/blockchain/
mv hwt-landing/cache/ hwt-landing/blockchain/

# Config e scripts
mv hwt-landing/hardhat.config.js hwt-landing/blockchain/
mv hwt-landing/compile-contracts.sh hwt-landing/blockchain/
mv hwt-landing/run-tests.sh hwt-landing/blockchain/
mv hwt-landing/withdraw-eth.js hwt-landing/blockchain/
```

#### **2.3. Atualizar hardhat.config.js**
```javascript
// Ajustar paths se necessário
module.exports = {
  solidity: "0.8.20",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
}
```

#### **2.4. Atualizar imports no frontend**

**VERIFICAR PRIMEIRO:**
```bash
# Procurar imports de contracts
grep -r "from.*contracts" app/ components/ config/
grep -r "import.*contracts" app/ components/ config/

# Procurar imports de scripts
grep -r "from.*scripts" app/ components/ config/
grep -r "import.*scripts" app/ components/ config/
```

**Se houver imports, atualizar:**
```typescript
// Antes
import { abi } from '../contracts/...'

// Depois
import { abi } from '../blockchain/contracts/...'
```

#### **2.5. Criar README em blockchain/**
```markdown
# 🔗 Blockchain

Smart contracts, scripts de deploy e testes do HanumanWaterToken.

## Estrutura:
- `contracts/` - Contratos Solidity
- `scripts/` - Scripts de deploy
- `flattened/` - Contratos flattened para Etherscan
- `artifacts/` - Contratos compilados (gerado)
- `cache/` - Cache do Hardhat (gerado)

## Como usar:

### Compilar:
```bash
npx hardhat compile
```

### Deploy (testnet):
```bash
npx hardhat run scripts/deploy-v2.ts --network sepolia
```

### Deploy (mainnet):
```bash
npx hardhat run scripts/deploy-v2-mainnet.js --network mainnet
```

### Verificar no Etherscan:
```bash
npx hardhat verify --network mainnet ENDEREÇO_CONTRATO
```

## Importante:
- Não commitar `artifacts/` e `cache/`
- Sempre testar em testnet primeiro
- Guardar endereços dos contratos deployados
```

### **Verificações de Segurança:**
```bash
# 1. Testar compilação Hardhat
cd hwt-landing/blockchain
npx hardhat compile
cd ..

# 2. Testar build Next.js
npm run build

# 3. Testar dev
npm run dev

# 4. Verificar imports
npm run build 2>&1 | grep "Module not found"
```

### **Commit:**
```bash
git add .
git commit -m "refactor: organizar arquivos blockchain em pasta dedicada

- Criar pasta blockchain/ para isolar código blockchain
- Mover contracts/, scripts/, flattened/ para blockchain/
- Mover hardhat.config.js e scripts .sh
- Atualizar imports se necessário
- Adicionar README em blockchain/

Facilita manutenção e separação de responsabilidades"
git push origin main
```

**Risco**: 🟡 BAIXO (se imports atualizados)  
**Tempo**: 30 minutos  
**Benefício**: Organização clara

---

## **FASE 3: Separação Completa** 🔴 (FUTURO - 2-4h)

### **Objetivo:** Separar completamente frontend e blockchain

### **Estrutura Final:**
```
HanumanWaterToken/
├── docs/                           # Documentação
│
├── frontend/                       # 🆕 Frontend isolado
│   ├── app/
│   ├── components/
│   ├── config/
│   ├── lib/
│   ├── public/
│   ├── styles/
│   ├── package.json               # Apenas deps frontend
│   ├── next.config.mjs
│   ├── vercel.json
│   └── README.md
│
└── blockchain/                     # 🆕 Blockchain isolado
    ├── contracts/
    ├── scripts/
    ├── test/
    ├── flattened/
    ├── package.json               # Apenas deps blockchain
    ├── hardhat.config.js
    └── README.md
```

### **Ações:**

#### **3.1. Criar estrutura**
```bash
# Na raiz do projeto
mkdir frontend
mkdir blockchain
```

#### **3.2. Mover frontend**
```bash
mv hwt-landing/app frontend/
mv hwt-landing/components frontend/
mv hwt-landing/config frontend/
mv hwt-landing/lib frontend/
mv hwt-landing/public frontend/
mv hwt-landing/styles frontend/
mv hwt-landing/hooks frontend/
mv hwt-landing/messages frontend/
mv hwt-landing/next.config.mjs frontend/
mv hwt-landing/vercel.json frontend/
mv hwt-landing/tailwind.config.js frontend/
mv hwt-landing/postcss.config.mjs frontend/
mv hwt-landing/tsconfig.json frontend/
mv hwt-landing/i18n.ts frontend/
mv hwt-landing/middleware.ts frontend/
mv hwt-landing/components.json frontend/
mv hwt-landing/.env frontend/
mv hwt-landing/.env.local frontend/
mv hwt-landing/.gitignore frontend/
```

#### **3.3. Mover blockchain**
```bash
mv hwt-landing/blockchain/* blockchain/
# ou se ainda não criou blockchain/
mv hwt-landing/contracts blockchain/
mv hwt-landing/scripts blockchain/
# etc...
```

#### **3.4. Criar package.json frontend**
```json
{
  "name": "hwt-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    // Apenas deps frontend (sem Hardhat)
    "next": "^15.5.6",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    // ... resto das deps frontend
  },
  "devDependencies": {
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5.9.2",
    "tailwindcss": "^3.4.17",
    "postcss": "^8"
  }
}
```

#### **3.5. Criar package.json blockchain**
```json
{
  "name": "hwt-blockchain",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "compile": "hardhat compile",
    "test": "hardhat test",
    "deploy:sepolia": "hardhat run scripts/deploy-v2.ts --network sepolia",
    "deploy:mainnet": "hardhat run scripts/deploy-v2-mainnet.js --network mainnet"
  },
  "dependencies": {
    "@openzeppelin/contracts": "^5.0.0",
    "@chainlink/contracts": "^1.4.0"
  },
  "devDependencies": {
    // Apenas deps blockchain (sem Next.js)
    "hardhat": "^2.17.0",
    "@nomicfoundation/hardhat-toolbox": "^2.0.0",
    // ... resto das deps blockchain
  }
}
```

#### **3.6. Configurar Vercel**

**vercel.json** (na raiz):
```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/.next",
  "installCommand": "cd frontend && npm install"
}
```

Ou no dashboard do Vercel:
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `.next`

#### **3.7. Atualizar imports**

Se frontend importa ABIs:
```typescript
// Opção 1: Copiar ABIs para frontend
frontend/config/abis/
  ├── HanumanWaterTokenV2.json
  └── HanumanWaterTokenPresale.json

// Opção 2: Importar do blockchain (não recomendado)
import abi from '../../blockchain/artifacts/...'
```

### **Verificações de Segurança:**
```bash
# 1. Testar frontend
cd frontend
npm install
npm run build
npm run dev

# 2. Testar blockchain
cd ../blockchain
npm install
npx hardhat compile
npx hardhat test

# 3. Testar Vercel
vercel --prod
```

### **Commit:**
```bash
git add .
git commit -m "refactor: separar completamente frontend e blockchain

BREAKING CHANGE: Estrutura do projeto reorganizada

- Criar pasta frontend/ com Next.js app
- Criar pasta blockchain/ com Hardhat
- Separar package.json (deps isoladas)
- Atualizar configuração Vercel
- Atualizar imports e paths

Benefícios:
- Builds mais rápidos
- Dependências isoladas
- Manutenção mais fácil
- Equipes podem trabalhar separadamente"
git push origin main
```

**Risco**: 🔴 ALTO  
**Tempo**: 2-4 horas  
**Benefício**: Arquitetura ideal

---

## ⚠️ **AVISOS IMPORTANTES:**

### **Antes de QUALQUER mudança:**

1. **✅ Fazer backup completo**
   ```bash
   git add .
   git commit -m "backup: antes de reorganização"
   git push origin main
   ```

2. **✅ Testar build local**
   ```bash
   npm run build
   ```

3. **✅ Verificar imports**
   ```bash
   grep -r "import.*contracts" app/ components/
   grep -r "import.*scripts" app/ components/
   ```

4. **✅ Documentar mudanças**
   - Atualizar README
   - Atualizar DEPLOY_GUIDE
   - Informar equipe

### **Coisas que NÃO PODEM ser movidas sem ajustes:**

1. ❌ **Arquivos importados pelo frontend**
   - ABIs de contratos
   - Configurações compartilhadas

2. ❌ **Configurações do Vercel**
   - Precisa saber onde está o frontend
   - Variáveis de ambiente

3. ❌ **Paths absolutos no código**
   - Imports com `@/`
   - Aliases do TypeScript

### **Checklist de Segurança:**

- [ ] Backup feito (commit + push)
- [ ] Build local testado
- [ ] Imports verificados
- [ ] Vercel configurado (se necessário)
- [ ] Variáveis de ambiente OK
- [ ] Documentação atualizada
- [ ] Equipe informada
- [ ] Teste em produção

---

## 🎯 **Recomendação Final:**

### **AGORA (Seguro):**
✅ **FASE 1** - Limpeza (10 min)
- Mover flattened
- Remover pastas vazias
- Atualizar .gitignore

### **ESTA SEMANA (Cuidado):**
🟡 **FASE 2** - Organizar blockchain (30 min)
- Criar pasta blockchain/
- Mover arquivos relacionados
- Atualizar imports

### **FUTURO (Planejamento):**
🔴 **FASE 3** - Separação completa (2-4h)
- Quando tiver tempo
- Quando precisar escalar
- Quando quiser arquitetura ideal

---

## 📊 **Benefícios de Cada Fase:**

| Fase | Tempo | Risco | Benefício | Quando Fazer |
|------|-------|-------|-----------|--------------|
| 1 | 10 min | 🟢 Zero | Organização visual | **AGORA** |
| 2 | 30 min | 🟡 Baixo | Separação lógica | Esta semana |
| 3 | 2-4h | 🔴 Alto | Arquitetura ideal | Quando tiver tempo |

---

**Quer que eu execute a FASE 1 agora?** ✅

Ou prefere revisar o plano primeiro? 🤔
