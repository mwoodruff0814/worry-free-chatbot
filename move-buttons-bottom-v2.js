const fs = require('fs');
const path = require('path');

console.log('Moving buttons to bottom of page...\\n');

const filePath = path.join(__dirname, 'squarespace-header-fixed.html');
let content = fs.readFileSync(filePath, 'utf8');

// Find and extract the quantum-button-system section (lines 804-856)
const buttonSectionRegex = /(<div class="quantum-button-system">[\s\S]*?<\/div>\s*<\/div>)\s*<\/header>/;
const match = content.match(buttonSectionRegex);

if (!match) {
    console.log('❌ Could not find quantum-button-system section');
    process.exit(1);
}

const buttonHTML = match[1];

// Remove the button section from inside the header
content = content.replace(buttonSectionRegex, '</header>');

// Add the button section right after </header>
content = content.replace('</header>', '</header>\\n\\n    ' + buttonHTML);

// Update CSS for fixed positioning at bottom
const oldButtonCSS = `.quantum-button-system {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
            justify-content: center;
        }`;

const newButtonCSS = `.quantum-button-system {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
            z-index: 999;
            justify-content: center;
            border-top: 1px solid var(--border-color);
        }`;

content = content.replace(oldButtonCSS, newButtonCSS);

// Update header height (remove button section height)
content = content.replace('--header-height: 200px;', '--header-height: 112px;');
content = content.replace('--mobile-header-height: 180px;', '--mobile-header-height: 92px;');

// Add padding-bottom to body for fixed buttons
const bodyStyleRegex = /(body\s*{[^}]*)(})/;
content = content.replace(bodyStyleRegex, '$1    padding-bottom: 120px;\\n        $2');

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Successfully moved buttons to bottom!');
console.log('   - Buttons fixed at bottom of page');
console.log('   - Header height reduced');
console.log('   - Added backdrop blur and shadow');
console.log('   - Added body padding for spacing');
console.log('\\n📁 Updated: squarespace-header-fixed.html');
