# 🚀 Guia de Deploy - HanumanWaterToken

**Versão**: 1.0  
**Última Atualização**: 13 de Novembro de 2025

---

## 📋 Pré-requisitos

### Contas Necessárias

- [ ] **Vercel Account** (para hosting do frontend)
- [ ] **WalletConnect Cloud** (Project ID)
- [ ] **Resend Account** (para emails)
- [ ] **Infura/Alchemy** (RPC endpoints)
- [ ] **Etherscan** (verificação de contratos)

### Ferramentas

- [ ] Node.js 18+ instalado
- [ ] Git configurado
- [ ] Vercel CLI instalado (opcional)

---

## 🔐 Passo 1: Configurar Variáveis de Ambiente

### 1.1 Desenvolvimento Local

```bash
# Copiar template
cp ENV_TEMPLATE.md .env.local

# Editar com seus valores
nano .env.local
```

### 1.2 Produção (Vercel)

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione cada variável:

```bash
# Blockchain
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
ETHERSCAN_API_KEY=YOUR_KEY

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=YOUR_PROJECT_ID

# Email
RESEND_API_KEY=re_YOUR_KEY
RESEND_FROM=Hanuman Water Token <noreply@yourdomain.com>

# Contracts
NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_USDT_ADDRESS=0x...

# Environment
NODE_ENV=production
```

---

## 🌐 Passo 2: Configurar WalletConnect

### 2.1 Criar Projeto

1. Acesse: https://cloud.walletconnect.com
2. Clique em **Create Project**
3. Nome: "Hanuman Water Token"
4. Copie o **Project ID**

### 2.2 Configurar Allowed Origins

Adicione seus domínios:

```
https://hanumanwatertoken.com
https://www.hanumanwatertoken.com
https://your-vercel-domain.vercel.app
http://localhost:3000 (apenas para dev)
```

---

## 📧 Passo 3: Configurar Email (Resend)

### 3.1 Verificar Domínio

1. Acesse: https://resend.com/domains
2. Adicione seu domínio
3. Configure DNS records (SPF, DKIM, DMARC)
4. Aguarde verificação

### 3.2 Criar API Key

1. Vá em **API Keys**
2. Clique em **Create API Key**
3. Nome: "HWT Production"
4. Copie a key (só aparece uma vez!)

### 3.3 Configurar Sender

```bash
RESEND_FROM=Hanuman Water Token <noreply@yourdomain.com>
```

---

## ⛓️ Passo 4: Deploy dos Smart Contracts

### 4.1 Compilar Contratos

```bash
cd hwt-landing
npx hardhat compile
```

### 4.2 Deploy na Sepolia (Testnet)

```bash
# Configurar .env com PRIVATE_KEY
npx hardhat run scripts/deploy-v2.ts --network sepolia
```

### 4.3 Verificar no Etherscan

```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

### 4.4 Deploy na Mainnet

⚠️ **ATENÇÃO**: Mainnet usa dinheiro real!

```bash
# Revisar tudo 3x antes de executar
npx hardhat run scripts/deploy-v2.ts --network mainnet

# Verificar
npx hardhat verify --network mainnet CONTRACT_ADDRESS
```

---

## 🌍 Passo 5: Deploy do Frontend

### 5.1 Via Vercel Dashboard

1. Acesse: https://vercel.com/new
2. Conecte seu repositório GitHub
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `hwt-landing`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Adicione Environment Variables
5. Clique em **Deploy**

### 5.2 Via Vercel CLI

```bash
# Instalar CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd hwt-landing
vercel --prod
```

---

## ✅ Passo 6: Verificações Pós-Deploy

### 6.1 Checklist Funcional

- [ ] Homepage carrega corretamente
- [ ] Troca de idioma funciona (PT/EN)
- [ ] WalletConnect abre modal
- [ ] Conexão de carteira funciona
- [ ] Checkout page carrega
- [ ] Saldo de ETH é exibido
- [ ] Botão "Comprar Tokens" funciona
- [ ] Desconexão funciona

### 6.2 Checklist de Segurança

- [ ] HTTPS ativo
- [ ] Headers de segurança configurados
- [ ] Rate limiting funcionando
- [ ] Validações de input ativas
- [ ] Logs não expõem dados sensíveis
- [ ] API keys não estão no código
- [ ] Contratos verificados no Etherscan

### 6.3 Checklist de Performance

- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] Bundle size < 500KB
- [ ] Imagens otimizadas

---

## 🔍 Passo 7: Monitoramento

### 7.1 Vercel Analytics

1. Ative em: **Settings** → **Analytics**
2. Monitore:
   - Page views
   - Unique visitors
   - Performance metrics

### 7.2 Error Tracking (Opcional)

Configure Sentry:

```bash
npm install @sentry/nextjs

# Seguir setup wizard
npx @sentry/wizard@latest -i nextjs
```

### 7.3 Logs

Monitore logs em:
- Vercel Dashboard → **Logs**
- Filtrar por erro/warning

---

## 🐛 Troubleshooting

### Problema: WalletConnect não conecta

**Solução**:
1. Verificar Project ID
2. Verificar Allowed Origins
3. Limpar cache do navegador
4. Testar em modo incógnito

### Problema: Email não envia

**Solução**:
1. Verificar RESEND_API_KEY
2. Verificar domínio verificado
3. Checar DNS records
4. Ver logs no Resend Dashboard

### Problema: Transação falha

**Solução**:
1. Verificar endereço do contrato
2. Verificar rede (Sepolia/Mainnet)
3. Verificar gas price
4. Ver transação no Etherscan

### Problema: Build falha

**Solução**:
1. Limpar cache: `rm -rf .next`
2. Reinstalar deps: `rm -rf node_modules && npm install`
3. Verificar erros de TypeScript
4. Checar logs do Vercel

---

## 🔄 Rollback

Se algo der errado:

### Via Vercel Dashboard

1. Vá em **Deployments**
2. Encontre deploy anterior estável
3. Clique nos 3 pontos → **Promote to Production**

### Via CLI

```bash
vercel rollback
```

---

## 📊 Métricas de Sucesso

### Após 24h do Deploy

- [ ] Zero erros críticos
- [ ] Uptime > 99.9%
- [ ] Response time < 500ms
- [ ] Pelo menos 1 transação bem-sucedida

### Após 1 semana

- [ ] Performance estável
- [ ] Sem vulnerabilidades reportadas
- [ ] Feedback positivo dos usuários
- [ ] Métricas de conversão satisfatórias

---

## 🆘 Suporte

### Em caso de emergência:

1. **Pausar contratos** (se necessário):
   ```solidity
   // Chamar função pause() como owner
   ```

2. **Reverter deploy**:
   ```bash
   vercel rollback
   ```

3. **Desabilitar features**:
   - Comentar rotas problemáticas
   - Deploy rápido

### Contatos

- **Vercel Support**: https://vercel.com/support
- **WalletConnect**: https://walletconnect.com/support
- **Resend**: support@resend.com

---

## ✅ Checklist Final

Antes de anunciar publicamente:

- [ ] Todos os testes passando
- [ ] Deploy em produção estável
- [ ] Monitoramento ativo
- [ ] Documentação atualizada
- [ ] Backup dos contratos
- [ ] Plano de rollback testado
- [ ] Equipe de suporte pronta
- [ ] Marketing materials prontos

---

## 🎉 Parabéns!

Seu projeto está no ar! 🚀

**Próximos passos**:
1. Monitorar métricas
2. Coletar feedback
3. Iterar e melhorar
4. Escalar conforme necessário

**Boa sorte!** 🍀
