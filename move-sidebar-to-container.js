const fs = require('fs');
const path = require('path');

console.log('Moving ChatSidebar from App.jsx to ChatContainer.jsx...\n');

// 1. Update ChatContainer to import and render ChatSidebar
const containerPath = path.join(__dirname, 'src', 'components', 'Modals', 'chat', 'ChatContainer.jsx');
let container = fs.readFileSync(containerPath, 'utf8');

// Add import
if (!container.includes("import ChatSidebar from './ChatSidebar';")) {
  container = container.replace(
    "import ChatNavigation from './ChatNavigation';",
    "import ChatNavigation from './ChatNavigation';\nimport ChatSidebar from './ChatSidebar';"
  );
  console.log('✅ Added ChatSidebar import to ChatContainer');
}

// Add ChatSidebar component above ChatNavigation in the JSX
container = container.replace(
  '        <FlowController />\n        <ChatNavigation />',
  '        <FlowController />\n        <ChatSidebar onSaveQuote={handleSaveQuote} onStartOver={startConversation} customerData={chatState.data} />\n        <ChatNavigation />'
);

fs.writeFileSync(containerPath, container, 'utf8');
console.log('✅ Added ChatSidebar above ChatNavigation in ChatContainer');

// 2. Remove ChatSidebar from App.jsx
const appPath = path.join(__dirname, 'src', 'components', 'App.jsx');
let app = fs.readFileSync(appPath, 'utf8');

// Remove import
app = app.replace(/import ChatSidebar from '\.\/Modals\/chat\/ChatSidebar';\n?/, '');

// Remove the ChatSidebar rendering line
app = app.replace(/\s*{chatState\.isOpen && <ChatSidebar onSaveQuote={handleSaveQuote} onStartOver={startConversation} customerData={chatState\.data} \/>}\n/, '');

fs.writeFileSync(appPath, app, 'utf8');
console.log('✅ Removed ChatSidebar from App.jsx');

console.log('\n📋 Summary:');
console.log('  - ChatSidebar now renders inside ChatContainer');
console.log('  - Positioned above ChatNavigation (Back/Close buttons)');
console.log('  - Horizontal layout with all quick action buttons');
