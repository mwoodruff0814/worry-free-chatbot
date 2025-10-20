# Square Payment Integration Setup

This guide will help you deploy the Square payment integration for storing customer cards on file.

## ✅ What's Already Done

- Frontend payment form (PaymentModal.jsx)
- Square SDK integration (squarePaymentService.js)
- Serverless function for creating customers (api/square-customer.js)
- Packing materials breakdown in estimate emails
- Square credentials in config.js

## 🚀 Quick Deployment to Vercel (5 minutes)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
cd C:\Users\caspe\worry-free-chatbot
vercel
```

### Step 4: Add Environment Variables

**✅ ALREADY DEPLOYED TO:** https://worry-free-chatbot-qzccuxk2r-matt-5184s-projects.vercel.app

**Option A: Using Vercel Dashboard (Recommended)**
1. Go to https://vercel.com/dashboard
2. Click on your project "worry-free-chatbot"
3. Go to Settings → Environment Variables
4. Add these two variables:
   - Name: `SQUARE_ACCESS_TOKEN`
   - Value: `EAAAlrQlot7DrT6h8D_9iRN1ZTAu_HzrfUyffHhcWxU1XTZkn4inHELSj6kBdEUS`
   - Environments: Production, Preview, Development (check all)

   - Name: `SQUARE_ENVIRONMENT`
   - Value: `production`
   - Environments: Production, Preview, Development (check all)
5. After adding both, redeploy: `vercel --prod`

**Option B: Using Vercel CLI**
Run these commands (you'll be prompted to paste the values):
```bash
vercel env add SQUARE_ACCESS_TOKEN production
# When prompted, paste: EAAAlrQlot7DrT6h8D_9iRN1ZTAu_HzrfUyffHhcWxU1XTZkn4inHELSj6kBdEUS

vercel env add SQUARE_ENVIRONMENT production
# When prompted, paste: production
```

Then redeploy:
```bash
vercel --prod
```

### Step 5: Add Location ID
1. Go to https://squareup.com/dashboard/locations
2. Copy your Location ID
3. Update `src/constants/config.js` line 31 with your location ID

### Step 6: Update Frontend URL
After deployment, Vercel gives you a URL (e.g., `your-app.vercel.app`)
Update `src/services/squarePaymentService.js` to use your Vercel URL:
```javascript
const API_URL = 'https://your-app.vercel.app/api/square-customer';
```

## 📋 How It Works

1. **Customer fills out estimate** → Gets quote
2. **Clicks "Save Payment Method"** → Payment modal opens
3. **Enters card info** → Square tokenizes (secure)
4. **Token sent to your Vercel function** → Creates Square customer
5. **Card saved on file** → No charges made
6. **Estimate + packing materials emailed** → To you and customer

## 🔒 Security Features

- ✅ Card data NEVER touches your servers
- ✅ Only secure tokens are transmitted
- ✅ PCI compliant via Square
- ✅ Access token stored in environment variables (not in code)
- ✅ HTTPS only

## 💳 What Gets Stored

**In Square:**
- Customer name, email, phone
- Card on file (encrypted by Square)
- Moving estimate details in notes
- NO charges/holds

**What You'll See:**
- Square dashboard shows new customer
- Customer has card on file
- You can charge later from Square dashboard

## 📧 Email Includes

When estimate is sent:
- ✅ Service type and pricing
- ✅ Itemized breakdown
- ✅ Packing materials list (if selected)
- ✅ Material purchase policy
- ✅ What's included
- ✅ Booking links

## 🧪 Testing

Before going live, test with Square Sandbox:
1. Change `SQUARE_ENVIRONMENT` to `sandbox`
2. Use sandbox Application ID: `sandbox-sq0idb-...`
3. Use test card: `4111 1111 1111 1111`, any future date, any CVV

## ❓ Troubleshooting

**"Failed to load payment form"**
- Check that Location ID is set in config.js

**"Failed to save payment method"**
- Check Vercel logs: `vercel logs`
- Verify environment variables are set

**Card saved but no email sent**
- Check FormSubmit logs (they email you failures)
- Verify email addresses in config.js

## 📞 Need Help?

Check Vercel logs:
```bash
vercel logs
```

Check Square API logs:
https://squareup.com/dashboard/developer/logs

## 🎯 Next Steps

After deployment:
1. Test with a real card (your own)
2. Check Square dashboard for new customer
3. Verify estimate emails are being sent
4. Test from mobile device
5. Go live!
