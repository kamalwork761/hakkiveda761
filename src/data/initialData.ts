import {
  Category,
  Product,
  Currency,
  HeroSlide,
  BeforeAfterItem,
  Review,
  BlogArticle,
  Coupon,
  User,
  SiteSettings,
  NavLink,
  TestimonialVideo,
  QuizQuestion,
  MediaItem,
  CountrySetting,
} from '../types/store';

export const INITIAL_CURRENCIES: Currency[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rateToINR: 1, country: 'India', flag: '🇮🇳' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rateToINR: 62.5, country: 'Singapore', flag: '🇸🇬' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', rateToINR: 18.8, country: 'Malaysia', flag: '🇲🇾' },
  { code: 'FJD', symbol: 'FJ$', name: 'Fijian Dollar', rateToINR: 37.2, country: 'Fiji', flag: '🇫🇯' },
  { code: 'MUR', symbol: 'Rs', name: 'Mauritian Rupee', rateToINR: 1.8, country: 'Mauritius', flag: '🇲🇺' },
  { code: 'USD', symbol: '$', name: 'US Dollar (Worldwide)', rateToINR: 83.5, country: 'United States & Global', flag: '🌐' },
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Hair Oils & Elixirs',
    slug: 'hair-oils',
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800',
    description: 'Slow-brewed in copper cauldrons with 42 rare mountain herbs for deep scalp penetration.',
    itemCount: 4,
  },
  {
    id: 'cat-2',
    name: 'Herbal Cleansers',
    slug: 'herbal-cleansers',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=800',
    description: 'Sulfate-free shampoos and natural soapnut clarifying cleansers.',
    itemCount: 3,
  },
  {
    id: 'cat-3',
    name: 'Follicle Serums',
    slug: 'follicle-serums',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
    description: 'Targeted scalp drops to reactivate dormant hair roots and improve shaft density.',
    itemCount: 2,
  },
  {
    id: 'cat-4',
    name: 'Tribal Masks & Lepas',
    slug: 'masks-lepas',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
    description: 'Traditional forest herbal muds and restorative scalp detox pastes.',
    itemCount: 2,
  },
  {
    id: 'cat-5',
    name: 'Wellness Combos',
    slug: 'wellness-combos',
    image: 'https://images.unsplash.com/photo-1512290900676-26c2a48f4134?auto=format&fit=crop&q=80&w=800',
    description: 'Complete 90-day hair regrowth and scalp rehabilitation bundles.',
    itemCount: 3,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'HAKKIVEDA Herbal Hair Oil (Tribal Gold)',
    category: 'Hair Oils & Elixirs',
    subtitle: 'Authentic 42 Mountain Herbs Slow-Brewed Formula',
    priceINR: 2499,
    originalPriceINR: 2999,
    rating: 4.95,
    reviewsCount: 1420,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800',
    additionalImages: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
    ],
    description: 'The crown jewel of Hakki-Pikki tribal wisdom. Handcrafted in small artisanal batches in Mysore using 42 rare wild-harvested herbs, root extracts, and virgin sesame & coconut oils slow-cooked in traditional copper cauldrons over woodfire for 21 solar cycles.',
    benefits: [
      'Reactivates dormant hair follicles within 45-60 days',
      'Stops severe hair fall and root breakage',
      'Promotes natural dark melanin retention & long hair growth',
      'Relieves dry scalp, itchiness, and flaky buildup',
      'Deeply conditions coarse & dry hair strands'
    ],
    ingredients: [
      'Wild Amla (Phyllanthus emblica)',
      'Bhringraj (Eclipta alba)',
      'Gunja Seed Elixir (Abrus precatorius)',
      'Shikakai (Senegalia rugata)',
      'Devadaru Resin (Cedrus deodara)',
      'Jatamansi (Nardostachys jatamansi)',
      'Cold-pressed Sesame & Coconut Oil base'
    ],
    volume: '200 ml / 6.7 fl oz',
    usageRitual: 'Warm 10-15ml oil in your palms. Apply gently onto dry scalp using fingertips in circular movements. Leave overnight or for at least 2 hours before washing with 42 Mountain Herbs Shampoo.',
    stock: 250,
    sku: 'HV-TGHO-200',
    isBestseller: true,
    isNew: false,
    inStock: true,
  },
  {
    id: 'prod-2',
    name: 'HAKKIVEDA 42 Mountain Herbs Clarifying Shampoo',
    category: 'Herbal Cleansers',
    subtitle: 'Sulfate-Free Soapnut & Shikakai Scalp Cleanser',
    priceINR: 1299,
    originalPriceINR: 1599,
    rating: 4.88,
    reviewsCount: 840,
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=800',
    additionalImages: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'A gentle, low-foaming botanical cleanser enriched with Reetha (soapnut), Hibiscus flowers, and Shikakai infusion. Gently lifts oil and environmental impurities without stripping natural scalp lipids.',
    benefits: [
      'Sulfate, Paraben and Silicone free',
      'Maintains healthy 5.5 scalp pH',
      'Prevents post-wash dryness and frizz',
      'Safe for color-treated and chemically straightened hair'
    ],
    ingredients: [
      'Reetha Fruit Extract',
      'Shikakai Decoction',
      'Fresh Hibiscus Petal Juice',
      'Aloe Vera Leaf Extract',
      'Vetiver Essential Oil'
    ],
    volume: '250 ml / 8.4 fl oz',
    usageRitual: 'Take a coin-sized amount, dilute with water, apply to damp scalp, massage gently for 2 minutes and rinse thoroughly with cool water.',
    stock: 180,
    sku: 'HV-MHCS-250',
    isBestseller: true,
    isNew: false,
    inStock: true,
  },
  {
    id: 'prod-3',
    name: 'HAKKIVEDA Root Density Follicle Serum',
    category: 'Follicle Serums',
    subtitle: 'Concentrated Botanical Scalp Drops',
    priceINR: 1899,
    originalPriceINR: 2199,
    rating: 4.92,
    reviewsCount: 512,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
    additionalImages: [
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'An advanced non-greasy aqueous serum formulated with fermented Indian Gooseberry and Gotu Kola. Designed to be left on the scalp daily to stimulate microcirculation and strengthen the dermal papilla.',
    benefits: [
      'Non-sticky leave-in daily formula',
      'Increases hair strand diameter and elasticity',
      'Shields roots from DHT follicle miniaturization',
      'Dermatologically tested & non-comedogenic'
    ],
    ingredients: [
      'Fermented Amla Nectar',
      'Gotu Kola (Centella asiatica)',
      'Red Onion Extract',
      'Brahmi Leaf Juice',
      'Rosemary Essential Oil'
    ],
    volume: '50 ml / 1.7 fl oz',
    usageRitual: 'Apply 1 full dropper onto dry or towel-dried scalp sections daily. Massage gently. Do not rinse.',
    stock: 120,
    sku: 'HV-RDFS-050',
    isBestseller: false,
    isNew: true,
    inStock: true,
  },
  {
    id: 'prod-4',
    name: 'HAKKIVEDA Herbal Baldness Care Powder & Lepa',
    category: 'Tribal Masks & Lepas',
    subtitle: 'Follicle Reactivating & Bald Spot Scalp Treatment Powder',
    priceINR: 1499,
    originalPriceINR: 1799,
    rating: 4.91,
    reviewsCount: 680,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
    additionalImages: [],
    description: 'Specialized Hakki-Pikki tribal herbal powder formula for advanced baldness, receding temple lines, and dormant hair root patches. Mix with water or oil to form a active herbal paste (Lepa).',
    benefits: [
      'Targeted root reactivation on visible bald patches & thinning spots',
      'Eradicates severe dandruff flakes and clears clogged scalp pores',
      'Stimulates micro-blood circulation to dormant hair roots'
    ],
    ingredients: [
      'Wild Neem Leaf Powder',
      'Gunja Seed Ash Powder',
      'Purified Camphor (Bhimseni Kapoor)',
      'Multani Mitti & Devadaru Bark',
      'Fenugreek & Tulsi Extract'
    ],
    volume: '150 g / 5.3 oz',
    usageRitual: 'Mix 2 tablespoons with warm water or Herbal Hair Oil to form a paste. Apply on bald spots & scalp. Leave for 20 minutes, then wash with HAKKIVEDA Clarifying Shampoo.',
    stock: 195,
    sku: 'HV-HBCP-150',
    isBestseller: true,
    isNew: false,
    inStock: true,
  },
  {
    id: 'prod-5',
    name: 'HAKKIVEDA Complete Baldness & Hair Density Care Kit',
    category: 'Wellness Combos',
    subtitle: 'Herbal Hair Oil + Baldness Care Powder + 42 Herbs Shampoo',
    priceINR: 4999,
    originalPriceINR: 5697,
    rating: 4.98,
    reviewsCount: 2100,
    image: 'https://images.unsplash.com/photo-1512290900676-26c2a48f4134?auto=format&fit=crop&q=80&w=800',
    additionalImages: [
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'The ultimate 3-step baldness care & hair regrowth system. Includes 1x HAKKIVEDA Herbal Hair Oil (200ml), 1x HAKKIVEDA Herbal Baldness Care Powder (150g), and 1x HAKKIVEDA 42 Herbs Shampoo (250ml). Includes free brass head massager tool!',
    benefits: [
      'Save 15% compared to purchasing individually',
      'Complete 3-step solution for baldness, severe thinning & hair fall',
      'Includes complimentary brass Kansa head massager',
      'Free express worldwide shipping'
    ],
    ingredients: ['Combines all 42 Hakki-Pikki mountain herbs across the 3-step ritual'],
    volume: 'Bundle (200ml Oil + 150g Baldness Powder + 250ml Shampoo)',
    usageRitual: 'Step 1: Apply Herbal Hair Oil 3x weekly. Step 2: Apply Baldness Care Powder paste 2x weekly. Step 3: Wash thoroughly with 42 Herbs Shampoo.',
    stock: 150,
    sku: 'HV-CHDR-COMBO',
    isBestseller: true,
    isNew: false,
    inStock: true,
  },
  {
    id: 'prod-6',
    name: 'Botanical Bhringraj & Amla Vitalizing Tonic',
    category: 'Hair Oils & Elixirs',
    subtitle: 'Lightweight Daily Hair Shine & Darkening Spray',
    priceINR: 1199,
    originalPriceINR: 1399,
    rating: 4.82,
    reviewsCount: 230,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
    additionalImages: [],
    description: 'A light, fragrant hair elixir spray that shields strands from UV damage, prevents split ends, and enhances natural gloss.',
    benefits: [
      'Tames flyaways and reduces split ends',
      'Adds natural silky shine without grease',
      'Heat-protection shield for daily styling'
    ],
    ingredients: ['Cold-pressed Bhringraj Juice', 'Fresh Amla Water', 'Vetiver Root Hydrosol'],
    volume: '100 ml / 3.4 fl oz',
    usageRitual: 'Mist lightly over damp or dry hair lengths. Comb through.',
    stock: 80,
    sku: 'HV-BAVT-100',
    isBestseller: false,
    isNew: true,
    inStock: true,
  }
];

export const INITIAL_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    tag: 'Authentic Hakki-Pikki Secret',
    title: 'Ancient Rituals',
    highlightText: 'Modern Care',
    subtitle: 'Harness the power of 42 rare mountain herbs, formulated by the Hakki-Pikki tribe for extraordinary hair density & scalp vitality.',
    image: '/images/hero_tribal_elders.jpg',
    ctaText: 'Shop Tribal Elixir',
    ctaLink: '#products',
    active: true,
  },
  {
    id: 'slide-2',
    tag: 'Hand-Crafted in Mysore',
    title: '21-Day Copper',
    highlightText: 'Cauldron Brew',
    subtitle: 'Slow-cooked over traditional woodfire with wild-harvested herbs from the pristine Western Ghats forest canopy.',
    image: 'https://images.unsplash.com/photo-1512290900676-26c2a48f4134?auto=format&fit=crop&q=80&w=1600',
    ctaText: 'Discover Our Story',
    ctaLink: '#brand-story',
    active: true,
  },
  {
    id: 'slide-3',
    tag: 'AI Trichology Diagnostic',
    title: 'Personalized Tribal',
    highlightText: 'Hair Analysis',
    subtitle: 'Take our 60-second AI Hair Quiz to unlock your tailor-made Ayurvedic scalp routine & herb selection.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1600',
    ctaText: 'Start AI Hair Quiz',
    ctaLink: '#ai-quiz',
    active: true,
  }
];

