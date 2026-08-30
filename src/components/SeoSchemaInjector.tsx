import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');

const normalizeCanonicalDomain = (url: string, siteUrl: string): string => {
  return url
    .replace(/^https?:\/\/(?:localhost(:\d+)?|[\w-]+\.run\.app|hakkiveda\.store|api\.hakkiveda\.com)/i, siteUrl)
    .replace(/([^:]\/)\/+/g, '$1');
};

const toAbsoluteUrl = (url: string | undefined | null, fallback: string, siteUrl: string): string => {
  if (!url) return fallback;
  const trimmed = url.trim();
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return fallback;
  if (trimmed.endsWith('.svg')) return fallback;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return normalizeCanonicalDomain(trimmed, siteUrl);
  }
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${siteUrl}${cleanPath}`;
};

const CATEGORY_FAQS_MAP: Record<string, Array<{ q: string; a: string }>> = {
  'hair-care': [
    {
      q: 'How soon can I expect visible results and reduced hair fall?',
      a: 'Most customers notice a noticeable reduction in routine hair shedding and breakage within 14 to 21 days of consistent 3x weekly oiling and shampooing. Visible improvements in scalp nourishment, strand thickness, and hair vitality typically appear within 45 to 60 days of regular ritual care.',
    },
    {
      q: 'Is HAKKIVEDA Hair Care safe for color-treated or bleached hair?',
      a: 'Yes, 100%! All our hair care products are sulfate-free, paraben-free, and formulated with 100% cold-pressed virgin oils that preserve color vibrance while restoring moisture lost during chemical treatments.',
    },
    {
      q: 'How often should I apply the 108 Herbs Hair Oil?',
      a: 'For optimal scalp stimulation, apply 10-15ml of warm oil 3 times a week. Massage thoroughly into dry scalp for 5 minutes and leave it on overnight or for at least 2 hours before washing.',
    },
    {
      q: 'Do I need to wash out the Root Density Follicle Serum?',
      a: 'No! The Root Density Serum is a lightweight, non-greasy aqueous formula designed to be left on the scalp daily. Apply 1 full dropper onto scalp sections and leave it in.',
    },
  ],
  'skin-care': [
    {
      q: 'What is an Adivasi Lepa and how is it used?',
      a: 'Lepa is a traditional Adivasi paste made by mixing finely ground wild herbs, clay, and botanicals with water, hydrosol, or oil. It is applied topically to detoxify, soothe, and nourish the skin or scalp.',
    },
    {
      q: 'Is the Lepa suitable for sensitive skin or facial use?',
      a: 'Yes, our Lepas are 100% natural and free from chemical fillers. We recommend performing a 24-hour patch test behind the ear or inner wrist prior to full facial or scalp application.',
    },
    {
      q: 'How often should I apply the Skin Care Lepa?',
      a: 'Apply 2 to 3 times a week for optimal deep cleansing and skin barrier replenishment. Leave on for 15-20 minutes until semi-dry, then rinse with lukewarm water.',
    },
  ],
  'tribal-wellness': [
    {
      q: 'What is included in the Tribal Wellness Regrowth Kit?',
      a: 'The complete kit includes 1x HAKKIVEDA 108 Herbs Hair Oil (200ml), 1x Herbal Baldness Care Powder (150g), 1x 42 Herbs Shampoo (250ml), plus a complimentary handcrafted brass head massager tool.',
    },
    {
      q: 'Why is a 90-day regimen recommended for tribal remedies?',
      a: 'Hair growth follows natural 90-day follicular cycles. The Hakki-Pikki tribe traditional regimen aligns with 3 lunar cycles to allow deep botanical lipid absorption, scalp detoxification, and new root sprouting.',
    },
    {
      q: 'Are there any dietary or lifestyle guidelines during the regimen?',
      a: 'For best results, maintain good hydration, avoid washing hair with scalding hot water, and allow hair to air-dry naturally after applying the shampoo and oil.',
    },
  ],
};

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
    currentCurrency,
    quickViewProduct,
  } = useStore();

  const [currentLocationPath, setCurrentLocationPath] = useState<string>(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  useEffect(() => {
    const handleLocationChange = () => {
      if (typeof window !== 'undefined') {
        setCurrentLocationPath(window.location.pathname);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('app:navigate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('app:navigate', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    const siteUrl = 'https://hakkiveda.com';
    const fallbackSocialImage = `${siteUrl}/images/hakkiveda_og_social_1200x630.jpg`;
    const defaultProductImage = `${siteUrl}/images/hakkiveda_108_oil_gold.jpg`;

    const rawLogo =
      brandIdentity.mainLogoLight ||
      brandIdentity.mainLogoDark ||
      footerConfig.brandLogo ||
      defaultProductImage;
    const logoUrl = toAbsoluteUrl(rawLogo, defaultProductImage, siteUrl);

    const phone = siteSettings.contactPhone || brandIdentity.phone || '+917619536831';
    const email = siteSettings.contactEmail || brandIdentity.email || 'support@hakkiveda.com';
    const addressText = footerConfig.address || siteSettings.contactAddress || 'Door No. 574, V.P. Bore, Hunsur, Mysore, Karnataka 571105, India';

    // ------------------------------------
    // DYNAMIC HEAD & META TAG HELPERS
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

    const removeMetaTag = (nameOrProperty: 'name' | 'property', key: string) => {
      const tag = document.querySelector(`meta[${nameOrProperty}="${key}"]`);
      if (tag && tag.parentNode) {
        tag.parentNode.removeChild(tag);
      }
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

    // ------------------------------------
    // ROUTE PARSING & METADATA RESOLUTION
    // ------------------------------------
    const rawPath = typeof window !== 'undefined' ? window.location.pathname : currentLocationPath;
    const cleanPath = (rawPath || '/').split('?')[0].split('#')[0];
    const canonicalPath = cleanPath === '/' ? '/' : cleanPath.replace(/\/+$/, '');
    const canonicalUrl = canonicalPath === '/' ? `${siteUrl}/` : `${siteUrl}${canonicalPath}`;

    let pageTitle = siteSettings.siteTitle || 'HAKKIVEDA | Authentic Hakki-Pikki Tribal Ayurvedic Hair Care';
    let pageDesc = siteSettings.seoDescription || 'Discover authentic Hakki-Pikki tribal Ayurvedic hair care from HAKKIVEDA. Shop 108 Herbs Hair Oil, Herbal Shampoo, Baldness Powder and premium natural wellness products with worldwide shipping.';
    let pageKeywords = siteSettings.seoKeywords || 'HAKKIVEDA, Adivasi Hair Oil, 108 Herbs Hair Oil, Hakki Pikki Tribe, Ayurvedic Hair Oil, Herbal Hair Growth, Natural Hair Care, Herbal Shampoo, Hair Fall Solution, Ayurvedic Wellness';
    let pageImage = fallbackSocialImage;
    let ogType = 'website';
    let isProductPage = false;
    let targetProductForMeta: typeof products[0] | null = null;
    let targetBlogForMeta: typeof blogs[0] | null = null;

    // 1. Check Product Reviews Route: /products/:slug/reviews
    const reviewsMatch = cleanPath.match(/^\/products\/([^/]+)\/reviews\/?$/i);
    // 2. Check Product Detail Route: /products/:slug or /product/:slug
    const productMatch = !reviewsMatch && cleanPath.match(/^\/products?\/([^/]+)\/?$/i);
    // 3. Check Journal Article Route: /journal/:slug or /blog/:slug
    const journalArticleMatch = cleanPath.match(/^\/(?:journal|blog)\/([^/]+)\/?$/i);

    if (reviewsMatch) {
      const slug = decodeURIComponent(reviewsMatch[1]);
      const matchedProd = products.find(
        (p) => (p.slug && p.slug === slug) || slugify(p.name || '') === slug || String(p.id) === slug
      );
      if (matchedProd) {
        isProductPage = true;
        targetProductForMeta = matchedProd;
        ogType = 'product';
        pageTitle = `Customer Reviews — ${matchedProd.name} | Verified Results - HAKKIVEDA`;
        pageDesc = `Read verified customer reviews, hair growth testimonials, and ratings for ${matchedProd.name}. Handcrafted with 108 wild herbs by the Hakki-Pikki tribe.`;
        pageKeywords = `${matchedProd.name} reviews, ${matchedProd.name} results, Hakki Pikki hair oil reviews, HAKKIVEDA customer ratings`;
        pageImage = toAbsoluteUrl(matchedProd.images?.[0] || matchedProd.image, defaultProductImage, siteUrl);
      } else {
        pageTitle = 'Customer Reviews & Real Results | HAKKIVEDA Tribal Ayurveda';
        pageDesc = 'Explore genuine customer transformations, hair fall reduction stories, and verified reviews for HAKKIVEDA ancestral formulations.';
      }
    } else if (productMatch) {
      const slug = decodeURIComponent(productMatch[1]);
      const matchedProd = products.find(
        (p) => (p.slug && p.slug === slug) || slugify(p.name || '') === slug || String(p.id) === slug
      );
      if (matchedProd) {
        isProductPage = true;
        targetProductForMeta = matchedProd;
        ogType = 'product';
        pageTitle = matchedProd.seoTitle || `${matchedProd.name} | 100% Authentic Adivasi Formulation - HAKKIVEDA`;
        pageDesc = matchedProd.seoDescription || (matchedProd.description
          ? matchedProd.description.slice(0, 160)
          : `Buy authentic ${matchedProd.name} online from HAKKIVEDA. Handcrafted with traditional Hakki-Pikki tribal herbs for proven root density and hair fall control. Free express worldwide delivery.`);
        pageKeywords = matchedProd.seoKeywords || `${matchedProd.name}, Adivasi Hair Oil, Hakki Pikki Oil, Herbal Hair Care, 108 Herbs Formulation, HAKKIVEDA`;
        pageImage = toAbsoluteUrl(matchedProd.images?.[0] || matchedProd.image, defaultProductImage, siteUrl);
      }
    } else if (journalArticleMatch) {
      const slug = decodeURIComponent(journalArticleMatch[1]);
      const matchedBlog = blogs.find(
        (b) => (b.slug && b.slug === slug) || slugify(b.title || '') === slug || String(b.id) === slug
      );
      if (matchedBlog) {
        targetBlogForMeta = matchedBlog;
        ogType = 'article';
        pageTitle = `${matchedBlog.title} | HAKKIVEDA Ayurvedic Journal`;
        pageDesc = matchedBlog.excerpt || matchedBlog.seoMetaDescription || matchedBlog.title;
        pageKeywords = matchedBlog.tags?.join(', ') || 'Ayurvedic hair care tips, Hakki Pikki tribal secrets, natural hair growth remedies, HAKKIVEDA';
        pageImage = toAbsoluteUrl(matchedBlog.imageUrl || matchedBlog.image, defaultProductImage, siteUrl);
      }
    } else if (cleanPath === '/hair-care') {
      pageTitle = 'Hair Care Formulations | Adivasi Hair Oils & Serums - HAKKIVEDA';
      pageDesc = 'Shop authentic Hakki-Pikki Adivasi Hair Care formulations. 108 Mountain Herbs Hair Oil, 42 Herbs Shampoo, and Root Density Serums. Free express worldwide shipping.';
      pageImage = `${siteUrl}/images/hakkiveda_108_oil_gold.jpg`;
      pageKeywords = 'Adivasi Hair Oil, 108 Herbs Oil, Herbal Shampoo, Hakki Pikki Tribe, Ayurvedic Hair Growth, HAKKIVEDA Hair Care';
    } else if (cleanPath === '/skin-care') {
      pageTitle = 'Skin Care & Lepas | Forest Botanical Muds - HAKKIVEDA';
      pageDesc = 'Discover authentic Adivasi Skin Care and herbal Lepas. Forest-harvested mud packs, neem powders, and restorative clay masks handcrafted in Mysore.';
      pageImage = `${siteUrl}/images/hakkiveda_baldness_powder.jpg`;
      pageKeywords = 'Adivasi Skin Care, Herbal Lepa, Forest Mud Pack, Neem Clay Mask, Tribal Skin Healing, HAKKIVEDA';
    } else if (cleanPath === '/tribal-wellness') {
      pageTitle = 'Tribal Wellness & Regrowth Combos | Adivasi Kits - HAKKIVEDA';
      pageDesc = 'Explore 90-day ancestral Hair Care and Tribal Wellness kits. Complete Adivasi regrowth systems handcrafted in Mysore with 108 mountain herbs.';
      pageImage = `${siteUrl}/images/hakkiveda_oil_couple_herbs.jpg`;
      pageKeywords = 'Tribal Wellness Kits, 90 Day Regrowth Combo, Adivasi Hair Kit, Hakki Pikki Hair Package, HAKKIVEDA Combos';
    } else if (cleanPath === '/our-story' || cleanPath === '/story' || cleanPath === '/about-us') {
      pageTitle = 'Our Heritage & Hakki-Pikki Tribal Origins | HAKKIVEDA';
      pageDesc = 'Discover the ancestral roots of HAKKIVEDA. Handcrafted by the Hakki-Pikki tribe in Mysore using 108 sacred forest herbs and centuries-old Ayurvedic traditions.';
      pageImage = fallbackSocialImage;
      pageKeywords = 'Hakki Pikki Tribe History, Adivasi Ayurveda Origin, Mysore Herbal Heritage, Tribal Hair Craft, HAKKIVEDA Story';
    } else if (cleanPath === '/our-tribal-roots' || cleanPath === '/tribal-heritage') {
      pageTitle = 'The Hakki-Pikki Tribe — Guardians of Forest Ayurveda | HAKKIVEDA';
      pageDesc = 'Learn about the Hakki-Pikki tribal community of Karnataka, their nomadic botanical wisdom, and their sacred relationship with medicinal forest flora.';
      pageImage = fallbackSocialImage;
      pageKeywords = 'Hakki Pikki Community, Nomadic Botanical Wisdom, Forest Herbs Mysore, Tribal Forest Guardians, HAKKIVEDA Roots';
    } else if (cleanPath === '/how-hakkiveda-is-made' || cleanPath === '/craft' || cleanPath === '/how-it-is-made') {
      pageTitle = 'Ancestral Woodfire Craft & 21-Day Slow Brewing Process | HAKKIVEDA';
      pageDesc = 'Explore our 21-day copper cauldron brewing ritual. 108 wild herbs, sesame oil base, and gentle woodfire distillation perfected by tribal elders.';
      pageImage = `${siteUrl}/images/hakkiveda_108_herbs_infographic.jpg`;
      pageKeywords = 'Copper Cauldron Hair Oil, 21 Day Ayurvedic Brewing, Woodfire Distillation, 108 Wild Herbs Extraction, HAKKIVEDA Craft';
    } else if (cleanPath === '/b2b' || cleanPath === '/b2b-enquiry' || cleanPath === '/export-enquiry') {
      pageTitle = 'B2B Wholesale & Global Export Enquiry | HAKKIVEDA';
      pageDesc = 'Partner with HAKKIVEDA for bulk Ayurvedic herbal distribution, private labeling, and worldwide export to over 200+ countries.';
      pageImage = defaultProductImage;
      pageKeywords = 'Adivasi Hair Oil Bulk Wholesale, Hakki Pikki Export, Ayurvedic Product Exporter India, Herbal Private Label, HAKKIVEDA B2B';
    } else if (cleanPath === '/video-rituals' || cleanPath === '/rituals' || cleanPath === '/reels') {
      pageTitle = 'Hakki-Pikki Hair Rituals & Video Gallery | HAKKIVEDA';
      pageDesc = 'Watch traditional scalp massage techniques, customer hair transformations, and behind-the-scenes video rituals from HAKKIVEDA.';
      pageImage = `${siteUrl}/images/hakkiveda_oil_couple_herbs.jpg`;
      pageKeywords = 'Ayurvedic Hair Massage Ritual, Hakki Pikki Video Guides, Adivasi Hair Application, HAKKIVEDA Video Gallery';
    } else if (cleanPath === '/journal' || cleanPath === '/blog' || cleanPath === '/blogs' || cleanPath === '/the-journal') {
      pageTitle = 'The Tribal Wellness Journal — Ayurvedic Hair & Scalp Wisdom | HAKKIVEDA';
      pageDesc = 'Evidence-based Ayurvedic guides, herbal ingredient deep-dives, and Hakki-Pikki tribal remedies for hair growth, dandruff, and scalp vitality.';
      pageImage = defaultProductImage;
      pageKeywords = 'Ayurvedic Hair Growth Blog, Hakki Pikki Herbal Journal, Tribal Scalp Guides, Hair Fall Natural Solutions, HAKKIVEDA Journal';
    } else if (cleanPath === '/privacy-policy' || cleanPath === '/privacy') {
      pageTitle = 'Privacy Policy | HAKKIVEDA Herbal Enterprises';
      pageDesc = 'Learn how HAKKIVEDA protects your privacy, personal information, customer account data, and secures payment transactions via PCI-DSS certified gateway.';
      pageImage = fallbackSocialImage;
      pageKeywords = 'HAKKIVEDA Privacy Policy, customer data security, payment security, cookie policy, Hakki Pikki store privacy';
    } else if (cleanPath === '/terms-and-conditions' || cleanPath === '/terms' || cleanPath === '/terms-of-service') {
      pageTitle = 'Terms & Conditions | HAKKIVEDA Herbal Enterprises';
      pageDesc = 'Read the official Terms and Conditions for HAKKIVEDA. Learn about order placement, customer accounts, intellectual property, and botanical product sales.';
      pageImage = fallbackSocialImage;
      pageKeywords = 'HAKKIVEDA Terms and Conditions, website terms, store policies, commercial terms, user agreement';
    } else if (cleanPath === '/shipping-policy' || cleanPath === '/shipping') {
      pageTitle = 'Shipping & Delivery Policy | Domestic & International - HAKKIVEDA';
      pageDesc = 'Discover HAKKIVEDA shipping timelines, domestic COD delivery, international air express logistics, courier tracking, and destination customs duty guidance.';
      pageImage = fallbackSocialImage;
      pageKeywords = 'HAKKIVEDA Shipping Policy, delivery timelines, express courier, international shipping, customs duty';
    } else if (cleanPath === '/refund-policy' || cleanPath === '/refunds' || cleanPath === '/returns' || cleanPath === '/return-policy') {
      pageTitle = 'Return & Refund Policy | HAKKIVEDA Herbal Enterprises';
      pageDesc = 'Understand our return, replacement, and refund policies for damaged or missing items, personal care hygiene guidelines, and reimbursement timelines.';
      pageImage = fallbackSocialImage;
      pageKeywords = 'HAKKIVEDA Refund Policy, return policy, damaged item replacement, order refund, hygiene policy';
    } else if (cleanPath === '/cancellation-policy' || cleanPath === '/cancellation') {
      pageTitle = 'Cancellation Policy | HAKKIVEDA Herbal Enterprises';
      pageDesc = 'Guidelines for order modification and pre-dispatch cancellation for domestic and international orders on HAKKIVEDA.';
      pageImage = fallbackSocialImage;
      pageKeywords = 'HAKKIVEDA Cancellation Policy, cancel order, order modification, pre-dispatch cancellation';
    } else if (cleanPath === '/disclaimer' || cleanPath === '/disclaimers') {
      pageTitle = 'Botanical & Product Disclaimer | HAKKIVEDA Herbal Enterprises';
      pageDesc = 'General informational disclaimer, Ayurvedic herbal cosmetics disclosure, patch test advice, and individual results variability for HAKKIVEDA.';
      pageImage = fallbackSocialImage;
      pageKeywords = 'HAKKIVEDA Disclaimer, Ayurvedic herbal disclaimer, cosmetic disclosure, patch test recommendation';
    } else if (cleanPath === '/contact' || cleanPath === '/contact-us' || cleanPath === '/support') {
      pageTitle = 'Contact Us & Customer Support | HAKKIVEDA Herbal Enterprises';
      pageDesc = 'Get in touch with HAKKIVEDA customer care. Official address in Mysore, phone +91 76195 36831, email support@hakkiveda.com, and WhatsApp concierge.';
      pageImage = fallbackSocialImage;
      pageKeywords = 'Contact HAKKIVEDA, customer support, Mysore office, customer care phone, WhatsApp support, grievance redressal';
    } else if (cleanPath === '/legal' || cleanPath === '/legal-center' || cleanPath === '/policies') {
      pageTitle = 'Legal & Customer Care Policy Directory | HAKKIVEDA';
      pageDesc = 'Official directory of HAKKIVEDA legal terms, privacy guidelines, shipping rates, refund rules, and consumer care policies.';
      pageImage = fallbackSocialImage;
      pageKeywords = 'HAKKIVEDA Legal Directory, store policies, privacy, terms, shipping, refunds';
    } else if (quickViewProduct && cleanPath === '/') {
      pageTitle = `${quickViewProduct.name} | HAKKIVEDA Hakki-Pikki Tribal Hair Care`;
      pageDesc = quickViewProduct.description ? quickViewProduct.description.slice(0, 160) : `Buy ${quickViewProduct.name} - Authentic Hakki-Pikki tribal Ayurvedic formula from HAKKIVEDA. Fast worldwide express shipping.`;
      pageImage = toAbsoluteUrl(quickViewProduct.images?.[0] || quickViewProduct.image, defaultProductImage, siteUrl);
    }

    // Apply Head Tags
    document.title = pageTitle;
    setMetaTag('name', 'description', pageDesc);
    setMetaTag('name', 'keywords', pageKeywords);
    setCanonical(canonicalUrl);

    // OpenGraph
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', pageDesc);
    setMetaTag('property', 'og:image', pageImage);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', 'HAKKIVEDA');

    // Twitter Card
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', pageDesc);
    setMetaTag('name', 'twitter:image', pageImage);
    setMetaTag('name', 'twitter:url', canonicalUrl);
    setMetaTag('name', 'twitter:card', 'summary_large_image');

    // Product-specific OpenGraph tags
    if (isProductPage && targetProductForMeta) {
      setMetaTag('property', 'product:price:amount', String(targetProductForMeta.priceINR || targetProductForMeta.price || 0));
      setMetaTag('property', 'product:price:currency', currentCurrency?.code || 'INR');
      setMetaTag('property', 'product:availability', targetProductForMeta.inStock !== false ? 'in stock' : 'out of stock');
    } else {
      removeMetaTag('property', 'product:price:amount');
      removeMetaTag('property', 'product:price:currency');
      removeMetaTag('property', 'product:availability');
    }

    // Collect social links dynamically
    const sameAsList: string[] = [
      brandIdentity.socialFacebook,
      brandIdentity.socialInstagram,
      brandIdentity.socialYoutube,
      brandIdentity.socialWhatsapp ? `https://wa.me/${brandIdentity.socialWhatsapp.replace(/\D/g, '')}` : '',
      brandIdentity.socialTwitter,
      brandIdentity.socialLinkedin,
    ].filter(Boolean) as string[];

    // =========================================================================
    // STRUCTURED DATA (JSON-LD) GENERATION — ROUTE-SPECIFIC & REAL DATA ONLY
    // =========================================================================

    const schemasToInject: object[] = [];

    // 1. Organization Schema (Universal Brand Entity)
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'HAKKIVEDA',
      legalName: 'HAKKIVEDA Herbal Enterprises',
      url: siteUrl,
      logo: logoUrl,
      image: fallbackSocialImage,
      description: 'Authentic Hakki-Pikki tribal Ayurvedic hair care and natural wellness formulations handcrafted in Mysore, Karnataka.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Door No. 574, V.P. Bore, Hunsur',
        addressLocality: 'Mysore',
        addressRegion: 'Karnataka',
        postalCode: '571105',
        addressCountry: 'IN',
      },
      telephone: phone,
      email: email,
      sameAs: sameAsList.length > 0 ? sameAsList : [
        'https://facebook.com/hakkiveda',
        'https://instagram.com/hakkiveda',
        'https://youtube.com/@hakkiveda',
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
      ],
    };

    // 2. WebSite Schema (Canonical Domain)
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
    };

    // 3. Dynamic Route-Specific BreadcrumbList Schema
    const breadcrumbItems = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${siteUrl}/`,
      },
    ];

    if (cleanPath === '/hair-care') {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Hair Care Formulations',
        item: `${siteUrl}/hair-care`,
      });
    } else if (cleanPath === '/skin-care') {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Skin Care & Lepas',
        item: `${siteUrl}/skin-care`,
      });
    } else if (cleanPath === '/tribal-wellness') {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Tribal Wellness & Combos',
        item: `${siteUrl}/tribal-wellness`,
      });
    } else if (cleanPath === '/journal' || cleanPath === '/blog' || cleanPath === '/blogs') {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Tribal Wellness Journal',
        item: `${siteUrl}/journal`,
      });
    } else if (journalArticleMatch && targetBlogForMeta) {
      const artSlug = targetBlogForMeta.slug || slugify(targetBlogForMeta.title || String(targetBlogForMeta.id));
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Journal',
        item: `${siteUrl}/journal`,
      });
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 3,
        name: targetBlogForMeta.title,
        item: `${siteUrl}/journal/${artSlug}`,
      });
    } else if (isProductPage && targetProductForMeta) {
      const catSlug = targetProductForMeta.primaryCategory || 'hair-care';
      const catName = targetProductForMeta.category || 'Hair Care';
      const prodSlug = targetProductForMeta.slug || slugify(targetProductForMeta.name || String(targetProductForMeta.id));
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: catName,
        item: `${siteUrl}/${catSlug}`,
      });
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 3,
        name: targetProductForMeta.name,
        item: `${siteUrl}/products/${prodSlug}`,
      });
    } else if (cleanPath === '/our-story' || cleanPath === '/story' || cleanPath === '/about-us') {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Our Story',
        item: `${siteUrl}/our-story`,
      });
    } else if (cleanPath === '/our-tribal-roots' || cleanPath === '/tribal-heritage') {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Tribal Roots',
        item: `${siteUrl}/our-tribal-roots`,
      });
    } else if (cleanPath === '/how-hakkiveda-is-made' || cleanPath === '/craft' || cleanPath === '/how-it-is-made') {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Ancestral Craft',
        item: `${siteUrl}/how-hakkiveda-is-made`,
      });
    } else if (cleanPath === '/b2b' || cleanPath === '/b2b-enquiry' || cleanPath === '/export-enquiry') {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: 'B2B Wholesale & Export',
        item: `${siteUrl}/b2b-enquiry`,
      });
    } else if (cleanPath === '/video-rituals' || cleanPath === '/rituals' || cleanPath === '/reels') {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Video Rituals',
        item: `${siteUrl}/video-rituals`,
      });
    }

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems,
    };

    // Always include Organization, WebSite, and BreadcrumbList
    schemasToInject.push(organizationSchema);
    schemasToInject.push(webSiteSchema);
    schemasToInject.push(breadcrumbSchema);

    // -------------------------------------------------------------------------
    // ROUTE CASE 1: PRODUCT DETAIL ROUTE (/products/:slug or /product/:slug)
    // -------------------------------------------------------------------------
    if (isProductPage && targetProductForMeta) {
      const prod = targetProductForMeta;
      const prodSlug = prod.slug || slugify(prod.name || String(prod.id));
      const isAvailable = prod.inStock !== false && (prod.stock === undefined || prod.stock > 0);
      const prodImageAbsolute = toAbsoluteUrl(prod.images?.[0] || prod.image, defaultProductImage, siteUrl);

      // Match genuine reviews only
      const genuineReviews = reviews.filter(
        (r) => r.productId === prod.id || (r.productName && r.productName.toLowerCase() === prod.name.toLowerCase())
      );

      const productSchemaObj: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `${siteUrl}/products/${prodSlug}#product`,
        name: prod.name,
        description: prod.description || prod.shortDescription || `${prod.name} by HAKKIVEDA. Authentic Hakki-Pikki tribal formula.`,
        image: prod.images && prod.images.length > 0
          ? prod.images.map((img: string) => toAbsoluteUrl(img, defaultProductImage, siteUrl))
          : [prodImageAbsolute],
        sku: prod.sku || `HV-${prod.id}`,
        category: prod.category,
        brand: {
          '@type': 'Brand',
          name: 'HAKKIVEDA',
        },
        url: `${siteUrl}/products/${prodSlug}`,
        offers: {
          '@type': 'Offer',
          url: `${siteUrl}/products/${prodSlug}`,
          priceCurrency: 'INR',
          price: prod.priceINR || prod.price,
          priceValidUntil: '2027-12-31',
          availability: isAvailable ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: {
            '@type': 'Organization',
            name: 'HAKKIVEDA',
          },
        },
      };

      // ONLY emit aggregateRating and review when genuine reviews exist (no fabricated data)
      if (genuineReviews.length > 0) {
        const sumRating = genuineReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
        const actualRatingValue = Number((sumRating / genuineReviews.length).toFixed(2));
        const actualReviewCount = genuineReviews.length;

        productSchemaObj.aggregateRating = {
          '@type': 'AggregateRating',
          ratingValue: actualRatingValue,
          bestRating: 5,
          worstRating: 1,
          ratingCount: actualReviewCount,
          reviewCount: actualReviewCount,
        };

        productSchemaObj.review = genuineReviews.map((rev) => ({
          '@type': 'Review',
          author: {
            '@type': 'Person',
            name: rev.customerName || rev.author || 'Verified Buyer',
          },
          datePublished: rev.date || '2026-07-01',
          reviewBody: rev.comment || rev.content || rev.title || 'Verified customer review.',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: Number(rev.rating) || 5,
            bestRating: 5,
            worstRating: 1,
          },
        }));
      }

      schemasToInject.push(productSchemaObj);
    }

    // -------------------------------------------------------------------------
    // ROUTE CASE 2: SINGLE JOURNAL ARTICLE (/journal/:slug or /blog/:slug)
    // -------------------------------------------------------------------------
    else if (journalArticleMatch && targetBlogForMeta) {
      const art = targetBlogForMeta;
      const artSlug = art.slug || slugify(art.title || String(art.id));
      const artImage = toAbsoluteUrl(art.imageUrl || art.image, defaultProductImage, siteUrl);

      const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': `${siteUrl}/journal/${artSlug}#article`,
        headline: art.title,
        description: art.excerpt || art.seoMetaDescription || art.title,
        image: [artImage],
        datePublished: art.date || art.createdAt || '2026-01-01',
        dateModified: art.updatedAt || art.date || art.createdAt || '2026-01-01',
        author: {
          '@type': 'Person',
          name: art.author || 'Dr. A. V. Shastri (Chief Vaidya)',
        },
        publisher: {
          '@type': 'Organization',
          name: 'HAKKIVEDA',
          url: siteUrl,
          logo: {
            '@type': 'ImageObject',
            url: logoUrl,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${siteUrl}/journal/${artSlug}`,
        },
        url: `${siteUrl}/journal/${artSlug}`,
      };

      schemasToInject.push(articleSchema);
    }

    // -------------------------------------------------------------------------
    // ROUTE CASE 3: JOURNAL LISTING (/journal, /blog, /blogs)
    // -------------------------------------------------------------------------
    else if (cleanPath === '/journal' || cleanPath === '/blog' || cleanPath === '/blogs') {
      const journalCollectionSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${siteUrl}/journal`,
        url: `${siteUrl}/journal`,
        name: pageTitle,
        description: pageDesc,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: blogs.map((art, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            url: `${siteUrl}/journal/${art.slug || slugify(art.title || String(art.id))}`,
            name: art.title,
          })),
        },
      };

      schemasToInject.push(journalCollectionSchema);
    }

    // -------------------------------------------------------------------------
    // ROUTE CASE 4: CATEGORY ROUTES (/hair-care, /skin-care, /tribal-wellness)
    // -------------------------------------------------------------------------
    else if (cleanPath === '/hair-care' || cleanPath === '/skin-care' || cleanPath === '/tribal-wellness') {
      const catKey = cleanPath.replace(/^\//, '');
      const filteredCategoryProds = products.filter((p) => {
        if (cleanPath === '/hair-care') return p.primaryCategory === 'hair-care' || (p.category && (p.category.includes('Hair') || p.category.includes('Cleanser') || p.category.includes('Serum')));
        if (cleanPath === '/skin-care') return p.primaryCategory === 'skin-care' || (p.category && (p.category.includes('Mask') || p.category.includes('Lepa') || p.category.includes('Skin')));
        if (cleanPath === '/tribal-wellness') return p.primaryCategory === 'tribal-wellness' || (p.category && (p.category.includes('Wellness') || p.category.includes('Combo')));
        return true;
      });

      const categoryCollectionSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${siteUrl}${cleanPath}`,
        url: `${siteUrl}${cleanPath}`,
        name: pageTitle,
        description: pageDesc,
        image: pageImage,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: filteredCategoryProds.map((p, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            url: `${siteUrl}/products/${p.slug || slugify(p.name || String(p.id))}`,
            name: p.name,
          })),
        },
      };

      schemasToInject.push(categoryCollectionSchema);

      // Visible category FAQs
      const categoryFaqs = CATEGORY_FAQS_MAP[catKey];
      if (categoryFaqs && categoryFaqs.length > 0) {
        const categoryFaqSchema = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: categoryFaqs.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.a,
            },
          })),
        };
        schemasToInject.push(categoryFaqSchema);
      }
    }

    // -------------------------------------------------------------------------
    // ROUTE CASE 5: HOMEPAGE (/)
    // -------------------------------------------------------------------------
    else if (cleanPath === '/') {
      // Include Brand Schema
      const brandSchema = {
        '@context': 'https://schema.org',
        '@type': 'Brand',
        '@id': `${siteUrl}/#brand`,
        name: 'HAKKIVEDA',
        slogan: 'Hakki-Pikki Tribal Wisdom. Ayurvedic Healing.',
        logo: logoUrl,
        description: 'Authentic Hakki-Pikki Tribal Ayurvedic Hair Care',
      };
      schemasToInject.push(brandSchema);

      // Include visible Video Objects for Testimonials & Shoppable Reels on homepage
      if (testimonialVideos && testimonialVideos.length > 0) {
        testimonialVideos.forEach((vid) => {
          schemasToInject.push({
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            name: `${vid.customerName} - HAKKIVEDA Hair Care Transformation`,
            description: vid.reviewText || 'Real customer video review showing hair fall reduction and hair density results using HAKKIVEDA 108 Herbs Hair Oil.',
            thumbnailUrl: toAbsoluteUrl(vid.thumbnailUrl, defaultProductImage, siteUrl),
            uploadDate: '2026-01-10T08:00:00+05:30',
            contentUrl: vid.videoUrl,
            embedUrl: vid.videoUrl,
          });
        });
      }

      if (shoppableReels && shoppableReels.length > 0) {
        shoppableReels.forEach((reel) => {
          schemasToInject.push({
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            name: reel.title || 'HakkiVeda Tribal Hair Care Reel',
            description: reel.subtitle || 'Watch authentic Hakki-Pikki tribal hair care formulation in action.',
            thumbnailUrl: toAbsoluteUrl(reel.posterUrl, defaultProductImage, siteUrl),
            uploadDate: '2026-01-15T08:00:00+05:30',
            contentUrl: reel.videoUrl,
            embedUrl: reel.videoUrl,
          });
        });
      }
    }

    // -------------------------------------------------------------------------
    // ROUTE CASE 6: VIDEO RITUALS GALLERY (/video-rituals, /rituals, /reels)
    // -------------------------------------------------------------------------
    else if (cleanPath === '/video-rituals' || cleanPath === '/rituals' || cleanPath === '/reels') {
      if (testimonialVideos && testimonialVideos.length > 0) {
        testimonialVideos.forEach((vid) => {
          schemasToInject.push({
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            name: `${vid.customerName} - HAKKIVEDA Hair Care Transformation`,
            description: vid.reviewText || 'Real customer video review showing hair fall reduction and hair density results using HAKKIVEDA 108 Herbs Hair Oil.',
            thumbnailUrl: toAbsoluteUrl(vid.thumbnailUrl, defaultProductImage, siteUrl),
            uploadDate: '2026-01-10T08:00:00+05:30',
            contentUrl: vid.videoUrl,
            embedUrl: vid.videoUrl,
          });
        });
      }
    }

    // -------------------------------------------------------------------------
    // ROUTE CASE 7: B2B ENQUIRY (/b2b, /b2b-enquiry, /export-enquiry)
    // -------------------------------------------------------------------------
    else if (cleanPath === '/b2b' || cleanPath === '/b2b-enquiry' || cleanPath === '/export-enquiry') {
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
      schemasToInject.push(b2bSchema);
    }

    // -------------------------------------------------------------------------
    // INJECT CLEAN JSON-LD INTO HEAD (ATOMIC REPLACEMENT ON SPA NAVIGATION)
    // -------------------------------------------------------------------------
    let scriptTag = document.getElementById('hakkiveda-jsonld-schema') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'hakkiveda-jsonld-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    scriptTag.textContent = JSON.stringify(schemasToInject, null, 2);

  }, [
    currentLocationPath,
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
    currentCurrency,
    quickViewProduct,
  ]);

  return null;
};
