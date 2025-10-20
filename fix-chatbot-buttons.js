const fs = require('fs');
const path = require('path');

console.log('Fixing chatbot button calls...\n');

const filePath = path.join(__dirname, 'header-fixed.html');

// Read the HTML (save the user's HTML as header-original.html first)
const originalPath = path.join(__dirname, 'header-original.html');

if (!fs.existsSync(originalPath)) {
    console.log('❌ Please save your HTML as "header-original.html" first');
    process.exit(1);
}

let content = fs.readFileSync(originalPath, 'utf8');

// Fix 1: Replace desktop button onclick
const oldDesktopOnclick = `onclick="try { document.getElementById('wfm-chat-toggle').click(); } catch(e) { console.warn('Chat not available'); }"`;
const newDesktopOnclick = `onclick="openChatbot()"`;

content = content.replace(oldDesktopOnclick, newDesktopOnclick);

// Fix 2: Replace mobile button onclick
const oldMobileOnclick = `onclick="if(window.openWFMChat) { window.openWFMChat(); } else { console.warn('Chat not available'); }"`;
const newMobileOnclick = `onclick="openChatbot()"`;

content = content.replace(oldMobileOnclick, newMobileOnclick);

// Fix 3: Add openChatbot() function at the start of the script section
const scriptStart = '    <script>\n        // Mobile menu toggle';
const newScriptStart = `    <script>
        // Mobile-friendly chatbot launcher
        function openChatbot() {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
            const chatUrl = 'https://worry-free-chatbot.vercel.app';

            if (isMobile) {
                window.open(chatUrl, '_blank');
            } else {
                const width = 420;
                const height = 680;
                const left = (window.screen.width - width) / 2;
                const top = (window.screen.height - height) / 2;
                window.open(chatUrl, 'WFMChat', \`width=\${width},height=\${height},left=\${left},top=\${top},resizable=yes,scrollbars=no,toolbar=no,menubar=no,location=no,status=no\`);
            }
        }

        // Mobile menu toggle`;

content = content.replace(scriptStart, newScriptStart);

// Write the fixed file
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Fixed chatbot buttons!');
console.log('   - Desktop button now calls openChatbot()');
console.log('   - Mobile button now calls openChatbot()');
console.log('   - Added openChatbot() function');
console.log('\n📁 Output saved to: header-fixed.html');
console.log('🌐 Chatbot URL: https://worry-free-chatbot.vercel.app');
