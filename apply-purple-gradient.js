const fs = require('fs');
const path = require('path');

console.log('Applying purple gradient theme to header...\\n');

const filePath = path.join(__dirname, 'squarespace-header-fixed.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Change the main header background from white to purple gradient
const oldHeaderBg = `.main-header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: rgba(255,255,255,0.98);
            backdrop-filter: blur(20px);
            z-index: 1000;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }`;

const newHeaderBg = `.main-header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            backdrop-filter: blur(20px);
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        }`;

content = content.replace(oldHeaderBg, newHeaderBg);

// 2. Change contact section background to match gradient
const oldContactBg = `.contact-section {
            background: #ffffff;
            padding: 12px 0;
            border-bottom: 1px solid var(--border-color);
        }`;

const newContactBg = `.contact-section {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 12px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }`;

content = content.replace(oldContactBg, newContactBg);

// 3. Update contact info text color to white
const oldContactInfo = `.contact-info {
            color: var(--text-medium);
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
        }

        .contact-info:hover {
            color: var(--primary-blue);
            transform: translateY(-2px);
        }`;

const newContactInfo = `.contact-info {
            color: rgba(255, 255, 255, 0.95);
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
        }

        .contact-info:hover {
            color: white;
            transform: translateY(-2px);
        }`;

content = content.replace(oldContactInfo, newContactInfo);

// 4. Update nav links to white text
const oldNavLink = `.nav-link, .dropdown-title {
            color: var(--text-dark);
            text-decoration: none;
            font-size: 15px;
            font-weight: 500;
            padding: 10px 12px;
            border-radius: 10px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            white-space: nowrap;
            background: transparent;
            cursor: pointer;
            border: none;
        }

        .nav-link:hover, .dropdown-title:hover {
            background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(124, 58, 237, 0.1));
            color: var(--primary-blue);
            transform: translateY(-2px);
        }`;

const newNavLink = `.nav-link, .dropdown-title {
            color: rgba(255, 255, 255, 0.95);
            text-decoration: none;
            font-size: 15px;
            font-weight: 500;
            padding: 10px 12px;
            border-radius: 10px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            white-space: nowrap;
            background: transparent;
            cursor: pointer;
            border: none;
        }

        .nav-link:hover, .dropdown-title:hover {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            transform: translateY(-2px);
        }`;

content = content.replace(oldNavLink, newNavLink);

// 5. Update company name gradient to white
const oldCompanyName = `.company-name {
            background: linear-gradient(135deg, var(--primary-blue), var(--accent-purple));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 700;
            font-size: 24px;
            letter-spacing: -0.5px;
            line-height: 1.1;
        }`;

const newCompanyName = `.company-name {
            color: white;
            font-weight: 700;
            font-size: 24px;
            letter-spacing: -0.5px;
            line-height: 1.1;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }`;

content = content.replace(oldCompanyName, newCompanyName);

// 6. Update tagline to white
const oldTagline = `.tagline {
            color: var(--text-light);
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }`;

const newTagline = `.tagline {
            color: rgba(255, 255, 255, 0.9);
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }`;

content = content.replace(oldTagline, newTagline);

// 7. Update mobile nav menu background
const mobileNavRegex = /(\\.nav-menu \\{[^}]*background: rgba\\(255,255,255,0\\.98\\);)/;
content = content.replace(mobileNavRegex, '.nav-menu {\\n                display: none;\\n                position: fixed;\\n                top: var(--mobile-header-height);\\n                left: 0;\\n                right: 0;\\n                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);');

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Applied purple gradient theme!');
console.log('   - Header: Purple gradient background');
console.log('   - Contact section: Transparent with blur');
console.log('   - All text: White/light colors');
console.log('   - Logo text: White with shadow');
console.log('   - Nav links: White with hover effects');
console.log('\\n📁 Updated: squarespace-header-fixed.html');
