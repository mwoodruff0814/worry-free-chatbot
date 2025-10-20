const fs = require('fs');
const path = require('path');

console.log('Updating chatbot URLs in HTML...\n');

const filePath = path.join(__dirname, 'header.html');

// Read the provided HTML (you'll need to save it as header.html first)
const oldUrl = 'https://worry-free-chatbot-bnngsfnrb-matt-5184s-projects.vercel.app';
const newUrl = 'https://worry-free-chatbot.vercel.app';

// If file exists, update it
if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    const count = (content.match(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;

    if (count > 0) {
        content = content.replace(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated ${count} instances of chatbot URL`);
        console.log(`   ${oldUrl}`);
        console.log(`   → ${newUrl}\n`);
    } else {
        console.log('✅ URLs already up to date');
    }
} else {
    console.log('⚠️  header.html not found');
    console.log('   Please save your HTML as header.html first');
}
