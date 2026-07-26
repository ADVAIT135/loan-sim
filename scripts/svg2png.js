const sharp = require('sharp');
const fs = require('fs');
(async () => {
  const svgPath = 'assets/og-image.svg';
  const outPath = 'assets/og-image.png';
  if (!fs.existsSync(svgPath)) {
    console.error('SVG not found:', svgPath);
    process.exit(2);
  }
  try {
    const svg = fs.readFileSync(svgPath);
    await sharp(svg)
      .resize(1200, 630, { fit: 'cover' })
      .png({ compressionLevel: 9 })
      .toFile(outPath);
    console.log('Wrote', outPath);
  } catch (err) {
    console.error('Conversion failed:', err);
    process.exit(1);
  }
})();
