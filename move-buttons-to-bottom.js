const fs = require('fs');
const path = require('path');

console.log('Moving buttons to bottom of page...\\n');

const filePath = path.join(__dirname, 'squarespace-header-fixed.html');
let content = fs.readFileSync(filePath, 'utf8');

// Find the quantum-button-system section
const quantumButtonStart = content.indexOf('<div class="quantum-button-system">');
const quantumButtonEnd = content.indexOf('</div>\\n        </div>\\n    </header>');

if (quantumButtonStart === -1 || quantumButtonEnd === -1) {
    console.log('❌ Could not find quantum-button-system to move');
    process.exit(1);
}

// Extract the quantum button system HTML
const quantumButtonHTML = content.substring(quantumButtonStart, quantumButtonEnd + 14); // +14 for "</div>\\n        "

// Remove it from the header
content = content.replace(quantumButtonHTML, '');

// Update the quantum-button-system CSS to be fixed at bottom
const oldCSS = `.quantum-button-system {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
            justify-content: center;
        }`;

const newCSS = `.quantum-button-system {
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

content = content.replace(oldCSS, newCSS);

// Update header height variables since buttons are no longer in header
const oldHeaderHeight = `--header-height: 200px;
            --mobile-header-height: 180px;`;

const newHeaderHeight = `--header-height: 112px;
            --mobile-header-height: 92px;`;

content = content.replace(oldHeaderHeight, newHeaderHeight);

// Add the quantum button system right after </header>
const headerEndTag = '</header>';
const headerEndIndex = content.indexOf(headerEndTag);

if (headerEndIndex !== -1) {
    const insertPosition = headerEndIndex + headerEndTag.length;
    content = content.slice(0, insertPosition) + '\\n\\n    ' + quantumButtonHTML.trim() + content.slice(insertPosition);
}

// Add body padding-bottom for the fixed buttons
const oldBodyPadding = `body {
            margin: 0;
            padding-top: var(--header-height);
            font-family: 'Poppins', sans-serif;
            background-color: #fefdfb;
            color: var(--text-dark);
        }`;

const newBodyPadding = `body {
            margin: 0;
            padding-top: var(--header-height);
            padding-bottom: 120px; /* Space for fixed buttons */
            font-family: 'Poppins', sans-serif;
            background-color: #fefdfb;
            color: var(--text-dark);
        }`;

content = content.replace(oldBodyPadding, newBodyPadding);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Moved buttons to bottom of page!');
console.log('   - Buttons now fixed at bottom');
console.log('   - Header height reduced');
console.log('   - Added backdrop blur effect');
console.log('   - Added shadow for depth');
console.log('\\n📁 Updated: squarespace-header-fixed.html');
