"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Droplet, Shield, Users, ChevronRight, ArrowRight, Star, Percent, CalendarDays, Gift, Leaf } from "lucide-react"
import { LanguageSwitcher } from "@/components/layout/language-switcher"

const scrollToSection = (elementId: string, offset = 80) => {
  if (typeof window === 'undefined') return
  
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

export default function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const t = useTranslations();
  const { locale } = React.use(params);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMoreFaqs, setShowMoreFaqs] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-logoBg" suppressHydrationWarning>
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
              href="https://etherscan.io/address/0x67A506934aA8Bb00E92a706Ba40c373F6269B44d"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:text-primary"
            >
              {t('navigation.presaleContract')}
            </a>
            <a
              href="https://etherscan.io/address/0x86C064635a535Aa681fD5c58ffa3639bD2d09fF8"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:text-primary"
            >
              {t('navigation.hwtContract')}
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
      
      {/* Buy HWT Button */}
      <Button asChild className="bg-primary hover:bg-primary/90 ml-2">
        <Link href={`/${locale}/checkout`}>
          {t('navigation.buyHWT')}
        </Link>
      </Button>
    </div>
  </div>
  {/* Menu mobile */}
  {menuOpen && (
    <nav className="flex flex-col md:hidden bg-white/95 shadow-md px-4 py-2 z-50 absolute w-full left-0 top-16 border-b">
      <Link href="#nossa-fonte-de-agua" className="py-2 border-b text-primary font-medium" onClick={e => {e.preventDefault(); setMenuOpen(false); scrollToSection('nossa-fonte-de-agua')}}>{t('navigation.about')}</Link>
      <Link href="#benefits" className="py-2 border-b text-primary font-medium" onClick={e => {e.preventDefault(); setMenuOpen(false); scrollToSection('benefits')}}>{t('navigation.benefits')}</Link>
      <Link href="#tokenomics" className="py-2 border-b text-primary font-medium" onClick={e => {e.preventDefault(); setMenuOpen(false); scrollToSection('tokenomics', 120)}}>{t('navigation.tokenomics')}</Link>
      <Link href="#roadmap" className="py-2 border-b text-primary font-medium" onClick={e => {e.preventDefault(); setMenuOpen(false); scrollToSection('roadmap')}}>{t('navigation.roadmap')}</Link>
      <a href="https://etherscan.io/address/0x67A506934aA8Bb00E92a706Ba40c373F6269B44d" target="_blank" rel="noopener noreferrer" className="py-2 border-b text-primary font-medium">{t('navigation.presaleContract')}</a>
      <a href="https://etherscan.io/address/0x86C064635a535Aa681fD5c58ffa3639bD2d09fF8" target="_blank" rel="noopener noreferrer" className="py-2 border-b text-primary font-medium">{t('navigation.hwtContract')}</a>
      <Link href="#faq" className="py-2 border-b text-primary font-medium" onClick={e => {e.preventDefault(); setMenuOpen(false); scrollToSection('faq')}}>{t('navigation.faq')}</Link>
    </nav>
  )}
