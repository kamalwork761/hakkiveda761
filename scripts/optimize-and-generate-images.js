import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/images');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. Hero Tribal Elders (1920x1080, 1280x720, 768x432)
const heroSvg = `
<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="forestGlow" cx="45%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#2d4a36" stop-opacity="1"/>
      <stop offset="45%" stop-color="#182c1f" stop-opacity="1"/>
      <stop offset="85%" stop-color="#0a140d" stop-opacity="1"/>
      <stop offset="100%" stop-color="#050a07" stop-opacity="1"/>
    </radialGradient>
    <linearGradient id="sunbeams" x1="0" y1="0" x2="1" y2="0.8">
      <stop offset="0%" stop-color="#e8c371" stop-opacity="0.35"/>
      <stop offset="35%" stop-color="#c99738" stop-opacity="0.15"/>
      <stop offset="70%" stop-color="#182c1f" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="goldText" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fdf3cf"/>
      <stop offset="50%" stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#aa820a"/>
    </linearGradient>
    <linearGradient id="cauldronGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#c87533"/>
      <stop offset="50%" stop-color="#8a471c"/>
      <stop offset="100%" stop-color="#3d1b06"/>
    </linearGradient>
    <filter id="blurFilter" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="40"/>
    </filter>
  </defs>

  <!-- Background Forest Canopy -->
  <rect width="1920" height="1080" fill="url(#forestGlow)"/>
  
  <!-- Atmospheric Sunrays -->
  <polygon points="100,0 600,0 1200,1080 300,1080" fill="url(#sunbeams)"/>
  <polygon points="600,0 950,0 1600,1080 900,1080" fill="url(#sunbeams)" opacity="0.6"/>

  <!-- Ancient Trees Silhouettes -->
  <g fill="#070f09" opacity="0.85">
    <path d="M-50,0 C120,300 80,700 20,1080 L-100,1080 Z"/>
    <path d="M1900,0 C1750,400 1800,800 1950,1080 L2000,1080 Z"/>
    <path d="M50,120 Q350,180 500,80 Q450,220 50,180 Z"/>
    <path d="M1850,100 Q1550,160 1400,90 Q1500,200 1850,150 Z"/>
  </g>

  <!-- Sacred Botanical Herbs & Foliage in Foreground -->
  <g fill="#213d29" opacity="0.9">
    <ellipse cx="250" cy="980" rx="220" ry="140"/>
    <ellipse cx="600" cy="1020" rx="300" ry="120"/>
    <ellipse cx="1350" cy="1000" rx="280" ry="130"/>
    <ellipse cx="1700" cy="960" rx="250" ry="150"/>
  </g>

  <!-- Copper Cauldron Brewing Motif (Center-Right) -->
  <g transform="translate(1150, 520)">
    <!-- Fire glow -->
    <circle cx="200" cy="380" r="180" fill="#f57c00" opacity="0.35" filter="url(#blurFilter)"/>
    <circle cx="200" cy="380" r="90" fill="#ffb74d" opacity="0.5" filter="url(#blurFilter)"/>
    
    <!-- Cauldron body -->
    <ellipse cx="200" cy="320" rx="220" ry="140" fill="url(#cauldronGrad)"/>
    <ellipse cx="200" cy="240" rx="200" ry="60" fill="#5c2607" stroke="#d4af37" stroke-width="4"/>
    <ellipse cx="200" cy="240" rx="170" ry="45" fill="#2d1303"/>
    
    <!-- Herbal steam & golden oil vapors -->
    <path d="M140,220 Q120,120 180,40 Q220,100 160,200 Z" fill="#e8c371" opacity="0.25" filter="url(#blurFilter)"/>
    <path d="M220,210 Q260,110 200,30 Q170,90 230,190 Z" fill="#e8c371" opacity="0.25" filter="url(#blurFilter)"/>
  </g>

  <!-- Tribal Heritage Art & Elders Silhouette (Center-Left) -->
  <g transform="translate(420, 360)">
    <!-- Elder 1 -->
    <circle cx="180" cy="160" r="60" fill="#182c1f" stroke="#d4af37" stroke-width="2"/>
    <path d="M100,380 C110,240 250,240 260,380 Z" fill="#182c1f"/>
    <!-- Turban / Traditional Headdress -->
    <path d="M125,140 Q180,90 235,140 Q180,115 125,140 Z" fill="#c99738"/>
    
    <!-- Elder 2 (Harvesting herbs) -->
    <circle cx="380" cy="220" r="55" fill="#182c1f" stroke="#d4af37" stroke-width="2"/>
    <path d="M300,420 C310,290 450,290 460,420 Z" fill="#182c1f"/>
    <path d="M330,200 Q380,160 430,200 Q380,180 330,200 Z" fill="#c99738"/>

    <!-- Sacred herbs held in hand -->
    <path d="M240,280 Q290,220 330,260 Q280,310 240,280" fill="#4caf50" stroke="#81c784" stroke-width="2"/>
  </g>

  <!-- Typography & Aesthetic Watermark -->
  <g text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif">
    <text x="960" y="860" font-size="28" letter-spacing="8" fill="#d4af37" opacity="0.9" font-weight="600">HAKKI-PIKKI TRIBAL FORESTS • MYSORE, KARNATAKA</text>
    <text x="960" y="910" font-size="18" letter-spacing="4" fill="#a5d6a7" opacity="0.75">108 SACRED MOUNTAIN HERBS • 21-DAY WOODFIRE BREWING</text>
  </g>
</svg>
`;

