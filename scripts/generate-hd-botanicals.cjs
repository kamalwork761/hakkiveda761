const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = path.join(__dirname, '..', 'public', 'images', 'botanical');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1024x1024 Master Source Resolution for Ultra-Crisp Retina Display
const W = 1024;
const H = 1024;

const botanicalDefinitions = [
  {
    name: 'neem_leaf.webp',
    svg: `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Forest Green Leaf Body Gradient -->
        <linearGradient id="neemBody" x1="20%" y1="10%" x2="80%" y2="90%">
          <stop offset="0%" stop-color="#0E2E1D"/>
          <stop offset="25%" stop-color="#194830"/>
          <stop offset="55%" stop-color="#246443"/>
          <stop offset="85%" stop-color="#1B4D34"/>
          <stop offset="100%" stop-color="#103321"/>
        </linearGradient>
        <!-- Luminous Left Half Highlight -->
        <linearGradient id="neemLeft" x1="0%" y1="30%" x2="100%" y2="70%">
          <stop offset="0%" stop-color="#348459" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#1B4E34" stop-opacity="0.2"/>
        </linearGradient>
        <!-- Golden Herbal Stem -->
        <linearGradient id="neemSpine" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#8C6E2D"/>
          <stop offset="40%" stop-color="#D4B055"/>
          <stop offset="70%" stop-color="#88C29A"/>
          <stop offset="100%" stop-color="#4F926B"/>
        </linearGradient>
        <!-- Depth Shadow -->
        <filter id="leafShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="4" dy="12" stdDeviation="16" flood-color="#05140C" flood-opacity="0.32"/>
        </filter>
        <!-- Subtle Glow -->
        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#D4B055" flood-opacity="0.4"/>
        </filter>
      </defs>

      <g filter="url(#leafShadow)">
        <!-- Outer Base Silhouette with Hand-Painted Organic Serrations -->
        <path d="M 512 920 
                 C 504 820, 480 710, 436 600
                 C 388 472, 320 340, 392 170
                 C 432 260, 504 324, 552 428
                 C 608 550, 624 720, 512 920 Z"
              fill="url(#neemBody)"/>

        <!-- Intricate Asymmetric Curved Serrated Edge (Ayurvedic Neem) -->
        <path d="M 392 170 
                 Q 398 205 376 220 Q 408 250 380 278 Q 418 312 384 348
                 Q 428 390 394 430 Q 440 480 410 524 Q 452 580 426 630
                 Q 466 700 446 760 Q 484 835 476 880 L 512 920
                 Q 538 840 572 760 Q 546 704 596 644 Q 568 584 612 524
                 Q 584 464 620 408 Q 592 352 616 300 Q 588 248 600 196
                 Q 572 160 552 428 L 392 170 Z"
              fill="url(#neemBody)"
              stroke="#2B6B48" stroke-width="3" stroke-linejoin="round"/>

        <!-- Left half subtle botanical illumination -->
        <path d="M 512 920 
                 C 504 820, 480 710, 436 600
                 C 388 472, 320 340, 392 170
                 C 410 260, 440 480, 512 920 Z"
              fill="url(#neemLeft)"/>

        <!-- Hand-Drawn Primary Leaf Spine with Gold Accents -->
        <path d="M 512 950 C 508 840, 492 660, 468 520 C 444 380, 408 240, 392 170"
              fill="none" stroke="url(#neemSpine)" stroke-width="9" stroke-linecap="round"/>

        <!-- Delicate Hand-Painted Lateral Vein Network -->
        <!-- Right lateral veins -->
        <path d="M 490 760 C 530 730, 560 690, 578 650" fill="none" stroke="#78B991" stroke-width="4.5" stroke-linecap="round" opacity="0.75"/>
        <path d="M 478 680 C 522 650, 558 604, 578 554" fill="none" stroke="#78B991" stroke-width="4.2" stroke-linecap="round" opacity="0.75"/>
        <path d="M 466 600 C 514 564, 550 514, 570 458" fill="none" stroke="#78B991" stroke-width="4.0" stroke-linecap="round" opacity="0.75"/>
        <path d="M 450 520 C 496 480, 532 428, 548 370" fill="none" stroke="#78B991" stroke-width="3.6" stroke-linecap="round" opacity="0.7"/>
        <path d="M 434 440 C 476 400, 508 348, 524 290" fill="none" stroke="#78B991" stroke-width="3.2" stroke-linecap="round" opacity="0.7"/>
        <path d="M 416 360 C 452 324, 480 274, 492 220" fill="none" stroke="#78B991" stroke-width="2.8" stroke-linecap="round" opacity="0.65"/>
        <path d="M 402 260 C 428 230, 448 190, 456 150" fill="none" stroke="#78B991" stroke-width="2.4" stroke-linecap="round" opacity="0.6"/>

        <!-- Left lateral veins -->
        <path d="M 482 720 C 444 700, 412 670, 392 640" fill="none" stroke="#68A981" stroke-width="4.2" stroke-linecap="round" opacity="0.7"/>
        <path d="M 470 640 C 430 620, 396 584, 376 544" fill="none" stroke="#68A981" stroke-width="4.0" stroke-linecap="round" opacity="0.7"/>
        <path d="M 456 560 C 416 534, 384 494, 366 448" fill="none" stroke="#68A981" stroke-width="3.8" stroke-linecap="round" opacity="0.7"/>
        <path d="M 440 480 C 402 450, 372 408, 356 358" fill="none" stroke="#68A981" stroke-width="3.4" stroke-linecap="round" opacity="0.65"/>
        <path d="M 424 400 C 390 370, 364 326, 350 278" fill="none" stroke="#68A981" stroke-width="3.0" stroke-linecap="round" opacity="0.65"/>
        <path d="M 408 310 C 382 284, 362 246, 354 204" fill="none" stroke="#68A981" stroke-width="2.6" stroke-linecap="round" opacity="0.6"/>

        <!-- Golden Highlight Tips Along the Edge & Spine -->
        <circle cx="392" cy="170" r="5" fill="#E8C96C" filter="url(#goldGlow)"/>
        <path d="M 508 840 C 496 700, 474 540, 452 430" fill="none" stroke="#E8C96C" stroke-width="2.5" opacity="0.65"/>
      </g>
    </svg>`
  },
  {
    name: 'tulsi_leaf.webp',
    svg: `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Sacred Holy Basil Deep Herbal Gradient -->
        <linearGradient id="tulsiBody" x1="0%" y1="15%" x2="100%" y2="85%">
          <stop offset="0%" stop-color="#143B25"/>
          <stop offset="30%" stop-color="#1E5234"/>
          <stop offset="65%" stop-color="#2D734B"/>
          <stop offset="100%" stop-color="#164129"/>
        </linearGradient>
        <radialGradient id="tulsiVelvet" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#3FA66F" stop-opacity="0.4"/>
          <stop offset="60%" stop-color="#205B3A" stop-opacity="0.1"/>
          <stop offset="100%" stop-color="#0E2C1B" stop-opacity="0.3"/>
        </radialGradient>
        <linearGradient id="tulsiSpineGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#7A6028"/>
          <stop offset="35%" stop-color="#CBB157"/>
          <stop offset="85%" stop-color="#76B58E"/>
          <stop offset="100%" stop-color="#A5DBB9"/>
        </linearGradient>
        <filter id="tulsiShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="2" dy="10" stdDeviation="15" flood-color="#04140B" flood-opacity="0.35"/>
        </filter>
      </defs>

      <g filter="url(#tulsiShadow)">
        <!-- Beautiful Ovate Holy Basil Shape with Soft Undulating Margin -->
        <path d="M 512 920 
                 C 420 880, 290 760, 266 580 
                 C 242 420, 330 280, 512 104 
                 C 694 280, 782 420, 758 580 
                 C 734 760, 604 880, 512 920 Z"
              fill="url(#tulsiBody)"
              stroke="#215738" stroke-width="4"/>

        <!-- Velvet inner luster -->
        <path d="M 512 920 
                 C 420 880, 290 760, 266 580 
                 C 242 420, 330 280, 512 104 
                 C 694 280, 782 420, 758 580 
                 C 734 760, 604 880, 512 920 Z"
              fill="url(#tulsiVelvet)"/>

        <!-- Scalloped Tulsi Leaf Margins -->
        <path d="M 512 104
                 Q 560 170 590 220 Q 640 290 670 360 Q 720 440 735 520 Q 755 610 740 680 Q 710 760 660 820 Q 590 880 512 920
                 Q 434 880 364 820 Q 314 760 284 680 Q 269 610 289 520 Q 304 440 354 360 Q 384 290 434 220 Q 464 170 512 104 Z"
              fill="none" stroke="#368357" stroke-width="3" opacity="0.6"/>

        <!-- Central Midrib with Gold Highlight Accents -->
        <path d="M 512 960 C 512 840, 512 440, 512 106"
              fill="none" stroke="url(#tulsiSpineGrad)" stroke-width="9" stroke-linecap="round"/>

        <!-- Symmetrical Arching Herbal Veins with Gold-Tipped Highlights -->
        <!-- Right veins -->
        <path d="M 512 760 C 580 710, 648 670, 690 610" fill="none" stroke="#7EC59B" stroke-width="4.5" stroke-linecap="round" opacity="0.75"/>
        <path d="M 512 620 C 592 560, 668 500, 710 430" fill="none" stroke="#7EC59B" stroke-width="4.2" stroke-linecap="round" opacity="0.75"/>
        <path d="M 512 470 C 584 410, 648 350, 684 280" fill="none" stroke="#7EC59B" stroke-width="3.8" stroke-linecap="round" opacity="0.7"/>
        <path d="M 512 320 C 568 270, 612 220, 640 160" fill="none" stroke="#7EC59B" stroke-width="3.2" stroke-linecap="round" opacity="0.65"/>
        
        <!-- Left veins -->
        <path d="M 512 760 C 444 710, 376 670, 334 610" fill="none" stroke="#7EC59B" stroke-width="4.5" stroke-linecap="round" opacity="0.75"/>
        <path d="M 512 620 C 432 560, 356 500, 314 430" fill="none" stroke="#7EC59B" stroke-width="4.2" stroke-linecap="round" opacity="0.75"/>
        <path d="M 512 470 C 440 410, 376 350, 340 280" fill="none" stroke="#7EC59B" stroke-width="3.8" stroke-linecap="round" opacity="0.7"/>
        <path d="M 512 320 C 456 270, 412 220, 384 160" fill="none" stroke="#7EC59B" stroke-width="3.2" stroke-linecap="round" opacity="0.65"/>

        <!-- Golden tip accent -->
        <circle cx="512" cy="106" r="6" fill="#F0CE72" opacity="0.9"/>
      </g>
    </svg>`
  },
  {
    name: 'bhringraj_sprig.webp',
    svg: `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bhrLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#113A24"/>
          <stop offset="50%" stop-color="#24643F"/>
          <stop offset="100%" stop-color="#14422B"/>
        </linearGradient>
        <linearGradient id="bhrPetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="70%" stop-color="#F2ECD9"/>
          <stop offset="100%" stop-color="#D6C18F"/>
        </linearGradient>
        <radialGradient id="bhrCenterGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#F2C75C"/>
          <stop offset="60%" stop-color="#B88A2B"/>
          <stop offset="100%" stop-color="#704D12"/>
        </radialGradient>
        <filter id="bhrShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="3" dy="10" stdDeviation="14" flood-color="#05140C" flood-opacity="0.32"/>
        </filter>
      </defs>

      <g filter="url(#bhrShadow)">
        <!-- Elegant Woody Herbal Stem -->
        <path d="M 512 940 Q 500 640 512 320" fill="none" stroke="#1D4B31" stroke-width="10" stroke-linecap="round"/>
        <path d="M 510 940 Q 498 640 510 320" fill="none" stroke="#CBB157" stroke-width="2.5" opacity="0.6"/>

        <!-- Lower Leaf Pair (Large Lanceolate) -->
        <!-- Left leaf -->
        <path d="M 508 640 C 360 680, 200 600, 140 480 C 240 440, 400 500, 508 640 Z"
              fill="url(#bhrLeafGrad)" stroke="#2B6B48" stroke-width="3"/>
        <path d="M 508 640 Q 320 540 140 480" fill="none" stroke="#71B58C" stroke-width="5" stroke-linecap="round" opacity="0.75"/>
        <path d="M 330 550 C 290 520, 240 490, 200 450" fill="none" stroke="#629F79" stroke-width="3" opacity="0.6"/>

        <!-- Right leaf -->
        <path d="M 512 620 C 660 660, 820 580, 880 460 C 780 420, 620 480, 512 620 Z"
              fill="url(#bhrLeafGrad)" stroke="#2B6B48" stroke-width="3"/>
        <path d="M 512 620 Q 700 520 880 460" fill="none" stroke="#71B58C" stroke-width="5" stroke-linecap="round" opacity="0.75"/>
        <path d="M 690 530 C 730 500, 780 470, 820 430" fill="none" stroke="#629F79" stroke-width="3" opacity="0.6"/>

        <!-- Upper Leaf Pair (Medium Lanceolate) -->
        <!-- Left upper -->
        <path d="M 508 440 C 380 460, 260 380, 220 280 C 300 260, 420 320, 508 440 Z"
              fill="url(#bhrLeafGrad)" stroke="#2B6B48" stroke-width="2.5"/>
        <path d="M 508 440 Q 360 350 220 280" fill="none" stroke="#71B58C" stroke-width="4" stroke-linecap="round" opacity="0.7"/>

        <!-- Right upper -->
        <path d="M 512 430 C 640 450, 760 370, 800 270 C 720 250, 600 310, 512 430 Z"
              fill="url(#bhrLeafGrad)" stroke="#2B6B48" stroke-width="2.5"/>
        <path d="M 512 430 Q 660 340 800 270" fill="none" stroke="#71B58C" stroke-width="4" stroke-linecap="round" opacity="0.7"/>

        <!-- Master Keshraj White & Golden Ayurvedic Flower at Apex -->
        <g transform="translate(512, 240)">
          <!-- 16 Radiating Star-like White Petals -->
          <ellipse cx="0" cy="-52" rx="12" ry="26" fill="url(#bhrPetalGrad)"/>
          <ellipse cx="0" cy="52" rx="12" ry="26" fill="url(#bhrPetalGrad)"/>
          <ellipse cx="-52" cy="0" rx="26" ry="12" fill="url(#bhrPetalGrad)"/>
          <ellipse cx="52" cy="0" rx="26" ry="12" fill="url(#bhrPetalGrad)"/>
          <ellipse cx="-37" cy="-37" rx="24" ry="12" transform="rotate(45 -37 -37)" fill="url(#bhrPetalGrad)"/>
          <ellipse cx="37" cy="37" rx="24" ry="12" transform="rotate(45 37 37)" fill="url(#bhrPetalGrad)"/>
          <ellipse cx="37" cy="-37" rx="24" ry="12" transform="rotate(-45 37 -37)" fill="url(#bhrPetalGrad)"/>
          <ellipse cx="-37" cy="37" rx="24" ry="12" transform="rotate(-45 -37 37)" fill="url(#bhrPetalGrad)"/>

          <!-- Interstitial petals -->
          <ellipse cx="-20" cy="-48" rx="22" ry="10" transform="rotate(22.5 -20 -48)" fill="url(#bhrPetalGrad)"/>
          <ellipse cx="20" cy="-48" rx="22" ry="10" transform="rotate(-22.5 20 -48)" fill="url(#bhrPetalGrad)"/>
          <ellipse cx="-48" cy="-20" rx="22" ry="10" transform="rotate(67.5 -48 -20)" fill="url(#bhrPetalGrad)"/>
          <ellipse cx="48" cy="-20" rx="22" ry="10" transform="rotate(-67.5 48 -20)" fill="url(#bhrPetalGrad)"/>
          <ellipse cx="-20" cy="48" rx="22" ry="10" transform="rotate(-22.5 -20 48)" fill="url(#bhrPetalGrad)"/>
          <ellipse cx="20" cy="48" rx="22" ry="10" transform="rotate(22.5 20 48)" fill="url(#bhrPetalGrad)"/>

          <!-- Rich Golden Pollen Core -->
          <circle cx="0" cy="0" r="32" fill="url(#bhrCenterGrad)"/>
          <circle cx="0" cy="0" r="18" fill="#FDE18C" opacity="0.6"/>
        </g>
      </g>
    </svg>`
  },
  {
    name: 'amla_sprig.webp',
    svg: `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="amlaStem" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#4F3B1A"/>
          <stop offset="40%" stop-color="#2D5A38"/>
          <stop offset="100%" stop-color="#559968"/>
        </linearGradient>
        <linearGradient id="amlaLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4BA364"/>
          <stop offset="50%" stop-color="#2C7043"/>
          <stop offset="100%" stop-color="#174426"/>
        </linearGradient>
        <radialGradient id="amlaBerry" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#F2E6A0"/>
          <stop offset="30%" stop-color="#A8D47E"/>
          <stop offset="70%" stop-color="#5E9946"/>
          <stop offset="100%" stop-color="#345924"/>
        </radialGradient>
        <filter id="amlaShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="3" dy="10" stdDeviation="15" flood-color="#041208" flood-opacity="0.3"/>
        </filter>
      </defs>

      <g filter="url(#amlaShadow)">
        <!-- Elegant Long Pinna Axis Stem -->
        <path d="M 512 950 Q 508 550 512 90" fill="none" stroke="url(#amlaStem)" stroke-width="9" stroke-linecap="round"/>

        <!-- Neatly Arranged Opposed Feathery Leaflet Pairs (Emblica Officinalis) -->
        <!-- Leaflet pair 1 (bottom) -->
        <g transform="translate(512, 850)">
          <ellipse cx="-86" cy="0" rx="80" ry="24" transform="rotate(-18 -86 0)" fill="url(#amlaLeaf)" stroke="#225433" stroke-width="2"/>
          <ellipse cx="86" cy="0" rx="80" ry="24" transform="rotate(18 86 0)" fill="url(#amlaLeaf)" stroke="#225433" stroke-width="2"/>
          <line x1="0" y1="0" x2="-155" y2="48" stroke="#71C58D" stroke-width="2.5" opacity="0.7"/>
          <line x1="0" y1="0" x2="155" y2="48" stroke="#71C58D" stroke-width="2.5" opacity="0.7"/>
        </g>
        <!-- Leaflet pair 2 -->
        <g transform="translate(512, 750)">
          <ellipse cx="-95" cy="0" rx="88" ry="25" transform="rotate(-16 -95 0)" fill="url(#amlaLeaf)" stroke="#225433" stroke-width="2"/>
          <ellipse cx="95" cy="0" rx="88" ry="25" transform="rotate(16 95 0)" fill="url(#amlaLeaf)" stroke="#225433" stroke-width="2"/>
        </g>
        <!-- Leaflet pair 3 -->
        <g transform="translate(512, 650)">
          <ellipse cx="-100" cy="0" rx="92" ry="26" transform="rotate(-15 -100 0)" fill="url(#amlaLeaf)" stroke="#225433" stroke-width="2"/>
          <ellipse cx="100" cy="0" rx="92" ry="26" transform="rotate(15 100 0)" fill="url(#amlaLeaf)" stroke="#225433" stroke-width="2"/>
        </g>
        <!-- Leaflet pair 4 -->
        <g transform="translate(512, 550)">
          <ellipse cx="-102" cy="0" rx="94" ry="26" transform="rotate(-14 -102 0)" fill="url(#amlaLeaf)" stroke="#225433" stroke-width="2"/>
          <ellipse cx="102" cy="0" rx="94" ry="26" transform="rotate(14 102 0)" fill="url(#amlaLeaf)" stroke="#225433" stroke-width="2"/>
        </g>
        <!-- Leaflet pair 5 -->
        <g transform="translate(512, 450)">
          <ellipse cx="-98" cy="0" rx="90" ry="25" transform="rotate(-12 -98 0)" fill="url(#amlaLeaf)" stroke="#225433" stroke-width="2"/>
          <ellipse cx="98" cy="0" rx="90" ry="25" transform="rotate(12 98 0)" fill="url(#amlaLeaf)" stroke="#225433" stroke-width="2"/>
        </g>
        <!-- Leaflet pair 6 -->
        <g transform="translate(512, 350)">
          <ellipse cx="-90" cy="0" rx="82" ry="24" transform="rotate(-10 -90 0)" fill="url(#amlaLeaf)" stroke="#225433" stroke-width="2"/>
          <ellipse cx="90" cy="0" rx="82" ry="24" transform="rotate(10 90 0)" fill="url(#amlaLeaf)" stroke="#225433" stroke-width="2"/>
        </g>
        <!-- Leaflet pair 7 -->
        <g transform="translate(512, 250)">
          <ellipse cx="-76" cy="0" rx="70" ry="22" transform="rotate(-8 -76 0)" fill="url(#amlaLeaf)" stroke="#225433" stroke-width="2"/>
          <ellipse cx="76" cy="0" rx="70" ry="22" transform="rotate(8 76 0)" fill="url(#amlaLeaf)" stroke="#225433" stroke-width="2"/>
        </g>
        <!-- Leaflet pair 8 -->
        <g transform="translate(512, 160)">
          <ellipse cx="-58" cy="0" rx="54" ry="18" transform="rotate(-6 -58 0)" fill="url(#amlaLeaf)" stroke="#225433" stroke-width="2"/>
          <ellipse cx="58" cy="0" rx="54" ry="18" transform="rotate(6 58 0)" fill="url(#amlaLeaf)" stroke="#225433" stroke-width="2"/>
        </g>
        <!-- Terminal leaflet -->
        <ellipse cx="512" cy="80" rx="26" ry="38" fill="url(#amlaLeaf)" stroke="#225433" stroke-width="2"/>

        <!-- Glistening Translucent Indian Gooseberry (Amla) Fruit -->
        <g transform="translate(512, 890)">
          <!-- Short pedicel stalk -->
          <path d="M 0 0 C 15 20, 30 35, 50 40" fill="none" stroke="#4F3B1A" stroke-width="5" stroke-linecap="round"/>
          <g transform="translate(90, 60)">
            <circle cx="0" cy="0" r="54" fill="url(#amlaBerry)" stroke="#4A7532" stroke-width="3"/>
            <!-- Characteristic 6 vertical meridian ribs of Amla -->
            <path d="M 0 -54 Q -20 0 0 54" fill="none" stroke="#2D5A22" stroke-width="2.5" opacity="0.5"/>
            <path d="M 0 -54 Q 20 0 0 54" fill="none" stroke="#2D5A22" stroke-width="2.5" opacity="0.5"/>
            <!-- Light luster shine -->
            <ellipse cx="-16" cy="-18" rx="14" ry="8" transform="rotate(-30 -16 -18)" fill="#FFFFFF" opacity="0.6"/>
          </g>
        </g>
      </g>
    </svg>`
  },
  {
    name: 'hibiscus_petal.webp',
    svg: `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Rich Velvet Botanical Crimson & Warm Golden Amber -->
        <radialGradient id="hibiscusVelvet" cx="50%" cy="85%" r="75%">
          <stop offset="0%" stop-color="#E8A850"/>
          <stop offset="25%" stop-color="#C25A2B"/>
          <stop offset="60%" stop-color="#8F2519"/>
          <stop offset="90%" stop-color="#60130E"/>
          <stop offset="100%" stop-color="#3D0B08"/>
        </radialGradient>
        <linearGradient id="hibRuffleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFDCA4" stop-opacity="0.8"/>
          <stop offset="50%" stop-color="#E87642" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#60130E" stop-opacity="0"/>
        </linearGradient>
        <filter id="hibShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="2" dy="12" stdDeviation="16" flood-color="#240503" flood-opacity="0.38"/>
        </filter>
      </defs>

      <g filter="url(#hibShadow)">
        <!-- Natural Ruffled Fan-like Ayurvedic Hibiscus Petal -->
        <path d="M 512 920 
                 C 480 820, 320 720, 240 560 
                 C 160 400, 220 240, 360 160 
                 C 460 100, 580 110, 680 180 
                 C 800 270, 860 430, 780 590 
                 C 700 740, 550 820, 512 920 Z"
              fill="url(#hibiscusVelvet)"
              stroke="#5E140F" stroke-width="4"/>

        <!-- Detailed Ruffled Edge Highlights -->
        <path d="M 360 160
                 Q 420 120 480 140 Q 540 110 600 135 Q 660 130 680 180
                 Q 750 250 800 340 Q 840 440 800 540 Q 750 650 680 740"
              fill="none" stroke="url(#hibRuffleGlow)" stroke-width="6" stroke-linecap="round"/>

        <!-- Radiant Golden-Rose Petal Venation Network -->
        <path d="M 512 900 Q 480 620 400 260" fill="none" stroke="#F5B273" stroke-width="5" opacity="0.65"/>
        <path d="M 512 900 Q 512 600 520 180" fill="none" stroke="#F5B273" stroke-width="5.5" opacity="0.7"/>
        <path d="M 512 900 Q 560 620 640 280" fill="none" stroke="#F5B273" stroke-width="5" opacity="0.65"/>
        <path d="M 512 900 Q 400 680 280 440" fill="none" stroke="#E68B50" stroke-width="4.2" opacity="0.55"/>
        <path d="M 512 900 Q 620 680 740 460" fill="none" stroke="#E68B50" stroke-width="4.2" opacity="0.55"/>

        <!-- Secondary capillary veins -->
        <path d="M 460 500 Q 400 420 330 360" fill="none" stroke="#F5B273" stroke-width="2.5" opacity="0.45"/>
        <path d="M 570 500 Q 630 420 700 370" fill="none" stroke="#F5B273" stroke-width="2.5" opacity="0.45"/>
        <path d="M 490 380 Q 440 300 390 230" fill="none" stroke="#F5B273" stroke-width="2.5" opacity="0.45"/>
        <path d="M 540 380 Q 590 300 640 240" fill="none" stroke="#F5B273" stroke-width="2.5" opacity="0.45"/>

        <!-- Golden base attachment point -->
        <path d="M 480 920 C 500 935, 524 935, 544 920" stroke="#F5C76C" stroke-width="6" stroke-linecap="round"/>
      </g>
    </svg>`
  },
  {
    name: 'brahmi_leaf.webp',
    svg: `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Fleshy Succulent Leaf Gradient -->
        <linearGradient id="brahmiSucculent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2D7547"/>
          <stop offset="45%" stop-color="#4B9C65"/>
          <stop offset="85%" stop-color="#2C6942"/>
          <stop offset="100%" stop-color="#19482A"/>
        </linearGradient>
        <radialGradient id="brahmiGleam" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stop-color="#8FE8A8" stop-opacity="0.6"/>
          <stop offset="60%" stop-color="#4B9C65" stop-opacity="0.1"/>
          <stop offset="100%" stop-color="#19482A" stop-opacity="0"/>
        </radialGradient>
        <filter id="brahmiShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="3" dy="10" stdDeviation="15" flood-color="#04140B" flood-opacity="0.32"/>
        </filter>
      </defs>

      <g filter="url(#brahmiShadow)">
        <!-- Joint Botanical Stem -->
        <path d="M 512 940 Q 508 720 512 520" fill="none" stroke="#255C37" stroke-width="12" stroke-linecap="round"/>
        <path d="M 512 940 Q 508 720 512 520" fill="none" stroke="#CBB157" stroke-width="3" opacity="0.65"/>

        <!-- Pair of Fleshy Obovate / Spatulate Bacopa Leaves -->
        <!-- Left spatula leaf -->
        <g>
          <path d="M 512 540 
                   C 440 560, 320 520, 260 400 
                   C 200 280, 260 180, 360 160 
                   C 460 140, 500 280, 512 540 Z"
                fill="url(#brahmiSucculent)"
                stroke="#245A36" stroke-width="4"/>
          <path d="M 512 540 
                   C 440 560, 320 520, 260 400 
                   C 200 280, 260 180, 360 160 
                   C 460 140, 500 280, 512 540 Z"
                fill="url(#brahmiGleam)"/>
          <!-- Faint succulent vein lines -->
          <path d="M 512 540 Q 400 360 340 220" fill="none" stroke="#90E0A6" stroke-width="4" stroke-linecap="round" opacity="0.6"/>
          <circle cx="340" cy="240" r="16" fill="#A8F5BE" opacity="0.4"/>
        </g>

        <!-- Right spatula leaf -->
        <g>
          <path d="M 512 540 
                   C 584 560, 704 520, 764 400 
                   C 824 280, 764 180, 664 160 
                   C 564 140, 524 280, 512 540 Z"
                fill="url(#brahmiSucculent)"
                stroke="#245A36" stroke-width="4"/>
          <path d="M 512 540 
                   C 584 560, 704 520, 764 400 
                   C 824 280, 764 180, 664 160 
                   C 564 140, 524 280, 512 540 Z"
                fill="url(#brahmiGleam)"/>
          <path d="M 512 540 Q 624 360 684 220" fill="none" stroke="#90E0A6" stroke-width="4" stroke-linecap="round" opacity="0.6"/>
          <circle cx="684" cy="240" r="16" fill="#A8F5BE" opacity="0.4"/>
        </g>

        <!-- Golden growth point nodule -->
        <circle cx="512" cy="530" r="12" fill="#E8C96C" stroke="#255C37" stroke-width="2"/>
      </g>
    </svg>`
  },
  {
    name: 'shikakai_pod.webp',
    svg: `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Deep Herbal Bark & Acacia Pod Mahogany Gradient -->
        <linearGradient id="shikakaiPodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4A2E16"/>
          <stop offset="35%" stop-color="#704420"/>
          <stop offset="70%" stop-color="#915B2D"/>
          <stop offset="100%" stop-color="#3D240E"/>
        </linearGradient>
        <radialGradient id="seedSwell" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#B57B43"/>
          <stop offset="70%" stop-color="#704420"/>
          <stop offset="100%" stop-color="#3D240E"/>
        </radialGradient>
        <filter id="shikakaiShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="3" dy="12" stdDeviation="15" flood-color="#170A03" flood-opacity="0.36"/>
        </filter>
      </defs>

      <g filter="url(#shikakaiShadow)">
        <!-- Natural Leathery Acacia Concinna Pod with Seed Swellings -->
        <path d="M 440 920 
                 C 420 840, 430 780, 452 730 
                 C 410 690, 400 630, 424 570 
                 C 390 520, 384 460, 412 400 
                 C 388 350, 388 290, 428 230 
                 C 460 170, 500 130, 550 100 
                 C 580 120, 560 170, 532 220 
                 C 568 270, 560 330, 520 390 
                 C 556 440, 552 510, 508 570 
                 C 540 630, 536 690, 496 750 
                 C 516 810, 500 870, 470 930 Z"
              fill="url(#shikakaiPodGrad)"
              stroke="#2E1707" stroke-width="4.5"/>

        <!-- 4 Distinct Raised Herbal Seed Compartments -->
        <ellipse cx="472" cy="280" rx="40" ry="60" transform="rotate(-12 472 280)" fill="url(#seedSwell)"/>
        <ellipse cx="464" cy="470" rx="44" ry="64" transform="rotate(-10 464 470)" fill="url(#seedSwell)"/>
        <ellipse cx="466" cy="660" rx="42" ry="64" transform="rotate(-8 466 660)" fill="url(#seedSwell)"/>
        <ellipse cx="464" cy="830" rx="36" ry="52" transform="rotate(-6 464 830)" fill="url(#seedSwell)"/>

        <!-- Organic Leathery Pod Rind Wrinkle Texture & Gold Highlights -->
        <path d="M 436 330 Q 480 340 528 335" fill="none" stroke="#D19858" stroke-width="3" opacity="0.6"/>
        <path d="M 424 520 Q 470 530 514 525" fill="none" stroke="#D19858" stroke-width="3" opacity="0.6"/>
        <path d="M 440 705 Q 480 715 506 710" fill="none" stroke="#D19858" stroke-width="3" opacity="0.6"/>

        <path d="M 428 230 C 470 200, 520 180, 550 100" fill="none" stroke="#E8C96C" stroke-width="3" opacity="0.75"/>
      </g>
    </svg>`
  },
  {
    name: 'curry_leaf.webp',
    svg: `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="curryBody" x1="10%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%" stop-color="#0E2F1B"/>
          <stop offset="40%" stop-color="#184C2C"/>
          <stop offset="80%" stop-color="#286940"/>
          <stop offset="100%" stop-color="#123821"/>
        </linearGradient>
        <linearGradient id="curryMidrib" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#7A6024"/>
          <stop offset="40%" stop-color="#CBB157"/>
          <stop offset="80%" stop-color="#7AC993"/>
          <stop offset="100%" stop-color="#AEE6C1"/>
        </linearGradient>
        <filter id="curryShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="3" dy="12" stdDeviation="15" flood-color="#041209" flood-opacity="0.32"/>
        </filter>
      </defs>

      <g filter="url(#curryShadow)">
        <!-- Elegant Pointed Asymmetrical Curry Leaf (Murraya Koenigii) -->
        <path d="M 512 930 
                 C 470 800, 320 640, 330 440 
                 C 340 280, 430 170, 512 90 
                 C 590 170, 690 280, 690 440 
                 C 690 640, 550 800, 512 930 Z"
              fill="url(#curryBody)"
              stroke="#215735" stroke-width="4"/>

        <!-- Glossy Midrib with Fine Golden-Lime Radiance -->
        <path d="M 512 950 Q 508 520 512 92" fill="none" stroke="url(#curryMidrib)" stroke-width="8.5" stroke-linecap="round"/>

        <!-- Curved Secondary Veins with Natural Botanical Sheen -->
        <!-- Right veins -->
        <path d="M 512 720 Q 600 630 650 540" fill="none" stroke="#71BF8E" stroke-width="4" stroke-linecap="round" opacity="0.75"/>
        <path d="M 512 540 Q 610 450 660 350" fill="none" stroke="#71BF8E" stroke-width="3.8" stroke-linecap="round" opacity="0.75"/>
        <path d="M 512 360 Q 590 280 630 210" fill="none" stroke="#71BF8E" stroke-width="3.2" stroke-linecap="round" opacity="0.7"/>
        <path d="M 512 210 Q 560 160 590 120" fill="none" stroke="#71BF8E" stroke-width="2.6" stroke-linecap="round" opacity="0.6"/>

        <!-- Left veins -->
        <path d="M 512 720 Q 424 630 370 540" fill="none" stroke="#71BF8E" stroke-width="4" stroke-linecap="round" opacity="0.75"/>
        <path d="M 512 540 Q 416 450 360 350" fill="none" stroke="#71BF8E" stroke-width="3.8" stroke-linecap="round" opacity="0.75"/>
        <path d="M 512 360 Q 436 280 390 210" fill="none" stroke="#71BF8E" stroke-width="3.2" stroke-linecap="round" opacity="0.7"/>
        <path d="M 512 210 Q 464 160 430 120" fill="none" stroke="#71BF8E" stroke-width="2.6" stroke-linecap="round" opacity="0.6"/>

        <!-- Glossy highlight strip -->
        <path d="M 530 650 C 540 500, 530 350, 522 250" fill="none" stroke="#B2EAC7" stroke-width="3" opacity="0.45"/>
      </g>
    </svg>`
  },
  {
    name: 'ayurvedic_herb_cluster.webp',
    svg: `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="clLeaf1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#113A24"/>
          <stop offset="100%" stop-color="#24643F"/>
        </linearGradient>
        <linearGradient id="clLeaf2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1A4A30"/>
          <stop offset="100%" stop-color="#3B8558"/>
        </linearGradient>
        <linearGradient id="clLeaf3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#557F48"/>
          <stop offset="100%" stop-color="#80B26E"/>
        </linearGradient>
        <linearGradient id="clGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#7C6026"/>
          <stop offset="50%" stop-color="#D4B055"/>
          <stop offset="100%" stop-color="#FCE59F"/>
        </linearGradient>
        <filter id="clusterShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="3" dy="12" stdDeviation="16" flood-color="#041208" flood-opacity="0.35"/>
        </filter>
      </defs>

      <g filter="url(#clusterShadow)">
        <!-- Rear Left Leaf (Neem curved blade) -->
        <g transform="translate(30, 20)">
          <path d="M 480 700 C 360 680, 220 560, 190 380 C 250 280, 390 360, 480 700 Z"
                fill="url(#clLeaf1)" stroke="#1F5434" stroke-width="3"/>
          <path d="M 480 700 Q 320 500 230 330" fill="none" stroke="#6EB888" stroke-width="4.5" opacity="0.7"/>
        </g>

        <!-- Rear Right Leaf (Muted Sage herbal blade) -->
        <g transform="translate(-20, 20)">
          <path d="M 540 700 C 660 680, 800 560, 830 380 C 770 280, 630 360, 540 700 Z"
                fill="url(#clLeaf3)" stroke="#4A753C" stroke-width="3"/>
          <path d="M 540 700 Q 700 500 790 330" fill="none" stroke="#B8DEAC" stroke-width="4.5" opacity="0.7"/>
        </g>

        <!-- Center Front Leaf (Tulsi broad ovate) -->
        <g>
          <path d="M 512 840 
                   C 420 740, 340 560, 370 340 
                   C 440 160, 512 120, 512 120 
                   C 512 120, 584 160, 654 340 
                   C 684 560, 604 740, 512 840 Z"
                fill="url(#clLeaf2)" stroke="#225B37" stroke-width="4"/>
          <path d="M 512 840 V 130" stroke="url(#clGold)" stroke-width="7" stroke-linecap="round"/>
          <path d="M 512 600 C 580 540, 630 480, 650 400" fill="none" stroke="#8FE2AD" stroke-width="4" opacity="0.75"/>
          <path d="M 512 600 C 444 540, 394 480, 374 400" fill="none" stroke="#8FE2AD" stroke-width="4" opacity="0.75"/>
        </g>

        <!-- Golden Dried Herbal Seed Sprig Accent Behind -->
        <path d="M 512 860 Q 560 500 620 220" fill="none" stroke="#D4B055" stroke-width="3" opacity="0.8"/>
        <circle cx="620" cy="220" r="14" fill="url(#clGold)"/>
        <circle cx="585" cy="290" r="10" fill="url(#clGold)"/>
        <circle cx="640" cy="330" r="9" fill="url(#clGold)"/>
      </g>
    </svg>`
  },
  {
    name: 'golden_herb_petal.webp',
    svg: `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gPetal" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#FFF0BE"/>
          <stop offset="35%" stop-color="#E5BE65"/>
          <stop offset="70%" stop-color="#BA8E35"/>
          <stop offset="100%" stop-color="#735214"/>
        </radialGradient>
        <filter id="gpShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="2" dy="8" stdDeviation="12" flood-color="#140E02" flood-opacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(#gpShadow)">
        <path d="M 512 900 C 380 780, 280 600, 310 400 C 340 200, 470 120, 512 120 C 554 120, 684 200, 714 400 C 744 600, 644 780, 512 900 Z"
              fill="url(#gPetal)" stroke="#9E7623" stroke-width="3"/>
        <path d="M 512 900 Q 512 500 512 122" fill="none" stroke="#FFE9A8" stroke-width="5" stroke-linecap="round" opacity="0.75"/>
        <path d="M 512 600 Q 590 500 640 400" fill="none" stroke="#FFE9A8" stroke-width="3" opacity="0.6"/>
        <path d="M 512 600 Q 434 500 384 400" fill="none" stroke="#FFE9A8" stroke-width="3" opacity="0.6"/>
      </g>
    </svg>`
  },
  {
    name: 'sage_leaf_variant.webp',
    svg: `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#416348"/>
          <stop offset="45%" stop-color="#698F6B"/>
          <stop offset="85%" stop-color="#4B7250"/>
          <stop offset="100%" stop-color="#2D4D33"/>
        </linearGradient>
        <filter id="sageShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="3" dy="10" stdDeviation="14" flood-color="#041208" flood-opacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(#sageShadow)">
        <path d="M 512 920 C 400 850, 310 700, 320 480 C 330 260, 440 140, 512 110 C 584 140, 694 260, 704 480 C 714 700, 624 850, 512 920 Z"
              fill="url(#sageGrad)" stroke="#39593E" stroke-width="4"/>
        <path d="M 512 940 V 115" stroke="#A9D1AF" stroke-width="8" stroke-linecap="round"/>
        <!-- Fine Sage Veins -->
        <path d="M 512 700 Q 610 630 650 540" fill="none" stroke="#C5E8CA" stroke-width="3.8" stroke-linecap="round" opacity="0.7"/>
        <path d="M 512 520 Q 610 450 650 360" fill="none" stroke="#C5E8CA" stroke-width="3.5" stroke-linecap="round" opacity="0.7"/>
        <path d="M 512 340 Q 590 280 630 210" fill="none" stroke="#C5E8CA" stroke-width="3" stroke-linecap="round" opacity="0.65"/>
        <path d="M 512 700 Q 414 630 374 540" fill="none" stroke="#C5E8CA" stroke-width="3.8" stroke-linecap="round" opacity="0.7"/>
        <path d="M 512 520 Q 414 450 374 360" fill="none" stroke="#C5E8CA" stroke-width="3.5" stroke-linecap="round" opacity="0.7"/>
        <path d="M 512 340 Q 434 280 394 210" fill="none" stroke="#C5E8CA" stroke-width="3" stroke-linecap="round" opacity="0.65"/>
      </g>
    </svg>`
  },
  {
    name: 'dried_herb_fragment.webp',
    svg: `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fragGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4A341B"/>
          <stop offset="50%" stop-color="#73532C"/>
          <stop offset="100%" stop-color="#3D2914"/>
        </linearGradient>
        <filter id="fragShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="2" dy="8" stdDeviation="10" flood-color="#120A03" flood-opacity="0.32"/>
        </filter>
      </defs>
      <g filter="url(#fragShadow)">
        <path d="M 460 880 C 410 750, 390 620, 440 500 C 470 420, 430 330, 470 210 C 510 240, 540 310, 520 400 C 560 480, 570 600, 520 730 C 540 800, 510 850, 460 880 Z"
              fill="url(#fragGrad)" stroke="#30200F" stroke-width="3"/>
        <path d="M 460 880 Q 480 500 470 215" fill="none" stroke="#C9A84E" stroke-width="3.5" opacity="0.7"/>
        <path d="M 470 520 Q 530 460 550 410" fill="none" stroke="#D9B763" stroke-width="2.5" opacity="0.6"/>
        <path d="M 460 660 Q 410 600 400 550" fill="none" stroke="#D9B763" stroke-width="2.5" opacity="0.6"/>
      </g>
    </svg>`
  }
];

async function generateHDAssets() {
  console.log('Rendering 9 Ultra-HD 1024x1024 Transparent Botanical WebP Assets...');
  for (const item of botanicalDefinitions) {
    const filePath = path.join(outDir, item.name);
    await sharp(Buffer.from(item.svg))
      .webp({ quality: 95, alphaQuality: 100, effort: 3 })
      .toFile(filePath);
    const stat = fs.statSync(filePath);
    console.log(`Rendered ${item.name} (${Math.round(stat.size / 1024)} KB)`);
  }
  console.log('Successfully completed Ultra-HD botanical asset generation.');
}

generateHDAssets().catch(err => {
  console.error(err);
  process.exit(1);
});
