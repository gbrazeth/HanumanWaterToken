# 🌊 HanumanWaterToken (HWT)

[![Status](https://img.shields.io/badge/status-live%20on%20mainnet-success)](https://etherscan.io/address/0x86C064635a535Aa681fD5c58ffa3639bD2d09fF8)
[![Network](https://img.shields.io/badge/network-Ethereum-blue)](https://ethereum.org)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Security](https://img.shields.io/badge/security-audited-green)](docs/security/)

O Hanuman Water Token (HWT) é uma plataforma inovadora que une blockchain e sustentabilidade para transformar a gestão de recursos hídricos. O projeto permite a tokenização de volumes de água mineral de uma fonte natural preservada, promovendo transparência, rastreabilidade e participação comunitária.

## 🚀 Visão Geral

- ✅ Landing page moderna com informações sobre o projeto, tokenomics, roadmap e FAQ
- ✅ Compra de tokens HWT via criptomoedas (ETH, USDT) e WalletConnect
- ✅ Autenticação por e-mail e carteira, com painel para consulta de saldo
- ✅ Smart Contract ERC-20 auditado para emissão e gestão dos tokens
- ✅ Design responsivo e identidade visual alinhada à marca Hanuman
- ✅ Suporte a múltiplos idiomas (PT-BR, EN-US)


## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 15** - Framework React com App Router
- **React 18** - Biblioteca UI
- **TailwindCSS** - Styling
- **shadcn/ui** - Componentes UI
- **next-intl** - Internacionalização

### Blockchain
- **Solidity** - Smart Contracts (ERC-20)
- **Hardhat** - Development environment
- **Ethers.js** - Ethereum library
- **WalletConnect** - Wallet integration
- **Wagmi** - React hooks para Ethereum

### Backend & Services
- **Resend** - Email service
- **Vercel** - Hosting & deployment

## ⚙️ Instalação e Uso

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/HanumanWaterToken.git
cd HanumanWaterToken/hwt-landing
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
# Copie o template
cp docs/ENV_TEMPLATE.md .env.local

# Edite com seus valores
nano .env.local
```

Consulte [ENV_TEMPLATE.md](hwt-landing/docs/ENV_TEMPLATE.md) para detalhes.

### 4. Inicie o projeto
```bash
npm run dev
```

### 5. Acesse
```
http://localhost:3000
```

## 📚 Documentação

- **[Deploy Guide](hwt-landing/docs/DEPLOY_GUIDE.md)** - Guia completo de deploy
- **[Whitepaper](docs/whitepaper/)** - Documentação do projeto
- **[Security Audit](hwt-landing/docs/FINAL_AUDIT_REPORT.md)** - Relatório de auditoria
- **[WalletConnect Setup](hwt-landing/docs/WALLETCONNECT_SETUP.md)** - Configuração do WalletConnect

## 💡 Funcionalidades

- ✅ Interface intuitiva para compra de tokens HWT
- ✅ Integração com WalletConnect (MetaMask, Google, Trust Wallet, etc.)
- ✅ Autenticação por e-mail com código de verificação
- ✅ Visualização de saldo de tokens em tempo real
- ✅ Tokenomics transparente e detalhada
- ✅ Contrato inteligente seguro e auditado
- ✅ Sistema de logging profissional
- ✅ Validações robustas de input
- ✅ Rate limiting e proteção contra ataques
- ✅ Error boundaries para melhor UX

## 📄 Smart Contracts

Os contratos ERC-20 do HWT estão localizados em:

- **Token**: `hwt-landing/contracts/HanumanWaterTokenV2.sol`
- **Presale**: `hwt-landing/contracts/HanumanWaterTokenPresale.sol`

### Endereços (Ethereum Mainnet) 🟢
- **Token**: [`0x86C064635a535Aa681fD5c58ffa3639bD2d09fF8`](https://etherscan.io/address/0x86C064635a535Aa681fD5c58ffa3639bD2d09fF8)
- **Presale**: [`0x67A506934aA8Bb00E92a706Ba40c373F6269B44d`](https://etherscan.io/address/0x67A506934aA8Bb00E92a706Ba40c373F6269B44d)

### Endereços (Sepolia Testnet)
- Token: `0xAa810fcC018b9a734ad20a47657CBf305b7E4046`
- Presale: `0x81feCF48B0fdb2C25E71c61e7655695E13f6680D`

## 📁 Estrutura do Projeto

```
HanumanWaterToken/
├── README.md                    ← Você está aqui
├── docs/                        ← Documentação geral
│   ├── whitepaper/             ← Whitepapers
│   ├── security/               ← Docs de segurança
│   └── assets/                 ← Logos e imagens
│
└── hwt-landing/                 ← Aplicação principal
    ├── app/                    ← Páginas Next.js
    ├── components/             ← Componentes React
    ├── lib/                    ← Utilitários
    ├── contracts/              ← Smart Contracts
    ├── docs/                   ← Docs técnicos
    └── public/                 ← Assets públicos
```

## 🔒 Segurança

Este projeto passou por auditoria completa de segurança:

- ✅ **Zero** vulnerabilidades críticas
- ✅ **Zero** API keys expostas
- ✅ **100%** logging profissional
- ✅ **15+** validadores de input
- ✅ Rate limiting implementado
- ✅ Error handling robusto

Consulte o [Relatório de Auditoria](hwt-landing/docs/FINAL_AUDIT_REPORT.md) para detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas!

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📫 Contato

**Gabriel Braz**  
Email: gabrielbbraz@gmail.com  
GitHub: [@seu-usuario](https://github.com/seu-usuario)

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Status**: 🚀 **EM PRODUÇÃO (MAINNET)**  
**Deploy Mainnet**: ✅ Concluído  
**Última Auditoria**: 13 de Novembro de 2025  
**Versão**: 1.0.0  
**Network**: Ethereum Mainnet

