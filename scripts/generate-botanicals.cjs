const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = path.join(__dirname, '..', 'public', 'images', 'botanical');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Definition of 12 distinct realistic Ayurvedic botanical elements
const botanicals = [
  {
    name: 'neem_leaf.webp',
    svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="neemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#143D2B"/>
          <stop offset="35%" stop-color="#1F573C"/>
          <stop offset="70%" stop-color="#2D7452"/>
          <stop offset="100%" stop-color="#1B4D35"/>
        </linearGradient>
        <linearGradient id="neemStem" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4E8C68" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#235A3D" stop-opacity="0.7"/>
        </linearGradient>
        <filter id="neemGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#071911" flood-opacity="0.18"/>
        </filter>
      </defs>
      <g filter="url(#neemGlow)">
        <!-- Asymmetrical curved serrated neem leaf blade -->
        <path d="M256 460 C254 410, 240 340, 218 280 C194 216, 160 152, 196 68 C216 112, 252 144, 276 196 C304 256, 312 344, 256 460 Z"
              fill="url(#neemGrad)" />
        
        <!-- Serrations along the outer curved edge -->
        <path d="M196 68 Q198 88 186 96 Q204 112 188 126 Q208 144 190 162 Q214 184 196 204 Q220 230 204 252 Q226 280 212 304 Q232 338 222 368 Q242 406 238 440 L256 460 Q268 418 286 380 Q272 352 298 322 Q284 292 306 262 Q292 232 310 204 Q296 176 308 150 Q294 124 300 98 Q286 80 276 196 L196 68 Z"
              fill="url(#neemGrad)" />
              
        <!-- Natural leaf spine / midrib -->
        <path d="M256 475 C254 420, 246 330, 234 260 C222 190, 204 120, 196 68"
              fill="none" stroke="url(#neemStem)" stroke-width="4.5" stroke-linecap="round"/>
              
        <!-- Lateral curving veins -->
        <path d="M246 380 C264 366, 278 350, 288 334" fill="none" stroke="#5DA37A" stroke-width="2.2" stroke-linecap="round" opacity="0.65"/>
        <path d="M240 340 C222 332, 206 318, 196 304" fill="none" stroke="#5DA37A" stroke-width="2.2" stroke-linecap="round" opacity="0.65"/>
        <path d="M236 300 C258 284, 274 266, 282 246" fill="none" stroke="#5DA37A" stroke-width="2.0" stroke-linecap="round" opacity="0.65"/>
        <path d="M230 260 C212 248, 198 232, 190 216" fill="none" stroke="#5DA37A" stroke-width="2.0" stroke-linecap="round" opacity="0.65"/>
        <path d="M224 220 C244 204, 258 186, 266 168" fill="none" stroke="#5DA37A" stroke-width="1.8" stroke-linecap="round" opacity="0.6"/>
        <path d="M218 180 C204 168, 194 154, 188 140" fill="none" stroke="#5DA37A" stroke-width="1.8" stroke-linecap="round" opacity="0.6"/>
        <path d="M210 140 C226 128, 238 114, 244 100" fill="none" stroke="#5DA37A" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>
        <path d="M204 104 C196 96, 190 86, 188 78" fill="none" stroke="#5DA37A" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/>
      </g>
    </svg>`
  },
  {
    name: 'tulsi_leaf.webp',
    svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tulsiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1A442E"/>
          <stop offset="40%" stop-color="#286343"/>
          <stop offset="80%" stop-color="#3B8158"/>
          <stop offset="100%" stop-color="#214E36"/>
        </linearGradient>
        <linearGradient id="tulsiVein" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#72B58A" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#427D57" stop-opacity="0.5"/>
        </linearGradient>
      </defs>
      <g>
        <!-- Ovate Holy Basil leaf with gentle undulating serrations -->
        <path d="M256 460 C210 440, 150 380, 136 290 C124 210, 168 140, 256 52 C344 140, 388 210, 376 290 C362 380, 302 440, 256 460 Z"
              fill="url(#tulsiGrad)" />
              
        <!-- Central stem -->
        <path d="M256 480 C256 420, 256 220, 256 54" fill="none" stroke="url(#tulsiVein)" stroke-width="5" stroke-linecap="round"/>
        
        <!-- Branching veins -->
        <path d="M256 380 C290 355, 324 335, 345 305" fill="none" stroke="#68A87E" stroke-width="2.8" stroke-linecap="round" opacity="0.6"/>
        <path d="M256 380 C222 355, 188 335, 167 305" fill="none" stroke="#68A87E" stroke-width="2.8" stroke-linecap="round" opacity="0.6"/>
        <path d="M256 310 C296 280, 334 250, 355 215" fill="none" stroke="#68A87E" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>
        <path d="M256 310 C216 280, 178 250, 157 215" fill="none" stroke="#68A87E" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>
        <path d="M256 235 C292 205, 324 175, 342 140" fill="none" stroke="#68A87E" stroke-width="2.2" stroke-linecap="round" opacity="0.55"/>
        <path d="M256 235 C220 205, 188 175, 170 140" fill="none" stroke="#68A87E" stroke-width="2.2" stroke-linecap="round" opacity="0.55"/>
        <path d="M256 160 C284 135, 306 110, 320 80" fill="none" stroke="#68A87E" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/>
        <path d="M256 160 C228 135, 206 110, 192 80" fill="none" stroke="#68A87E" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/>
      </g>
    </svg>`
  },
  {
    name: 'amla_sprig.webp',
    svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="amlaStemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#406E47"/>
          <stop offset="100%" stop-color="#244B2C"/>
        </linearGradient>
        <linearGradient id="amlaLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#559960"/>
          <stop offset="50%" stop-color="#3C7546"/>
          <stop offset="100%" stop-color="#23502C"/>
        </linearGradient>
      </defs>
      <g>
        <!-- Slender central branchlet stem -->
        <path d="M256 480 Q254 300 256 40" fill="none" stroke="url(#amlaStemGrad)" stroke-width="4.5" stroke-linecap="round"/>
        
        <!-- Paired miniature linear-oblong leaflets -->
        <!-- Leaflet pairs along spine -->
        <ellipse cx="216" cy="420" rx="38" ry="12" transform="rotate(-18 216 420)" fill="url(#amlaLeafGrad)"/>
        <ellipse cx="296" cy="420" rx="38" ry="12" transform="rotate(18 296 420)" fill="url(#amlaLeafGrad)"/>
        
        <ellipse cx="212" cy="370" rx="42" ry="13" transform="rotate(-16 212 370)" fill="url(#amlaLeafGrad)"/>
        <ellipse cx="300" cy="370" rx="42" ry="13" transform="rotate(16 300 370)" fill="url(#amlaLeafGrad)"/>
        
        <ellipse cx="208" cy="318" rx="45" ry="13.5" transform="rotate(-15 208 318)" fill="url(#amlaLeafGrad)"/>
        <ellipse cx="304" cy="318" rx="45" ry="13.5" transform="rotate(15 304 318)" fill="url(#amlaLeafGrad)"/>
        
        <ellipse cx="206" cy="265" rx="45" ry="14" transform="rotate(-14 206 265)" fill="url(#amlaLeafGrad)"/>
        <ellipse cx="306" cy="265" rx="45" ry="14" transform="rotate(14 306 265)" fill="url(#amlaLeafGrad)"/>
        
        <ellipse cx="208" cy="212" rx="44" ry="13" transform="rotate(-12 208 212)" fill="url(#amlaLeafGrad)"/>
        <ellipse cx="304" cy="212" rx="44" ry="13" transform="rotate(12 304 212)" fill="url(#amlaLeafGrad)"/>
        
        <ellipse cx="214" cy="160" rx="40" ry="12" transform="rotate(-10 214 160)" fill="url(#amlaLeafGrad)"/>
        <ellipse cx="298" cy="160" rx="40" ry="12" transform="rotate(10 298 160)" fill="url(#amlaLeafGrad)"/>
        
        <ellipse cx="222" cy="110" rx="34" ry="11" transform="rotate(-8 222 110)" fill="url(#amlaLeafGrad)"/>
        <ellipse cx="290" cy="110" rx="34" ry="11" transform="rotate(8 290 110)" fill="url(#amlaLeafGrad)"/>
        
        <ellipse cx="234" cy="65" rx="26" ry="9" transform="rotate(-6 234 65)" fill="url(#amlaLeafGrad)"/>
        <ellipse cx="278" cy="65" rx="26" ry="9" transform="rotate(6 278 65)" fill="url(#amlaLeafGrad)"/>
        
        <!-- Terminal tip leaflet -->
        <ellipse cx="256" cy="34" rx="14" ry="18" fill="url(#amlaLeafGrad)"/>
      </g>
    </svg>`
  },
  {
    name: 'bhringraj_sprig.webp',
    svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bhrLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#194833"/>
          <stop offset="50%" stop-color="#2D6F4E"/>
          <stop offset="100%" stop-color="#18422E"/>
        </linearGradient>
        <linearGradient id="bhrPetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="80%" stop-color="#E2D9C5"/>
          <stop offset="100%" stop-color="#B8A476"/>
        </linearGradient>
      </defs>
      <g>
        <!-- Stem -->
        <path d="M256 470 Q250 320 256 160" fill="none" stroke="#25553C" stroke-width="5" stroke-linecap="round"/>
        
        <!-- Opposite lanceolate leaf pair -->
        <!-- Left leaf -->
        <path d="M254 320 C180 340, 100 300, 70 240 C120 220, 200 250, 254 320 Z" fill="url(#bhrLeaf)"/>
        <path d="M254 320 Q160 270 70 240" fill="none" stroke="#5FA37D" stroke-width="2.5" opacity="0.6"/>
        
        <!-- Right leaf -->
        <path d="M256 310 C330 330, 410 290, 440 230 C390 210, 310 240, 256 310 Z" fill="url(#bhrLeaf)"/>
        <path d="M256 310 Q350 260 440 230" fill="none" stroke="#5FA37D" stroke-width="2.5" opacity="0.6"/>
        
        <!-- Upper leaf pair -->
        <path d="M254 220 C190 230, 130 190, 110 140 C150 130, 210 160, 254 220 Z" fill="url(#bhrLeaf)"/>
        <path d="M256 215 C320 225, 380 185, 400 135 C360 125, 300 155, 256 215 Z" fill="url(#bhrLeaf)"/>
        
        <!-- Little white Ayurvedic flower bud at apex -->
        <circle cx="256" cy="130" r="16" fill="#C5A059"/>
        <ellipse cx="256" cy="106" rx="6" ry="12" fill="url(#bhrPetal)"/>
        <ellipse cx="256" cy="154" rx="6" ry="12" fill="url(#bhrPetal)"/>
        <ellipse cx="232" cy="130" rx="12" ry="6" fill="url(#bhrPetal)"/>
        <ellipse cx="280" cy="130" rx="12" ry="6" fill="url(#bhrPetal)"/>
        <ellipse cx="239" cy="113" rx="10" ry="6" transform="rotate(45 239 113)" fill="url(#bhrPetal)"/>
        <ellipse cx="273" cy="147" rx="10" ry="6" transform="rotate(45 273 147)" fill="url(#bhrPetal)"/>
        <ellipse cx="273" cy="113" rx="10" ry="6" transform="rotate(-45 273 113)" fill="url(#bhrPetal)"/>
        <ellipse cx="239" cy="147" rx="10" ry="6" transform="rotate(-45 239 147)" fill="url(#bhrPetal)"/>
      </g>
    </svg>`
  },
  {
    name: 'hibiscus_petal.webp',
    svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="hibPetal" cx="50%" cy="80%" r="70%">
          <stop offset="0%" stop-color="#C5853B"/>
          <stop offset="35%" stop-color="#A8582C"/>
          <stop offset="70%" stop-color="#8F3F24"/>
          <stop offset="100%" stop-color="#732A18"/>
        </radialGradient>
        <linearGradient id="petalGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFD494" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#A8582C" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <g>
        <!-- Delicate undulating curved flower petal -->
        <path d="M256 460 C240 410, 160 360, 120 280 C80 200, 110 120, 180 80 C230 50, 290 55, 340 90 C400 135, 430 215, 390 295 C350 370, 275 410, 256 460 Z"
              fill="url(#hibPetal)"/>
        <!-- Soft top ruffled edge highlight -->
        <path d="M180 80 Q210 65 240 70 Q270 55 300 70 Q330 65 340 90 Q380 140 370 220 Q280 120 180 80 Z"
              fill="url(#petalGlow)"/>
        <!-- Radiating petal veins -->
        <path d="M256 450 Q240 310 200 130" fill="none" stroke="#DDA86C" stroke-width="2.4" opacity="0.45"/>
        <path d="M256 450 Q256 300 260 90" fill="none" stroke="#DDA86C" stroke-width="2.6" opacity="0.5"/>
        <path d="M256 450 Q280 310 320 140" fill="none" stroke="#DDA86C" stroke-width="2.4" opacity="0.45"/>
        <path d="M256 450 Q200 340 140 220" fill="none" stroke="#DDA86C" stroke-width="2.0" opacity="0.35"/>
        <path d="M256 450 Q310 340 370 230" fill="none" stroke="#DDA86C" stroke-width="2.0" opacity="0.35"/>
      </g>
    </svg>`
  },
  {
    name: 'brahmi_leaf.webp',
    svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="brahmiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3D7D54"/>
          <stop offset="50%" stop-color="#55996B"/>
          <stop offset="100%" stop-color="#265A39"/>
        </linearGradient>
      </defs>
      <g>
        <!-- Fleshy succulent spatula-shaped paired leaves -->
        <path d="M256 470 Q254 360 256 260" fill="none" stroke="#2D6641" stroke-width="6" stroke-linecap="round"/>
        <!-- Left spatula leaf -->
        <path d="M256 270 C220 280, 160 260, 130 200 C100 140, 130 90, 180 80 C230 70, 250 140, 256 270 Z"
              fill="url(#brahmiGrad)"/>
        <circle cx="160" cy="130" r="15" fill="#71BF8A" opacity="0.35"/>
        <!-- Right spatula leaf -->
        <path d="M256 270 C292 280, 352 260, 382 200 C412 140, 382 90, 332 80 C282 70, 262 140, 256 270 Z"
              fill="url(#brahmiGrad)"/>
        <circle cx="352" cy="130" r="15" fill="#71BF8A" opacity="0.35"/>
      </g>
    </svg>`
  },
  {
    name: 'shikakai_pod.webp',
    svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shikakaiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#5A3A1E"/>
          <stop offset="40%" stop-color="#7B4E28"/>
          <stop offset="75%" stop-color="#8F5E33"/>
          <stop offset="100%" stop-color="#462C15"/>
        </linearGradient>
      </defs>
      <g>
        <!-- Segmented cured Acacia concinna pod -->
        <path d="M220 460 C210 420, 215 390, 226 365 C205 345, 200 315, 212 285 C195 260, 192 230, 206 200 C194 175, 194 145, 214 115 C230 85, 250 65, 275 50 C290 60, 280 85, 266 110 C284 135, 280 165, 260 195 C278 220, 276 255, 254 285 C270 315, 268 345, 248 375 C258 405, 250 435, 235 465 Z"
              fill="url(#shikakaiGrad)"/>
        <!-- Seed swelling contours -->
        <ellipse cx="236" cy="140" rx="20" ry="30" fill="#9C6B3D" opacity="0.45"/>
        <ellipse cx="232" cy="235" rx="22" ry="32" fill="#9C6B3D" opacity="0.45"/>
        <ellipse cx="233" cy="330" rx="21" ry="32" fill="#9C6B3D" opacity="0.45"/>
        <ellipse cx="232" cy="415" rx="18" ry="26" fill="#9C6B3D" opacity="0.45"/>
      </g>
    </svg>`
  },
  {
    name: 'curry_leaf.webp',
    svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="curryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#113622"/>
          <stop offset="45%" stop-color="#1C4F34"/>
          <stop offset="85%" stop-color="#2D734C"/>
          <stop offset="100%" stop-color="#143D28"/>
        </linearGradient>
      </defs>
      <g>
        <!-- Asymmetric teardrop curry leaf with prominent glossy midrib -->
        <path d="M256 465 C235 400, 160 320, 165 220 C170 140, 215 85, 256 45 C295 85, 345 140, 345 220 C345 320, 275 400, 256 465 Z"
              fill="url(#curryGrad)"/>
        <path d="M256 475 Q254 260 256 46" fill="none" stroke="#68AB83" stroke-width="4.2" stroke-linecap="round"/>
        <!-- Fine lateral veins -->
        <path d="M256 360 Q300 315 325 270" fill="none" stroke="#55996D" stroke-width="2.2" opacity="0.6"/>
        <path d="M256 360 Q212 315 185 270" fill="none" stroke="#55996D" stroke-width="2.2" opacity="0.6"/>
        <path d="M256 270 Q305 225 330 175" fill="none" stroke="#55996D" stroke-width="2.0" opacity="0.6"/>
        <path d="M256 270 Q208 225 180 175" fill="none" stroke="#55996D" stroke-width="2.0" opacity="0.6"/>
        <path d="M256 180 Q295 140 315 105" fill="none" stroke="#55996D" stroke-width="1.8" opacity="0.5"/>
        <path d="M256 180 Q218 140 198 105" fill="none" stroke="#55996D" stroke-width="1.8" opacity="0.5"/>
      </g>
    </svg>`
  },
  {
    name: 'ayurvedic_herb_cluster.webp',
    svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="leafG1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#16412D"/>
          <stop offset="100%" stop-color="#2D6B4B"/>
        </linearGradient>
        <linearGradient id="leafG2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#20553A"/>
          <stop offset="100%" stop-color="#468862"/>
        </linearGradient>
        <linearGradient id="leafG3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4B7744"/>
          <stop offset="100%" stop-color="#76A368"/>
        </linearGradient>
      </defs>
      <g>
        <!-- Cluster of 3 overlapping wild Ayurvedic leaves -->
        <!-- Rear Left leaf -->
        <path d="M240 350 C180 340, 110 280, 95 190 C125 140, 195 180, 240 350 Z" fill="url(#leafG1)"/>
        <!-- Rear Right leaf -->
        <path d="M270 350 C330 340, 400 280, 415 190 C385 140, 315 180, 270 350 Z" fill="url(#leafG3)"/>
        <!-- Center Front leaf -->
        <path d="M256 420 C210 370, 170 280, 185 170 C220 80, 256 60, 256 60 C256 60, 292 80, 327 170 C342 280, 302 370, 256 420 Z" fill="url(#leafG2)"/>
        <path d="M256 420 V65" stroke="#87C49F" stroke-width="3" opacity="0.6"/>
      </g>
    </svg>`
  },
  {
    name: 'dried_herb_fragment.webp',
    svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="driedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4A3B22"/>
          <stop offset="50%" stop-color="#786036"/>
          <stop offset="85%" stop-color="#9E814D"/>
          <stop offset="100%" stop-color="#5C4728"/>
        </linearGradient>
      </defs>
      <g>
        <!-- Curled dried herbal fragment with parchment gold edges -->
        <path d="M256 440 C210 390, 160 350, 140 280 C120 200, 180 130, 230 80 C270 120, 360 160, 370 250 C380 340, 300 400, 256 440 Z"
              fill="url(#driedGrad)"/>
        <!-- Organic vein cracks -->
        <path d="M256 430 Q240 260 230 85" fill="none" stroke="#C5A566" stroke-width="3.2" opacity="0.55"/>
        <path d="M248 310 Q190 270 150 240" fill="none" stroke="#C5A566" stroke-width="2.2" opacity="0.5"/>
        <path d="M242 220 Q310 190 350 170" fill="none" stroke="#C5A566" stroke-width="2.2" opacity="0.5"/>
      </g>
    </svg>`
  },
  {
    name: 'golden_herb_petal.webp',
    svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldPetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#8C6A28"/>
          <stop offset="40%" stop-color="#B79A4A"/>
          <stop offset="80%" stop-color="#DFBC62"/>
          <stop offset="100%" stop-color="#9E7F33"/>
        </linearGradient>
      </defs>
      <g>
        <!-- Radiance golden botanical petal specifically crafted for deep contrast on dark forest green -->
        <path d="M256 455 C220 380, 150 310, 140 210 C130 110, 195 65, 256 45 C317 65, 382 110, 372 210 C362 310, 292 380, 256 455 Z"
              fill="url(#goldPetal)"/>
        <path d="M256 455 Q256 250 256 46" fill="none" stroke="#FFE49E" stroke-width="3.2" opacity="0.6"/>
        <path d="M256 320 Q290 270 340 210" fill="none" stroke="#FFE49E" stroke-width="2.0" opacity="0.45"/>
        <path d="M256 320 Q222 270 172 210" fill="none" stroke="#FFE49E" stroke-width="2.0" opacity="0.45"/>
      </g>
    </svg>`
  },
  {
    name: 'sage_leaf_variant.webp',
    svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4C6B50"/>
          <stop offset="45%" stop-color="#729676"/>
          <stop offset="85%" stop-color="#93B497"/>
          <stop offset="100%" stop-color="#5D8061"/>
        </linearGradient>
      </defs>
      <g>
        <!-- Pale velvety sacred sage leaf that shines on dark green & blends on white -->
        <path d="M256 460 C200 420, 145 350, 138 250 C130 150, 190 85, 256 50 C322 85, 382 150, 374 250 C367 350, 312 420, 256 460 Z"
              fill="url(#sageGrad)"/>
        <path d="M256 470 Q255 260 256 52" fill="none" stroke="#C8E2CB" stroke-width="3.8" opacity="0.7"/>
        <path d="M256 350 Q305 305 342 250" fill="none" stroke="#C8E2CB" stroke-width="2.2" opacity="0.55"/>
        <path d="M256 350 Q207 305 170 250" fill="none" stroke="#C8E2CB" stroke-width="2.2" opacity="0.55"/>
        <path d="M256 250 Q310 205 345 150" fill="none" stroke="#C8E2CB" stroke-width="2.0" opacity="0.5"/>
        <path d="M256 250 Q202 205 167 150" fill="none" stroke="#C8E2CB" stroke-width="2.0" opacity="0.5"/>
      </g>
    </svg>`
  }
];

async function generateAll() {
  console.log('Generating 12 high-resolution 512x512 transparent WebP botanical assets...');
  for (const item of botanicals) {
    const filePath = path.join(outDir, item.name);
    await sharp(Buffer.from(item.svg))
      .webp({ quality: 92, alphaQuality: 100, effort: 2 })
      .toFile(filePath);
    const stat = fs.statSync(filePath);
    console.log(`Generated ${item.name} (${Math.round(stat.size / 1024)} KB)`);
  }
  console.log('All 12 botanical assets successfully generated.');
}

generateAll().catch(err => {
  console.error(err);
  process.exit(1);
});
