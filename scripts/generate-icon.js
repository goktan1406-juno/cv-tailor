const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets');

function generate(svgFile, outFile, size) {
  const svg = fs.readFileSync(path.join(assetsDir, svgFile), 'utf8');
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
  });
  const png = resvg.render().asPng();
  fs.writeFileSync(path.join(assetsDir, outFile), png);
  console.log(`✓ ${outFile} (${size}x${size})`);
}

generate('icon.svg',                    'icon.png',                    1024);
generate('icon.svg',                    'favicon.png',                   48);
generate('icon.svg',                    'splash-icon.png',              200);
generate('android-icon-background.svg', 'android-icon-background.png', 1024);
generate('android-icon-foreground.svg', 'android-icon-foreground.png', 1024);
generate('android-icon-foreground.svg', 'android-icon-monochrome.png',  1024);

console.log('\nDone. All icon files generated.');
