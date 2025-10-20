const fs = require('fs');
const path = require('path');

console.log('Renaming "Full Service" to "Movers + Truck"...\n');

const files = [
  path.join(__dirname, 'src', 'services', 'emailService.js'),
  path.join(__dirname, 'src', 'hooks', 'emailService.js'),
  path.join(__dirname, 'src', 'components', 'FlowController.jsx')
];

const replacements = [
  // Email headers and sections
  { from: "WHAT'S INCLUDED IN YOUR FULL SERVICE MOVE", to: "WHAT'S INCLUDED - MOVERS + TRUCK SERVICE" },
  { from: 'FULL SERVICE MOVING TERMS:', to: 'MOVERS + TRUCK SERVICE TERMS:' },

  // Service type labels
  { from: '⭐ FULL SERVICE ⭐', to: '🚚 MOVERS + TRUCK 🚚' },
  { from: '⭐ FULL SERVICE MOVING ⭐', to: '🚚 MOVERS + TRUCK 🚚' },

  // Narrative text
  { from: 'full-service moves', to: 'Movers + Truck service' },
  { from: 'Our full-service moves', to: 'Our Movers + Truck service' }
];

let totalReplacements = 0;

files.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let fileReplacements = 0;

    replacements.forEach(({ from, to }) => {
      const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = (content.match(regex) || []).length;
      if (matches > 0) {
        content = content.replace(regex, to);
        fileReplacements += matches;
      }
    });

    if (fileReplacements > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${path.basename(filePath)}: ${fileReplacements} replacements`);
      totalReplacements += fileReplacements;
    }
  }
});

console.log(`\n📋 Total: ${totalReplacements} replacements made`);
console.log('   "Full Service" → "Movers + Truck" ✓');
