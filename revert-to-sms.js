const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'Modals', 'chat', 'ChatSidebar.jsx');

console.log('Reading ChatSidebar.jsx...');
let content = fs.readFileSync(filePath, 'utf8');

// Remove LiveChatModal import
content = content.replace(
  "import LiveChatModal from './LiveChatModal';\n",
  ""
);

// Remove Portal import
content = content.replace(
  "import Portal from './Portal';\n",
  ""
);

// Remove showLiveChat state
content = content.replace(
  "  const [showLiveChat, setShowLiveChat] = useState(false);\n",
  ""
);

// Add handleSMS function after handleCall
content = content.replace(
  `  const handleCall = () => {
    window.open('tel:330-435-8686', '_self');
  };`,
  `  const handleCall = () => {
    window.open('tel:330-435-8686', '_self');
  };

  const handleSMS = () => {
    window.open('sms:330-435-8686', '_self');
  };`
);

// Replace Live Chat button with SMS button
content = content.replace(
  `      {/* Live Chat Button */}
      <button
        onClick={() => setShowLiveChat(true)}
        title="Live Chat with Agent"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(111, 66, 193, 0.4)',
          transition: 'all 0.3s',
          color: 'white',
          fontSize: '24px'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 6px 20px rgba(111, 66, 193, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 12px rgba(111, 66, 193, 0.4)';
        }}
      >
        💬
      </button>`,
  `      {/* SMS Button */}
      <button
        onClick={handleSMS}
        title="Text us: 330-435-8686"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(111, 66, 193, 0.4)',
          transition: 'all 0.3s',
          color: 'white',
          fontSize: '24px'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 6px 20px rgba(111, 66, 193, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 12px rgba(111, 66, 193, 0.4)';
        }}
      >
        💬
      </button>`
);

// Remove LiveChatModal rendering
content = content.replace(
  `      {/* Live Chat Modal */}
      {showLiveChat && (
        <LiveChatModal
          customerData={customerData}
          onClose={() => setShowLiveChat(false)}
        />
      )}

`,
  ""
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Reverted to SMS button');
console.log('   - Removed LiveChatModal import');
console.log('   - Removed Portal import');
console.log('   - Removed showLiveChat state');
console.log('   - Added handleSMS function');
console.log('   - Changed live chat button to SMS button');
console.log('   - Removed LiveChatModal rendering');
console.log('\n📱 SMS button will open default messaging app at sms:330-435-8686');
