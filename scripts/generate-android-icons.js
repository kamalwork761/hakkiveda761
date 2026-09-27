import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const RES_DIR = path.join(ROOT_DIR, 'android/app/src/main/res');
const SOURCE_PNG = path.join(ROOT_DIR, 'public/images/hakkiveda_hv_logo.png');
const SOURCE_SVG = path.join(ROOT_DIR, 'public/images/hakkiveda_hv_logo.svg');

// Colors
const BG_WARM_IVORY = '#FAF7F2';
const BG_SPLASH_GREEN = '#0E3B2E';

// Launcher icon densities and sizes (dp to px)
// Standard icon sizes: 48, 72, 96, 144, 192
// Adaptive foreground sizes: 108, 162, 216, 324, 432
const DENSITIES = [
  { name: 'mdpi', iconSize: 48, fgSize: 108 },
  { name: 'hdpi', iconSize: 72, fgSize: 162 },
  { name: 'xhdpi', iconSize: 96, fgSize: 216 },
  { name: 'xxhdpi', iconSize: 144, fgSize: 324 },
  { name: 'xxxhdpi', iconSize: 192, fgSize: 432 },
];

// Splash screen dimensions (width x height)
const SPLASH_SCREENS = [
  { dir: 'drawable', width: 480, height: 800 },
  { dir: 'drawable-port-mdpi', width: 320, height: 480 },
  { dir: 'drawable-port-hdpi', width: 480, height: 800 },
  { dir: 'drawable-port-xhdpi', width: 720, height: 1280 },
  { dir: 'drawable-port-xxhdpi', width: 960, height: 1600 },
  { dir: 'drawable-port-xxxhdpi', width: 1280, height: 1920 },
  { dir: 'drawable-land-mdpi', width: 480, height: 320 },
  { dir: 'drawable-land-hdpi', width: 800, height: 480 },
  { dir: 'drawable-land-xhdpi', width: 1280, height: 720 },
  { dir: 'drawable-land-xxhdpi', width: 1600, height: 960 },
  { dir: 'drawable-land-xxxhdpi', width: 1920, height: 1280 },
];

async function generateAdaptiveForeground(fgSize) {
  // Safe zone for Android adaptive icon is 66dp of 108dp (~61% - 66%)
  // Ensure the logo and its delicate leaf details fit with comfortable safe margin
  const logoTargetSize = Math.round(fgSize * 0.63);

  // Resize source artwork
  const resizedLogo = await sharp(SOURCE_PNG)
    .resize(logoTargetSize, logoTargetSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const left = Math.round((fgSize - logoTargetSize) / 2);
  const top = Math.round((fgSize - logoTargetSize) / 2);

  // Create transparent 108dp canvas and composite resized logo in exact center
  return sharp({
    create: {
      width: fgSize,
      height: fgSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: resizedLogo, left, top }])
    .png()
    .toBuffer();
}

async function generateStandardLauncherIcon(iconSize) {
  // Standard square/rounded launcher icon with warm ivory background
  const logoTargetSize = Math.round(iconSize * 0.82);
  const cornerRadius = Math.round(iconSize * 0.22);

  const resizedLogo = await sharp(SOURCE_PNG)
    .resize(logoTargetSize, logoTargetSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const left = Math.round((iconSize - logoTargetSize) / 2);
  const top = Math.round((iconSize - logoTargetSize) / 2);

  // Base canvas with warm ivory
  const bgSvg = `
    <svg width="${iconSize}" height="${iconSize}">
      <rect width="${iconSize}" height="${iconSize}" rx="${cornerRadius}" fill="${BG_WARM_IVORY}" />
    </svg>
  `;

  return sharp(Buffer.from(bgSvg))
    .composite([{ input: resizedLogo, left, top }])
    .png()
    .toBuffer();
}

async function generateRoundLauncherIcon(iconSize) {
  // Circular legacy icon for devices requiring roundIcon
  const logoTargetSize = Math.round(iconSize * 0.78);
  const radius = iconSize / 2;

  const resizedLogo = await sharp(SOURCE_PNG)
    .resize(logoTargetSize, logoTargetSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const left = Math.round((iconSize - logoTargetSize) / 2);
  const top = Math.round((iconSize - logoTargetSize) / 2);

  const circleSvg = `
    <svg width="${iconSize}" height="${iconSize}">
      <circle cx="${radius}" cy="${radius}" r="${radius}" fill="${BG_WARM_IVORY}" />
    </svg>
  `;

  return sharp(Buffer.from(circleSvg))
    .composite([{ input: resizedLogo, left, top }])
    .png()
    .toBuffer();
}

async function generateSplashScreen(width, height) {
  // Center logo with pleasant proportional sizing (min dimension * 0.38)
  const minDim = Math.min(width, height);
  const logoSize = Math.min(Math.round(minDim * 0.42), 360);

  const resizedLogo = await sharp(SOURCE_PNG)
    .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const left = Math.round((width - logoSize) / 2);
  const top = Math.round((height - logoSize) / 2);

  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: BG_SPLASH_GREEN,
    },
  })
    .composite([{ input: resizedLogo, left, top }])
    .png()
    .toBuffer();
}

