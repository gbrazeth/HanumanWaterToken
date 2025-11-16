"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ethers } from "ethers"
import { TOKEN_CONTRACT_ADDRESS, PRESALE_ADDRESS, USDT_ADDRESS } from "@/config/contract";
import { useTranslations } from 'next-intl';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { useWeb3ModalSafe } from '@/hooks/use-web3modal-safe';
import { ClientOnly } from '@/components/client-only';
// Usando endereços da Mainnet para produção

// Config Mainnet para uso no switchEthereumChain
const NETWORK_CONFIG = {
  chainId: '0x1', // 1 em hexadecimal
  chainName: 'Ethereum Mainnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: [process.env.NEXT_PUBLIC_MAINNET_RPC_URL || `https://mainnet.infura.io/v3/${process.env.MAINNET_INFURA_KEY}`],
  blockExplorerUrls: ['https://etherscan.io']
};
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, AlertCircle, Check } from "lucide-react"

// Importar ABIs dos contratos (em produção, estes seriam importados de arquivos JSON)
const HWT_ABI = [
  "function mintPresaleTokens(address to, uint256 amount) external",
  "function balanceOf(address account) external view returns (uint256)",
  "function symbol() external view returns (string)",
  "function decimals() external view returns (uint8)",
]

const PRESALE_ABI = ["function buyWithETH() external payable", "function buyWithUSDT(uint256 usdtAmount) external"]

