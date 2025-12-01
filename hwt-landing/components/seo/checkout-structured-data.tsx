export function CheckoutStructuredData() {
  const checkoutData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Hanuman Water Token - Checkout",
    "description": "Página de compra do Hanuman Water Token (HWT) - Tokenização de água real",
    "url": "https://hanumanwatertoken.com/pt-BR/checkout",
    "mainEntity": {
      "@type": "Product",
      "name": "Hanuman Water Token (HWT)",
      "description": "Token que representa água real hipertermal de 9.000 anos, 100% natural",
      "brand": {
        "@type": "Brand",
        "name": "Hanuman Water Token"
      },
      "category": "Digital Asset",
      "image": "https://hanumanwatertoken.com/images/logos/hwt-logo.png",
      "sku": "HWT-TOKEN-2024",
      "offers": {
        "@type": "Offer",
        "name": "Hanuman Water Token Presale",
        "description": "Pré-venda do token HWT com múltiplas opções de pagamento",
        "url": "https://hanumanwatertoken.com/pt-BR/checkout",
        "priceCurrency": "USD",
        "price": "0.20",
        "priceValidUntil": "2025-12-31",
        "availability": "https://schema.org/InStock",
        "validFrom": "2024-01-01",
        "seller": {
          "@type": "Organization",
          "name": "Hanuman Water Token",
          "url": "https://hanumanwatertoken.com"
        },
        "itemCondition": "https://schema.org/NewCondition",
        "acceptedPaymentMethod": [
          "https://schema.org/CreditCard",
          "https://schema.org/PaymentCard",
          "Cryptocurrency",
          "PIX"
        ],
        "deliveryMethod": "Digital",
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": 0,
            "currency": "USD"
          },
          "shippingDestination": {
            "@type": "DefinedRegion",
            "addressCountry": "US"
          },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "handlingTime": {
              "@type": "QuantitativeValue",
              "minValue": 0,
              "maxValue": 0,
              "unitCode": "DAY"
            },
            "transitTime": {
              "@type": "QuantitativeValue",
              "minValue": 0,
              "maxValue": 0,
              "unitCode": "DAY"
            }
          }
        },
        "hasMerchantReturnPolicy": {
          "@type": "MerchantReturnPolicy",
          "applicableCountry": "US",
          "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
          "merchantReturnDays": 30,
          "returnMethod": "https://schema.org/ReturnByMail",
          "returnFees": "https://schema.org/FreeReturn"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "127",
        "bestRating": "5",
        "worstRating": "1"
      }
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://hanumanwatertoken.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Checkout",
          "item": "https://hanumanwatertoken.com/pt-BR/checkout"
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(checkoutData) }}
    />
  );
}
