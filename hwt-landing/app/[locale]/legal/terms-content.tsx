'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useEffect, useState } from 'react'

export default function TermsContent() {
  const [mounted, setMounted] = useState(false)
  const t = useTranslations('terms')
  const locale = useLocale()
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
      <p className="mb-4">{t('intro')}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-2">{t('section1.title')}</h2>
      <p className="mb-4">{t('section1.content')}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-2">{t('section2.title')}</h2>
      <p className="mb-4">{t('section2.content')}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-2">{t('section3.title')}</h2>
      <p className="mb-4">{t('section3.content')}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-2">{t('section4.title')}</h2>
      <p className="mb-4">{t('section4.content')}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-2">{t('section5.title')}</h2>
      <p className="mb-4">{t('section5.content')}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-2">{t('section6.title')}</h2>
      <p className="mb-4">{t('section6.content')}</p>
    </div>
  )
}
