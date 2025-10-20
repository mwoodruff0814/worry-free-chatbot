const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'Modals', 'chat', 'ChatSidebar.jsx');

console.log('Reading ChatSidebar.jsx...');
let content = fs.readFileSync(filePath, 'utf8');

// Change right to left for sidebar positioning
content = content.replace(
  "right: '20px',",
  "left: '20px',"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Moved sidebar buttons to the left side');