export const INITIAL_BEFORE_AFTER: BeforeAfterItem[] = [
  {
    id: 'ba-1',
    title: '90 Days Crown Density Transformation',
    days: 90,
    concern: 'Severe Crown Baldness & Top Scalp Thinning',
    beforeImage: '/images/before_male_top.jpg',
    afterImage: '/images/after_male_top.jpg',
    testimonial: 'My crown was completely sparse and balding. After using HAKKIVEDA Tribal Gold Oil 3x a week for 90 days, my crown density returned remarkably with new dark growth!',
    author: 'Rajesh K.',
    location: 'Delhi, India',
  },
  {
    id: 'ba-2',
    title: '60 Days Crown Bald Patch Regrowth',
    days: 60,
    concern: 'Crown Bald Patch & Severe Breakage',
    beforeImage: '/images/before_male_back.jpg',
    afterImage: '/images/after_male_back.jpg',
    testimonial: 'The round bald patch at the back of my head was embarrassing. By week 8 of applying HAKKIVEDA oil, it is now completely covered in thick healthy hair!',
    author: 'Arjun V.',
    location: 'Singapore',
  },
  {
    id: 'ba-3',
    title: '120 Days Scalp Parting Reversal',
    days: 120,
    concern: 'Widening Scalp Parting & Sparse Hairline',
    beforeImage: '/images/before_female_parting.jpg',
    afterImage: '/images/after_female_parting.jpg',
    testimonial: 'My hair parting gap was widening and showing white scalp. The 42-herb infusion brought back thick density and closed the scalp gap completely.',
    author: 'Priya S.',
    location: 'Bengaluru, India',
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    customerName: 'Meera Deshmukh',
    rating: 5,
    title: 'True Tribal Magic in a Bottle!',
    comment: 'The scent is earthly and deep. After 4 weeks, my scalp feels so calm and my hair roots are visibly stronger. Worth every single rupee!',
    date: '2026-07-15',
    verifiedPurchase: true,
    location: 'Bengaluru, India',
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    customerName: 'David Tan',
    rating: 5,
    title: 'Fast Shipping to Singapore & Top Quality',
    comment: 'Arrived in Singapore in just 3 days. My wife and I both use HAKKIVEDA oil now. Outstanding density improvements.',
    date: '2026-07-10',
    verifiedPurchase: true,
    location: 'Singapore',
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    customerName: 'Kavitha Pillay',
    rating: 5,
    title: 'Gentle on Sensitive Scalp',
    comment: 'Most commercial shampoos trigger itching for me. This soapnut formula cleans thoroughly without any harsh chemicals.',
    date: '2026-06-28',
    verifiedPurchase: true,
    location: 'Penang, Malaysia',
  }
];