</header>

      <main className="flex-1">
        {/* Hero Section - Otimizado para telas 13/14 polegadas */}
        <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
          {/* Background uniforme */}
          <div className="absolute inset-0 bg-logoBg"></div>

          {/* Conteúdo centralizado */}
          <div className="relative z-10 container mx-auto px-4 py-4 lg:py-0">
            <div className="flex items-center w-full h-full">
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
                
                {/* Coluna esquerda - Conteúdo */}
                <div className="lg:col-span-7 space-y-6 lg:space-y-8 text-center lg:text-left pt-4 lg:pt-0">
                  
                  {/* Título principal */}
                  <div className="space-y-4 lg:space-y-6">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-primary">
                      {t('hero.title')}
                    </h1>
                    
                    {/* Linha decorativa */}
                    <div className="flex items-center gap-4 justify-center lg:justify-start">
                      <div className="h-1 w-16 lg:w-20 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
                      <Droplet className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                      <div className="h-1 w-16 lg:w-20 bg-gradient-to-r from-primary/60 to-primary rounded-full"></div>
                    </div>
                  </div>

                  {/* Descrição */}
                  <p className="text-lg lg:text-xl xl:text-2xl text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    {t('hero.description')}
                  </p>
                  
                  {/* Stats em cards - Compacto em telas menores */}
                  <div className="grid grid-cols-3 gap-3 lg:gap-4 py-2 lg:py-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 lg:p-4 text-center shadow-lg border border-primary/10">
                      <div className="text-xl lg:text-2xl font-bold text-primary">9.000</div>
                      <div className="text-xs lg:text-sm text-gray-600">{t('hero.stats.years')}</div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 lg:p-4 text-center shadow-lg border border-primary/10">
                      <div className="text-xl lg:text-2xl font-bold text-primary">42°C</div>
                      <div className="text-xs lg:text-sm text-gray-600">{t('hero.stats.hyperthermal')}</div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 lg:p-4 text-center shadow-lg border border-primary/10">
                      <div className="text-xl lg:text-2xl font-bold text-primary">100%</div>
                      <div className="text-xs lg:text-sm text-gray-600">{t('hero.stats.natural')}</div>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center items-center">
                    <Button 
                      size="lg" 
                      className="group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-bold px-6 lg:px-8 py-2 lg:py-3 text-base lg:text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 rounded-full border border-primary/20 relative overflow-hidden" 
                      asChild
                    >
                      <Link href={`/${locale}/checkout`} className="flex items-center gap-2 relative z-10">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                        {t('hero.cta.buyNow')} 
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" />
                      </Link>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-2 border-primary/60 text-primary hover:bg-primary hover:text-white font-semibold px-5 lg:px-6 py-2 lg:py-3 text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300 rounded-full bg-white/80 backdrop-blur-sm hover:border-primary"
                      onClick={() => scrollToSection("nossa-fonte-de-agua")}
                    >
                      {t('hero.cta.learnMore')}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary/80 hover:text-primary hover:bg-primary/10 font-medium px-4 py-2 text-sm transition-all duration-300 rounded-full border border-transparent hover:border-primary/30 lg:hidden"
                      asChild
                    >
                      <Link href="https://hanumanwater.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        {t('navigation.institutionalSite')}
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    </Button>
                    
                    {/* Botão institucional visível apenas em telas maiores para economizar espaço vertical */}
                    <Button
                      variant="ghost"
                      size="lg"
                      className="text-primary/80 hover:text-primary hover:bg-primary/10 font-medium px-4 py-2 text-sm transition-all duration-300 rounded-full border border-transparent hover:border-primary/30 hidden lg:inline-flex"
                      asChild
                    >
                      <Link href="https://hanumanwater.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        {t('navigation.institutionalSite')}
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    </Button>
                  </div>

                  {/* Trust indicators - Ultra compacto */}
                  <div className="pt-2 lg:mb-8">
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2 lg:p-3 shadow-lg border border-primary/10">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="flex flex-col items-center text-center p-1.5 lg:p-2 rounded-md bg-green-50 border border-green-200 hover:shadow-md transition-all duration-300">
                          <div className="w-6 h-6 lg:w-8 lg:h-8 bg-green-100 rounded-full flex items-center justify-center mb-1">
                            <Shield className="h-3 w-3 lg:h-4 lg:w-4 text-green-600" />
                          </div>
                          <span className="font-semibold text-[10px] lg:text-xs text-green-800">{t('hero.trustIndicators.auditedSecure')}</span>
                          <span className="text-[10px] lg:text-xs text-green-600 opacity-80">{t('hero.trustIndicators.verified')}</span>
                        </div>
                        <div className="flex flex-col items-center text-center p-1.5 lg:p-2 rounded-md bg-blue-50 border border-blue-200 hover:shadow-md transition-all duration-300">
                          <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                            <Droplet className="h-3 w-3 lg:h-4 lg:w-4 text-blue-600" />
                          </div>
                          <span className="font-semibold text-[10px] lg:text-xs text-blue-800">{t('hero.trustIndicators.realWaterTokenized')}</span>
                          <span className="text-[10px] lg:text-xs text-blue-600 opacity-80">{t('hero.trustIndicators.tangible')}</span>
                        </div>
                        <div className="flex flex-col items-center text-center p-1.5 lg:p-2 rounded-md bg-purple-50 border border-purple-200 hover:shadow-md transition-all duration-300">
                          <div className="w-6 h-6 lg:w-8 lg:h-8 bg-purple-100 rounded-full flex items-center justify-center mb-1">
                            <Users className="h-3 w-3 lg:h-4 lg:w-4 text-purple-600" />
                          </div>
                          <span className="font-semibold text-[10px] lg:text-xs text-purple-800">{t('hero.trustIndicators.activeCommunity')}</span>
                          <span className="text-[10px] lg:text-xs text-purple-600 opacity-80">{t('hero.trustIndicators.active')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coluna direita - Imagem */}
                <div className="lg:col-span-5 flex justify-center items-center mt-4 lg:mt-0">
                  <div className="relative w-full max-w-[500px] lg:max-w-none">
                    {/* Container da imagem */}
                    <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-4 lg:p-6 shadow-2xl border border-primary/10">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-02-11%2019.39.57%20-%20A%20futuristic%20water%20reservoir%20representing%20the%20Hanuman%20Water%20Token%20(HWT)%20water%20source,%20prominently%20displaying%20the%20HWT%20token%20branding.%20The%20structure%20is%20-axQPVyW3jf0Cf7UlwYOEii7HfaQbHx.webp"
                        alt="HWT Futuristic Water Processing Facility"
                        width={600}
                        height={450}
                        className="rounded-2xl w-full h-auto object-cover"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator - Centralizado abaixo da imagem */}
          <div className="absolute bottom-4 lg:bottom-8 left-1/2 transform -translate-x-1/2 lg:left-3/4 lg:-translate-x-1/2 z-20 hidden lg:block">
            <div 
              className="flex flex-col items-center cursor-pointer group animate-bounce"
              onClick={() => scrollToSection("nossa-fonte-de-agua")}
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-xl mb-2 group-hover:bg-primary group-hover:text-white transition-all duration-300 border-2 border-primary/30">
                <span className="text-sm font-semibold">{t('navigationButtons.ourWaterSource')}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-primary rotate-90 group-hover:scale-110 transition-transform drop-shadow-lg" />
            </div>
          </div>

        </section>

        {/* Water Source Section */}
        <section className="relative py-16 md:py-24 bg-logoBg" id="nossa-fonte-de-agua">
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
                <div className="mt-8 p-6 max-w-2xl mx-auto border-2 border-white rounded-lg shadow-lg" style={{ backgroundColor: '#f4f8fb' }}>

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

          {/* Scroll indicator para próxima seção - Hidden on mobile */}
          <div className="container px-4 mt-16 hidden lg:block">
            <div className="flex justify-center">
              <div 
                className="flex flex-col items-center cursor-pointer group animate-bounce"
                onClick={() => scrollToSection("about")}
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-xl mb-2 group-hover:bg-primary group-hover:text-white transition-all duration-300 border-2 border-primary/30">
                  <span className="text-sm font-semibold">{t('navigationButtons.features')}</span>
                </div>
                <ChevronRight className="h-6 w-6 text-primary rotate-90 group-hover:scale-110 transition-transform drop-shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-16 md:py-24 bg-logoBg" id="about">
          <div className="container px-4">
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
          </div>

          {/* Scroll indicator para próxima seção - Hidden on mobile */}
          <div className="container px-4 mt-16 hidden lg:block">
            <div className="flex justify-center">
              <div 
                className="flex flex-col items-center cursor-pointer group animate-bounce"
                onClick={() => scrollToSection("benefits")}
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-xl mb-2 group-hover:bg-primary group-hover:text-white transition-all duration-300 border-2 border-primary/30">
                  <span className="text-sm font-semibold">{t('navigationButtons.benefits')}</span>
                </div>
                <ChevronRight className="h-6 w-6 text-primary rotate-90 group-hover:scale-110 transition-transform drop-shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Token Benefits Section */}
        <section className="relative py-16 md:py-24 bg-logoBg" id="benefits">
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

          {/* Scroll indicator para próxima seção - Hidden on mobile */}
          <div className="container px-4 mt-16 hidden lg:block">
            <div className="flex justify-center">
              <div 
                className="flex flex-col items-center cursor-pointer group animate-bounce"
                onClick={() => scrollToSection("tokenomics")}
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-xl mb-2 group-hover:bg-primary group-hover:text-white transition-all duration-300 border-2 border-primary/30">
                  <span className="text-sm font-semibold">{t('navigationButtons.tokenomics')}</span>
                </div>
                <ChevronRight className="h-6 w-6 text-primary rotate-90 group-hover:scale-110 transition-transform drop-shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Tokenomics Section */}
        <section className="relative bg-logoBg py-16 md:py-24" id="tokenomics">
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

          {/* Scroll indicator para próxima seção - Hidden on mobile */}
          <div className="container px-4 mt-16 hidden lg:block">
            <div className="flex justify-center">
              <div 
                className="flex flex-col items-center cursor-pointer group animate-bounce"
                onClick={() => scrollToSection("roadmap")}
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-xl mb-2 group-hover:bg-primary group-hover:text-white transition-all duration-300 border-2 border-primary/30">
                  <span className="text-sm font-semibold">{t('navigationButtons.roadmap')}</span>
                </div>
                <ChevronRight className="h-6 w-6 text-primary rotate-90 group-hover:scale-110 transition-transform drop-shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section className="relative bg-logoBg py-16 md:py-24" id="roadmap">
          <div className="container px-4">
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
          </div>

          {/* Scroll indicator para próxima seção - Hidden on mobile */}
          <div className="container px-4 mt-16 hidden lg:block">
            <div className="flex justify-center">
              <div 
                className="flex flex-col items-center cursor-pointer group animate-bounce"
                onClick={() => scrollToSection("faq")}
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-xl mb-2 group-hover:bg-primary group-hover:text-white transition-all duration-300 border-2 border-primary/30">
                  <span className="text-sm font-semibold">{t('navigationButtons.faq')}</span>
                </div>
                <ChevronRight className="h-6 w-6 text-primary rotate-90 group-hover:scale-110 transition-transform drop-shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative bg-logoBg py-16 md:py-24" id="faq">
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

          {/* Scroll indicator para próxima seção - Hidden on mobile */}
          <div className="container px-4 mt-16 hidden lg:block">
            <div className="flex justify-center">
              <div 
                className="flex flex-col items-center cursor-pointer group animate-bounce"
                onClick={() => window.location.href = `/${locale}/checkout`}
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-xl mb-2 group-hover:bg-primary group-hover:text-white transition-all duration-300 border-2 border-primary/30">
                  <span className="text-sm font-semibold">{t('navigationButtons.buyHWT')}</span>
                </div>
                <ChevronRight className="h-6 w-6 text-primary rotate-90 group-hover:scale-110 transition-transform drop-shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-logoBg py-16 md:py-24">
          <div className="container px-4">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
              {t('cta.title')}
            </h2>
            <p className="text-muted-foreground md:text-xl max-w-[600px] mx-auto">
              {t('cta.description')}
            </p>
            <Button size="lg" className="mt-6" style={{ backgroundColor: '#3F5767', color: '#fff' }} asChild>
              <Link href={`/${locale}/checkout`}>{t('cta.button')}</Link>
            </Button>
          </div>
          </div>
        </section>

        {/* New Water Gallery Section */}
        <section className="py-16 md:py-24 bg-logoBg">
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


      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="container px-4 py-8 md:py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/images/logos/hwt-logo.png"
                  alt="Logo do Hanuman Water Token"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-xl font-bold text-white">HWT</span>
              </div>
              <p className="text-sm text-white/80">{t('footer.description')}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">{t('footer.quickLinks.title')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#nossa-fonte-de-agua" className="text-sm text-white/70 hover:text-white transition-colors">
                    {t('footer.quickLinks.about')}
                  </Link>
                </li>
                <li>
                  <Link href="#tokenomics" className="text-sm text-white/70 hover:text-white transition-colors">
                    {t('footer.quickLinks.tokenomics')}
                  </Link>
                </li>
                <li>
                  <Link href="#roadmap" className="text-sm text-white/70 hover:text-white transition-colors">
                    {t('footer.quickLinks.roadmap')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">{t('footer.resources.title')}</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://gbrazeth.github.io/HanumanWaterToken/docs/whitepaper/whitepaper-hwt-completo.html" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-white transition-colors">
                    {t('footer.resources.whitepaper')}
                  </a>
                </li>
                <li>
                  <a href="https://gbrazeth.github.io/HanumanWaterToken/docs/whitepaper/whitepaper-hwt-completo.html" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-white transition-colors">
                    {t('footer.resources.documentation')}
                  </a>
                </li>
                <li>
                  <a href="https://etherscan.io/address/0x67A506934aA8Bb00E92a706Ba40c373F6269B44d" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-white transition-colors">
                    {t('footer.resources.smartContract')}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">{t('footer.legal.title')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href={`/${locale}/legal/privacy`} className="text-sm text-white/70 hover:text-white transition-colors">
                    {t('footer.legal.privacy')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/legal/terms`} className="text-sm text-white/70 hover:text-white transition-colors">
                    {t('footer.legal.terms')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/legal/disclaimer`} className="text-sm text-white/70 hover:text-white transition-colors">
                    {t('footer.legal.disclaimer')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/20 text-center text-sm text-white/70">
            © {new Date().getFullYear()} HanumanWater Token. {t('footer.copyright')}
          </div>
        </div>
      </footer>
    </div>
  )
}

