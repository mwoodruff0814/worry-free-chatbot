# Worry Free Moving - Sarah AI Chatbot

React-based intelligent moving chatbot with full estimate calculations, photo uploads, and scheduling integration.

## 📁 Project Structure
```
worry-free-chatbot/
├── src/
│   ├── components/          # React components
│   ├── context/             # State management
│   ├── hooks/               # Custom hooks
│   ├── services/            # API services
│   ├── utils/               # Helper functions
│   ├── constants/           # Configuration
│   └── styles/              # CSS files
├── public/
└── package.json
```

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configuration
All config is in `src/constants/config.js`. Update:
- Google Maps API key
- Cloudinary credentials
- Email addresses
- Phone numbers

### 3. Run Development Server
```bash
npm start
```

Runs on `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```

Creates optimized build in `build/` folder.

### 5. Deploy
Upload `build/` contents to your web server.

## 🔑 Key Features

✅ **Smart Estimates** - Calculates moving, labor, and single-item quotes
✅ **Heavy Items Support** - Properly handles 300+ lb items in ALL services
✅ **Photo Uploads** - Cloudinary integration
✅ **Google Maps** - Address autocomplete and distance calculation
✅ **Email Integration** - FormSubmit.co for quotes
✅ **Acuity Scheduling** - Direct booking integration
✅ **Mobile Optimized** - Full responsive design
✅ **Session Management** - LocalStorage for conversation persistence

## 📱 External Integration

Add this button to ANY page to open the chat:
```html
<button onclick="window.openWFMChat()">Chat with Sarah</button>
```

## 🛠️ Troubleshooting

**Chat won't open:**
- Check browser console for errors
- Verify Google Maps API key is valid
- Ensure all dependencies installed

**Estimates incorrect:**
- Check `src/utils/calculations.js`
- Verify rates in `src/constants/rates.js`

**Photos not uploading:**
- Verify Cloudinary config
- Check upload preset exists
- Ensure file size < 10MB

## 📞 Support

Contact: service@worryfreemovers.com
Phone: 330-435-8686

## 🎯 Heavy Items Fix

✅ LABOR service now includes:
- Heavy item fees ($150 per item over 300lbs)
- Shop equipment fees
- Oversized furniture fees

Check `src/utils/calculations.js` → `calculateLaborEstimate()`

## 📄 License

Proprietary - Worry Free Moving LLC © 2024