export const INITIAL_BLOGS: BlogArticle[] = [
  {
    id: 'blog-1',
    title: 'Secrets of the Hakki-Pikki Tribe: 42 Forest Herbs Unveiled',
    slug: 'hakki-pikki-42-herbs-secrets',
    excerpt: 'Explore how nomadic elders of Karnataka preserve ancient botanical knowledge, wildcrafting rare roots and flowers in harmony with forest moon cycles.',
    content: `For generations, the nomadic Hakki-Pikki tribe of Southern India lived in deep communion with the dense forest reserves of the Western Ghats. Their extraordinary hair thickness and youthful longevity have long intrigued modern herbal researchers.\n\nAt the core of their formula lies a sacred balance of 42 botanicals, including Gunja seeds, wild Bhringraj, Devadaru tree resin, and Jatamansi roots. Each herb is harvested at dawn during specific planetary alignments when active phytonutrients reach peak potency.\n\nUnlike mass-manufactured beauty products, HAKKIVEDA continues this sacred heritage in Hunsur, Mysore, employing tribal elders to supervise the 21-day copper cauldron brewing process over natural woodfires.`,
    author: 'Elder Somanna & Dr. A. V. Shastri (Chief Vaidya)',
    date: '2026-07-01',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=800',
    category: 'Tribal Lore & History',
  },
  {
    id: 'blog-2',
    title: 'Why Copper Cauldron Slow-Brewing Matters for Hair Oils',
    slug: 'copper-cauldron-slow-brewing-benefits',
    excerpt: 'Discover why heating botanical oils in pure copper cauldrons for 21 days enhances bioavailability and scalp absorption.',
    content: `In classical Ayurvedic alchemy (Rasa Shastra), copper is considered a sacred element capable of ionizing botanical extracts. When 42 wild mountain herbs are submerged in cold-pressed sesame and coconut oils inside copper vessels for 21 days:\n\n1. Copper micro-ions fuse with lipid molecules, acting as natural bioavailability boosters.\n2. Low, steady woodfire heat prevents thermal destruction of heat-sensitive antioxidants like Vitamin E and polyphenols.\n3. Moisture slowly evaporates, leaving an undiluted, golden potion that deeply penetrates all three layers of the hair follicle.`,
    author: 'Dr. Archana Rao, Senior Ayurvedic Botanist',
    date: '2026-06-18',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1512290900676-26c2a48f4134?auto=format&fit=crop&q=80&w=800',
    category: 'Ayurvedic Science',
  }
];

