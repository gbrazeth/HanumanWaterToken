'use client'

import dynamic from 'next/dynamic'

// Dynamic import da página de checkout para evitar SSR
const CheckoutPageComponent = dynamic(
  () => import('@/app/[locale]/checkout/page').then(mod => ({ default: mod.default })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }
)

interface CheckoutClientProps {
  params: Promise<{ locale: string }>
}

export default function CheckoutClient({ params }: CheckoutClientProps) {
  return <CheckoutPageComponent params={params} />
}
