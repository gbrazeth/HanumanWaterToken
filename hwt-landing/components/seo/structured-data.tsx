export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hanuman Water Token",
    "alternateName": "HWT",
    "description": "Plataforma de tokenização de água real com blockchain. Água hipertermal de 9.000 anos, 100% natural.",
    "url": "https://hanumanwatertoken.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://hanumanwatertoken.com/images/logos/hwt-logo.png",
      "width": 400,
      "height": 400
    },
    "image": "https://hanumanwatertoken.com/images/logos/hwt-logo.png",
    "sameAs": [
      "https://twitter.com/HanumanWaterToken",
      "https://t.me/HanumanWaterToken",
      "https://github.com/gbrazeth/HanumanWaterToken"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contact@hanumanwater.com"
    },
    "foundingDate": "2024",
    "industry": "Blockchain Technology",
    "keywords": "tokenização, água, blockchain, criptomoeda, investimento, água natural, hipertermal",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://hanumanwatertoken.com"
    },
    "offers": {
      "@type": "Offer",
      "name": "Hanuman Water Token Presale",
      "description": "Pré-venda do token HWT - tokenização de água real",
      "url": "https://hanumanwatertoken.com/pt-BR/checkout",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": "2024-01-01",
      "category": "Digital Asset"
    },
    "product": {
      "@type": "Product",
      "name": "Hanuman Water Token (HWT)",
      "description": "Token que representa água real hipertermal de 9.000 anos",
      "brand": {
        "@type": "Brand",
        "name": "Hanuman Water Token"
      },
      "category": "Cryptocurrency",
      "image": "https://hanumanwatertoken.com/images/logos/hwt-logo.png"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
