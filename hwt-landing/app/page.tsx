"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { TOKEN_ABI, TOKEN_CONTRACT_ADDRESS, RPC_URL } from "@/config/contract"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Droplet, Shield, Users, ChevronRight, ArrowRight } from "lucide-react"
import { AuthDialog } from "@/components/auth-dialog"
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
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
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
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-02-11%20at%2012.29.35-daDbj654dksYpGWva5AmTu4AfzMKUq.jpeg"
              alt="Logo do Hanuman Water Token"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-xl font-bold text-primary">HWT</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#nossa-fonte-de-agua"
              className="text-sm font-medium hover:text-primary"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("nossa-fonte-de-agua")
              }}
            >
              Sobre
            </Link>
            <Link
              href="#tokenomics"
              className="text-sm font-medium hover:text-primary"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("tokenomics", 120)
              }}
            >
              Tokenomics
            </Link>
            <Link
              href="#roadmap"
              className="text-sm font-medium hover:text-primary"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("roadmap")
              }}
            >
              Roadmap
            </Link>
            <a
              href="https://polygonscan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:text-primary"
            >
              Contrato
            </a>
            <Link
              href="#faq"
              className="text-sm font-medium hover:text-primary"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("faq")
              }}
            >
              FAQ
            </Link>
          </nav>
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Conta Conectada ({tokenBalance} HWT)
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button className="bg-primary hover:bg-primary/90" onClick={() => setAuthDialogOpen(true)}>
              Conectar-se
            </Button>
          )}
        </div>
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
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-02-11%20at%2012.29.35-daDbj654dksYpGWva5AmTu4AfzMKUq.jpeg"
                    alt="Logo do Hanuman Water Token"
                    width={120}
                    height={120}
                    className="mb-6"
                  />
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary">
                  Unindo Natureza e Tecnologia
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  O HanumanWater Token (HWT) está transformando a gestão de recursos hídricos através da tecnologia
                  blockchain, garantindo transparência e eficiência na distribuição de água.
                </p>
                <div className="flex gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                    <Link href="/checkout">
                      Comprar HWT <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary text-primary hover:bg-primary/10"
                    onClick={() => scrollToSection("nossa-fonte-de-agua")}
                  >
                    Saiba Mais
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
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-02-11%2019.38.57%20-%20A%20futuristic%20water%20reservoir%20representing%20the%20Hanuman%20Water%20Token%20(HWT)%20water%20source.%20The%20structure%20is%20modern%20and%20high-tech,%20featuring%20sleek%20metallic%20-Qqy58ihqbKhBBwsqgnzhQAtuWhnMzu.webp"
                  alt="Instalação de Processamento de Água HWT"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter text-primary">Nossa Fonte de Água</h2>
                <p className="text-muted-foreground">
                  A Fonte de Água Hanuman é uma jazida natural preservada, fornecendo água mineral pura e rica em
                  nutrientes essenciais. O Hanuman Water Token (HWT) transforma esse recurso em um ativo digital
                  rastreável via blockchain, garantindo transparência e segurança. Cada 1.000 HWT representam 1 metro
                  cúbico de água (1.000 litros), permitindo que esse bem natural seja gerenciado e negociado de forma
                  eficiente.
                </p>
                <p className="text-muted-foreground">
                  Além de democratizar o acesso à água mineral, o HWT traz liquidez ao mercado e assegura a integridade
                  da cadeia de suprimentos por meio da tecnologia blockchain. Esse ecossistema inovador une natureza e
                  tecnologia, criando um novo modelo sustentável de governança, onde os detentores do token participam
                  ativamente da preservação e distribuição responsável da água.
                </p>
                <div className="mt-8 p-6 bg-background rounded-lg space-y-4">
                  <h3 className="text-xl font-bold text-primary">
                    Hanuman Water Token (HWT) – Investindo no Futuro da Água Termal
                  </h3>
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      O Token Hanuman Water (HWT) tem um preço mínimo de US$ 2.000 por m³.
                    </p>
                    <div className="space-y-1">
                      <p className="font-medium">Testes Finais e Lançamento da Pré-Venda</p>
                      <p className="text-muted-foreground">Período: 10/04 a 10/05/2025</p>
                      <p className="text-muted-foreground">Meta: Venda mínima de 100.000 m³ em 12 meses.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container px-4 py-16 md:py-24" id="about">
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
                <h3 className="text-xl font-bold mb-2 text-primary">Ativo do Mundo Real</h3>
                <p className="text-muted-foreground">
                  Cada HWT representa um volume específico de água mineral da Fonte Hanuman, garantindo um vínculo
                  direto com um recurso tangível.
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
                <h3 className="text-xl font-bold mb-2 text-primary">Transparência</h3>
                <p className="text-muted-foreground">
                  Visibilidade completa na cadeia de suprimentos de água através da tecnologia blockchain, assegurando
                  rastreabilidade e confiança.
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
                <h3 className="text-xl font-bold mb-2 text-primary">Governança Comunitária</h3>
                <p className="text-muted-foreground">
                  Os detentores de HWT participam ativamente nas decisões-chave do projeto, promovendo uma gestão
                  descentralizada e democrática.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tokenomics Section */}
        <section className="bg-muted py-16 md:py-24" id="tokenomics">
          <div className="container px-4 pt-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12 text-center text-primary">
              Tokenomics
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold mb-4 text-primary" id="distribuicao">
                  Distribuição
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Distribuição Pública</span>
                      <span>80%</span>
                    </div>
                    <Progress value={80} className="h-2">
                      <div className="h-full bg-primary" style={{ width: "80%" }} />
                    </Progress>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Equipe de Desenvolvimento</span>
                      <span>6%</span>
                    </div>
                    <Progress value={6} className="h-2">
                      <div className="h-full bg-primary" style={{ width: "6%" }} />
                    </Progress>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Fundo de Liquidez e Reservas</span>
                      <span>5%</span>
                    </div>
                    <Progress value={5} className="h-2">
                      <div className="h-full bg-primary" style={{ width: "5%" }} />
                    </Progress>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Parcerias Estratégicas</span>
                      <span>3%</span>
                    </div>
                    <Progress value={3} className="h-2">
                      <div className="h-full bg-primary" style={{ width: "3%" }} />
                    </Progress>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Recompensas à Comunidade</span>
                      <span>3%</span>
                    </div>
                    <Progress value={3} className="h-2">
                      <div className="h-full bg-primary" style={{ width: "3%" }} />
                    </Progress>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Consultores e Vendas</span>
                      <span>3%</span>
                    </div>
                    <Progress value={3} className="h-2">
                      <div className="h-full bg-primary" style={{ width: "3%" }} />
                    </Progress>
                  </div>
                </div>
              </div>
              <div>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-4 text-primary">Detalhes do Token</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fornecimento Total</span>
                        <span className="font-medium">500 Milhões HWT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rede</span>
                        <span className="font-medium">Ethereum</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tipo de Token</span>
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
            Roteiro de Desenvolvimento
          </h2>
          <Tabs defaultValue="phase1" className="max-w-3xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="phase1">Fase 1</TabsTrigger>
              <TabsTrigger value="phase2">Fase 2</TabsTrigger>
              <TabsTrigger value="phase3">Fase 3</TabsTrigger>
            </TabsList>
            <TabsContent value="phase1" className="space-y-4">
              <h3 className="text-xl font-bold text-primary">Planejamento e Estruturação</h3>
              <p className="text-muted-foreground">Fase 1</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  Definição do escopo e requisitos técnicos
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  Design da Landing Page
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  Desenvolvimento inicial do Smart Contract
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  Configuração inicial de Integrações
                </li>
              </ul>
            </TabsContent>
            <TabsContent value="phase2" className="space-y-4">
              <h3 className="text-xl font-bold text-primary">Desenvolvimento e Integração</h3>
              <p className="text-muted-foreground">Fase 2</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  Desenvolvimento completo da Landing Page (Frontend e Backend)
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  Finalização do Smart Contract
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  Desenvolvimento do Checkout para Pré-Venda
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  Testes e Ajustes
                </li>
              </ul>
            </TabsContent>
            <TabsContent value="phase3" className="space-y-4">
              <h3 className="text-xl font-bold text-primary">Testes Finais e Lançamento</h3>
              <p className="text-muted-foreground">Fase 3</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  Auditoria do Smart Contract
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  Testes reais de compra na Landing Page
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  Lançamento Oficial
                </li>
              </ul>
            </TabsContent>
          </Tabs>
        </section>

        {/* FAQ Section */}
        <section className="bg-muted py-16 md:py-24" id="faq">
          <div className="container px-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12 text-center text-primary">
              Perguntas Frequentes
            </h2>
            <Accordion type="single" collapsible className="max-w-2xl mx-auto">
              <AccordionItem value="item-1">
                <AccordionTrigger>O que é HWT?</AccordionTrigger>
                <AccordionContent>
                  HWT (HanumanWater Token) é um token utilitário que representa a propriedade de recursos hídricos
                  minerais, construído na tecnologia blockchain para garantir transparência e gestão eficiente de
                  recursos. Cada token está diretamente vinculado a um volume específico de água mineral da Fonte
                  Hanuman que poderá ser extraído pelo investidores até o final de 2026.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Como posso comprar HWT?</AccordionTrigger>
                <AccordionContent>
                  Durante a fase de pré-venda, você pode comprar HWT diretamente através da nossa plataforma usando
                  criptomoeda ou moeda fiduciária. Após o lançamento, o HWT estará disponível nas principais exchanges
                  descentralizadas. Fique atento aos nossos canais oficiais para informações sobre datas de venda e
                  instruções detalhadas.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>O que torna o HWT único?</AccordionTrigger>
                <AccordionContent>
                  O HWT é respaldado por ativos hídricos do mundo real, fornecendo uma conexão tangível entre tokens
                  digitais e recursos físicos. Ele também implementa governança comunitária e gestão sustentável de
                  recursos. Além disso, o HWT utiliza tecnologia blockchain avançada para garantir total transparência e
                  rastreabilidade na cadeia de suprimentos de água, promovendo confiança e eficiência no setor de gestão
                  hídrica.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container px-4 py-16 md:py-24">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
              Junte-se ao Futuro da Gestão Hídrica
            </h2>
            <p className="text-muted-foreground md:text-xl max-w-[600px] mx-auto">
              Faça parte da revolução na gestão sustentável de recursos hídricos com o HWT
            </p>
            <Button size="lg" className="mt-6 bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
              <Link href="/checkout">Compre HWT Agora</Link>
            </Button>
          </div>
        </section>

        {/* New Water Gallery Section */}
        <section className="py-16 md:py-24 bg-muted">
          <div className="container px-4">
            <h2 className="text-3xl font-bold tracking-tighter text-primary text-center mb-12">
              Nossas Fontes de Água
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative group overflow-hidden rounded-lg">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-02-11%2019.39.57%20-%20A%20futuristic%20water%20reservoir%20representing%20the%20Hanuman%20Water%20Token%20(HWT)%20water%20source,%20prominently%20displaying%20the%20HWT%20token%20branding.%20The%20structure%20is%20-xyhrFL0mgi0EGbO4awnEkE5wOnOeHP.webp"
                  alt="Instalação de Processamento Primário HWT"
                  width={400}
                  height={300}
                  className="object-cover w-full h-[300px] transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <h3 className="text-white font-bold">Fonte Primária</h3>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-lg">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-02-11%2019.38.57%20-%20A%20futuristic%20water%20reservoir%20representing%20the%20Hanuman%20Water%20Token%20(HWT)%20water%20source.%20The%20structure%20is%20modern%20and%20high-tech,%20featuring%20sleek%20metallic%20-Qqy58ihqbKhBBwsqgnzhQAtuWhnMzu.webp"
                  alt="Sistema de Filtração Avançado HWT"
                  width={400}
                  height={300}
                  className="object-cover w-full h-[300px] transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <h3 className="text-white font-bold">Instalação de Processamento</h3>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-lg">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-02-11%2019.32.37%20-%20A%20futuristic%20water%20reservoir%20with%20a%20modern%20architectural%20design.%20The%20structure%20is%20sleek%20and%20metallic,%20incorporating%20glass%20domes%20and%20advanced%20filtratio-I9vHkUZqLwLvqeVpHpisMlXxRKHVZw.webp"
                  alt="Gestão Sustentável de Água HWT"
                  width={400}
                  height={300}
                  className="object-cover w-full h-[300px] transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <h3 className="text-white font-bold">Rede de Distribuição</h3>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-primary/20 bg-background">
        <div className="container px-4 py-8 md:py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-02-11%20at%2012.29.35-daDbj654dksYpGWva5AmTu4AfzMKUq.jpeg"
                  alt="Logo do Hanuman Water Token"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-xl font-bold text-primary">HWT</span>
              </div>
              <p className="text-sm text-muted-foreground">Transformando a gestão de recursos hídricos</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-primary">Links Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#nossa-fonte-de-agua" className="text-sm text-muted-foreground hover:text-primary">
                    Sobre
                  </Link>
                </li>
                <li>
                  <Link href="#tokenomics" className="text-sm text-muted-foreground hover:text-primary">
                    Tokenomics
                  </Link>
                </li>
                <li>
                  <Link href="#roadmap" className="text-sm text-muted-foreground hover:text-primary">
                    Roteiro
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-primary">Recursos</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                    Whitepaper
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                    Documentação
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                    Contrato Inteligente
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-primary">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                    Termos de Serviço
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                    Aviso Legal
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} HanumanWater Token. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}

