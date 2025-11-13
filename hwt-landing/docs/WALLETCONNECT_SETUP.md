# WalletConnect - Configuração e Uso

## ✅ O que foi implementado

Implementamos o **WalletConnect** (via Web3Modal) para permitir que usuários conectem suas carteiras tanto no **desktop** quanto no **mobile**.

### Benefícios:
- ✅ **Mobile**: Funciona em navegadores mobile (Chrome, Safari, etc.)
- ✅ **Desktop**: Continua funcionando normalmente
- ✅ **Múltiplas Carteiras**: Suporta MetaMask, Trust Wallet, Rainbow, Coinbase Wallet, e muitas outras
- ✅ **QR Code**: No desktop, mostra QR code para conectar com app mobile
- ✅ **Deep Linking**: No mobile, abre automaticamente o app da carteira

## 📦 Bibliotecas Instaladas

```bash
npm install @web3modal/wagmi wagmi viem@2.x @tanstack/react-query --legacy-peer-deps
```

## 🔧 Arquivos Criados/Modificados

### 1. `/config/wagmi.ts`
Configuração do WalletConnect com as redes suportadas (Mainnet e Sepolia).

### 2. `/components/web3-provider.tsx`
Provider que envolve a aplicação e fornece o contexto do WalletConnect.

### 3. `/app/[locale]/layout.tsx`
Adicionado o `Web3Provider` para envolver toda a aplicação.

### 4. `/app/[locale]/checkout/page.tsx`
Atualizado para usar os hooks do wagmi:
- `useAccount()` - Obtém endereço e status de conexão
- `useBalance()` - Obtém saldo de ETH automaticamente
- `useWeb3Modal()` - Abre o modal de conexão

## 🔑 Variável de Ambiente Necessária

No arquivo `.env.local`, adicione:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=seu_project_id_aqui
```

**Como obter o Project ID:**
1. Acesse: https://cloud.walletconnect.com
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie o **Project ID**

## 🎯 Como Funciona

### No Desktop:
1. Usuário clica em "Conectar Carteira"
2. Abre um modal com opções:
   - **MetaMask** (se instalado)
   - **WalletConnect** (QR Code para mobile)
   - Outras carteiras instaladas

### No Mobile:
1. Usuário clica em "Conectar Carteira"
2. Abre um modal com lista de carteiras
3. Ao selecionar uma carteira:
   - Se o app está instalado: abre automaticamente (deep link)
   - Se não está instalado: redireciona para a loja de apps

## 🧪 Testando

### Desktop:
```bash
npm run dev
```
Acesse: http://localhost:3000/pt-br/checkout

### Mobile:
1. Certifique-se que o servidor está acessível na rede local
2. Acesse pelo IP: http://SEU_IP:3000/pt-br/checkout
3. Ou use um serviço como ngrok para expor o localhost

## 📱 Carteiras Suportadas

- MetaMask
- Trust Wallet
- Rainbow
- Coinbase Wallet
- Ledger Live
- Argent
- Zerion
- E muitas outras...

## 🔄 Migração do Código Antigo

### Antes (só MetaMask):
```typescript
const [isConnected, setIsConnected] = useState(false)
const [walletAddress, setWalletAddress] = useState("")

const connectWallet = async () => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts"
  })
  setWalletAddress(accounts[0])
  setIsConnected(true)
}
```

### Depois (WalletConnect):
```typescript
const { address, isConnected } = useAccount()
const { open } = useWeb3Modal()

const connectWallet = async () => {
  await open()
}
```

## 🎨 Personalização

O modal do WalletConnect pode ser personalizado em `/config/wagmi.ts`:

```typescript
const metadata = {
  name: 'Hanuman Water Token',
  description: 'Descrição do seu projeto',
  url: 'https://seusite.com',
  icons: ['https://seusite.com/logo.png']
}
```

## 🐛 Troubleshooting

### Erro: "Project ID is not defined"
- Verifique se adicionou `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` no `.env.local`
- Reinicie o servidor após adicionar a variável

### Modal não abre no mobile
- Verifique se está acessando via HTTPS ou localhost
- Alguns navegadores mobile bloqueiam popups

### Carteira não conecta
- Verifique se está na rede correta (Mainnet ou Sepolia)
- Tente limpar o cache do navegador
- No mobile, certifique-se que o app da carteira está instalado

## 📚 Documentação Oficial

- WalletConnect: https://docs.walletconnect.com/
- Web3Modal: https://docs.walletconnect.com/web3modal/about
- Wagmi: https://wagmi.sh/
