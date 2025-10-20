const fs = require('fs');
const path = require('path');

console.log('Speeding up chat flow by reducing message delays...\n');

const filePath = path.join(__dirname, 'src/components/FlowController.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Reduce all addBotMessage delays to make chat faster
// Strategy: Cut delays by ~70%
const replacements = [
  // Common delays
  { from: ', 3200)', to: ', 800)' },   // 3200ms → 800ms
  { from: ', 3000)', to: ', 750)' },   // 3000ms → 750ms
  { from: ', 2800)', to: ', 700)' },   // 2800ms → 700ms
  { from: ', 2500)', to: ', 650)' },   // 2500ms → 650ms
  { from: ', 2400)', to: ', 600)' },   // 2400ms → 600ms
  { from: ', 2200)', to: ', 550)' },   // 2200ms → 550ms
  { from: ', 2000)', to: ', 500)' },   // 2000ms → 500ms
  { from: ', 1900)', to: ', 475)' },   // 1900ms → 475ms
  { from: ', 1800)', to: ', 450)' },   // 1800ms → 450ms
  { from: ', 1600)', to: ', 400)' },   // 1600ms → 400ms
  { from: ', 1500)', to: ', 400)' },   // 1500ms → 400ms
  { from: ', 1200)', to: ', 350)' },   // 1200ms → 350ms
  { from: ', 1000)', to: ', 300)' },   // 1000ms → 300ms
  { from: ', 800)', to: ', 250)' },    // 800ms → 250ms
  { from: ', 500)', to: ', 150)' },    // 500ms → 150ms
  { from: ', 300)', to: ', 100)' },    // 300ms → 100ms
];

let changeCount = 0;
replacements.forEach(({ from, to }) => {
  const beforeCount = (content.match(new RegExp(from.replace(/[()]/g, '\\$&'), 'g')) || []).length;
  content = content.replace(new RegExp(from.replace(/[()]/g, '\\$&'), 'g'), to);
  const afterCount = (content.match(new RegExp(to.replace(/[()]/g, '\\$&'), 'g')) || []).length - beforeCount;
  if (afterCount > 0) {
    changeCount += afterCount;
    console.log(`✓ Replaced ${from} → ${to} (${afterCount} occurrences)`);
  }
});

fs.writeFileSync(filePath, content, 'utf8');

console.log(`\n✅ Chat flow optimized! Reduced ${changeCount} delays by ~70%`);
console.log('📁 Updated: src/components/FlowController.jsx');
console.log('\n🚀 Messages will now appear much faster!');
