# Ethers Migration Plan: v5 → v6

## 🎯 Objetivo
Migrar de ethers v5.8.0 para v6.15.0 de forma segura e gradual, resolvendo conflitos de dependências.

## 🔍 Análise Atual

### Dependências Afetadas:
- **Frontend**: `app/[locale]/checkout/page.tsx` (uso direto)
- **Hardhat**: Todas as ferramentas de desenvolvimento
- **TypeChain**: Geração de tipos para contratos

### Conflitos Identificados:
```
ethers@5.8.0 (atual) vs ethers@^6.14.0 (requerido por hardhat tools)
```

## 📋 Estratégia de Migração

### Fase 1: Preparação (SEGURA)
- [x] Criar backup do código atual
- [x] Documentar uso atual do ethers
- [x] Criar testes para funcionalidades críticas
- [ ] Criar branch específica para migração

### Fase 2: Migração de Dev Dependencies (MÉDIA CAUTELA)
- [ ] Atualizar hardhat tools para versões compatíveis
- [ ] Migrar scripts de desenvolvimento
- [ ] Testar build e deploy de contratos

### Fase 3: Migração do Frontend (ALTA CAUTELA)
- [ ] Atualizar imports no checkout/page.tsx
- [ ] Adaptar sintaxe v6 (providers, signers)
- [ ] Testar todas as funcionalidades Web3
- [ ] Validar integração com wagmi

### Fase 4: Validação Completa
- [ ] Testes end-to-end
- [ ] Validação em testnet
- [ ] Performance testing
- [ ] Rollback plan ready

## 🚨 Principais Mudanças v5 → v6

### 1. Providers
```typescript
// v5
const provider = new ethers.providers.JsonRpcProvider(url)

// v6
const provider = new ethers.JsonRpcProvider(url)
```

### 2. Contracts
```typescript
// v5
const contract = new ethers.Contract(address, abi, provider)

// v6
const contract = new ethers.Contract(address, abi, provider)
// (sintaxe similar, mas internals diferentes)
```

### 3. Utils
```typescript
// v5
ethers.utils.parseEther("1.0")
ethers.utils.formatEther(value)

// v6
ethers.parseEther("1.0")
ethers.formatEther(value)
```

## ⚠️ Riscos Identificados

### Alto Risco:
- Quebra de funcionalidades Web3 no checkout
- Incompatibilidade com wagmi/web3modal
- Problemas de build em produção

### Médio Risco:
- Scripts de desenvolvimento quebrados
- Testes unitários falhando
- Performance degradation

### Baixo Risco:
- Warnings de deprecação
- Mudanças cosméticas no código

## 🛡️ Plano de Contingência

### Se algo der errado:
1. **Rollback imediato** para ethers v5
2. **Restaurar** package-lock.json
3. **Rebuild** node_modules
4. **Testar** funcionalidades críticas
5. **Documentar** problemas encontrados

## 📊 Cronograma Sugerido

### Semana 1: Preparação
- Criar branch de migração
- Implementar testes automatizados
- Documentar estado atual

### Semana 2: Dev Dependencies
- Migrar ferramentas de desenvolvimento
- Testar build de contratos
- Validar scripts

### Semana 3: Frontend
- Migrar código do checkout
- Testes extensivos
- Validação com usuários

### Semana 4: Deploy
- Deploy em staging
- Testes finais
- Deploy em produção

## 🎯 Critérios de Sucesso

- [ ] Todas as funcionalidades Web3 funcionando
- [ ] Build sem erros ou warnings
- [ ] Performance mantida ou melhorada
- [ ] Testes passando 100%
- [ ] Zero vulnerabilidades relacionadas ao ethers

## 📝 Notas Importantes

- **NÃO fazer** em produção sem testes extensivos
- **SEMPRE ter** rollback plan pronto
- **TESTAR em** múltiplos browsers
- **VALIDAR com** diferentes wallets
- **MONITORAR** métricas pós-deploy

---
*Documento criado em: 2025-11-15*
*Status: PLANEJAMENTO*