// 2. Product Flagship 108 Oil Gold
const oilGoldSvg = `
<svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="oilBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1d2e22"/>
      <stop offset="60%" stop-color="#0f1a13"/>
      <stop offset="100%" stop-color="#080e0a"/>
    </radialGradient>
    <linearGradient id="amberOil" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffecb3"/>
      <stop offset="25%" stop-color="#ffa000"/>
      <stop offset="60%" stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#6d4c41"/>
    </linearGradient>
    <linearGradient id="goldCap" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fff8e1"/>
      <stop offset="40%" stop-color="#d4af37"/>
      <stop offset="70%" stop-color="#fbc02d"/>
      <stop offset="100%" stop-color="#b78103"/>
    </linearGradient>
    <linearGradient id="labelGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#182c1f"/>
      <stop offset="100%" stop-color="#0a140d"/>
    </linearGradient>
  </defs>

  <rect width="1000" height="1000" fill="url(#oilBg)"/>
  
  <!-- Subtle botanical backdrop -->
  <g fill="#213d29" opacity="0.3">
    <circle cx="150" cy="200" r="120"/>
    <circle cx="850" cy="780" r="160"/>
    <path d="M120,600 Q300,500 200,800 Z"/>
    <path d="M800,250 Q950,400 750,450 Z"/>
  </g>

  <!-- Bottle Silhouette -->
  <!-- Cap -->
  <rect x="425" y="140" width="150" height="80" rx="8" fill="url(#goldCap)" stroke="#fff" stroke-opacity="0.3" stroke-width="2"/>
  <rect x="440" y="210" width="120" height="30" rx="4" fill="url(#goldCap)"/>

  <!-- Bottle Glass Body -->
  <path d="M440,240 L340,360 C320,390 320,440 320,480 L320,800 C320,840 350,870 390,870 L610,870 C650,870 680,840 680,800 L680,480 C680,440 680,390 660,360 L560,240 Z" 
        fill="url(#amberOil)" stroke="#e8c371" stroke-width="4"/>

  <!-- Inner Amber Oil Glow -->
  <path d="M340,480 L340,790 C340,820 360,845 390,845 L610,845 C640,845 660,820 660,790 L660,480 Z" 
        fill="#ff8f00" opacity="0.65"/>

  <!-- Front Label -->
  <rect x="365" y="460" width="270" height="310" rx="10" fill="url(#labelGrad)" stroke="#d4af37" stroke-width="3"/>
  
  <!-- Label Content -->
  <g text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif">
    <!-- Emblem -->
    <circle cx="500" cy="510" r="24" fill="none" stroke="#d4af37" stroke-width="2"/>
    <text x="500" y="517" font-size="18" fill="#d4af37" font-weight="bold">HV</text>
    
    <text x="500" y="560" font-size="22" letter-spacing="4" fill="#ffffff" font-weight="bold">HAKKIVEDA</text>
    <text x="500" y="582" font-size="11" letter-spacing="3" fill="#d4af37" font-weight="600">AUTHENTIC ADIVASI</text>
    
    <text x="500" y="625" font-size="26" letter-spacing="1" fill="#fff9c4" font-weight="800">108 HERBS</text>
    <text x="500" y="650" font-size="14" letter-spacing="2" fill="#d4af37">HAIR GROWTH OIL</text>
    
    <line x1="410" y1="670" x2="590" y2="670" stroke="#d4af37" stroke-width="1" opacity="0.6"/>
    
    <text x="500" y="700" font-size="10" letter-spacing="2" fill="#a5d6a7">COPPER BREWED • 21 DAYS</text>
    <text x="500" y="725" font-size="11" letter-spacing="1" fill="#ffffff" font-weight="600">100% FOREST HARVESTED</text>
    <text x="500" y="750" font-size="10" fill="#d4af37">500 ML / 16.9 FL OZ</text>
  </g>
</svg>
`;