const USDT_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name": "_spender", "type": "address"},
      {"name": "_value", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

// Usando os endereços importados do arquivo de configuração

export default function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const t = useTranslations('checkout');
  const { locale } = React.use(params);
  
  // Wagmi hooks para WalletConnect
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open, isReady } = useWeb3ModalSafe();
  const { data: balanceData } = useBalance({
    address: address,
  });
  
  // Contract addresses loaded from config
  const [tokenAmount, setTokenAmount] = useState<string>("10")
  const [usdAmount, setUsdAmount] = useState<string>("20")
  const [waterAmount, setWaterAmount] = useState<string>("10")
  const [paymentMethod, setPaymentMethod] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSelectedQuantity, setHasSelectedQuantity] = useState<boolean>(false)
  const [usdtBalance, setUsdtBalance] = useState<string>("0")
  const [pixCode, setPixCode] = useState<string>("")

  // Dados do cartão de crédito
  const [cardNumber, setCardNumber] = useState<string>("")
  const [cardName, setCardName] = useState<string>("")
  const [cardExpiry, setCardExpiry] = useState<string>("")
  const [cardCVC, setCardCVC] = useState<string>("")

  // Efeito para detectar se estamos no browser MetaMask e conectar diretamente
  useEffect(() => {
    const isMetaMaskBrowser = /MetaMask/i.test(navigator.userAgent) && window.ethereum?.isMetaMask
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)
    
    if (isMetaMaskBrowser && isMobile) {
      console.log('🔄 Detectado browser MetaMask mobile, conectando diretamente...')
      
      // Definir método de pagamento como ETH imediatamente
      setPaymentMethod('eth')
      
      // Tentar conectar diretamente com o MetaMask
      setTimeout(async () => {
        try {
          if (window.ethereum && !isConnected) {
            console.log('🔗 Solicitando conexão direta com MetaMask...')
            
            // Conectar diretamente via ethereum.request
            const accounts = await window.ethereum.request({ 
              method: 'eth_requestAccounts' 
            })
            
            if (accounts && accounts.length > 0) {
              console.log('✅ Conectado diretamente com MetaMask:', accounts[0])
              // Forçar atualização do estado
              window.location.reload()
            }
          }
        } catch (error) {
          console.log('⚠️ Erro na conexão direta:', error)
          // Fallback para WalletConnect
          try {
            await open({ view: 'Connect' })
          } catch (fallbackError) {
            console.log('⚠️ Erro no fallback WalletConnect:', fallbackError)
          }
        }
      }, 1000)
    }
  }, [isConnected, open])

  // Efeito para atualizar saldos quando conectar
  useEffect(() => {
    if (isConnected && address) {
      // Limpar erro ao conectar
      setError(null)
      getBalances(address)
      
      // Se não há método de pagamento selecionado, definir como 'social' por padrão
      if (!paymentMethod) {
        setPaymentMethod('social')
        console.log('🔄 Método de pagamento definido como social por padrão')
      }
    }
  }, [isConnected, address, paymentMethod])

  // Função para verificar e trocar para a rede correta
  const checkAndSwitchNetwork = async () => {
    try {
      // Se não tiver window.ethereum (carteira custodial), retorna true
      if (typeof window.ethereum === "undefined") {
        // Custodial wallet detected (e.g., WalletConnect Google)
        return true
      }

      // Tentar trocar para a rede Mainnet
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: NETWORK_CONFIG.chainId }],
        })
      } catch (switchError: any) {
        // Se a rede não existe, adicionar
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [NETWORK_CONFIG],
          })
        } else {
          throw switchError
        }
      }

      return true
    } catch (error) {
      console.error("Erro ao trocar de rede:", error)
      // Erro 4001 significa que o usuário rejeitou a solicitação
      if ((error as any).code === 4001) {
        setError(t('acceptNetworkSwitch'))
      } else {
        setError(t('connectToMainnet'))
      }
      return false
    }
  }

  // Função para obter saldos
  const getBalances = async (walletAddress: string) => {
    try {
      // Se não tiver window.ethereum (carteira custodial como Google), apenas retorna
      if (!window.ethereum) {
        // Custodial wallet - USDT balance not available
        setUsdtBalance("0")
        return
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum as any)

      // Verificar rede apenas se tiver window.ethereum
      const networkOk = await checkAndSwitchNetwork()
      if (!networkOk) {
        // Network not confirmed, continue without USDT balance
        setUsdtBalance("0")
        return
      }

      try {
        // Obter saldo de USDT
        const usdtContract = new ethers.Contract(USDT_ADDRESS, USDT_ABI, provider)
        const usdtBalance = await usdtContract.balanceOf(walletAddress)
        setUsdtBalance(ethers.utils.formatUnits(usdtBalance, 6)) // USDT tem 6 casas decimais
      } catch (usdtError) {
        // USDT balance not available, set to zero
        setUsdtBalance("0")
      }
    } catch (error) {
      // Unable to get balances, set to zero
      setUsdtBalance("0")
    }
  }

  // Função para conectar carteira crypto
  const connectCryptoWallet = async () => {
    setIsLoading(true)
    setError('')
    setPaymentMethod('eth')
    
    try {
      // Sempre usar WalletConnect normal para conectar
      await open({ view: 'Connect' })
    } catch (error) {
      console.error('Erro ao conectar carteira crypto:', error)
      setError('Erro ao conectar carteira crypto. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  // Função para conectar com email/social (pagamento tradicional)
  const connectSocialWallet = async () => {
    setIsLoading(true)
    setError('')
    setPaymentMethod('social')
    
    try {
      await open({ view: 'Connect' })
    } catch (error) {
      console.error('Erro ao conectar com email/social:', error)
      setError('Erro ao conectar. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  // Função para atualizar o valor em USD e água quando o número de tokens mudar
  const handleTokenAmountChange = (value: string) => {
    setTokenAmount(value)
    setHasSelectedQuantity(true) // Marcar que o usuário interagiu

    // Calcular valor em USD (1 HWT = $2)
    const usdValue = Number.parseFloat(value) * 2
    setUsdAmount(usdValue.toString())

    // Calcular quantidade de água (1 HWT = 1 litro)
    setWaterAmount(value)
  }

  // Função para verificar se os contratos estão configurados
  function checkContractAddresses() {
    // Só exige o contrato HWT para funcionar; presale pode ser opcional
    if (!TOKEN_CONTRACT_ADDRESS || TOKEN_CONTRACT_ADDRESS.toLowerCase() === "0x0000000000000000000000000000000000000000") {
      setError("O endereço do contrato HWT ainda não foi configurado")
      return false
    }
    return true
  }

  // Função para detectar se está no MetaMask mobile browser
  const isMetaMaskMobile = () => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    return /MetaMask/i.test(userAgent) || (window as any).ethereum?.isMetaMask && /Mobile|Android|iPhone|iPad/i.test(userAgent);
  }

  // Função para tentar abrir MetaMask com múltiplos métodos
  const openMetaMaskApp = () => {
    const currentUrl = `${window.location.host}${window.location.pathname}`
    
    // URLs diferentes para tentar
    const urls = [
      `https://metamask.app.link/dapp/${currentUrl}`,
      `metamask://dapp/${currentUrl}`,
      `https://metamask.io/download/`,
      `metamask://`
    ]
    
    console.log('🔗 Tentando abrir MetaMask com URLs:', urls)
    
    // Tentar cada URL com delay
    urls.forEach((url, index) => {
      setTimeout(() => {
        console.log(`🔗 Tentativa ${index + 1}: ${url}`)
        
        if (index === 0) {
          // Primeira tentativa: window.open
          const opened = window.open(url, '_blank')
          if (!opened || opened.closed) {
            console.log('🔗 window.open falhou para:', url)
          }
        } else {
          // Outras tentativas: location.href
          try {
            window.location.href = url
          } catch (e) {
            console.log('🔗 location.href falhou para:', url, e)
          }
        }
      }, index * 1500) // 1.5 segundos entre cada tentativa
    })
    
    return urls[0] // Retornar a primeira URL para o link manual
  }


  // Função para comprar tokens com ETH
  const buyWithETH = async () => {
    console.log('💰 buyWithETH iniciado:', {
      tokenAmount,
      hasEthereum: typeof window.ethereum !== "undefined",
      address,
      contractAddress: TOKEN_CONTRACT_ADDRESS,
      isMetaMaskMobile: isMetaMaskMobile(),
      userAgent: navigator.userAgent
    })
    
    try {
      if (typeof window.ethereum !== "undefined") {
        setIsLoading(true)
        setError(null)

        // Verificar se os contratos estão configurados
        if (!checkContractAddresses()) {
          setIsLoading(false)
          return
        }

        // Verificar e trocar para a rede correta
        const networkOk = await checkAndSwitchNetwork()
        if (!networkOk) {
          setIsLoading(false)
          return
        }

        if (!window.ethereum) throw new Error(t('metaMaskNotFound'))
        
        const provider = new ethers.providers.Web3Provider(window.ethereum as any)
        const signer = provider.getSigner()
        
        // Para mobile, implementar lógica específica para WalletConnect
        const isMobile = /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)
        
        if (isMobile) {
          console.log('📱 Mobile detectado, verificando tipo de conexão...')
          
          // Verificar se é WalletConnect (não tem MetaMask injetado diretamente)
          const isWalletConnect = !window.ethereum?.isMetaMask && window.ethereum
          
          if (isWalletConnect) {
            console.log('🔗 WalletConnect detectado no mobile, preparando transação...')
            
            // Para WalletConnect mobile, precisamos garantir que o provider está ativo
            try {
              // Tentar fazer uma chamada simples para "acordar" o provider
              await provider.getNetwork()
              console.log('✅ Provider WalletConnect ativo')
            } catch (providerError) {
              console.log('⚠️ Provider WalletConnect inativo, tentando reativar...')
              
              // Se o provider não responder, pode ser que a sessão WalletConnect tenha expirado
              // Vamos tentar reconectar
              throw new Error('Sessão WalletConnect expirada. Por favor, reconecte sua carteira.')
            }
          }
          
          // Tentar focar na janela atual
          window.focus()
          
          // Aguardar um pouco para garantir que tudo está pronto
          await new Promise(resolve => setTimeout(resolve, 500))
        }
        
        // Verificar se ainda estamos conectados
        const accounts = await provider.listAccounts()
        if (accounts.length === 0) {
          throw new Error('Carteira desconectada. Conecte novamente.')
        }
        
        const presaleContract = new ethers.Contract(PRESALE_ADDRESS, [
          ...PRESALE_ABI,
          "function getEthAmountForTokens(uint256 tokenAmount) public view returns (uint256)"
        ], signer)

        // Calcular o valor exato de ETH a partir do contrato
        const tokenAmount18 = ethers.utils.parseUnits(tokenAmount, 18)
        console.log('💰 Calculando valor ETH para tokens:', tokenAmount18.toString())
        
        const ethAmount = await presaleContract.getEthAmountForTokens(tokenAmount18)
        console.log('💰 Valor ETH calculado:', ethers.utils.formatEther(ethAmount))

        // Para MetaMask mobile, adicionar configurações específicas
        const txConfig = {
          value: ethAmount,
          gasLimit: ethers.utils.hexlify(300000), // Gas limit explícito
        }
        
        console.log('🚀 Enviando transação:', txConfig)

        // Para WalletConnect mobile, mostrar instruções claras em vez de tentar transação
        if (isMobile && !window.ethereum?.isMetaMask) {
          console.log('🔄 WalletConnect mobile detectado: orientando usuário...')
          
          // Em vez de tentar a transação, orientar o usuário
          const metamaskUrl = `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`
          
          setError(`
            📱 Para completar a compra no mobile:
            
            1️⃣ Abra o app MetaMask
            2️⃣ Toque no ícone do browser (🌐)
            3️⃣ Acesse: hanumanwatertoken.com.br
            4️⃣ Vá para checkout e conecte sua carteira
            5️⃣ Clique em "Buy Tokens"
            
            Ou clique no botão abaixo para abrir diretamente:
          `)
          
          // Criar um botão especial na interface
          setTimeout(() => {
            const errorDiv = document.querySelector('.error-message')
            if (errorDiv) {
              const button = document.createElement('button')
              button.innerHTML = '🚀 Abrir no MetaMask App'
              button.className = 'mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium'
              button.onclick = () => {
                window.open(metamaskUrl, '_blank')
              }
              errorDiv.appendChild(button)
            }
          }, 100)
          
          setIsLoading(false)
          return
          
        } else {
          // Executar transação normal (desktop ou MetaMask mobile browser)
          const tx = await presaleContract.buyWithETH(txConfig)
          console.log('✅ Transação enviada:', tx.hash)
          
          // Aguardar confirmação
          const receipt = await tx.wait()
          console.log('✅ Transação confirmada:', receipt)
        }

        setSuccess(true);
        window.dispatchEvent(new Event('hwt-balance-updated'))
      }
    } catch (error) {
      console.error("Erro ao comprar tokens com ETH:", error)
      
      // Se é mobile e o erro pode ser relacionado ao MetaMask não estar acessível
      const isMobile = /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)
      const errorMessage = (error as any)?.message?.toLowerCase() || ''
      
      if (isMobile && (
        errorMessage.includes('user rejected') || 
        errorMessage.includes('user denied') ||
        errorMessage.includes('metamask') ||
        !window.ethereum?.isMetaMask
      )) {
        console.log('🔗 Erro de acesso MetaMask mobile, tentando deep link...')
        
        // Tentar abrir MetaMask via deep link
        const metamaskDeepLink = `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`
        
        setError(`Para completar a transação, abra este link no MetaMask: ${metamaskDeepLink}`)
        
        // Tentar abrir automaticamente
        setTimeout(() => {
          window.open(metamaskDeepLink, '_blank')
        }, 1000)
      } else {
        setError("Erro ao processar a compra. Por favor, tente novamente.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Função para comprar tokens com USDT
  const buyWithUSDT = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        setIsLoading(true)
        setError(null)

        // Verificar se os contratos estão configurados
        if (!checkContractAddresses()) {
          setIsLoading(false)
          return
        }

        // Verificar e trocar para a rede correta
        const networkOk = await checkAndSwitchNetwork()
        if (!networkOk) {
          setIsLoading(false)
          return
        }

        if (!window.ethereum) throw new Error(t('metaMaskNotFound'))
      const provider = new ethers.providers.Web3Provider(window.ethereum as any)
        const signer = provider.getSigner()

        // Calcular valor em USDT (1:1 com USD)
        const usdtValue = Number.parseFloat(usdAmount)

        // Criar contratos
        const usdtContract = new ethers.Contract(USDT_ADDRESS, USDT_ABI, signer)
        const presaleContract = new ethers.Contract(PRESALE_ADDRESS, PRESALE_ABI, signer)

        // Verificar allowance
        const allowance = await usdtContract.allowance(address, PRESALE_ADDRESS)
        const usdtAmount = ethers.utils.parseUnits(usdtValue.toString(), 6) // USDT tem 6 casas decimais

        // Se necessário, aprovar o contrato para gastar USDT
        if (allowance.lt(usdtAmount)) {
          const approveTx = await usdtContract.approve(PRESALE_ADDRESS, usdtAmount)
          await approveTx.wait()
        }

        // Executar a compra
        const tx = await presaleContract.buyWithUSDT(usdtAmount)
        await tx.wait()

        setSuccess(true);
window.dispatchEvent(new Event('hwt-balance-updated'))
      }
    } catch (error) {
      console.error("Erro ao comprar tokens com USDT:", error)
      setError("Erro ao processar a compra. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  // Função para processar pagamento com PIX
  const processPixPayment = () => {
    // Em produção, isso geraria um código PIX real
    setPixCode(
      "00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426655440000520400005303986540510.005802BR5913Hanuman Water6008Sao Paulo62070503***63041234",
    )

    // Simular processamento
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  // Função para processar pagamento com cartão de crédito
  const processCreditCardPayment = () => {
    // Validar dados do cartão
    if (!cardNumber || !cardName || !cardExpiry || !cardCVC) {
      setError("Por favor, preencha todos os campos do cartão.")
      return
    }

    // Em produção, isso processaria o pagamento com cartão
    setIsLoading(true)

    // Simular processamento
    setTimeout(() => {
      setIsLoading(false)
      setSuccess(true);
window.dispatchEvent(new Event('hwt-balance-updated'))
    }, 2000)
  }

  const MIN_TOKENS = 10;

  // Função para processar o pagamento com base no método selecionado
  const processPayment = () => {
    console.log('🔄 processPayment chamado:', {
      paymentMethod,
      tokenAmount,
      isConnected,
      address,
      balanceData: balanceData?.formatted,
      hasSelectedQuantity
    })
    
    setError(null)

    // Validação do valor mínimo
    if (Number(tokenAmount) < MIN_TOKENS) {
      setError(`A quantidade mínima para compra é ${MIN_TOKENS} tokens.`)
      return;
    }

    switch (paymentMethod) {
      case "eth":
        buyWithETH()
        break
      case "usdt":
        buyWithUSDT()
        break
      case "social":
        // Para pagamento social, usar ETH se houver saldo
        if (balanceData && Number(balanceData.formatted) > 0) {
          buyWithETH()
        } else {
          setError("Saldo insuficiente. Adicione ETH à sua carteira primeiro.")
        }
        break
      case "pix":
        processPixPayment()
        break
      case "credit_card":
        processCreditCardPayment()
        break
      default:
        setError("Método de pagamento inválido.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-logoBg">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-logoBg/95 backdrop-blur supports-[backdrop-filter]:bg-logoBg/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logos/hwt-logo.png"
              alt="Logo do Hanuman Water Token"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-xl font-bold text-primary">HWT</span>
          </div>
          <Link href={`/${locale}`} className="flex items-center text-sm font-medium hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToHome')}
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container px-4">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  hasSelectedQuantity && tokenAmount && Number(tokenAmount) > 0 ? 'bg-green-500 text-white' : 'bg-primary text-white'
                }`}>
                  {hasSelectedQuantity && tokenAmount && Number(tokenAmount) > 0 ? '✓' : '1'}
                </div>
                <span className="ml-2 text-sm font-medium">{t('selectQuantity')}</span>
              </div>
              
              <div className={`h-0.5 w-16 ${hasSelectedQuantity && tokenAmount && Number(tokenAmount) > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  hasSelectedQuantity && tokenAmount && Number(tokenAmount) > 0 && !isConnected ? 'bg-primary text-white' : 
                  isConnected ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {isConnected ? '✓' : '2'}
                </div>
                <span className="ml-2 text-sm font-medium">{t('connectWallet')}</span>
              </div>
              
              <div className={`h-0.5 w-16 ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  success ? 'bg-green-500 text-white' : 
                  isConnected && hasSelectedQuantity && tokenAmount && Number(tokenAmount) > 0 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {success ? '✓' : '3'}
                </div>
                <span className="ml-2 text-sm font-medium">{t('confirmation')}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">{t('title')}</h1>
            <p className="mt-2 text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>

          {success ? (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 rounded-full bg-green-100 p-3">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary mb-2">{t('purchaseSuccess')}</h2>
                  <p className="text-muted-foreground mb-6">
                    {t('purchaseSuccessMessage').replace('{amount}', tokenAmount)}
                  </p>
                  <Button
                    className="mb-6"
                    variant="secondary"
                    onClick={async () => {
                      if (window.ethereum) {
                        try {
                          await window.ethereum.request({
                            method: 'wallet_watchAsset',
                            params: {
                              type: 'ERC20',
                              options: {
                                address: TOKEN_CONTRACT_ADDRESS,
                                symbol: 'HWT',
                                decimals: 18,
                              },
                            },
                          } as any);
                        } catch (err) {
                          alert(t('errorAddingToken'));
                        }
                      } else {
                        alert(t('metaMaskNotFound'));
                      }
                    }}
                  >
                    {t('addToMetaMask')}
                  </Button>
                  <div className="flex gap-4">
                    <Button asChild>
                      <Link href={`/${locale}`}>{t('backToHome')}</Link>
                    </Button>
                    <Button variant="outline" onClick={() => setSuccess(false)}>
                      {t('makeAnotherPurchase')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>{t('purchaseDetails')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-4">
                        <Label htmlFor="token-amount">{t('tokenQuantity')}</Label>
                        
                        {/* Pacotes Pré-definidos */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                          <button
                            onClick={() => handleTokenAmountChange("100")}
                            className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                              tokenAmount === "100" 
                                ? "border-primary bg-primary/10 text-primary" 
                                : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                            }`}
                          >
                            <div className="text-center">
                              <div className="font-bold text-lg">100 HWT</div>
                              <div className="text-xs text-muted-foreground">Starter</div>
                              <div className="text-sm font-medium">$200</div>
                            </div>
                          </button>
                          
                          <button
                            onClick={() => handleTokenAmountChange("500")}
                            className={`p-3 rounded-lg border-2 transition-all duration-300 relative ${
                              tokenAmount === "500" 
                                ? "border-primary bg-primary/10 text-primary" 
                                : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                            }`}
                          >
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              Popular
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-lg">500 HWT</div>
                              <div className="text-xs text-muted-foreground">Standard</div>
                              <div className="text-sm font-medium">$1,000</div>
                            </div>
                          </button>
                          
                          <button
                            onClick={() => handleTokenAmountChange("1000")}
                            className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                              tokenAmount === "1000" 
                                ? "border-primary bg-primary/10 text-primary" 
                                : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                            }`}
                          >
                            <div className="text-center">
                              <div className="font-bold text-lg">1000 HWT</div>
                              <div className="text-xs text-muted-foreground">Premium</div>
                              <div className="text-sm font-medium">$2,000</div>
                            </div>
                          </button>
                        </div>
                        
                        <Input
                          id="token-amount"
                          type="number"
                          min="1"
                          value={tokenAmount}
                          onChange={(e) => handleTokenAmountChange(e.target.value)}
                          className="text-lg"
                          placeholder="Ou digite uma quantidade personalizada"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t('valueInUSD')}</Label>
                          <div className="p-2 border rounded-md bg-muted">
                            <span className="text-lg font-medium">${usdAmount}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>{t('equivalentWater')}</Label>
                          <div className="p-2 border rounded-md bg-muted">
                            <span className="text-lg font-medium">{waterAmount} {t('liters')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <div className="rounded-md bg-muted p-4">
                          <div className="flex">
                            <AlertCircle className="h-5 w-5 text-primary mr-3" />
                            <div>
                              <p className="text-sm text-muted-foreground">
                                {t('waterRedemptionNote')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>{t('paymentMethod')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full space-y-6">
                      {/* Seção 1: Carteiras Crypto */}
                      <div className="border rounded-lg p-4">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            💰 {t('cryptoWallets')}
                          </h3>
                          <p className="text-sm text-muted-foreground">{t('cryptoWalletsDescription')}</p>
                        </div>
                        
                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                          <div className="flex items-center space-x-2 border rounded-md p-3">
                            <RadioGroupItem value="eth" id="eth" />
                            <Label htmlFor="eth" className="flex-1 cursor-pointer">
                              <div className="flex justify-between items-center">
                                <span>Ethereum (ETH)</span>
                                {isConnected && balanceData && paymentMethod === 'eth' && (
                                  <span className="text-sm text-muted-foreground">
                                    {t('balance')}: {Number.parseFloat(balanceData.formatted).toFixed(4)} ETH
                                  </span>
                                )}
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                        
                        {paymentMethod === 'eth' && (
                          <div className="mt-4">
                            {!isConnected ? (
                              <div className="space-y-3">
                                {/MetaMask/i.test(navigator.userAgent) && window.ethereum?.isMetaMask && /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) ? (
                                  <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-3">
                                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                                      <p className="text-sm font-bold text-green-800">🎉 MetaMask Detectado!</p>
                                    </div>
                                    <p className="text-xs text-green-700 mb-3">
                                      Conectando diretamente com sua carteira MetaMask...
                                    </p>
                                    <div className="space-y-2">
                                      <Button 
                                        onClick={async () => {
                                          try {
                                            if (window.ethereum) {
                                              const accounts = await window.ethereum.request({ 
                                                method: 'eth_requestAccounts' 
                                              })
                                              if (accounts?.length > 0) {
                                                window.location.reload()
                                              }
                                            }
                                          } catch (error) {
                                            console.error('Erro ao conectar:', error)
                                          }
                                        }}
                                        className="w-full text-xs bg-green-600 hover:bg-green-700"
                                        size="sm"
                                      >
                                        🚀 Conectar Agora
                                      </Button>
                                      <Button 
                                        onClick={connectCryptoWallet} 
                                        variant="outline" 
                                        size="sm" 
                                        className="w-full text-xs"
                                      >
                                        🔗 Usar WalletConnect
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <Button onClick={connectCryptoWallet} className="w-full" disabled={isLoading}>
                                    {isLoading ? t('connecting') : `🔗 ${t('connectCryptoWallet')}`}
                                  </Button>
                                )}
                                
                                {/Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) && (
                                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                    <p className="text-sm font-bold text-amber-800">⚠️ Importante para Mobile:</p>
                                    <p className="text-xs text-amber-700 mt-2 leading-relaxed">
                                      Para comprar tokens no mobile, você precisa usar o <strong>browser do MetaMask</strong>, não o browser normal.
                                    </p>
                                    <div className="mt-3 p-3 bg-white rounded border border-amber-200">
                                      <p className="text-xs font-medium text-amber-800 mb-2">📱 Como fazer:</p>
                                      <p className="text-xs text-amber-700 leading-relaxed">
                                        1. Abra o <strong>app MetaMask</strong><br/>
                                        2. Toque no ícone do <strong>browser (🌐)</strong><br/>
                                        3. Digite: <strong>hanumanwatertoken.com.br</strong><br/>
                                        4. Vá para checkout e conecte sua carteira<br/>
                                        5. Clique em "Buy Tokens" (funcionará perfeitamente)
                                      </p>
                                    </div>
                                    <Button 
                                      onClick={() => {
                                        const url = `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`
                                        window.open(url, '_blank')
                                      }}
                                      className="mt-3 w-full text-xs bg-amber-600 hover:bg-amber-700"
                                      size="sm"
                                    >
                                      🚀 Abrir no Browser MetaMask
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                                  <p className="text-sm font-medium text-green-800">{t('walletConnected')}</p>
                                  <p className="text-xs text-green-600 mt-1 font-mono">
                                    {address?.slice(0, 6)}...{address?.slice(-4)}
                                  </p>
                                </div>
                                
                                {balanceData && Number(balanceData.formatted) === 0 && (
                                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                    <p className="text-sm font-medium text-yellow-800">⚠️ {t('insufficientBalance')}</p>
                                    <p className="text-xs text-yellow-600 mt-1">
                                      Você precisa adicionar <strong>ETH</strong> à sua carteira para comprar tokens.
                                    </p>
                                    <Button 
                                      onClick={() => open({ view: 'OnRampProviders' })} 
                                      variant="outline" 
                                      size="sm"
                                      className="mt-2 w-full"
                                    >
                                      💳 Comprar <strong>ETH</strong> com PIX ou Cartão
                                    </Button>
                                    <p className="text-xs text-yellow-600 mt-2 italic">
                                      💡 {t.rich('recommendedMeld', {
                                        strong: (chunks) => <strong>{chunks}</strong>
                                      })}
                                    </p>
                                  </div>
                                )}
                                
                                {/Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) && !window.ethereum?.isMetaMask ? (
                                  <div className="space-y-3">
                                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                                      <p className="text-sm font-medium text-orange-800">📱 Conectado via WalletConnect</p>
                                      <p className="text-xs text-orange-600 mt-1">
                                        Para comprar tokens no mobile, use o browser do MetaMask diretamente.
                                      </p>
                                    </div>
                                    <Button 
                                      onClick={() => {
                                        const url = `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`
                                        window.open(url, '_blank')
                                      }}
                                      className="w-full bg-orange-600 hover:bg-orange-700"
                                    >
                                      🚀 Continuar no MetaMask App
                                    </Button>
                                    <Button onClick={() => disconnect()} variant="outline" className="w-full">
                                      {t('disconnect')}
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex gap-2">
                                    <Button 
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        console.log('🔘 Crypto Buy Tokens button clicked')
                                        processPayment()
                                      }} 
                                      className="flex-1 bg-primary" 
                                      disabled={isLoading}
                                      type="button"
                                    >
                                      {isLoading ? t('processing') : t('buyTokens')}
                                    </Button>
                                    <Button onClick={() => disconnect()} variant="outline" className="px-4" type="button">
                                      {t('disconnect')}
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Seção 2: Pagamento Tradicional */}
                      <div className="border rounded-lg p-4">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            💳 {t('traditionalPayment')}
                          </h3>
                          <p className="text-sm text-muted-foreground">{t('traditionalPaymentDescription')}</p>
                        </div>
                        
                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                          <div className="flex items-center space-x-2 border rounded-md p-3">
                            <RadioGroupItem value="social" id="social" />
                            <Label htmlFor="social" className="flex-1 cursor-pointer">
                              <div className="flex justify-between items-center">
                                <span>{t('pixCreditCard')}</span>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {t('viaEmailGoogle')}
                                </span>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                        
                        {paymentMethod === 'social' && (
                          <div className="mt-4">
                            {!isConnected ? (
                              <div className="space-y-3">
                                <Button onClick={connectSocialWallet} className="w-full" disabled={isLoading}>
                                  {isLoading ? t('connecting') : `📧 ${t('connectEmailGoogle')}`}
                                </Button>
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                                  <p className="text-sm font-medium text-blue-800">💡 {t('howItWorks')}</p>
                                  <p className="text-xs text-blue-600 mt-1">
                                    {t('howItWorksDescription')}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                                  <p className="text-sm font-medium text-green-800">{t('connected')}</p>
                                  <p className="text-xs text-green-600 mt-1">
                                    {t('connectedDescription')}
                                  </p>
                                </div>

                                {/* Aviso de saldo insuficiente */}
                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                  <p className="text-sm font-medium text-yellow-800 flex items-center gap-2">
                                    ⚠️ {t('insufficientBalance')}
                                  </p>
                                  <p className="text-xs text-yellow-700 mt-1">
                                    Você precisa adicionar <strong>ETH</strong> à sua carteira para comprar tokens.
                                  </p>
                                  <div className="mt-2">
                                    <p className="text-xs font-medium text-yellow-800">
                                      💳 Comprar <strong>ETH</strong> com PIX ou Cartão
                                    </p>
                                    <p className="text-xs text-yellow-700 mt-1">
                                      💡 Recomendado: Use <strong>Meld.io</strong> (Coinbase temporariamente indisponível)
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex gap-2">
                                  {balanceData && Number(balanceData.formatted) > 0 ? (
                                    <Button 
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        console.log('🔘 Buy Tokens button clicked')
                                        processPayment()
                                      }} 
                                      className="flex-1 bg-primary" 
                                      disabled={isLoading}
                                      type="button"
                                    >
                                      {isLoading ? t('processing') : t('buyTokens')}
                                    </Button>
                                  ) : (
                                    <Button 
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        console.log('🔘 OnRamp button clicked')
                                        open({ view: 'OnRampProviders' })
                                      }} 
                                      className="flex-1 bg-primary" 
                                      disabled={isLoading}
                                      type="button"
                                    >
                                      {isLoading ? t('processing') : `💳 ${t('payWithPixCard')}`}
                                    </Button>
                                  )}
                                  <Button onClick={() => disconnect()} variant="outline" className="px-4" type="button">
                                    {t('disconnect')}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {error && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>{t('errorTitle')}</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-primary/20 bg-logoBg">
        <div className="container px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Image
                src="/images/logos/hwt-logo.png"
                alt="Logo do Hanuman Water Token"
                width={30}
                height={30}
                className="rounded-full"
              />
              <span className="text-lg font-bold text-primary">HWT</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} HanumanWater Token. {t('allRightsReserved')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

