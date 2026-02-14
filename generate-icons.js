const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [
  { size: 64, name: 'pwa-64x64.png' },
  { size: 192, name: 'pwa-192x192.png' },
  { size: 512, name: 'pwa-512x512.png' },
  { size: 512, name: 'maskable-icon-512x512.png', maskable: true }
];

const publicDir = path.join(__dirname, 'public');
const iconPath = path.join(publicDir, 'icon.svg');

async function generateIcons() {
  for (const { size, name, maskable } of sizes) {
    const outputPath = path.join(publicDir, name);

    if (maskable) {
      // For maskable icons, add padding (safe zone)
      const padding = Math.floor(size * 0.1);
      const innerSize = size - (padding * 2);

      await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 88, g: 101, b: 242, alpha: 1 }
        }
      })
      .composite([{
        input: await sharp(iconPath)
          .resize(innerSize, innerSize)
          .toBuffer(),
        top: padding,
        left: padding
      }])
      .png()
      .toFile(outputPath);
    } else {
      await sharp(iconPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
    }

    console.log(`✓ Generated ${name}`);
  }

  // Generate favicon.ico (using 32x32)
  await sharp(iconPath)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));

  console.log('✓ Generated favicon.png');
  console.log('✓ All PWA icons generated successfully!');
}

generateIcons().catch(console.error);