export const INITIAL_COUPONS: Coupon[] = [];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  announcementText: 'Worldwide Express Shipping • 100% Authentic 42 Mountain Herbs Formula',
  announcementActive: true,
  announcementBgColor: '#C8A24A',
  announcementTextColor: '#0B3D2E',

  logoText: 'HAKKIVEDA',
  logoSubtext: 'Hakki-Pikki Tribe & Ayurveda',
  logoInitials: 'HV',

  companyName: 'HAKKIVEDA Herbal Enterprises',
  address: 'Door No. 574, V.P. Bore, Hunsur, Mysore, Karnataka, India - 571105',
  phone: '+91 76195 36831',
  whatsappNumber: '917619536831',
  email: 'hakkiveda@gmail.com',

  heroCtaText: 'Shop Tribal Elixir',
  heroCtaLink: '#products',

  footerAbout: 'Blend of Hakki-Pikki Tribe & Ayurveda. Handcrafted in small batches with 42 wild mountain herbs slow-cooked over woodfire in copper cauldrons for 21 days.',
  footerCopyright: '© 2026 HAKKIVEDA Herbal Enterprises. All Rights Reserved. Door No. 574, V.P. Bore, Hunsur, Mysore.',

  seoTitle: 'HAKKIVEDA | 42 Mountain Herbs Tribal Hair Oil & Ayurveda',
  seoDescription: 'Handcrafted in Mysore with 42 wild mountain herbs by the Hakki-Pikki tribe.',
  seoKeywords: 'hair oil, ayurveda, tribal hair oil, hair growth, hakkiveda, mysore',
  maintenanceMode: false,

  freeShippingThresholdINR: 1500,
  codEnabled: true,
  razorpayKeyId: 'rzp_live_hakkiveda_key',
  expressCourierPartner: 'DHL / BlueDart Express',

  quizHeadline: 'AI Ayurvedic Scalp & Hair Density Diagnostic',
  quizSubtitle: 'Unlock your personalized 42-herb formulation in 60 seconds.',
};

