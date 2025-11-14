"use client"

import { useState, useEffect } from "react"
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

export default function CheckoutPage() {
  const t = useTranslations('checkout');
  
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
  const [usdtBalance, setUsdtBalance] = useState<string>("0")
  const [pixCode, setPixCode] = useState<string>("")

  // Dados do cartão de crédito
  const [cardNumber, setCardNumber] = useState<string>("")
  const [cardName, setCardName] = useState<string>("")
  const [cardExpiry, setCardExpiry] = useState<string>("")
  const [cardCVC, setCardCVC] = useState<string>("")

  // Efeito para atualizar saldos quando conectar
  useEffect(() => {
    if (isConnected && address) {
      // Limpar erro ao conectar
      setError(null)
      getBalances(address)
    }
  }, [isConnected, address])

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
        setError("Você precisa aceitar a troca de rede para Ethereum Mainnet no MetaMask")
      } else {
        setError("Por favor, conecte-se à rede Ethereum Mainnet")
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

  // Função para comprar tokens com ETH
  const buyWithETH = async () => {
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

        if (!window.ethereum) throw new Error("MetaMask não encontrado")
        const provider = new ethers.providers.Web3Provider(window.ethereum as any)
        const signer = provider.getSigner()
        const presaleContract = new ethers.Contract(PRESALE_ADDRESS, [
          ...PRESALE_ABI,
          "function getEthAmountForTokens(uint256 tokenAmount) public view returns (uint256)"
        ], signer)

        // Calcular o valor exato de ETH a partir do contrato
        const tokenAmount18 = ethers.utils.parseUnits(tokenAmount, 18)
        const ethAmount = await presaleContract.getEthAmountForTokens(tokenAmount18)

        // Executar transação
        const tx = await presaleContract.buyWithETH({
          value: ethAmount,
        })

        // Aguardar confirmação
        await tx.wait()

        setSuccess(true);
        window.dispatchEvent(new Event('hwt-balance-updated'))
      }
    } catch (error) {
      console.error("Erro ao comprar tokens com ETH:", error)
      setError("Erro ao processar a compra. Por favor, tente novamente.")
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

        if (!window.ethereum) throw new Error("MetaMask não encontrado")
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
              src="/hwt-logo.png"
              alt="Logo do Hanuman Water Token"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-xl font-bold text-primary">HWT</span>
          </div>
          <Link href="/" className="flex items-center text-sm font-medium hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToHome')}
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container px-4">
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
                      <Link href="/">{t('backToHome')}</Link>
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
                      <div className="space-y-2">
                        <Label htmlFor="token-amount">{t('tokenQuantity')}</Label>
                        <Input
                          id="token-amount"
                          type="number"
                          min="1"
                          value={tokenAmount}
                          onChange={(e) => handleTokenAmountChange(e.target.value)}
                          className="text-lg"
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
                            💰 Carteiras Crypto
                          </h3>
                          <p className="text-sm text-muted-foreground">MetaMask, WalletConnect, Coinbase Wallet, etc.</p>
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
                              <Button onClick={connectCryptoWallet} className="w-full" disabled={isLoading}>
                                {isLoading ? t('connecting') : '🔗 Conectar Carteira Crypto'}
                              </Button>
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
                                    <p className="text-sm font-medium text-yellow-800">⚠️ Saldo insuficiente</p>
                                    <p className="text-xs text-yellow-600 mt-1">
                                      Você precisa adicionar ETH à sua carteira para comprar tokens.
                                    </p>
                                    <Button 
                                      onClick={() => open({ view: 'OnRampProviders' })} 
                                      variant="outline" 
                                      size="sm"
                                      className="mt-2 w-full"
                                    >
                                      💳 Comprar ETH com Cartão
                                    </Button>
                                    <p className="text-xs text-yellow-600 mt-2 italic">
                                      💡 Recomendado: Use <strong>Meld.io</strong> (Coinbase temporariamente indisponível)
                                    </p>
                                  </div>
                                )}
                                
                                <div className="flex gap-2">
                                  <Button onClick={processPayment} className="flex-1 bg-primary" disabled={isLoading}>
                                    {isLoading ? t('processing') : t('buyTokens')}
                                  </Button>
                                  <Button onClick={() => disconnect()} variant="outline" className="px-4">
                                    {t('disconnect')}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Seção 2: Pagamento Tradicional */}
                      <div className="border rounded-lg p-4">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            💳 Pagamento Tradicional
                          </h3>
                          <p className="text-sm text-muted-foreground">PIX, Cartão de Crédito via Email/Google/Redes Sociais</p>
                        </div>
                        
                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                          <div className="flex items-center space-x-2 border rounded-md p-3">
                            <RadioGroupItem value="social" id="social" />
                            <Label htmlFor="social" className="flex-1 cursor-pointer">
                              <div className="flex justify-between items-center">
                                <span>PIX / Cartão de Crédito</span>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  Via Email/Google
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
                                  {isLoading ? t('connecting') : '📧 Conectar com Email/Google'}
                                </Button>
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                                  <p className="text-sm font-medium text-blue-800">💡 Como funciona?</p>
                                  <p className="text-xs text-blue-600 mt-1">
                                    Conecte com seu email ou conta Google para acessar opções de pagamento com PIX e cartão de crédito.
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                                  <p className="text-sm font-medium text-green-800">Conectado!</p>
                                  <p className="text-xs text-green-600 mt-1">
                                    Agora você pode pagar com PIX ou cartão de crédito.
                                  </p>
                                </div>
                                
                                <div className="flex gap-2">
                                  <Button onClick={processPayment} className="flex-1 bg-primary" disabled={isLoading}>
                                    {isLoading ? t('processing') : '💳 Pagar com PIX/Cartão'}
                                  </Button>
                                  <Button onClick={() => disconnect()} variant="outline" className="px-4">
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
                src="/hwt-logo.png"
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

