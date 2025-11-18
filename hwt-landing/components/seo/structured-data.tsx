export function StructuredData() {
  const organizationData = {
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
    }
  };

  const productData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Hanuman Water Token (HWT)",
    "description": "Token que representa água real hipertermal de 9.000 anos, 100% natural. Plataforma de tokenização de água com blockchain.",
    "brand": {
      "@type": "Brand",
      "name": "Hanuman Water Token"
    },
    "category": "Digital Asset",
    "image": [
      "https://hanumanwatertoken.com/images/logos/hwt-logo.png"
    ],
    "sku": "HWT-TOKEN-2024",
    "mpn": "HWT001",
    "offers": {
      "@type": "Offer",
      "name": "Hanuman Water Token Presale",
      "description": "Pré-venda do token HWT - tokenização de água real",
      "url": "https://hanumanwatertoken.com/pt-BR/checkout",
      "priceCurrency": "USD",
      "price": "0.20",
      "priceValidUntil": "2025-12-31",
      "availability": "https://schema.org/InStock",
      "validFrom": "2024-01-01",
      "seller": {
        "@type": "Organization",
        "name": "Hanuman Water Token"
      },
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Investidor Crypto"
        },
        "reviewBody": "Projeto inovador que tokeniza água real. Conceito único no mercado de criptomoedas.",
        "datePublished": "2024-11-01"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "4",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Analista Blockchain"
        },
        "reviewBody": "Interessante abordagem para tokenização de recursos naturais. Boa proposta de valor.",
        "datePublished": "2024-10-15"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productData) }}
      />
    </>
  );
}