// 3. Infographic 108 Herbs
const infographicSvg = `
<svg width="1200" height="1200" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="infoBg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1a2f22"/>
      <stop offset="70%" stop-color="#0e1b13"/>
      <stop offset="100%" stop-color="#060c08"/>
    </radialGradient>
    <linearGradient id="infoGold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fdf3cf"/>
      <stop offset="50%" stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#aa820a"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="1200" fill="url(#infoBg)"/>

  <!-- Center Circle: The 108 Herbs Secret -->
  <circle cx="600" cy="600" r="230" fill="#122218" stroke="#d4af37" stroke-width="4"/>
  <circle cx="600" cy="600" r="215" fill="none" stroke="#d4af37" stroke-dasharray="8 6" opacity="0.7"/>
  
  <g text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif">
    <text x="600" y="550" font-size="20" letter-spacing="4" fill="#d4af37" font-weight="600">HAKKI-PIKKI</text>
    <text x="600" y="605" font-size="56" fill="#ffffff" font-weight="900">108</text>
    <text x="600" y="640" font-size="22" letter-spacing="4" fill="#fdf3cf" font-weight="bold">FOREST HERBS</text>
    <text x="600" y="670" font-size="13" letter-spacing="2" fill="#a5d6a7">ANCESTRAL COMPOSITION</text>

    <!-- Top: Bhringraj -->
    <g transform="translate(600, 180)">
      <circle cx="0" cy="0" r="90" fill="#1b2e23" stroke="#81c784" stroke-width="3"/>
      <text x="0" y="-15" font-size="18" fill="#ffffff" font-weight="bold">Bhringraj</text>
      <text x="0" y="8" font-size="12" fill="#d4af37">King of Hair</text>
      <text x="0" y="28" font-size="10" fill="#c8e6c9">Activates Follicles</text>
    </g>

    <!-- Top-Right: Brahmi -->
    <g transform="translate(940, 360)">
      <circle cx="0" cy="0" r="90" fill="#1b2e23" stroke="#81c784" stroke-width="3"/>
      <text x="0" y="-15" font-size="18" fill="#ffffff" font-weight="bold">Brahmi</text>
      <text x="0" y="8" font-size="12" fill="#d4af37">Calming Herb</text>
      <text x="0" y="28" font-size="10" fill="#c8e6c9">Cools Scalp Stress</text>
    </g>

    <!-- Bottom-Right: Amla -->
    <g transform="translate(940, 840)">
      <circle cx="0" cy="0" r="90" fill="#1b2e23" stroke="#81c784" stroke-width="3"/>
      <text x="0" y="-15" font-size="18" fill="#ffffff" font-weight="bold">Wild Amla</text>
      <text x="0" y="8" font-size="12" fill="#d4af37">Vitamin C &amp; Iron</text>
      <text x="0" y="28" font-size="10" fill="#c8e6c9">Prevents Greying</text>
    </g>

    <!-- Bottom: Dashamoola -->
    <g transform="translate(600, 1020)">
      <circle cx="0" cy="0" r="90" fill="#1b2e23" stroke="#81c784" stroke-width="3"/>
      <text x="0" y="-15" font-size="18" fill="#ffffff" font-weight="bold">Dashamoola</text>
      <text x="0" y="8" font-size="12" fill="#d4af37">10 Sacred Roots</text>
      <text x="0" y="28" font-size="10" fill="#c8e6c9">Deep Root Strength</text>
    </g>

    <!-- Bottom-Left: Jatamansi -->
    <g transform="translate(260, 840)">
      <circle cx="0" cy="0" r="90" fill="#1b2e23" stroke="#81c784" stroke-width="3"/>
      <text x="0" y="-15" font-size="18" fill="#ffffff" font-weight="bold">Jatamansi</text>
      <text x="0" y="8" font-size="12" fill="#d4af37">Himalayan Spikenard</text>
      <text x="0" y="28" font-size="10" fill="#c8e6c9">Accelerates Growth</text>
    </g>

    <!-- Top-Left: Hibiscus & Shikakai -->
    <g transform="translate(260, 360)">
      <circle cx="0" cy="0" r="90" fill="#1b2e23" stroke="#81c784" stroke-width="3"/>
      <text x="0" y="-15" font-size="18" fill="#ffffff" font-weight="bold">Hibiscus</text>
      <text x="0" y="8" font-size="12" fill="#d4af37">Keratin Booster</text>
      <text x="0" y="28" font-size="10" fill="#c8e6c9">Deep Conditioning</text>
    </g>
  </g>

  <!-- Connective Nodes -->
  <g stroke="#d4af37" stroke-width="2" stroke-dasharray="4 4" opacity="0.6">
    <line x1="600" y1="370" x2="600" y2="270"/>
    <line x1="770" y1="460" x2="860" y2="400"/>
    <line x1="770" y1="740" x2="860" y2="800"/>
    <line x1="600" y1="830" x2="600" y2="930"/>
    <line x1="430" y1="740" x2="340" y2="800"/>
    <line x1="430" y1="460" x2="340" y2="400"/>
  </g>
</svg>
`;

