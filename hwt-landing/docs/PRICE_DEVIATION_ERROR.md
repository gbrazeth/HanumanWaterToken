# 🔴 Erro: "Price deviation too high"

**Data**: 14 de Novembro de 2025  
**Status**: ⚠️ BLOQUEANDO COMPRAS  
**Severidade**: 🔴 ALTA

---

## 📋 **Descrição do Problema:**

Usuários não conseguem comprar tokens HWT com ETH devido ao erro:

```
execution reverted: Price deviation too high
```

### **Causa Raiz:**

O contrato `HanumanWaterTokenPresale` implementa uma proteção TWAP (Time-Weighted Average Price) que:

1. Mantém histórico dos últimos 3 preços do ETH/USD
2. Calcula a média desses preços (TWAP)
3. Verifica se o preço atual não desvia mais de **10%** da média
4. **Rejeita a transação** se o desvio for maior que 10%

### **Código Relevante:**

```solidity
// Linha 42 do contrato
uint256 public maxPriceDeviation = 10; // 10% de desvio máximo

// Linha 219
require(deviation <= maxPriceDeviation, "Price deviation too high");
```

---

## 🔍 **Por que está acontecendo:**

### **Cenário 1: Contrato Recém-Deployado** ⚠️
- O array `lastPrices` está vazio ou com poucos valores
- TWAP não tem dados suficientes
- Qualquer variação parece grande

### **Cenário 2: Volatilidade do ETH** 📈📉
- ETH está volátil (variando mais de 10%)
- Preço atual vs. média dos últimos 3 preços > 10%
- Proteção ativa corretamente, mas bloqueia compras legítimas

### **Cenário 3: Primeira Compra do Dia** 🌅
- Última atualização foi há muitas horas
- Preço do ETH mudou significativamente
- Desvio > 10%

---

## 💡 **Soluções:**

### **Opção 1: Aguardar Estabilização** 🕐 (Temporário)

**O que fazer:**
- Aguardar 1-2 horas
- Tentar novamente quando o preço estabilizar
- O TWAP vai se ajustar automaticamente

**Prós:**
- ✅ Sem mudanças no contrato
- ✅ Segurança mantida

**Contras:**
- ❌ Usuários não conseguem comprar agora
- ❌ Perda de vendas
- ❌ Experiência ruim

---

### **Opção 2: Adicionar Função de Atualização** ✅ (RECOMENDADO)

**O que fazer:**

1. **Criar novo contrato com função de atualização:**

```solidity
/**
 * @dev Atualiza o desvio máximo permitido de preço
 * @param _newDeviation Novo valor de desvio (em porcentagem)
 */
function updateMaxPriceDeviation(uint256 _newDeviation) external onlyOwner {
    require(_newDeviation > 0 && _newDeviation <= 50, "Invalid deviation");
    uint256 oldDeviation = maxPriceDeviation;
    maxPriceDeviation = _newDeviation;
    emit MaxPriceDeviationUpdated(oldDeviation, _newDeviation);
}
```

2. **Fazer upgrade do contrato** (se usar proxy) ou **deploy novo contrato**

3. **Atualizar para 20-30%** temporariamente

**Prós:**
- ✅ Flexibilidade para ajustar
- ✅ Pode aumentar durante volatilidade
- ✅ Pode diminuir quando estável

**Contras:**
- ⚠️ Requer deploy/upgrade
- ⚠️ Custo de gas
- ⚠️ Migração de usuários (se novo contrato)

---

### **Opção 3: Desabilitar Temporariamente a Verificação** ⚠️ (NÃO RECOMENDADO)

**O que fazer:**
- Criar função para desabilitar temporariamente a verificação TWAP
- Habilitar novamente quando estável

**Prós:**
- ✅ Compras funcionam imediatamente

**Contras:**
- ❌ Remove proteção de segurança
- ❌ Vulnerável a manipulação de preço
- ❌ Não recomendado para produção

---

### **Opção 4: Forçar Atualização do TWAP** 🔄 (WORKAROUND)

**O que fazer:**

1. **Criar função pública para atualizar TWAP:**

```solidity
/**
 * @dev Força atualização do TWAP sem compra
 * Qualquer um pode chamar para popular o histórico
 */
function updateTwap() external {
    updateAndGetTwapPrice();
}
```