async function run() {
  console.log('[1/4] Checking source artwork:', SOURCE_PNG);
  if (!fs.existsSync(SOURCE_PNG)) {
    throw new Error('Source PNG not found at ' + SOURCE_PNG);
  }

  // 1. Generate Mipmap Icons for all densities
  console.log('[2/4] Generating Android Mipmap Icons across all densities...');
  for (const { name, iconSize, fgSize } of DENSITIES) {
    const mipmapDir = path.join(RES_DIR, `mipmap-${name}`);
    if (!fs.existsSync(mipmapDir)) {
      fs.mkdirSync(mipmapDir, { recursive: true });
    }

    // Adaptive foreground
    const fgBuf = await generateAdaptiveForeground(fgSize);
    fs.writeFileSync(path.join(mipmapDir, 'ic_launcher_foreground.png'), fgBuf);

    // Standard legacy icon
    const iconBuf = await generateStandardLauncherIcon(iconSize);
    fs.writeFileSync(path.join(mipmapDir, 'ic_launcher.png'), iconBuf);

    // Round legacy icon
    const roundBuf = await generateRoundLauncherIcon(iconSize);
    fs.writeFileSync(path.join(mipmapDir, 'ic_launcher_round.png'), roundBuf);

    console.log(`  ✓ mipmap-${name}: standard (${iconSize}x${iconSize}), round (${iconSize}x${iconSize}), foreground (${fgSize}x${fgSize})`);
  }

  // 2. Setup Adaptive Icon XML (API 26+)
  console.log('[3/4] Setting up Adaptive Icon XML in mipmap-anydpi-v26 and values/ic_launcher_background.xml...');
  const anydpiDir = path.join(RES_DIR, 'mipmap-anydpi-v26');
  if (!fs.existsSync(anydpiDir)) {
    fs.mkdirSync(anydpiDir, { recursive: true });
  }

  const adaptiveXmlContent = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
`;

  fs.writeFileSync(path.join(anydpiDir, 'ic_launcher.xml'), adaptiveXmlContent, 'utf8');
  fs.writeFileSync(path.join(anydpiDir, 'ic_launcher_round.xml'), adaptiveXmlContent, 'utf8');

  // Background color resource
  const valuesDir = path.join(RES_DIR, 'values');
  if (!fs.existsSync(valuesDir)) {
    fs.mkdirSync(valuesDir, { recursive: true });
  }
  const bgXmlContent = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">${BG_WARM_IVORY}</color>
</resources>
`;
  fs.writeFileSync(path.join(valuesDir, 'ic_launcher_background.xml'), bgXmlContent, 'utf8');
  console.log('  ✓ Adaptive icon XML generated in mipmap-anydpi-v26 and ic_launcher_background.xml set to', BG_WARM_IVORY);

  // 3. Generate Splash screens
  console.log('[4/4] Generating Android Splash screens for all screen orientations & densities...');
  for (const { dir, width, height } of SPLASH_SCREENS) {
    const splashDir = path.join(RES_DIR, dir);
    if (!fs.existsSync(splashDir)) {
      fs.mkdirSync(splashDir, { recursive: true });
    }
    const splashBuf = await generateSplashScreen(width, height);
    fs.writeFileSync(path.join(splashDir, 'splash.png'), splashBuf);
    console.log(`  ✓ ${dir}/splash.png (${width}x${height})`);
  }

  // Also ensure /images/hakkiveda-logo.png matches the source HV logo
  const publicLogoAlias = path.join(ROOT_DIR, 'public/images/hakkiveda-logo.png');
  fs.copyFileSync(SOURCE_PNG, publicLogoAlias);
  console.log('  ✓ Updated public/images/hakkiveda-logo.png alias from', SOURCE_PNG);

  // Generate web/PWA touch icons and favicons using the real HV logo
  console.log('[5/5] Updating Web and PWA icons with real HV logo...');
  const pwa192 = await generateStandardLauncherIcon(192);
  fs.writeFileSync(path.join(ROOT_DIR, 'public/pwa-192x192.png'), pwa192);

  const pwa512 = await generateStandardLauncherIcon(512);
  fs.writeFileSync(path.join(ROOT_DIR, 'public/pwa-512x512.png'), pwa512);

  const pwaMaskable512 = await generateAdaptiveForeground(512);
  // Composite over warm ivory background for maskable
  const pwaMaskable = await sharp({
    create: { width: 512, height: 512, channels: 4, background: BG_WARM_IVORY },
  })
    .composite([{ input: pwaMaskable512, left: 0, top: 0 }])
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(ROOT_DIR, 'public/pwa-maskable-512x512.png'), pwaMaskable);

  const appleTouch = await generateStandardLauncherIcon(180);
  fs.writeFileSync(path.join(ROOT_DIR, 'public/apple-touch-icon.png'), appleTouch);

  console.log('All Android and Web icons and splash branding generated successfully!');
}

run().catch((err) => {
  console.error('Fatal error generating Android assets:', err);
  process.exit(1);
});
