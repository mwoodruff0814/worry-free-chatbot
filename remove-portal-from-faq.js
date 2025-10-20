const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'Modals', 'chat', 'ChatSidebar.jsx');

console.log('Removing Portal from FAQ modal...');
let content = fs.readFileSync(filePath, 'utf8');

// Remove opening Portal tag
content = content.replace(
  '      {showFAQ && (\n        <Portal>\n        <div style={{',
  '      {showFAQ && (\n        <div style={{'
);

// Remove closing Portal tag
content = content.replace(
  '        </div>\n        </Portal>\n      )}',
  '        </div>\n      )}'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Removed Portal wrapper from FAQ modal');
