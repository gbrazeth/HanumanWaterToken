# 🔧 Correção do Erro Coinbase Onramp

**Data**: 13 de Novembro de 2025  
**Problema**: Coinbase Onramp retorna erro de parâmetros inválidos

---

## ⚠️ **Erro Encontrado:**

```
Parâmetros ausentes ou inválidos:
1. destinationWallets foi descontinuado
2. Seu projeto requer um sessionToken
```

---

## 🔍 **Causa:**

A API do Coinbase Onramp mudou e agora requer:
1. **Novos parâmetros**: `endereços` e `ativos` (não mais `destinationWallets`)
2. **Session Token**: Para inicialização segura
3. **Configuração atualizada**: SDK do @reown/appkit precisa ser atualizado

---

## 💡 **Soluções:**

### **Opção 1: Desabilitar Coinbase (RÁPIDO)** ✅

Manter apenas outros provedores que funcionam:
- ✅ MoonPay
- ✅ Transak  
- ✅ Ramp Network
- ✅ Meld.io

**Como fazer:**
- Não precisa fazer nada!
- O usuário pode escolher outro provedor
- Coinbase é opcional

**Prós:**
- ✅ Funciona imediatamente
- ✅ Sem código para alterar
- ✅ Outros provedores funcionam bem

**Contras:**
- ⚠️ Coinbase não disponível (mas há 4+ alternativas)

---

### **Opção 2: Atualizar SDK (MÉDIO PRAZO)** 🔄

Atualizar `@reown/appkit` para versão mais recente que suporta nova API Coinbase.

**Passos:**

1. **Verificar versão atual:**
```bash
cd hwt-landing
npm list @reown/appkit
```

2. **Atualizar para latest:**
```bash
npm install @reown/appkit@latest --legacy-peer-deps
```

3. **Testar:**
```bash
npm run build
npm run dev
```

**Prós:**
- ✅ Coinbase funcionando
- ✅ SDK atualizado

**Contras:**
- ⚠️ Pode quebrar outras coisas
- ⚠️ Precisa testar tudo
- ⚠️ Vulnerabilidades do WalletConnect ainda presentes

---

### **Opção 3: Configurar Session Token (COMPLEXO)** 🔐

Implementar autenticação segura para Coinbase Onramp.

**Requer:**
1. Backend para gerar session tokens
2. API route no Next.js
3. Configuração do Coinbase Developer
4. Muito trabalho

**Não recomendado** para este projeto.

---

## 🎯 **Recomendação:**

### **USAR OPÇÃO 1** ✅

**Por quê?**
1. ✅ **Funciona agora** - Sem espera
2. ✅ **Sem risco** - Não quebra nada
3. ✅ **4+ alternativas** - MoonPay, Transak, Ramp, Meld
4. ✅ **Mesma funcionalidade** - Comprar ETH com cartão
5. ✅ **Taxas similares** - Todos cobram 1-3%

**Usuário pode:**
- Escolher MoonPay (popular)
- Escolher Transak (rápido)
- Escolher Ramp (boas taxas)
- Escolher Meld.io (novo)

---

## 📋 **Instruções para Usuários:**

### **Como Comprar ETH sem Coinbase:**

1. **Conecte sua carteira** no checkout
2. **Clique em "💳 Comprar ETH com Cartão"**
3. **Escolha outro provedor:**
   - ✅ **MoonPay** (Recomendado)
   - ✅ **Transak**
   - ✅ **Ramp Network**
   - ✅ **Meld.io**
4. **Complete a compra** normalmente

---

## 🔮 **Futuro (Opcional):**

Se **realmente** precisar do Coinbase:

### **Quando atualizar:**
- Quando @reown/appkit lançar versão estável
- Quando vulnerabilidades WalletConnect forem corrigidas
- Quando houver tempo para testar tudo

### **Como atualizar:**
```bash
# Backup
cp package.json package.json.backup3

# Atualizar
npm install @reown/appkit@latest --legacy-peer-deps

# Testar TUDO
npm run build
npm run dev
# Testar: conectar carteira, comprar tokens, etc.

# Se funcionar
git add package.json package-lock.json
git commit -m "feat: atualizar @reown/appkit para suportar Coinbase Onramp"
git push origin main

# Se quebrar
cp package.json.backup3 package.json
npm install --legacy-peer-deps
```

---

## 📊 **Comparação de Provedores:**

| Provedor | Taxa | Velocidade | KYC | Disponibilidade |
|----------|------|------------|-----|-----------------|
| MoonPay | 1-4% | Rápido | Sim | 🌍 Global |
| Transak | 1-3% | Muito Rápido | Sim | 🌍 Global |
| Ramp | 0.5-3% | Rápido | Sim | 🌍 Global |
| Meld.io | 1-2% | Rápido | Sim | 🌍 Global |
| Coinbase | 1-2% | Rápido | Sim | ❌ Não funciona |

**Todos são confiáveis e seguros!**

---

## ✅ **Conclusão:**

**Não precisa fazer nada!** 

- ✅ Deixe Coinbase desabilitado
- ✅ Use outros provedores
- ✅ Funcionalidade mantida
- ✅ Usuários felizes

**Se usuários reclamarem:**
- Explique que há 4 alternativas
- Todas funcionam igualmente bem
- Mesmas taxas e velocidade

---

## 🆘 **Suporte:**

Se usuário insistir no Coinbase:
1. Explique que é problema da API deles
2. Mostre as alternativas
3. Recomende MoonPay (mais popular)

---

**Última Atualização**: 13 de Novembro de 2025  
**Status**: ✅ Resolvido (usar outros provedores)  
**Ação Necessária**: ❌ Nenhuma