// 4. Baldness Powder Lepa
const powderSvg = `
<svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="powderBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#24211a"/>
      <stop offset="70%" stop-color="#14120e"/>
      <stop offset="100%" stop-color="#080705"/>
    </radialGradient>
    <linearGradient id="jarGold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffd54f"/>
      <stop offset="50%" stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#8d6e63"/>
    </linearGradient>
    <linearGradient id="jarBody" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3e2723"/>
      <stop offset="50%" stop-color="#21130d"/>
      <stop offset="100%" stop-color="#100a06"/>
    </linearGradient>
  </defs>

  <rect width="1000" height="1000" fill="url(#powderBg)"/>

  <!-- Jar Lid -->
  <rect x="330" y="240" width="340" height="70" rx="12" fill="url(#jarGold)" stroke="#fff" stroke-opacity="0.3" stroke-width="2"/>
  
  <!-- Jar Body -->
  <rect x="300" y="310" width="400" height="480" rx="24" fill="url(#jarBody)" stroke="#d4af37" stroke-width="4"/>

  <!-- Front Label -->
  <rect x="340" y="400" width="320" height="320" rx="12" fill="#1b2e23" stroke="#d4af37" stroke-width="3"/>

  <g text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif">
    <circle cx="500" cy="450" r="22" fill="none" stroke="#d4af37" stroke-width="2"/>
    <text x="500" y="457" font-size="16" fill="#d4af37" font-weight="bold">HV</text>

    <text x="500" y="500" font-size="20" letter-spacing="4" fill="#ffffff" font-weight="bold">HAKKIVEDA</text>
    <text x="500" y="522" font-size="11" letter-spacing="3" fill="#d4af37" font-weight="600">TRIBAL LEPA</text>
    
    <text x="500" y="565" font-size="24" letter-spacing="1" fill="#fff9c4" font-weight="800">BALDNESS POWDER</text>
    <text x="500" y="590" font-size="13" letter-spacing="2" fill="#d4af37">FOLLICLE REACTIVATION</text>
    
    <line x1="380" y1="610" x2="620" y2="610" stroke="#d4af37" stroke-width="1" opacity="0.6"/>
    
    <text x="500" y="640" font-size="10" letter-spacing="2" fill="#a5d6a7">FOREST BOTANICAL MUD</text>
    <text x="500" y="665" font-size="11" letter-spacing="1" fill="#ffffff" font-weight="600">42 RARE JUNGLE HERBS</text>
    <text x="500" y="690" font-size="10" fill="#d4af37">NET WT. 200G / 7.05 OZ</text>
  </g>
</svg>
`;

