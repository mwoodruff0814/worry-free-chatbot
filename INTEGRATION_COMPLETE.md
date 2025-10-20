# Complete Integration Guide

## What's Been Fixed & Added

### ✅ API Services Created (`src/api/`)
1. **googleMapsService.js** - Autocomplete, distance calculation, geocoding
2. **cloudinaryService.js** - Photo uploads with progress tracking  
3. **emailService.js** - FormSubmit integration for estimates and claims

### ✅ Utils Updated
- **src/utils/googleMaps.js** - Now uses googleMapsService

### ✅ Components Created
- **src/components/Modals/chat/LocationInput.jsx** - Autocomplete address input

## How to Use LocationInput in FlowController

### Step 1: Import the component

```javascript
import LocationInput from './Modals/chat/LocationInput';
```

### Step 2: Use it for address stages

```javascript
// In your FlowController render logic:

{chatState.stage === STAGES.LOCATION_FROM && (
  <LocationInput 
    onSelect={async (address) => {
      // Store the address
      updateChatData({ from: address });
      
      // Show confirmation
      addBotMessage(`Got it! Starting from ${address}`, 500);
      
      // Move to next stage
      setTimeout(() => {
        addBotMessage("Where are you moving to?", 800);
        updateStage(STAGES.LOCATION_TO);
      }, 1000);
    }}
    placeholder="Start typing your pickup address..."
  />
)}

{chatState.stage === STAGES.LOCATION_TO && (
  <LocationInput 
    onSelect={async (address) => {
      updateChatData({ to: address });
      addBotMessage(`Perfect! Moving to ${address}`, 500);
      
      // Calculate distance
      if (chatState.data.from && address) {
        try {
          addBotMessage("Calculating distance...", 800);
          const { distance, duration } = await googleMapsService.calculateDistance(
            chatState.data.from,
            address
          );
          
          updateChatData({ 
            distance: parseFloat(distance),
            duration: parseFloat(duration)
          });
          
          setTimeout(() => {
            addBotMessage(`That's about ${distance} miles (${duration} hours drive time)`, 1200);
            setTimeout(() => {
              // Move to next stage
              updateStage(STAGES.MOVING_DATE);
            }, 1500);
          }, 1000);
        } catch (error) {
          console.error('Distance calculation failed:', error);
          addBotMessage("I couldn't calculate the exact distance, but let's continue!", 800);
          setTimeout(() => updateStage(STAGES.MOVING_DATE), 1200);
        }
      }
    }}
    placeholder="Start typing your destination address..."
  />
)}
```

### Step 3: Add the import for googleMapsService

```javascript
import { googleMapsService } from '../api/googleMapsService';
```

## Testing Checklist

1. ✅ Start dev server: `npm start`
2. ✅ Open http://localhost:3000
3. ✅ Start a conversation
4. ✅ Type an address (min 3 characters)
5. ✅ See Google Maps dropdown suggestions
6. ✅ Click a suggestion
7. ✅ See distance calculation
8. ✅ Verify no duplicate messages
9. ✅ Check console for API logs

## API Service Examples

### Google Maps Service
```javascript
import { googleMapsService } from '../api/googleMapsService';

// Autocomplete
const suggestions = await googleMapsService.getAutocompletePredictions('123 Main');

// Distance
const { distance, duration } = await googleMapsService.calculateDistance(from, to);

// Geocode
const { lat, lng } = await googleMapsService.geocodeAddress(address);
```

### Cloudinary Service
```javascript
import { cloudinaryService } from '../api/cloudinaryService';

// Upload single photo
const result = await cloudinaryService.uploadPhoto(file, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});

// Upload multiple
const results = await cloudinaryService.uploadPhotos(files, (index, progress) => {
  console.log(`Photo ${index + 1}: ${progress}%`);
});
```

### Email Service
```javascript
import { emailService } from '../api/emailService';

// Send estimate
await emailService.sendEstimate({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '555-1234',
  serviceType: 'moving',
  from: '123 Main St',
  to: '456 Oak Ave',
  estimate: { total: 500 }
});
```

## Common Issues & Fixes

### Issue: Autocomplete not showing
**Fix**: Check console for Google Maps loading errors. Verify API key in `src/constants/config.js`

### Issue: Distance not calculating
**Fix**: Ensure both addresses are set before calling `calculateDistance()`

### Issue: Photos not uploading
**Fix**: Check Cloudinary config in `src/constants/config.js`. Verify upload preset exists.

## File Structure

```
src/
├── api/
│   ├── googleMapsService.js     ✅ Google Maps integration
│   ├── cloudinaryService.js     ✅ Photo uploads
│   └── emailService.js           ✅ Email sending
├── components/
│   └── Modals/
│       └── chat/
│           └── LocationInput.jsx ✅ Autocomplete input
└── utils/
    └── googleMaps.js             ✅ Updated to use service
```

## Next Steps

1. **Integrate LocationInput** into FlowController for:
   - LOCATION_FROM stage
   - LOCATION_TO stage  
   - LOCATION_THIRD stage

2. **Update distance calculation** to use the new service

3. **Test thoroughly** with real addresses

4. **Add loading states** for better UX

5. **Error handling** for API failures

All services are ready to use! 🚀
