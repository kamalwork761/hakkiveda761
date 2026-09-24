import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const RES_DIR = path.resolve('android/app/src/main/res');

// Brand colors
const FOREST_GREEN = '#0E3B2E';
const GOLD = '#D4AF37';
const WARM_IVORY = '#FAF8F5';

// 1. Generate SVGs
function getLegacyIconSvg(size, isRound = false) {
  const rx = isRound ? size / 2 : Math.round(size * 0.22);
  const strokeW = Math.max(2, Math.round(size * 0.045));
  const diamondHalf = Math.round(size * 0.28);
  const fontSize = Math.round(size * 0.28);
  const yOffset = Math.round(fontSize * 0.16);

  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" rx="${rx}" fill="${FOREST_GREEN}"/>
    <g transform="translate(${size / 2} ${size / 2}) rotate(45)">
      <rect x="-${diamondHalf}" y="-${diamondHalf}" width="${diamondHalf * 2}" height="${diamondHalf * 2}" fill="${FOREST_GREEN}" stroke="${GOLD}" stroke-width="${strokeW}" rx="${Math.round(size * 0.03)}"/>
      <text transform="rotate(-45)" x="0" y="${yOffset}" font-family="'Cinzel', 'Times New Roman', serif" font-weight="900" font-size="${fontSize}" fill="${GOLD}" text-anchor="middle" dominant-baseline="central">HV</text>
    </g>
  </svg>
  `;
}

function getForegroundIconSvg(size) {
  // Adaptive icon foreground: transparent bg, icon in center 66dp of 108dp canvas
  const strokeW = Math.max(2, Math.round(size * 0.035));
  const diamondHalf = Math.round(size * 0.19);
  const fontSize = Math.round(size * 0.19);
  const yOffset = Math.round(fontSize * 0.16);

  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <g transform="translate(${size / 2} ${size / 2}) rotate(45)">
      <rect x="-${diamondHalf}" y="-${diamondHalf}" width="${diamondHalf * 2}" height="${diamondHalf * 2}" fill="${FOREST_GREEN}" stroke="${GOLD}" stroke-width="${strokeW}" rx="${Math.round(size * 0.025)}"/>
      <text transform="rotate(-45)" x="0" y="${yOffset}" font-family="'Cinzel', 'Times New Roman', serif" font-weight="900" font-size="${fontSize}" fill="${GOLD}" text-anchor="middle" dominant-baseline="central">HV</text>
    </g>
  </svg>
  `;
}

function getSplashSvg(width, height) {
  const minDim = Math.min(width, height);
  const diamondHalf = Math.round(minDim * 0.13);
  const strokeW = Math.max(3, Math.round(minDim * 0.016));
  const hvFontSize = Math.round(minDim * 0.13);
  const hvY = Math.round(hvFontSize * 0.15);

  const titleSize = Math.max(18, Math.round(minDim * 0.055));
  const subSize = Math.max(9, Math.round(minDim * 0.022));
  const centerOffsetY = Math.round(height * 0.42);

  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#071D16" />
        <stop offset="50%" stop-color="#0E3B2E" />
        <stop offset="100%" stop-color="#061812" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#bg)"/>
    
    <!-- Central Monogram -->
    <g transform="translate(${width / 2} ${centerOffsetY}) rotate(45)">
      <rect x="-${diamondHalf}" y="-${diamondHalf}" width="${diamondHalf * 2}" height="${diamondHalf * 2}" fill="#0E3B2E" stroke="${GOLD}" stroke-width="${strokeW}" rx="${Math.round(minDim * 0.018)}"/>
      <text transform="rotate(-45)" x="0" y="${hvY}" font-family="'Cinzel', 'Times New Roman', serif" font-weight="900" font-size="${hvFontSize}" fill="${GOLD}" text-anchor="middle" dominant-baseline="central">HV</text>
    </g>

    <!-- Typography -->
    <text x="${width / 2}" y="${centerOffsetY + diamondHalf * 1.8 + titleSize}" font-family="'Cinzel', 'Times New Roman', serif" font-weight="700" font-size="${titleSize}" fill="${GOLD}" text-anchor="middle" letter-spacing="8">HAKKIVEDA</text>
    <text x="${width / 2}" y="${centerOffsetY + diamondHalf * 1.8 + titleSize + subSize * 2.2}" font-family="'Montserrat', sans-serif" font-weight="500" font-size="${subSize}" fill="${WARM_IVORY}" text-anchor="middle" letter-spacing="4" opacity="0.9">PREMIUM AYURVEDIC HAIR CARE</text>
  </svg>
  `;
}

export async function generateAndroidAssets() {
  console.log('Generating Android icons and splash screens in', RES_DIR);

  const iconSizes = {
    'mipmap-mdpi': { icon: 48, fg: 108 },
    'mipmap-hdpi': { icon: 72, fg: 162 },
    'mipmap-xhdpi': { icon: 96, fg: 216 },
    'mipmap-xxhdpi': { icon: 144, fg: 324 },
    'mipmap-xxxhdpi': { icon: 192, fg: 432 },
  };

  for (const [folder, sizes] of Object.entries(iconSizes)) {
    const dir = path.join(RES_DIR, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // ic_launcher.png
    const iconSvg = getLegacyIconSvg(sizes.icon, false);
    await sharp(Buffer.from(iconSvg)).png().toFile(path.join(dir, 'ic_launcher.png'));

    // ic_launcher_round.png
    const roundSvg = getLegacyIconSvg(sizes.icon, true);
    await sharp(Buffer.from(roundSvg)).png().toFile(path.join(dir, 'ic_launcher_round.png'));

    // ic_launcher_foreground.png
    const fgSvg = getForegroundIconSvg(sizes.fg);
    await sharp(Buffer.from(fgSvg)).png().toFile(path.join(dir, 'ic_launcher_foreground.png'));

    console.log(`Generated icons in ${folder}`);
  }

  // Splash screens
  const splashSizes = {
    'drawable-port-mdpi': { w: 320, h: 480 },
    'drawable-port-hdpi': { w: 480, h: 800 },
    'drawable-port-xhdpi': { w: 720, h: 1280 },
    'drawable-port-xxhdpi': { w: 960, h: 1600 },
    'drawable-port-xxxhdpi': { w: 1280, h: 1920 },
    'drawable-land-mdpi': { w: 480, h: 320 },
    'drawable-land-hdpi': { w: 800, h: 480 },
    'drawable-land-xhdpi': { w: 1280, h: 720 },
    'drawable-land-xxhdpi': { w: 1600, h: 960 },
    'drawable-land-xxxhdpi': { w: 1920, h: 1280 },
  };

  for (const [folder, dims] of Object.entries(splashSizes)) {
    const dir = path.join(RES_DIR, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const splashSvg = getSplashSvg(dims.w, dims.h);
    await sharp(Buffer.from(splashSvg)).png().toFile(path.join(dir, 'splash.png'));
    console.log(`Generated splash in ${folder}`);
  }

  // default drawable/splash.png
  const defaultDir = path.join(RES_DIR, 'drawable');
  if (!fs.existsSync(defaultDir)) fs.mkdirSync(defaultDir, { recursive: true });
  const defaultSplashSvg = getSplashSvg(480, 800);
  await sharp(Buffer.from(defaultSplashSvg)).png().toFile(path.join(defaultDir, 'splash.png'));
  console.log('Generated default drawable/splash.png');

  console.log('All Android assets generated successfully!');
}

generateAndroidAssets().catch(err => {
  console.error(err);
  process.exit(1);
});