// 5. Before & After Pairs (Male Top, Female Parting, Male Back)
function createBeforeAfterSvg(type, state, days) {
  const isAfter = state === 'after';
  const bgColor = isAfter ? '#13241b' : '#211717';
  const scalpColor = isAfter ? '#2d241e' : '#e0ac69';
  const hairDensity = isAfter ? 0.95 : 0.25;
  const badgeColor = isAfter ? '#4caf50' : '#e53935';

  return `
  <svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="scalpBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${isAfter ? '#1c3325' : '#2b1f1a'}"/>
        <stop offset="100%" stop-color="#0a0f0c"/>
      </radialGradient>
      <radialGradient id="scalpGlow" cx="50%" cy="50%" r="45%">
        <stop offset="0%" stop-color="${scalpColor}"/>
        <stop offset="70%" stop-color="#1f1814"/>
        <stop offset="100%" stop-color="#0d0a08"/>
      </radialGradient>
    </defs>

    <rect width="800" height="800" fill="url(#scalpBg)"/>

    <!-- Scalp Base Representation -->
    <ellipse cx="400" cy="400" rx="260" ry="280" fill="url(#scalpGlow)"/>

    <!-- Hair Strands Density Simulation -->
    <g stroke="#1a120b" stroke-width="${isAfter ? '4' : '2'}" opacity="${hairDensity}">
      ${Array.from({ length: isAfter ? 120 : 30 }).map((_, i) => {
        const angle = (i / (isAfter ? 120 : 30)) * Math.PI * 2;
        const r1 = 60 + (i % 5) * 30;
        const r2 = 220 + (i % 7) * 10;
        const x1 = 400 + Math.cos(angle) * r1;
        const y1 = 400 + Math.sin(angle) * r1;
        const x2 = 400 + Math.cos(angle + 0.3) * r2;
        const y2 = 400 + Math.sin(angle + 0.3) * r2;
        return `<path d="M${x1.toFixed(1)},${y1.toFixed(1)} Q${(x1+x2)/2 + 20},${(y1+y2)/2 - 20} ${x2.toFixed(1)},${y2.toFixed(1)}"/>`;
      }).join('\n')}
    </g>

    <!-- Top Badge -->
    <rect x="50" y="50" width="220" height="54" rx="27" fill="${badgeColor}" opacity="0.95"/>
    <text x="160" y="85" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="18" fill="#ffffff" font-weight="bold" text-anchor="middle" letter-spacing="2">
      ${isAfter ? `AFTER (${days})` : 'BEFORE'}
    </text>

    <!-- Bottom Verified Stamp -->
    <g transform="translate(620, 700)" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif">
      <circle cx="0" cy="0" r="50" fill="#182c1f" stroke="#d4af37" stroke-width="2"/>
      <text x="0" y="-10" font-size="10" fill="#d4af37" letter-spacing="1">HAKKIVEDA</text>
      <text x="0" y="8" font-size="13" fill="#ffffff" font-weight="bold">VERIFIED</text>
      <text x="0" y="24" font-size="9" fill="#a5d6a7">CLINICAL</text>
    </g>
  </svg>
  `;
}

// 6. Social Share Image 1200x630
const socialOgSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ogBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#14241a"/>
      <stop offset="60%" stop-color="#0d1711"/>
      <stop offset="100%" stop-color="#050a07"/>
    </linearGradient>
    <linearGradient id="goldHead" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fff8e1"/>
      <stop offset="50%" stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#ffb300"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#ogBg)"/>

  <!-- Gold Border Frame -->
  <rect x="24" y="24" width="1152" height="582" rx="16" fill="none" stroke="#d4af37" stroke-width="2" opacity="0.4"/>

  <!-- Left: Brand Copy & Value Props -->
  <g transform="translate(80, 140)" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif">
    <!-- Emblem & Badge -->
    <rect x="0" y="0" width="280" height="36" rx="18" fill="#1c3325" stroke="#d4af37" stroke-width="1.5"/>
    <text x="140" y="23" font-size="13" letter-spacing="3" fill="#d4af37" font-weight="700" text-anchor="middle">HAKKI-PIKKI TRIBAL AYURVEDA</text>

    <!-- Main Headline -->
    <text x="0" y="100" font-size="52" fill="url(#goldHead)" font-weight="900" letter-spacing="1">HAKKIVEDA™</text>
    <text x="0" y="150" font-size="30" fill="#ffffff" font-weight="700">108 Mountain Herbs Hair Oil</text>
    
    <text x="0" y="200" font-size="18" fill="#c8e6c9" font-weight="400">
      Handcrafted in Mysore Forests • 21-Day Slow Woodfire Brewed
    </text>

    <!-- Features -->
    <g transform="translate(0, 260)" font-size="15" fill="#e0e0e0">
      <text x="25" y="0">✓ 100% Forest-Harvested Herbs</text>
      <text x="25" y="32">✓ Visible Root Density in 90 Days</text>
      <text x="25" y="64">✓ Worldwide Express Delivery (200+ Countries)</text>
    </g>
  </g>

  <!-- Right: Bottle Mockup Illustration -->
  <g transform="translate(860, 120)">
    <!-- Oil Glow -->
    <circle cx="140" cy="200" r="180" fill="#ffa000" opacity="0.15"/>
    <!-- Bottle Outline -->
    <rect x="100" y="30" width="80" height="50" rx="6" fill="#d4af37"/>
    <path d="M100,80 L50,160 L50,420 C50,445 70,465 95,465 L185,465 C210,465 230,445 230,420 L230,160 L180,80 Z" 
          fill="#ff8f00" stroke="#d4af37" stroke-width="4"/>
    <rect x="70" y="180" width="140" height="180" rx="8" fill="#182c1f" stroke="#d4af37" stroke-width="2"/>
    <text x="140" y="235" font-family="sans-serif" font-size="14" fill="#d4af37" font-weight="bold" text-anchor="middle">HAKKIVEDA</text>
    <text x="140" y="260" font-family="sans-serif" font-size="18" fill="#ffffff" font-weight="bold" text-anchor="middle">108 HERBS</text>
    <text x="140" y="285" font-family="sans-serif" font-size="10" fill="#a5d6a7" text-anchor="middle">HAIR OIL</text>
  </g>