export const INITIAL_NAV_LINKS: NavLink[] = [
  { id: 'nav-1', label: 'Collections', url: '#products', visible: true },
  { id: 'nav-2', label: 'Tribal Heritage', url: '#brand-story', visible: true },
  { id: 'nav-3', label: 'AI Hair Quiz', url: '#ai-quiz', isModal: true, modalType: 'QUIZ', visible: true },
  { id: 'nav-4', label: 'Results', url: '#before-after', visible: true },
  { id: 'nav-5', label: 'B2B / Export', url: '#b2b', isModal: true, modalType: 'B2B', visible: true },
  { id: 'nav-6', label: 'Journal', url: '#blogs', visible: true },
];

export const INITIAL_TESTIMONIAL_VIDEOS: TestimonialVideo[] = [
  {
    id: 'vid-1',
    customerName: 'Shalini Patel',
    location: 'London, UK',
    rating: 5,
    videoUrl: 'https://youtu.be/1jzF9v5PEBY?si=AWftq4EOQ5cOXjt4',
    thumbnail: 'https://img.youtube.com/vi/1jzF9v5PEBY/hqdefault.jpg',
    reviewText: 'My hair fall stopped within 3 weeks of using HAKKIVEDA oil!',
  },
  {
    id: 'vid-2',
    customerName: 'Arjun Verma',
    location: 'Singapore',
    rating: 5,
    videoUrl: 'https://youtube.com/shorts/XV-Y5vXaKqU?si=FTdChnp0Ei3dnLlS',
    thumbnail: 'https://img.youtube.com/vi/XV-Y5vXaKqU/hqdefault.jpg',
    reviewText: 'Massive growth in density at my temples. Highly recommended!',
  },
  {
    id: 'vid-3',
    customerName: 'Priya Sundaram',
    location: 'Bengaluru, India',
    rating: 5,
    videoUrl: 'https://youtube.com/shorts/5Q9IpbVpgZM?si=5MBNXibq_8n0mLZB',
    thumbnail: 'https://img.youtube.com/vi/5Q9IpbVpgZM/hqdefault.jpg',
    reviewText: 'The 42-herb formulation cured my severe scalp itching & hair fall.',
  },
];

