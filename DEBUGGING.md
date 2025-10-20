# DEBUGGING GUIDE - Google Maps API & Autocomplete

## Current Status
✅ Code is properly written
✅ App compiles successfully
⚠️ Need to verify runtime behavior in browser

## How to Debug in Browser

### Step 1: Open Browser Console
1. Open http://localhost:3000
2. Press **F12** to open Developer Tools
3. Click **Console** tab
4. Clear any existing messages

### Step 2: Check Google Maps Loading
**Look for these messages in console:**
- `✅ Google Maps API ready` - Means Maps loaded successfully
- `✅ Google Maps services initialized` - Means services are ready
- `❌ Failed to load Google Maps: [error]` - Means there's a problem

**If you see an error**, look for:
- API key errors: "This API key is not authorized..."
- CORS errors: "Access-Control-Allow-Origin"
- Network errors: "Failed to load resource"

### Step 3: Test Autocomplete
1. Enter your name (e.g., "John Smith")
2. Select "Full Moving Service"
3. Choose a date
4. Click "I Understand and Agree" on pest disclaimer
5. **Type "123 main" in the address field**

**Watch console for these messages:**
- `🔍 LocationInput: Fetching suggestions for: 123 main`
- `📡 LocationInput: Calling googleMapsService.getAutocompletePredictions`
- `✅ LocationInput: Received X predictions`

**If you DON'T see dropdown:**
- Check console for error messages
- Verify `predictions.length > 0`
- Check if `showSuggestions` is true

### Step 4: Check Network Tab
1. Click **Network** tab in DevTools
2. Filter by "maps.googleapis.com"
3. Type in address field
4. **Look for API calls:**
   - `maps.googleapis.com/maps/api/js?key=...&libraries=places` - Initial load
   - Autocomplete requests (if any)

**Status codes:**
- **200**: Success
- **403**: API key issue / billing not enabled
- **400**: Bad request format

## Common Issues & Fixes

### Issue 1: "This page can't load Google Maps correctly"
**Cause**: Billing not enabled on Google Cloud account
**Fix**:
1. Go to https://console.cloud.google.com
2. Enable billing for your project
3. Make sure Maps JavaScript API and Places API are enabled

### Issue 2: Autocomplete dropdown doesn't appear
**Possible causes**:
- `googleMapsService.getAutocompletePredictions` returning empty array
- `showSuggestions` state not updating
- CSS z-index issue (dropdown hidden behind other elements)

**How to check**:
```javascript
// Type in browser console after typing address:
window.googleMapsService
// Should show the service object

await window.googleMapsService.getAutocompletePredictions("123 main")
// Should return array of predictions
```

### Issue 3: Distance calculation not working
**Check console for**:
- `Great! Calculating distance from our base... 🗺️`
- `Distance from our base: XX miles`
- Any error messages from `calculateDistance()`

## Manual Test in Console

Open browser console and run:

```javascript
// Check if Google Maps is loaded
console.log('Google Maps:', window.google?.maps ? 'LOADED' : 'NOT LOADED');

// Check if our service is available
console.log('Service:', window.googleMapsService ? 'AVAILABLE' : 'NOT AVAILABLE');

// Test autocomplete manually
if (window.googleMapsService) {
  window.googleMapsService.getAutocompletePredictions("123 main st")
    .then(results => console.log('Autocomplete results:', results))
    .catch(err => console.error('Autocomplete error:', err));
}

// Test distance calculation
if (window.googleMapsService) {
  window.googleMapsService.calculateDistance(
    "11715 Mahoning Avenue, North Jackson, OH 44451",
    "123 Main Street, Youngstown, OH"
  )
    .then(result => console.log('Distance result:', result))
    .catch(err => console.error('Distance error:', err));
}
```

## What to Report Back

After testing, please share:
1. ✅ or ❌ Google Maps loaded
2. ✅ or ❌ Autocomplete dropdown appeared
3. ✅ or ❌ Distance calculation worked
4. Any **red error messages** from console (copy exact text)
5. Screenshot of Network tab showing API calls

## Pest Control Double-Click Issue

If you need to click twice on "I Understand and Agree":
- This might be a React state issue
- Check if clicking once shows any console errors
- Try clicking slowly (not double-clicking)

## API Key Verification

The current API key in `src/constants/config.js`:
```
AIzaSyAWGIVnh7-2sgDJin_2qgNvwh4JD9UgJDo
```

**To verify it's working:**
1. Go to https://console.cloud.google.com/apis/credentials
2. Find this API key
3. Check:
   - ✅ API key restrictions (if any)
   - ✅ Maps JavaScript API is enabled
   - ✅ Places API is enabled
   - ✅ Directions API is enabled
   - ✅ Billing is enabled on the project