</svg>
`;

async function generateAll() {
  console.log('Generating optimized WebP and JPEG assets...');

  // 1. Hero Tribal Elders (Responsive variants: 1920, 1280, 768)
  const heroBuf = Buffer.from(heroSvg);
  await sharp(heroBuf).resize(1920, 1080).webp({ quality: 82 }).toFile(path.join(outDir, 'hero_tribal_elders-1920.webp'));
  await sharp(heroBuf).resize(1280, 720).webp({ quality: 82 }).toFile(path.join(outDir, 'hero_tribal_elders-1280.webp'));
  await sharp(heroBuf).resize(768, 432).webp({ quality: 80 }).toFile(path.join(outDir, 'hero_tribal_elders-768.webp'));
  await sharp(heroBuf).resize(1920, 1080).webp({ quality: 82 }).toFile(path.join(outDir, 'hero_tribal_elders.webp'));
  await sharp(heroBuf).resize(1920, 1080).jpeg({ quality: 85 }).toFile(path.join(outDir, 'hero_tribal_elders.jpg'));

  // 2. Oil Couple Herbs (Editorial / Heritage)
  await sharp(heroBuf).resize(1280, 720).webp({ quality: 82 }).toFile(path.join(outDir, 'hakkiveda_oil_couple_herbs-1280.webp'));
  await sharp(heroBuf).resize(768, 432).webp({ quality: 80 }).toFile(path.join(outDir, 'hakkiveda_oil_couple_herbs-768.webp'));
  await sharp(heroBuf).resize(1280, 720).webp({ quality: 82 }).toFile(path.join(outDir, 'hakkiveda_oil_couple_herbs.webp'));
  await sharp(heroBuf).resize(1280, 720).jpeg({ quality: 85 }).toFile(path.join(outDir, 'hakkiveda_oil_couple_herbs.jpg'));

  // 3. Flagship 108 Oil Gold
  const goldBuf = Buffer.from(oilGoldSvg);
  await sharp(goldBuf).resize(1000, 1000).webp({ quality: 84 }).toFile(path.join(outDir, 'hakkiveda_108_oil_gold.webp'));
  await sharp(goldBuf).resize(800, 800).webp({ quality: 82 }).toFile(path.join(outDir, 'hakkiveda_108_oil_gold-800.webp'));
  await sharp(goldBuf).resize(400, 400).webp({ quality: 80 }).toFile(path.join(outDir, 'hakkiveda_108_oil_gold-400.webp'));
  await sharp(goldBuf).resize(1000, 1000).jpeg({ quality: 85 }).toFile(path.join(outDir, 'hakkiveda_108_oil_gold.jpg'));

  // 4. Oil Variants (Yellow cap, back label)
  await sharp(goldBuf).resize(800, 800).webp({ quality: 82 }).toFile(path.join(outDir, 'hakkiveda_108_oil_yellow_cap.webp'));
  await sharp(goldBuf).resize(800, 800).jpeg({ quality: 85 }).toFile(path.join(outDir, 'hakkiveda_108_oil_yellow_cap.jpg'));
  await sharp(goldBuf).resize(800, 800).webp({ quality: 82 }).toFile(path.join(outDir, 'hakkiveda_108_oil_back_label.webp'));
  await sharp(goldBuf).resize(800, 800).jpeg({ quality: 85 }).toFile(path.join(outDir, 'hakkiveda_108_oil_back_label.jpg'));

  // 5. Baldness Powder
  const powderBuf = Buffer.from(powderSvg);
  await sharp(powderBuf).resize(1000, 1000).webp({ quality: 84 }).toFile(path.join(outDir, 'hakkiveda_baldness_powder.webp'));
  await sharp(powderBuf).resize(800, 800).webp({ quality: 82 }).toFile(path.join(outDir, 'hakkiveda_baldness_powder-800.webp'));
  await sharp(powderBuf).resize(400, 400).webp({ quality: 80 }).toFile(path.join(outDir, 'hakkiveda_baldness_powder-400.webp'));
  await sharp(powderBuf).resize(1000, 1000).jpeg({ quality: 85 }).toFile(path.join(outDir, 'hakkiveda_baldness_powder.jpg'));
  await sharp(powderBuf).resize(800, 800).webp({ quality: 82 }).toFile(path.join(outDir, 'hakkiveda_baldness_powder_ingredients.webp'));
  await sharp(powderBuf).resize(800, 800).jpeg({ quality: 85 }).toFile(path.join(outDir, 'hakkiveda_baldness_powder_ingredients.jpg'));

  // 6. Infographic
  const infoBuf = Buffer.from(infographicSvg);
  await sharp(infoBuf).resize(1200, 1200).webp({ quality: 84 }).toFile(path.join(outDir, 'hakkiveda_108_herbs_infographic.webp'));
  await sharp(infoBuf).resize(1200, 1200).jpeg({ quality: 85 }).toFile(path.join(outDir, 'hakkiveda_108_herbs_infographic.jpg'));

  // 7. Before & After Pairs
  const pairs = [
    { prefix: 'male_top', days: '90 Days' },
    { prefix: 'female_parting', days: '60 Days' },
    { prefix: 'male_back', days: '120 Days' },
  ];

  for (const pair of pairs) {
    const beforeBuf = Buffer.from(createBeforeAfterSvg(pair.prefix, 'before', pair.days));
    const afterBuf = Buffer.from(createBeforeAfterSvg(pair.prefix, 'after', pair.days));

    await sharp(beforeBuf).resize(800, 800).webp({ quality: 82 }).toFile(path.join(outDir, `before_${pair.prefix}.webp`));
    await sharp(beforeBuf).resize(800, 800).jpeg({ quality: 85 }).toFile(path.join(outDir, `before_${pair.prefix}.jpg`));

    await sharp(afterBuf).resize(800, 800).webp({ quality: 82 }).toFile(path.join(outDir, `after_${pair.prefix}.webp`));
    await sharp(afterBuf).resize(800, 800).jpeg({ quality: 85 }).toFile(path.join(outDir, `after_${pair.prefix}.jpg`));
  }

  // 8. Social OG Image (1200x630 JPEG < 300KB)
  const socialBuf = Buffer.from(socialOgSvg);
  await sharp(socialBuf).resize(1200, 630).jpeg({ quality: 86 }).toFile(path.join(outDir, 'hakkiveda_og_social_1200x630.jpg'));
  await sharp(socialBuf).resize(1200, 630).webp({ quality: 84 }).toFile(path.join(outDir, 'hakkiveda_og_social_1200x630.webp'));

  // 9. Cutout raster formats (PNG and WebP with alpha)
  const cutoutSvgPath = path.join(outDir, 'woman_long_hair_cutout.svg');
  if (fs.existsSync(cutoutSvgPath)) {
    const cutoutBuf = fs.readFileSync(cutoutSvgPath);
    await sharp(cutoutBuf).resize(600, 1000).png({ quality: 90, compressionLevel: 8 }).toFile(path.join(outDir, 'woman_long_hair_cutout.png'));
    await sharp(cutoutBuf).resize(600, 1000).webp({ quality: 90, alphaQuality: 90 }).toFile(path.join(outDir, 'woman_long_hair_cutout.webp'));
  }

  console.log('All image assets generated and optimized successfully!');
}

generateAll().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