export const INITIAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'qq-1',
    question: 'What is your primary hair & scalp concern?',
    options: [
      { text: 'Severe Hair Fall & Thinning Roots', dosha: 'VATA' },
      { text: 'Flaky Dandruff & Scalp Itchiness', dosha: 'PITTA' },
      { text: 'Oily Roots & Slow Growth Rate', dosha: 'KAPHA' },
      { text: 'Premature Graying & Dry Texture', dosha: 'TRIDOSHA' },
    ],
  },
  {
    id: 'qq-2',
    question: 'How often do you wash your scalp each week?',
    options: [
      { text: 'Daily or every 2 days', dosha: 'PITTA' },
      { text: '2 to 3 times a week', dosha: 'VATA' },
      { text: 'Once a week or less', dosha: 'KAPHA' },
    ],
  },
];

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'med-1',
    title: 'Copper Cauldron Brewing',
    type: 'IMAGE',
    url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800',
    uploadedAt: '2026-07-01',
  },
  {
    id: 'med-2',
    title: 'Wild Mountain Herbs Harvesting',
    type: 'IMAGE',
    url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=800',
    uploadedAt: '2026-07-05',
  },
];

export const INITIAL_COUNTRIES: CountrySetting[] = [
  { code: 'IN', name: 'India', flag: '🇮🇳', currencyCode: 'INR', enabled: true },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', currencyCode: 'SGD', enabled: true },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', currencyCode: 'MYR', enabled: true },
  { code: 'FJ', name: 'Fiji', flag: '🇫🇯', currencyCode: 'FJD', enabled: true },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺', currencyCode: 'MUR', enabled: true },
  { code: 'US', name: 'United States & Worldwide', flag: '🌐', currencyCode: 'USD', enabled: true },
];

