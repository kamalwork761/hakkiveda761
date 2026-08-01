import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';

export const SeoSchemaInjector: React.FC = () => {
  const {
    siteSettings,
    brandIdentity,
    footerConfig,
    b2bSectionConfig,
    products,
    categories,
    blogs,
    reviews,
    testimonialVideos,
    shoppableReels,
    quizQuestions,
    currentCurrency,
    selectedCountry,
    quickViewProduct,
  } = useStore();

  useEffect(() => {
    const siteUrl = 'https://hakkiveda.store';
    const logoUrl =
      brandIdentity.mainLogoLight ||
      brandIdentity.mainLogoDark ||
      footerConfig.brandLogo ||
      `${siteUrl}/favicon.svg`;

    const phone = siteSettings.contactPhone || brandIdentity.phone || '+917619536831';
    const email = siteSettings.contactEmail || brandIdentity.email || 'support@hakkiveda.store';
    const addressText = footerConfig.address || siteSettings.contactAddress || 'Door No. 574, V.P. Bore, Hunsur, Mysore, Karnataka 571105, India';

    // ------------------------------------
    // DYNAMIC HEAD & META TAG UPDATES
    // ------------------------------------
    const setMetaTag = (nameOrProperty: 'name' | 'property', key: string, content: string) => {
      let tag = document.querySelector(`meta[${nameOrProperty}="${key}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(nameOrProperty, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    const setCanonical = (href: string) => {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    let pageTitle = siteSettings.siteTitle || 'HAKKIVEDA | Authentic Hakki-Pikki Tribal Ayurvedic Hair Care';
    let pageDesc = siteSettings.seoDescription || 'Discover authentic Hakki-Pikki tribal Ayurvedic hair care from HAKKIVEDA. Shop 108 Herbs Hair Oil, Herbal Shampoo, Baldness Powder and premium natural wellness products with worldwide shipping.';
    let pageKeywords = siteSettings.seoKeywords || 'HAKKIVEDA, Adivasi Hair Oil, 108 Herbs Hair Oil, Hakki Pikki Tribe, Ayurvedic Hair Oil, Herbal Hair Growth, Natural Hair Care, Herbal Shampoo, Hair Fall Solution, Ayurvedic Wellness';
    let pageImage = logoUrl;
    let canonicalUrl = `${siteUrl}${window.location.pathname}${window.location.search}`;

    if (quickViewProduct) {
      pageTitle = `${quickViewProduct.name} | HAKKIVEDA Hakki-Pikki Tribal Hair Care`;
      pageDesc = quickViewProduct.description ? quickViewProduct.description.slice(0, 160) : `Buy ${quickViewProduct.name} - Authentic Hakki-Pikki tribal Ayurvedic formula from HAKKIVEDA. Fast worldwide express shipping.`;
      pageImage = quickViewProduct.image || logoUrl;
      const slug = quickViewProduct.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-');
      canonicalUrl = `${siteUrl}/products/${slug}`;

      // Additional Product OpenGraph tags
      setMetaTag('property', 'product:price:amount', String(quickViewProduct.priceINR || 0));
      setMetaTag('property', 'product:price:currency', currentCurrency.code || 'INR');
      setMetaTag('property', 'product:availability', quickViewProduct.inStock ? 'in stock' : 'out of stock');
    }

    document.title = pageTitle;
    setMetaTag('name', 'description', pageDesc);
    setMetaTag('name', 'keywords', pageKeywords);
    setCanonical(canonicalUrl);

    // OpenGraph
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', pageDesc);
    setMetaTag('property', 'og:image', pageImage);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', quickViewProduct ? 'product' : 'website');

    // Twitter Card
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', pageDesc);
    setMetaTag('name', 'twitter:image', pageImage);
    setMetaTag('name', 'twitter:card', 'summary_large_image');

    // Collect social links dynamically
    const sameAsList: string[] = [
      brandIdentity.socialFacebook,
      brandIdentity.socialInstagram,
      brandIdentity.socialYoutube,
      brandIdentity.socialWhatsapp ? `https://wa.me/${brandIdentity.socialWhatsapp.replace(/\D/g, '')}` : '',
      brandIdentity.socialTwitter,
      brandIdentity.socialLinkedin,
    ].filter(Boolean) as string[];

    // 1. Organization Schema
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'HAKKIVEDA',
      legalName: 'HAKKIVEDA Herbal Enterprises',
      url: siteUrl,
      logo: logoUrl,
      image: logoUrl,
      description: 'Authentic Hakki-Pikki Tribal Ayurvedic Hair Care Brand.',
      foundingLocation: {
        '@type': 'Place',
        name: 'Mysore, Karnataka',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Mysore',
          addressRegion: 'Karnataka',
          addressCountry: 'IN',
        },
      },
      businessType: 'Health & Beauty Brand',
      sameAs: sameAsList.length > 0 ? sameAsList : [
        'https://facebook.com/hakkiveda',
        'https://instagram.com/hakkiveda',
        'https://youtube.com/hakkiveda',
        'https://wa.me/917619536831',
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: phone,
          email: email,
          contactType: 'Customer Support',
          availableLanguage: ['en', 'hi', 'kn'],
          areaServed: 'Worldwide',
        },
        {
          '@type': 'ContactPoint',
          telephone: phone,
          contactType: 'WhatsApp Concierge',
          availableLanguage: ['en', 'hi', 'kn'],
          areaServed: 'Worldwide',
        },
      ],
      areaServed: 'Worldwide',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'HakkiVeda Tribal Hair Care Catalog',
        itemListElement: categories.map((cat, idx) => ({
          '@type': 'OfferCatalog',
          name: cat.name,
          position: idx + 1,
        })),
      },
    };

    // 2. WebSite Schema with SearchAction
    const webSiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'HAKKIVEDA',
      alternateName: 'HakkiVeda Tribal Ayurveda',
      description: siteSettings.seoDescription || 'Discover authentic Hakki-Pikki tribal Ayurvedic hair care from HAKKIVEDA. Shop 108 Herbs Hair Oil, Herbal Shampoo, Baldness Powder and premium natural wellness products with worldwide shipping.',
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    };

    // 3. Brand Schema
    const brandSchema = {
      '@context': 'https://schema.org',
      '@type': 'Brand',
      '@id': `${siteUrl}/#brand`,
      name: 'HAKKIVEDA',
      slogan: 'Hakki-Pikki Tribal Wisdom. Ayurvedic Healing.',
      logo: logoUrl,
      description: 'Authentic Hakki-Pikki Tribal Ayurvedic Hair Care',
    };

    // 4. LocalBusiness / HealthAndBeautyBusiness Schema
    const localBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'HealthAndBeautyBusiness',
      '@id': `${siteUrl}/#localbusiness`,
      name: 'HAKKIVEDA',
      category: 'Health and Beauty',
      url: siteUrl,
      logo: logoUrl,
      image: `${siteUrl}/images/hakkiveda_108_oil_gold.jpg`,
      description: 'Authentic Hakki-Pikki tribal Ayurvedic hair care formulation brewed in Mysore.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: addressText,
        addressLocality: 'Hunsur, Mysore',
        addressRegion: 'Karnataka',
        postalCode: '571105',
        addressCountry: 'IN',
      },
      telephone: phone,
      email: email,
      priceRange: '₹₹',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '20:00',
        },
      ],
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 12.3052,
        longitude: 76.2847,
      },
    };

    // 5. Product Schemas for active products
    const productSchemas = products.map((prod) => {
      const prodReviews = reviews.filter((r) => r.productId === prod.id || r.productName === prod.name);
      const ratingValue = prod.rating || 4.9;
      const reviewCount = prod.reviewCount || (prodReviews.length > 0 ? prodReviews.length : 48);

      const isAvailable = prod.inStock !== false;

      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `${siteUrl}/#product-${prod.id}`,
        name: prod.name,
        description: prod.description || prod.shortDescription || `${prod.name} by HAKKIVEDA. Authentic Hakki-Pikki tribal formula.`,
        image: prod.images && prod.images.length > 0 ? prod.images : [prod.image],
        sku: prod.sku || `HV-${prod.id}`,
        category: prod.category,
        brand: {
          '@type': 'Brand',
          name: 'HAKKIVEDA',
        },
        offers: {
          '@type': 'Offer',
          url: `${siteUrl}/#product-${prod.id}`,
          priceCurrency: currentCurrency.code || 'INR',
          price: prod.price,
          priceValidUntil: '2027-12-31',
          availability: isAvailable ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: {
            '@type': 'Organization',
            name: 'HAKKIVEDA',
          },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingRate: {
              '@type': 'MonetaryAmount',
              value: '0',
              currency: currentCurrency.code || 'INR',
            },
            shippingDestination: {
              '@type': 'DefinedRegion',
              addressCountry: selectedCountry?.code || 'IN',
            },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              handlingTime: {
                '@type': 'QuantitativeValue',
                minValue: 1,
                maxValue: 2,
                unitCode: 'DAY',
              },
              transitTime: {
                '@type': 'QuantitativeValue',
                minValue: 3,
                maxValue: 7,
                unitCode: 'DAY',
              },
            },
          },
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: selectedCountry?.code || 'IN',
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 7,
            returnMethod: 'https://schema.org/ReturnByMail',
            returnFees: 'https://schema.org/FreeReturn',
          },
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: ratingValue,
          bestRating: 5,
          worstRating: 1,
          ratingCount: reviewCount,
          reviewCount: reviewCount,
        },
        review: prodReviews.slice(0, 5).map((rev) => ({
          '@type': 'Review',
          author: {
            '@type': 'Person',
            name: rev.customerName || rev.author || 'Verified Buyer',
          },
          datePublished: rev.date || '2026-01-15',
          reviewBody: rev.comment || rev.content || 'Exceptional herbal hair oil, visible hair fall reduction!',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: rev.rating || 5,
            bestRating: 5,
            worstRating: 1,
          },
        })),
      };
    });

    // 6. BreadcrumbList Schema
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Herbal Collections',
          item: `${siteUrl}/#products`,
        },
        ...(quickViewProduct
          ? [
              {
                '@type': 'ListItem',
                position: 3,
                name: quickViewProduct.name,
                item: `${siteUrl}/#product-${quickViewProduct.id}`,
              },
            ]
          : []),
      ],
    };

    // 7. FAQPage Schema
    const faqData = [
      {
        q: 'What makes HAKKIVEDA 108 Herbs Hair Oil authentic?',
        a: 'HAKKIVEDA hair oils are handcrafted directly by elders of the Hakki-Pikki tribe in Mysore, Karnataka. We use 108 authentic forest botanicals and 42 wild herbs slow-cooked over woodfire in copper cauldrons for 21 days according to ancient tribal secrets.',
      },
      {
        q: 'How fast will I notice a reduction in hair fall?',
        a: 'Most customers notice a visible reduction in hair fall and scalp dryness within 14 to 21 days of consistent application 3 times a week. New hair growth and root reactivation typically appear within 60 to 90 days.',
      },
      {
        q: 'Is HAKKIVEDA suitable for all scalp types and age groups?',
        a: 'Yes! Our 100% natural, chemical-free herbal formula is safe for men, women, teenagers, and senior citizens across all scalp types (dry, oily, sensitive, or dandruff-prone).',
      },
      {
        q: 'Does HAKKIVEDA ship internationally?',
        a: 'Yes, we provide international express shipping with custom clearance to over 200+ countries including USA, UK, UAE, Canada, Australia, Singapore, Malaysia, Fiji, and Mauritius.',
      },
      {
        q: 'How should I apply HAKKIVEDA 108 Herbs Hair Oil for best results?',
        a: 'Apply 5-10 ml directly to the scalp, gently massage in circular motions using your fingertips for 10 minutes, and leave it on overnight (or at least 2 hours before washing with a mild herbal shampoo). Use 3-4 times a week.',
      },
    ];

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqData.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    };

    // 8. Article Schema for Journal & Guides (Blog posts)
    const articleSchemas = blogs.map((article) => ({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${siteUrl}/#article-${article.id}`,
      headline: article.title,
      description: article.excerpt || article.seoMetaDescription || article.title,
      image: article.imageUrl ? [article.imageUrl] : [`${siteUrl}/images/hakkiveda_108_oil_gold.jpg`],
      datePublished: article.createdAt || '2026-01-01',
      dateModified: article.updatedAt || article.createdAt || '2026-01-01',
      author: {
        '@type': 'Organization',
        name: 'HAKKIVEDA Tribal Herbalists',
        url: siteUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: 'HAKKIVEDA',
        logo: {
          '@type': 'ImageObject',
          url: logoUrl,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${siteUrl}/#blog-${article.id}`,
      },
    }));

    // 9. VideoObject Schema for Video Testimonials & Shoppable Reels
    const videoSchemas = [
      ...testimonialVideos.map((vid) => ({
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: `${vid.customerName} - HAKKIVEDA Hair Care Transformation`,
        description: vid.reviewText || 'Real customer video review showing hair fall reduction and hair density results using HAKKIVEDA 108 Herbs Hair Oil.',
        thumbnailUrl: vid.thumbnailUrl || `${siteUrl}/images/hakkiveda_108_oil_gold.jpg`,
        uploadDate: '2026-01-10T08:00:00+05:30',
        contentUrl: vid.videoUrl,
        embedUrl: vid.videoUrl,
      })),
      ...shoppableReels.map((reel) => ({
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: reel.title || 'HakkiVeda Tribal Hair Care Reel',
        description: reel.subtitle || 'Watch authentic Hakki-Pikki tribal hair care formulation in action.',
        thumbnailUrl: reel.posterUrl || `${siteUrl}/images/hakkiveda_108_oil_gold.jpg`,
        uploadDate: '2026-01-15T08:00:00+05:30',
        contentUrl: reel.videoUrl,
        embedUrl: reel.videoUrl,
      })),
    ];

    // 10. Review Schema (verified customer reviews)
    const reviewSchemas = reviews.slice(0, 10).map((rev) => ({
      '@context': 'https://schema.org',
      '@type': 'Review',
      itemReviewed: {
        '@type': 'Product',
        name: rev.productName || 'HAKKIVEDA 108 Herbs Hair Oil',
        image: `${siteUrl}/images/hakkiveda_108_oil_gold.jpg`,
      },
      author: {
        '@type': 'Person',
        name: rev.customerName || rev.author || 'Verified Buyer',
      },
      datePublished: rev.date || '2026-01-20',
      reviewBody: rev.comment || rev.content || 'Excellent Ayurvedic hair oil, completely natural and effective.',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: rev.rating || 5,
        bestRating: 5,
        worstRating: 1,
      },
    }));

    // 11. AI Quiz Schema (AI Hair Analysis Service)
    const aiQuizSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${siteUrl}/#ai-hair-analysis`,
      name: 'HAKKIVEDA AI Diagnostic Hair Analysis',
      serviceType: 'Ayurvedic Scalp & Hair Consultation',
      provider: {
        '@id': `${siteUrl}/#organization`,
      },
      description: 'Personalized 60-second AI scalp diagnostic and Dosha hair care routine generator using tribal Ayurvedic principles.',
      areaServed: 'Worldwide',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'AI Diagnostic Questions',
        itemListElement: quizQuestions.map((q, idx) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: `Question ${idx + 1}: ${q.question}`,
          },
        })),
      },
    };

    // 12. B2B Schema (Wholesale Export Service)
    const b2bSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${siteUrl}/#b2b-wholesale-export`,
      name: 'HAKKIVEDA B2B Bulk Wholesale & Global Export',
      serviceType: 'Wholesale Herbal Manufacturing & Export',
      provider: {
        '@id': `${siteUrl}/#organization`,
      },
      description: b2bSectionConfig.subtitle || 'Bulk supply, private label, and international export of authentic Hakki-Pikki tribal Ayurvedic hair care products to 200+ countries.',
      areaServed: 'Worldwide',
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: '0',
        description: 'Wholesale export bulk catalog inquiry',
        availability: 'https://schema.org/InStock',
      },
    };

    // Combine into graph or array of clean JSON-LD objects
    const allSchemas = [
      organizationSchema,
      webSiteSchema,
      brandSchema,
      localBusinessSchema,
      breadcrumbSchema,
      faqSchema,
      aiQuizSchema,
      b2bSchema,
      ...productSchemas,
      ...articleSchemas,
      ...videoSchemas,
      ...reviewSchemas,
    ];

    // Inject JSON-LD tag into head
    let scriptTag = document.getElementById('hakkiveda-jsonld-schema') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'hakkiveda-jsonld-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    scriptTag.textContent = JSON.stringify(allSchemas, null, 2);

    return () => {
      // Keep tag in head or cleanup if needed
    };
  }, [
    siteSettings,
    brandIdentity,
    footerConfig,
    b2bSectionConfig,
    products,
    categories,
    blogs,
    reviews,
    testimonialVideos,
    shoppableReels,
    quizQuestions,
    currentCurrency,
    selectedCountry,
    quickViewProduct,
  ]);

  return null;
};
