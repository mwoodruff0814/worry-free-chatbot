const fs = require('fs');
const path = require('path');

console.log('Fixing close button to prevent auto-reopen...\\n');

// Fix ChatButton to track manual close
const chatButtonPath = path.join(__dirname, 'src/components/ChatButton.jsx');
let chatButtonContent = fs.readFileSync(chatButtonPath, 'utf8');

const oldChatButton = `const ChatButton = () => {
  const { chatState, openChat } = useChatContext();

  // Auto-open chat if in a popup window (from Squarespace)
  useEffect(() => {
    const isPopup = window.opener !== null || window.innerWidth < 500;
    if (isPopup && !chatState.isOpen) {
      console.log('🪟 Popup detected - auto-opening chat');
      setTimeout(() => {
        openChat();
      }, 100);
    }
  }, [chatState.isOpen, openChat]);`;

const newChatButton = `const ChatButton = () => {
  const { chatState, openChat } = useChatContext();

  // Auto-open chat if in a popup window (from Squarespace)
  useEffect(() => {
    const isPopup = window.opener !== null || window.innerWidth < 500;
    const hasAutoOpened = sessionStorage.getItem('wfm-chat-auto-opened');

    if (isPopup && !chatState.isOpen && !hasAutoOpened) {
      console.log('🪟 Popup detected - auto-opening chat');
      sessionStorage.setItem('wfm-chat-auto-opened', 'true');
      setTimeout(() => {
        openChat();
      }, 100);
    }
  }, [chatState.isOpen, openChat]);`;

chatButtonContent = chatButtonContent.replace(oldChatButton, newChatButton);
fs.writeFileSync(chatButtonPath, chatButtonContent, 'utf8');

// Fix ChatHeader to actually close the window
const chatHeaderPath = path.join(__dirname, 'src/components/Modals/chat/ChatHeader.jsx');
let chatHeaderContent = fs.readFileSync(chatHeaderPath, 'utf8');

const oldHeader = `  const handleClose = () => {
    // If opened in a popup window from Squarespace, close the window
    const isPopup = window.opener !== null;
    if (isPopup) {
      window.close();
    } else {
      // Otherwise just close the chat widget
      onClose();
    }
  };`;

const newHeader = `  const handleClose = () => {
    // If opened in a popup window from Squarespace, close the window
    const isPopup = window.opener !== null || window.innerWidth < 500;
    console.log('Close button clicked, isPopup:', isPopup);

    if (isPopup) {
      console.log('Attempting to close popup window...');
      // Try to close the window
      window.close();

      // Fallback: if window.close() doesn't work, try this
      setTimeout(() => {
        if (!window.closed) {
          console.log('window.close() failed, trying alternative...');
          window.open('', '_self').close();
        }
      }, 100);
    } else {
      // Otherwise just close the chat widget
      onClose();
    }
  };`;

chatHeaderContent = chatHeaderContent.replace(oldHeader, newHeader);
fs.writeFileSync(chatHeaderPath, chatHeaderContent, 'utf8');

console.log('✅ Fixed close button behavior!');
console.log('   - Added sessionStorage flag to prevent auto-reopen');
console.log('   - Enhanced window close with fallback');
console.log('   - Added debugging logs');
console.log('\\n📁 Updated:');
console.log('   - src/components/ChatButton.jsx');
console.log('   - src/components/Modals/chat/ChatHeader.jsx');