export const INITIAL_ADMIN_USER: User = {
  id: 'usr-admin-1',
  name: 'HAKKIVEDA Master Admin',
  email: 'hakkiveda@gmail.com',
  phone: '+91 76195 36831',
  addresses: [],
  isAdmin: true,
  status: 'ACTIVE',
  createdAt: '2026-01-01',
  lastLogin: '2026-07-27 12:00 IST',
};

export const INITIAL_CUSTOMER_ACCOUNTS: User[] = [
  {
    id: 'usr-cust-1',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@gmail.com',
    phone: '+91 98450 12345',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    isAdmin: false,
    status: 'ACTIVE',
    createdAt: '2026-02-14',
    lastLogin: '2026-07-27 10:45 IST',
    loyaltyPoints: 450,
    referralCode: 'HAKKI-RAJESH-89',
    addresses: [
      {
        id: 'addr-1',
        title: 'Home',
        name: 'Rajesh Sharma',
        phone: '+91 98450 12345',
        line1: '108 Sacred Banyan Enclave, Jayalakshmipuram',
        city: 'Mysore',
        state: 'Karnataka',
        country: 'India',
        pincode: '570012',
        isDefault: true,
      },
      {
        id: 'addr-2',
        title: 'Office',
        name: 'Rajesh Sharma (Tech Lead)',
        phone: '+91 98450 12345',
        line1: 'Suite 402, Embassy TechVillage, Outer Ring Rd',
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        pincode: '560103',
        isDefault: false,
      },
    ],
    savedPayments: [
      {
        id: 'pay-1',
        provider: 'RAZORPAY',
        title: 'Razorpay UPI',
        details: 'rajesh.sharma@okicici',
        isDefault: true,
      },
      {
        id: 'pay-2',
        provider: 'STRIPE',
        title: 'HDFC Bank Visa Card',
        details: '•••• 4242',
        isDefault: false,
      },
    ],
    loginHistory: [
      {
        id: 'log-1',
        timestamp: '2026-07-27 10:45:12 IST',
        ipLocation: 'Mysore, Karnataka, India (IPv4)',
        device: 'Chrome on macOS (MacBook Pro)',
      },
      {
        id: 'log-2',
        timestamp: '2026-07-24 18:30:00 IST',
        ipLocation: 'Bengaluru, Karnataka, India',
        device: 'Safari on iPhone 15 Pro',
      },
    ],
    preferences: {
      country: 'India',
      currency: 'INR',
      language: 'English',
      emailOrders: true,
      whatsappUpdates: true,
      promotional: true,
    },
  },
  {
    id: 'usr-cust-2',
    name: 'Priya Nair',
    email: 'priya.nair@singapore.com',
    phone: '+65 8123 4567',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    isAdmin: false,
    status: 'ACTIVE',
    createdAt: '2026-03-22',
    lastLogin: '2026-07-26 15:20 SGT',
    loyaltyPoints: 820,
    referralCode: 'HAKKI-PRIYA-22',
    addresses: [
      {
        id: 'addr-3',
        title: 'Home',
        name: 'Priya Nair',
        phone: '+65 8123 4567',
        line1: '12 Marina Boulevard, Tower 2 #18-04',
        city: 'Singapore',
        state: 'Central Region',
        country: 'Singapore',
        pincode: '018982',
        isDefault: true,
      },
    ],
    savedPayments: [
      {
        id: 'pay-3',
        provider: 'STRIPE',
        title: 'DBS Altitude Visa',
        details: '•••• 8888',
        isDefault: true,
      },
      {
        id: 'pay-4',
        provider: 'PAYPAL',
        title: 'PayPal Account',
        details: 'priya.nair@singapore.com',
        isDefault: false,
      },
    ],
    loginHistory: [
      {
        id: 'log-3',
        timestamp: '2026-07-26 15:20:00 SGT',
        ipLocation: 'Marina Bay, Singapore',
        device: 'Chrome on Mac M2',
      },
    ],
    preferences: {
      country: 'Singapore',
      currency: 'SGD',
      language: 'English',
      emailOrders: true,
      whatsappUpdates: true,
      promotional: false,
    },
  },
  {
    id: 'usr-cust-3',
    name: 'Ananya Gupta',
    email: 'ananya.g@gmail.com',
    phone: '+91 99001 55432',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    isAdmin: false,
    status: 'ACTIVE',
    createdAt: '2026-05-10',
    lastLogin: '2026-07-20 20:10 IST',
    loyaltyPoints: 150,
    referralCode: 'HAKKI-ANANYA-55',
    addresses: [
      {
        id: 'addr-4',
        title: 'Home',
        name: 'Ananya Gupta',
        phone: '+91 99001 55432',
        line1: 'B-402 Palm Beach Heights, Worli',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        pincode: '400018',
        isDefault: true,
      },
    ],
    savedPayments: [
      {
        id: 'pay-5',
        provider: 'COD',
        title: 'Cash on Delivery (Domestic)',
        details: 'Pay on Handshake Delivery',
        isDefault: true,
      },
    ],
    loginHistory: [
      {
        id: 'log-4',
        timestamp: '2026-07-20 20:10:00 IST',
        ipLocation: 'Mumbai, Maharashtra, India',
        device: 'Firefox on Windows 11',
      },
    ],
    preferences: {
      country: 'India',
      currency: 'INR',
      language: 'English',
      emailOrders: true,
      whatsappUpdates: false,
      promotional: true,
    },
  },
];

