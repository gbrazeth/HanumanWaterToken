"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from 'next-intl'
import { TOKEN_ABI, TOKEN_CONTRACT_ADDRESS } from "@/config/contract";
import { NETWORK_CONFIG } from "@/config/contract";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Droplet, Shield, Users, ChevronRight, ArrowRight, Star, Percent, CalendarDays, Gift, Leaf } from "lucide-react"
import { AuthDialog } from "@/components/auth-dialog"
import { LanguageSwitcher } from "@/components/language-switcher"
// Primeiro, vamos adicionar o import para o DropdownMenu
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogOut, User } from "lucide-react"

const scrollToSection = (elementId: string, offset = 80) => {
  const element = document.getElementById(elementId)
  if (element) {
    const bodyRect = document.body.getBoundingClientRect().top
    const elementRect = element.getBoundingClientRect().top
    const elementPosition = elementRect - bodyRect
    const offsetPosition = elementPosition - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    })
  }
}

export default function LandingPage() {
  const t = useTranslations();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMoreFaqs, setShowMoreFaqs] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [tokenBalance, setTokenBalance] = useState("0")

  // Verificar se o usuário já está logado ao carregar a página
  const fetchTokenBalance = async (identifier: string) => {
    try {
      // Importar ethers dinamicamente apenas no cliente
      const { ethers } = await import('ethers')

      // Se o identificador for um endereço Ethereum válido
      if (ethers.utils.isAddress(identifier)) {
        let provider;
        if (typeof window !== 'undefined' && (window as any).ethereum) {
          provider = new ethers.providers.Web3Provider((window as any).ethereum);
        } else {
          provider = new ethers.providers.JsonRpcProvider(NETWORK_CONFIG.rpcUrls[0]);
        }
        const contract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_ABI, provider)

        // Buscar o saldo e os decimais do token
        const [balance, decimals] = await Promise.all([
          contract.balanceOf(identifier),
          contract.decimals()
        ])

        // Formatar o saldo considerando os decimais
        const formattedBalance = ethers.utils.formatUnits(balance, decimals)
        return formattedBalance
      } else {
        // Se não for um endereço (ex: email), retorna 0
        // TODO: Implementar mapeamento de email para endereço se necessário
        return "0"
      }
    } catch (error) {
      console.error("Erro ao buscar saldo de tokens:", error)
      return "0"
    }
  }

  useEffect(() => {
    const authToken = localStorage.getItem("hwt-auth-token")
    if (authToken) {
      try {
        const tokenData = JSON.parse(authToken)
        // Verificar se o token não expirou (opcional - 7 dias)
        const expirationTime = 7 * 24 * 60 * 60 * 1000 // 7 dias em milissegundos
        if (Date.now() - tokenData.timestamp < expirationTime) {
          setIsLoggedIn(true)
        } else {
          // Token expirado, remover
          localStorage.removeItem("hwt-auth-token")
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
        localStorage.removeItem("hwt-auth-token")
      }
    }

    // Função para obter o endereço conectado na MetaMask
    const getConnectedAddress = async (): Promise<string | null> => {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            return accounts[0];
          }
        } catch (e) {
          // Silenciar
        }
      }
      return null;
    };

    // Atualiza saldo ao receber evento de compra ou ao carregar
    const updateBalance = async () => {
      let address = await getConnectedAddress();
      if (address) {
        const balance = await fetchTokenBalance(address);
        setTokenBalance(balance);
      } else {
        // fallback: método antigo (email ou auth-token)
        const authToken = localStorage.getItem("hwt-auth-token");
        if (authToken) {
          try {
            const tokenData = JSON.parse(authToken);
            const identifier = tokenData.address || tokenData.email;
            const balance = await fetchTokenBalance(identifier);
            setTokenBalance(balance);
          } catch (error) {
            console.error("Erro ao atualizar saldo após compra:", error);
          }
        }
      }
    };

    // Atualizar saldo ao carregar a página
    updateBalance();
    // Atualizar saldo ao receber evento customizado
    window.addEventListener('hwt-balance-updated', updateBalance);
    return () => {
      window.removeEventListener('hwt-balance-updated', updateBalance);
    };
  }, [])

  const handleLoginSuccess = async () => {
    setIsLoggedIn(true)
    // Buscar o saldo de tokens quando o usuário fizer login
    const authToken = localStorage.getItem("hwt-auth-token")
    if (authToken) {
      try {
        const tokenData = JSON.parse(authToken)
        // Se for uma carteira Metamask, usa o endereço da carteira
        // Se for login por email/Google, usa o email como identificador
        const identifier = tokenData.address || tokenData.email
        const balance = await fetchTokenBalance(identifier)
        setTokenBalance(balance)
      } catch (error) {
        console.error("Erro ao buscar saldo inicial:", error)
      }
    }
  }

  // Agora, vamos adicionar a função handleLogout logo após a função handleLoginSuccess
  const handleLogout = () => {
    // Verificar se o usuário está conectado via Metamask
    if (typeof window.ethereum !== "undefined") {
      // Não há um método direto para "desconectar" do Metamask,
      // mas podemos limpar o estado da aplicação
      console.log("Desconectando da carteira Metamask")
    }

    // Limpar qualquer token ou sessão armazenada
    localStorage.removeItem("hwt-auth-token")

    // Atualizar o estado para desconectado
    setIsLoggedIn(false)

    console.log("Usuário desconectado com sucesso")
  }

  return (
    <div className="flex min-h-screen flex-col bg-logoBg">
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
    {/* Menu desktop */}
    <nav className="hidden md:flex gap-6">
            <Link
              href="#nossa-fonte-de-agua"
              className="text-sm font-medium hover:text-primary"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("nossa-fonte-de-agua")
              }}
            >
              {t('navigation.about')}
            </Link>
            <Link
              href="#benefits"
              className="text-sm font-medium hover:text-primary"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("benefits")
              }}
            >
              {t('navigation.benefits')}
            </Link>
            <Link
              href="#tokenomics"
              className="text-sm font-medium hover:text-primary"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("tokenomics", 120)
              }}
            >
              {t('navigation.tokenomics')}
            </Link>
            <Link
              href="#roadmap"
              className="text-sm font-medium hover:text-primary"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("roadmap")
              }}
            >
              {t('navigation.roadmap')}
            </Link>
            <a
              href="https://etherscan.io/address/0x86C064635a535Aa681fD5c58ffa3639bD2d09fF8"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:text-primary"
            >
              {t('navigation.hwtContract')}
            </a>
            <a
              href="https://etherscan.io/address/0x67A506934aA8Bb00E92a706Ba40c373F6269B44d"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:text-primary"
            >
              {t('navigation.presaleContract')}
            </a>
            <Link
              href="#faq"
              className="text-sm font-medium hover:text-primary"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("faq")
              }}
            >
              {t('navigation.faq')}
            </Link>
          </nav>
    <div className="flex items-center gap-2">
      {/* Language Switcher */}
      <LanguageSwitcher />
      
      {/* Botão hamburguer mobile */}
      <button
        className="md:hidden flex items-center px-2 py-1"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Abrir menu"
      >
        <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      {/* Login/Account Button */}
      {isLoggedIn ? (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2">
            <User className="h-4 w-4" />
            Conta Conectada ({Number(tokenBalance) % 1 === 0 ? Number(tokenBalance) : Number(tokenBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })} HWT)
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="h-4 w-4 mr-2" />
            {t('navigation.logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ) : (
      <Button className="bg-primary hover:bg-primary/90 ml-2" onClick={() => setAuthDialogOpen(true)}>
        {t('navigation.login')}
      </Button>
    )}
    </div>
  </div>
  {/* Menu mobile */}
  {menuOpen && (
    <nav className="flex flex-col md:hidden bg-white/95 shadow-md px-4 py-2 z-50 absolute w-full left-0 top-16 border-b">
      <Link href="#nossa-fonte-de-agua" className="py-2 border-b text-primary font-medium" onClick={e => {e.preventDefault(); setMenuOpen(false); scrollToSection('nossa-fonte-de-agua')}}>{t('navigation.about')}</Link>
      <Link href="#benefits" className="py-2 border-b text-primary font-medium" onClick={e => {e.preventDefault(); setMenuOpen(false); scrollToSection('benefits')}}>{t('navigation.benefits')}</Link>
      <Link href="#tokenomics" className="py-2 border-b text-primary font-medium" onClick={e => {e.preventDefault(); setMenuOpen(false); scrollToSection('tokenomics', 120)}}>{t('navigation.tokenomics')}</Link>
      <Link href="#roadmap" className="py-2 border-b text-primary font-medium" onClick={e => {e.preventDefault(); setMenuOpen(false); scrollToSection('roadmap')}}>{t('navigation.roadmap')}</Link>
      <a href="https://etherscan.io/address/0x86C064635a535Aa681fD5c58ffa3639bD2d09fF8" target="_blank" rel="noopener noreferrer" className="py-2 border-b text-primary font-medium">{t('navigation.hwtContract')}</a>
      <a href="https://etherscan.io/address/0x67A506934aA8Bb00E92a706Ba40c373F6269B44d" target="_blank" rel="noopener noreferrer" className="py-2 border-b text-primary font-medium">{t('navigation.presaleContract')}</a>
      <Link href="#faq" className="py-2 border-b text-primary font-medium" onClick={e => {e.preventDefault(); setMenuOpen(false); scrollToSection('faq')}}>{t('navigation.faq')}</Link>
    </nav>
  )}
</header>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} onLoginSuccess={handleLoginSuccess} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-02-11%2019.39.57%20-%20A%20futuristic%20water%20reservoir%20representing%20the%20Hanuman%20Water%20Token%20(HWT)%20water%20source,%20prominently%20displaying%20the%20HWT%20token%20branding.%20The%20structure%20is%20-xyhrFL0mgi0EGbO4awnEkE5wOnOeHP.webp"
              alt="HWT Futuristic Water Facility"
              width={1920}
              height={800}
              className="object-cover w-full h-full opacity-20"
            />
          </div>
          <div className="container relative px-4 py-24 md:py-32">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="mb-6">
                  <Image
                    src="/hwt-logo.png"
                    alt="Logo do Hanuman Water Token"
                    width={120}
                    height={120}
                    className="mb-6"
                  />
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary">
                  {t('hero.title')}
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  {t('hero.description')}
                </p>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 flex-1 sm:flex-none min-w-[140px]" asChild>
                    <Link href="/checkout">
                      {t('hero.cta.buyNow')} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary text-primary hover:bg-primary/10 flex-1 sm:flex-none min-w-[140px]"
                    onClick={() => scrollToSection("nossa-fonte-de-agua")}
                  >
                    {t('hero.cta.learnMore')}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto"
                    asChild
                  >
                    <Link href="https://hanumanwater.com" target="_blank" rel="noopener noreferrer">
                      Site Institucional
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-02-11%2019.39.57%20-%20A%20futuristic%20water%20reservoir%20representing%20the%20Hanuman%20Water%20Token%20(HWT)%20water%20source,%20prominently%20displaying%20the%20HWT%20token%20branding.%20The%20structure%20is%20-axQPVyW3jf0Cf7UlwYOEii7HfaQbHx.webp"
                  alt="HWT Futuristic Water Processing Facility"
                  width={500}
                  height={500}
                  className="rounded-lg object-cover shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Water Source Section */}
        <section className="py-16 md:py-24 bg-white" id="nossa-fonte-de-agua">
          <div className="container px-4">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div>
                <Image
                  src="/images/jazida/DJI_0848.JPG"
                  alt="Fonte de água Hanuman com casa de bombas e névoa"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter text-primary">{t('about.title')}</h2>
                <p className="text-muted-foreground">
                  {t('about.description1')}
                </p>
                <p className="text-muted-foreground">
                  {t('about.description2')}
                </p>
                <div className="mt-8 p-6 max-w-2xl mx-auto" style={{ backgroundColor: '#f4f8fb' }}>

                  <h3 className="text-xl font-bold text-primary">
                    {t('about.presaleBox.title')}
                  </h3>
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      {t('about.presaleBox.price')}
                    </p>
                    <div className="space-y-1">
                      <p className="font-medium">{t('about.presaleBox.launchTitle')}</p>
                      <p className="text-muted-foreground">{t('about.presaleBox.period')}</p>
                      <p className="text-muted-foreground">{t('about.presaleBox.goal')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container px-4 py-16 md:py-24 bg-logoBg" id="about">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-02-11%2020.05.53%20-%20A%20futuristic%20and%20modern%20digital%20representation%20of%20Hanuman%20Water%20Token%20(HWT).%20The%20image%20features%20a%20glowing%20HWT%20logo%20with%20blockchain-inspired%20elements,%20-S7LICV75NEyBcYeYL8iRXipId5doVp.webp"
                  alt="HWT Real World Asset"
                  fill
                  className="object-cover opacity-20"
                />
              </div>
              <CardContent className="relative p-6 z-10">
                <Droplet className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2 text-primary">{t('about.features.realWorldAsset.title')}</h3>
                <p className="text-muted-foreground">
                  {t('about.features.realWorldAsset.description')}
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-02-11%2020.05.56%20-%20A%20high-tech%20futuristic%20concept%20of%20Hanuman%20Water%20Token%20(HWT)%20showcasing%20water%20tokenization.%20The%20scene%20features%20a%20digital%20water%20reservoir%20with%20a%20hologra-AASx5a6BnGhardcESvkTTfiGMWgTTD.webp"
                  alt="HWT Transparency"
                  fill
                  className="object-cover opacity-20"
                />
              </div>
              <CardContent className="relative p-6 z-10">
                <Shield className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2 text-primary">{t('about.features.transparency.title')}</h3>
                <p className="text-muted-foreground">
                  {t('about.features.transparency.description')}
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-02-11%2020.06.08%20-%20A%20visually%20stunning%20landing%20page%20background%20for%20Hanuman%20Water%20Token%20(HWT).%20The%20design%20includes%20a%20sleek%20futuristic%20interface%20with%20a%20glowing%20HWT%20token%20a-tGETO5jKJiT13C2KP0mTEcLqv4z4bq.webp"
                  alt="HWT Community Governance"
                  fill
                  className="object-cover opacity-20"
                />
              </div>
              <CardContent className="relative p-6 z-10">
                <Users className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2 text-primary">{t('about.features.communityGovernance.title')}</h3>
                <p className="text-muted-foreground">
                  {t('about.features.communityGovernance.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Token Benefits Section */}
        <section className="py-16 md:py-24 bg-muted/40" id="benefits">
          <div className="container px-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12 text-center text-primary">
              {t('benefits.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <Star className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2 text-primary">{t('benefits.priorityRedemption.title')}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t('benefits.priorityRedemption.description')}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <ChevronRight className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2 text-primary">{t('benefits.newOffers.title')}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t('benefits.newOffers.description')}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Percent className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2 text-primary">{t('benefits.discounts.title')}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t('benefits.discounts.description')}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <CalendarDays className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2 text-primary">{t('benefits.events.title')}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t('benefits.events.description')}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2 text-primary">{t('benefits.community.title')}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t('benefits.community.description')}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Gift className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2 text-primary">{t('benefits.rewards.title')}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t('benefits.rewards.description')}
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto mt-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <Leaf className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2 text-primary">{t('benefits.economy.title')}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t('benefits.economy.description')}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2 text-primary">{t('benefits.backing.title')}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t('benefits.backing.description')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Tokenomics Section */}
        <section className="bg-white py-16 md:py-24" id="tokenomics">
          <div className="container px-4 pt-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12 text-center text-primary">
              Tokenomics
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold mb-4 text-primary" id="distribuicao">
                  {t('tokenomics.distributionTitle')}
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>{t('tokenomics.distribution.publicDistribution')}</span>
                      <span>80%</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>{t('tokenomics.distribution.developmentTeam')}</span>
                      <span>6%</span>
                    </div>
                    <Progress value={6} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>{t('tokenomics.distribution.operationalFund')}</span>
                      <span>5%</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>{t('tokenomics.distribution.strategicPartnerships')}</span>
                      <span>3%</span>
                    </div>
                    <Progress value={3} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>{t('tokenomics.distribution.communityRewards')}</span>
                      <span>3%</span>
                    </div>
                    <Progress value={3} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>{t('tokenomics.distribution.advisorsAndSales')}</span>
                      <span>3%</span>
                    </div>
                    <Progress value={3} className="h-2" />
                  </div>
                </div>
              </div>
              <div>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-4 text-primary">{t('tokenomics.detailsTitle')}</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('tokenomics.details.totalSupply')}</span>
                        <span className="font-medium">100 Milhões HWT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rede</span>
                        <span className="font-medium">Ethereum</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('tokenomics.details.tokenStandard')}</span>
                        <span className="font-medium">ERC-20</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section className="container px-4 py-16 md:py-24" id="roadmap">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12 text-center text-primary">
            {t('roadmap.title')}
          </h2>
          <Tabs defaultValue="phase1" className="max-w-3xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="phase1">Fase 1</TabsTrigger>
              <TabsTrigger value="phase2">Fase 2</TabsTrigger>
              <TabsTrigger value="phase3">Fase 3</TabsTrigger>
            </TabsList>
            <TabsContent value="phase1" className="space-y-4">
              <h3 className="text-xl font-bold text-primary">{t('roadmap.phase1.title')}</h3>
              <p className="text-muted-foreground">{t('roadmap.phase1.subtitle')}</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  {t('roadmap.phase1.items.0')}
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  {t('roadmap.phase1.items.1')}
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  {t('roadmap.phase1.items.2')}
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  {t('roadmap.phase1.items.3')}
                </li>
              </ul>
            </TabsContent>
            <TabsContent value="phase2" className="space-y-4">
              <h3 className="text-xl font-bold text-primary">{t('roadmap.phase2.title')}</h3>
              <p className="text-muted-foreground">{t('roadmap.phase2.subtitle')}</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  {t('roadmap.phase2.items.0')}
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  {t('roadmap.phase2.items.1')}
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  {t('roadmap.phase2.items.2')}
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  {t('roadmap.phase2.items.3')}
                </li>
              </ul>
            </TabsContent>
            <TabsContent value="phase3" className="space-y-4">
              <h3 className="text-xl font-bold text-primary">{t('roadmap.phase3.title')}</h3>
              <p className="text-muted-foreground">{t('roadmap.phase3.subtitle')}</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  {t('roadmap.phase3.items.0')}
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  {t('roadmap.phase3.items.1')}
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  {t('roadmap.phase3.items.2')}
                </li>
              </ul>
            </TabsContent>
          </Tabs>
        </section>

        {/* FAQ Section */}
        <section className="bg-[#f8f9fa] py-16 md:py-24" id="faq">
          <div className="container px-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12 text-center text-primary">
              {t('faq.title')}
            </h2>
            <Accordion type="single" collapsible className="max-w-2xl mx-auto">
              <AccordionItem value="item-1">
                <AccordionTrigger>{t('faq.questions.whatIsHWT.question')}</AccordionTrigger>
                <AccordionContent>
                  {t('faq.questions.whatIsHWT.answer')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>{t('faq.questions.howToBuy.question')}</AccordionTrigger>
                <AccordionContent>
                  {t('faq.questions.howToBuy.answer')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>{t('faq.questions.whatMakesUnique.question')}</AccordionTrigger>
                <AccordionContent>
                  <div className="whitespace-pre-line">
                    {t('faq.questions.whatMakesUnique.answer')}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>{t('faq.questions.utility.question')}</AccordionTrigger>
                <AccordionContent>
                  {t('faq.questions.utility.answer')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>{t('faq.questions.blockchain.question')}</AccordionTrigger>
                <AccordionContent>
                  {t('faq.questions.blockchain.answer')}
                </AccordionContent>
              </AccordionItem>

              <div className="text-center my-4">
                <Button onClick={() => setShowMoreFaqs(!showMoreFaqs)} variant="outline" className="text-primary border-primary hover:bg-primary/10 hover:text-primary">
                  {showMoreFaqs ? t('faq.showLess') : t('faq.showMore')}
                </Button>
              </div>

              {showMoreFaqs && (
                <>
                  <AccordionItem value="item-6">
                    <AccordionTrigger>{t('faq.questions.risks.question')}</AccordionTrigger>
                    <AccordionContent>
                      <div className="whitespace-pre-line">
                        {t('faq.questions.risks.answer')}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-7">
                    <AccordionTrigger>{t('faq.questions.redemption.question')}</AccordionTrigger>
                    <AccordionContent>
                      {t('faq.questions.redemption.answer')}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-8">
                    <AccordionTrigger>{t('faq.questions.minPurchase.question')}</AccordionTrigger>
                    <AccordionContent>
                      {t('faq.questions.minPurchase.answer')}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-10">
                    <AccordionTrigger>{t('faq.questions.sustainability.question')}</AccordionTrigger>
                    <AccordionContent>
                      <div className="whitespace-pre-line">
                        {t('faq.questions.sustainability.answer')}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-11">
                    <AccordionTrigger className="whitespace-normal text-left">{t('faq.questions.earlyRedemption.question')}</AccordionTrigger>
                    <AccordionContent>
                      <div className="whitespace-pre-line">
                        {t('faq.questions.earlyRedemption.answer')}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-12">
                    <AccordionTrigger>{t('faq.questions.transparency.question')}</AccordionTrigger>
                    <AccordionContent>
                      <div className="whitespace-pre-line">
                        {t('faq.questions.transparency.answer')}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </>
              )}
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container px-4 py-16 md:py-24">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
              {t('cta.title')}
            </h2>
            <p className="text-muted-foreground md:text-xl max-w-[600px] mx-auto">
              {t('cta.description')}
            </p>
            <Button size="lg" className="mt-6" style={{ backgroundColor: '#3F5767', color: '#fff' }} asChild>
              <Link href="/checkout">{t('cta.button')}</Link>
            </Button>
          </div>
        </section>

        {/* New Water Gallery Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container px-4">
            <h2 className="text-3xl font-bold tracking-tighter text-primary text-center mb-12">
              {t('gallery.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative group overflow-hidden rounded-lg">
                <Image
                  src="/images/jazida/DJI_0878.JPG"
                  alt="Riacho na jazida Hanuman"
                  width={400}
                  height={300}
                  className="object-cover w-full h-[300px] transition-transform group-hover:scale-110"
                />
                
              </div>
              <div className="relative group overflow-hidden rounded-lg">
                <Image
                  src="/images/jazida/DJI_0864.JPG"
                  alt="Casa de bomba na jazida Hanuman"
                  width={400}
                  height={300}
                  className="object-cover w-full h-[300px] transition-transform group-hover:scale-110"
                />
                
              </div>
              <div className="relative group overflow-hidden rounded-lg">
                <Image
                  src="/images/jazida/DJI_0859.JPG"
                  alt="Vista aérea da jazida Hanuman"
                  width={400}
                  height={300}
                  className="object-cover w-full h-[300px] transition-transform group-hover:scale-110"
                />
                
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-primary/20 bg-logoBg">
        <div className="container px-4 py-8 md:py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/hwt-logo.png"
                  alt="Logo do Hanuman Water Token"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-xl font-bold text-primary">HWT</span>
              </div>
              <p className="text-sm text-muted-foreground">{t('footer.description')}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-primary">{t('footer.quickLinks.title')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#nossa-fonte-de-agua" className="text-sm text-muted-foreground hover:text-primary">
                    {t('footer.quickLinks.about')}
                  </Link>
                </li>
                <li>
                  <Link href="#tokenomics" className="text-sm text-muted-foreground hover:text-primary">
                    {t('footer.quickLinks.tokenomics')}
                  </Link>
                </li>
                <li>
                  <Link href="#roadmap" className="text-sm text-muted-foreground hover:text-primary">
                    {t('footer.quickLinks.roadmap')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-primary">{t('footer.resources.title')}</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://gbrazeth.github.io/HanumanWaterToken/whitepaper-hwt-completo.html" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">
                    {t('footer.resources.whitepaper')}
                  </a>
                </li>
                <li>
                  <a href="https://gbrazeth.github.io/HanumanWaterToken/whitepaper-hwt-completo.html" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">
                    {t('footer.resources.documentation')}
                  </a>
                </li>
                <li>
                  <a href="https://etherscan.io/address/0x86C064635a535Aa681fD5c58ffa3639bD2d09fF8" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">
                    {t('footer.resources.smartContract')}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-primary">{t('footer.legal.title')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/legal/privacy" className="text-sm text-muted-foreground hover:text-primary">
                    {t('footer.legal.privacy')}
                  </Link>
                </li>
                <li>
                  <Link href="/legal/terms" className="text-sm text-muted-foreground hover:text-primary">
                    {t('footer.legal.terms')}
                  </Link>
                </li>
                <li>
                  <Link href="/legal/disclaimer" className="text-sm text-muted-foreground hover:text-primary">
                    {t('footer.legal.disclaimer')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} HanumanWater Token. {t('footer.copyright')}
          </div>
        </div>
      </footer>
    </div>
  )
}