2. **Chamar várias vezes** para popular o array de preços

3. **Usuários podem comprar** depois que TWAP estiver populado

**Prós:**
- ✅ Mantém segurança
- ✅ Resolve problema de inicialização

**Contras:**
- ⚠️ Requer deploy/upgrade
- ⚠️ Usuários precisam esperar

---

## 🎯 **Recomendação Imediata:**

### **Para o Owner do Contrato:**

**Se o contrato é upgradeable:**
1. Adicionar função `updateMaxPriceDeviation`
2. Aumentar para 20-30%
3. Monitorar por alguns dias
4. Reduzir gradualmente conforme estabiliza

**Se o contrato NÃO é upgradeable:**
1. **Opção A**: Deploy novo contrato com função de atualização
2. **Opção B**: Aguardar estabilização do mercado
3. **Opção C**: Comunicar aos usuários para tentar em horários de menor volatilidade

---

### **Para os Usuários:**

**Enquanto o problema não é resolvido:**

1. **Tentar em diferentes horários:**
   - Manhã cedo (menos volatilidade)
   - Fim de semana (mercado mais calmo)

2. **Comprar com USDT em vez de ETH:**
   - USDT não tem verificação de desvio
   - Funciona normalmente

3. **Aguardar comunicado oficial:**
   - Owner vai ajustar o contrato
   - Problema será resolvido em breve

---

## 📊 **Análise Técnica:**

### **Valores Atuais:**
```solidity
maxPriceDeviation = 10%  // Muito restritivo
twapWindow = 3           // Últimos 3 preços
maxPriceAge = 3600       // 1 hora
```

### **Valores Recomendados:**
```solidity
maxPriceDeviation = 20-30%  // Mais flexível
twapWindow = 5-10           // Mais dados
maxPriceAge = 1800          // 30 minutos (mais atual)
```

---

## 🔧 **Script de Diagnóstico:**

```javascript
// Verificar estado atual do TWAP
const presale = await ethers.getContractAt("HanumanWaterTokenPresale", PRESALE_ADDRESS);

const currentPrice = await presale.getEthUsdPrice();
const twapPrice = await presale.calculateTwapPrice();
const maxDeviation = await presale.maxPriceDeviation();

const deviation = Math.abs(currentPrice - twapPrice) * 100 / twapPrice;

console.log(`Preço atual: $${currentPrice / 1e8}`);
console.log(`TWAP: $${twapPrice / 1e8}`);
console.log(`Desvio: ${deviation.toFixed(2)}%`);
console.log(`Máximo permitido: ${maxDeviation}%`);
console.log(`Status: ${deviation <= maxDeviation ? '✅ OK' : '❌ BLOQUEADO'}`);
```

---

## 📝 **Próximos Passos:**

### **Curto Prazo (Hoje):**
- [ ] Verificar se contrato é upgradeable
- [ ] Decidir entre Opção 2 ou Opção 4
- [ ] Comunicar usuários sobre o problema

### **Médio Prazo (Esta Semana):**
- [ ] Implementar função de atualização
- [ ] Deploy/upgrade do contrato
- [ ] Ajustar maxPriceDeviation para 20-30%
- [ ] Testar compras

### **Longo Prazo (Este Mês):**
- [ ] Monitorar volatilidade
- [ ] Ajustar parâmetros conforme necessário
- [ ] Considerar TWAP mais sofisticado (Uniswap V3 style)
- [ ] Adicionar dashboard de monitoramento

---

## 🆘 **Suporte:**

Se você é o owner do contrato e precisa de ajuda:

1. Verifique se o contrato é upgradeable
2. Se sim, prepare upgrade com função de atualização
3. Se não, considere deploy de novo contrato
4. Comunique aos usuários sobre a solução

---

## 📚 **Referências:**

- [Chainlink Price Feeds](https://docs.chain.link/data-feeds/price-feeds)
- [TWAP Oracles](https://docs.uniswap.org/contracts/v3/guides/oracle/oracle)
- [OpenZeppelin Upgradeable Contracts](https://docs.openzeppelin.com/upgrades-plugins/1.x/)

---

**Última Atualização**: 14 de Novembro de 2025  
**Status**: 🔴 Problema Ativo - Aguardando Solução