export const INITIAL_ORDERS: any[] = [
  {
    id: 'ord-1001',
    orderNumber: 'HV-894201',
    date: '2026-07-25',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 2,
      },
    ],
    totalAmountINR: 4998,
    currencyCode: 'INR',
    convertedTotal: 4998,
    customer: {
      name: 'Rajesh Sharma',
      email: 'rajesh.sharma@gmail.com',
      phone: '+91 98450 12345',
      address: '108 Sacred Banyan Enclave, Jayalakshmipuram',
      city: 'Mysore',
      state: 'Karnataka',
      country: 'India',
      pincode: '570012',
    },
    paymentMethod: 'RAZORPAY',
    paymentStatus: 'PAID',
    trackingStatus: 'IN_TRANSIT',
    trackingNumber: 'BD-EXP-994812',
    courierName: 'BlueDart Air Express',
    estimatedDeliveryDate: '2026-07-28',
  },
  {
    id: 'ord-1002',
    orderNumber: 'HV-712390',
    date: '2026-07-20',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
      },
    ],
    totalAmountINR: 2499,
    currencyCode: 'SGD',
    convertedTotal: 40,
    customer: {
      name: 'Priya Nair',
      email: 'priya.nair@singapore.com',
      phone: '+65 8123 4567',
      address: '12 Marina Boulevard, Tower 2 #18-04',
      city: 'Singapore',
      state: 'Central Region',
      country: 'Singapore',
      pincode: '018982',
    },
    paymentMethod: 'INTERNATIONAL_PREPAID',
    paymentStatus: 'PAID',
    trackingStatus: 'DELIVERED',
    trackingNumber: 'DHL-SG-55102',
    courierName: 'DHL Express Global',
    estimatedDeliveryDate: '2026-07-24',
  },
];

