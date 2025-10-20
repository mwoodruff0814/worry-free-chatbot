const fs = require('fs');
const path = require('path');

console.log('Moving buttons to bottom on mobile only...\\n');

const filePath = path.join(__dirname, 'squarespace-header-fixed.html');
let content = fs.readFileSync(filePath, 'utf8');

// Find the mobile media query section for quantum-button-system
const mobileButtonCSS = `.quantum-button-system {
                flex-direction: column;
                gap: 12px;
                padding: 12px 15px;
            }`;

const newMobileButtonCSS = `.quantum-button-system {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                flex-direction: column;
                gap: 12px;
                padding: 12px 15px;
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(20px);
                box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
                border-top: 1px solid var(--border-color);
                z-index: 999;
            }`;

content = content.replace(mobileButtonCSS, newMobileButtonCSS);

// Add mobile-specific body padding inside mobile media query
// Find the mobile media query body section
const mobileBodyRegex = /(@media \(max-width: 992px\) \{[\s\S]*?body \{[\s\S]*?)(padding-top: var\(--mobile-header-height\);)/;

content = content.replace(
    mobileBodyRegex,
    '$1$2\\n                padding-bottom: 140px;'
);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Successfully configured mobile bottom buttons!');
console.log('   - Desktop: Buttons stay in header');
console.log('   - Mobile: Buttons fixed at bottom');
console.log('   - Added backdrop blur and shadow on mobile');
console.log('   - Added mobile body padding');
console.log('\\n📁 Updated: squarespace-header-fixed.html');
