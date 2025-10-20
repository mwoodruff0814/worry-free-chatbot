# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React-based AI chatbot ("Sarah") for Worry Free Moving LLC. Provides instant moving estimates, labor quotes, and single-item moving services through an intelligent conversation flow.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm start

# Build for production (outputs to build/)
npm run build

# Run tests
npm test
```

## Core Architecture

### State Management
- **ChatContext** (`src/context/ChatContext.jsx`) - Global state container for entire conversation
  - Manages chat data, current stage, messages, and navigation history
  - Provides session persistence via localStorage
  - Handles back button navigation through state snapshots

### Conversation Flow
- **useConversationFlow** (`src/hooks/useConversationFlow.js`) - The chatbot's "brain"
  - Processes user responses and determines next stage
  - Contains all business logic for conversation transitions
  - Handles estimate calculations and data collection
  - Manages different flows for 3 service types: Moving, Labor, Single Item

### Stage System
- Conversation progresses through predefined stages (see `src/constants/stages.js`)
- Each stage represents a question or decision point
- Flow is non-linear - stages can skip or branch based on previous answers
- Example: LABOR service skips packing-related stages that only apply to MOVING service

### Pricing Calculations
All estimate logic lives in `src/utils/calculations.js`:
- **calculateMovingEstimate()** - Full moving service with trucks, packing, distance
- **calculateLaborEstimate()** - Labor-only service (no truck)
- **calculateSingleItemEstimate()** - Individual item moves

**Critical**: The LABOR service MUST include heavy item fees ($150 per item over 300lbs). This was a previous bug - ensure any changes preserve this logic via `calculateHeavyItemFees()`.

### Rate Configuration
`src/constants/rates.js` contains ALL pricing data:
- Base rates and multipliers for each service type
- Special item fees (pianos, safes, pool tables, etc.)
- Equipment categories (SHOP_EQUIPMENT, OVERSIZED_FURNITURE, TV_HANDLING)
- Packing materials pricing
- Access factors (large homes, long walks, stairs)

**Important**: Heavy items are defined as 300+ lbs and trigger the $150 fee. This threshold is checked via `weightThreshold` property.

## Key Integration Points

### External Services
- **Google Maps API** - Address autocomplete and distance calculation (`src/utils/googleMaps.js`)
- **Cloudinary** - Photo upload storage (configured in `src/constants/config.js`)
- **FormSubmit.co** - Email delivery for quotes (`src/services/emailService.js`)
- **Acuity Scheduling** - Direct booking integration (iframe embed)

### Configuration
All API keys and settings are in `src/constants/config.js`:
- Google Maps API key
- Cloudinary cloud name and upload preset
- Email addresses
- Phone numbers
- Acuity scheduling URL

## Component Structure

### FlowController
`src/components/FlowController.jsx` - Main UI orchestrator (24KB file, largest component)
- Renders appropriate UI for each stage
- Handles user input collection
- Manages photo uploads
- Displays estimates and booking options

### UI Components
`src/components/UI/` - Reusable interface elements
- ChatWindow, MessageBubble, InputField, etc.

### Modals
`src/components/Modals/` - Popup dialogs for estimates and booking

## Important Business Logic

### Service Types
1. **MOVING** - Full service with truck, crew, packing
   - Collects: locations, dates, home size, items, packing needs
   - Calculates based on: distance, bedrooms, stairs, special items, crew size

2. **LABOR** - Crew only, customer provides truck
   - Collects: hours needed, items, crew size
   - **Must include**: Heavy item fees, shop equipment fees, oversized furniture fees

3. **SINGLE_ITEM** - Move one item or set
   - Uses predefined categories with crew requirements and time minimums
   - Different pricing for standard/set/heavy categories

### Heavy Items Handling
Items over 300 lbs require:
- Additional $150 fee per item
- Larger crew (3-4 people)
- Extended time estimates

Categories that trigger heavy item fees:
- Large safes (300+ lbs)
- Pool tables
- Pianos
- Heavy machinery (table saws, drill presses)
- Universal gym equipment
- Some oversized furniture

Check `SHOP_EQUIPMENT` and `OVERSIZED_FURNITURE` in rates.js for `weightThreshold >= 300`.

### Distance Calculations
- Uses Google Maps Distance Matrix API
- Factors into both pricing and time estimates
- Different multipliers for moving vs labor services

## Testing Considerations

When modifying estimate calculations:
1. Test all three service types independently
2. Verify heavy items add correct fees in LABOR service
3. Check that stairs multiply correctly for multiple locations
4. Ensure FVP (Full Value Protection) insurance calculates at correct rates
5. Test same-day booking multiplier (10% surcharge)

## Session Persistence

Conversations save to localStorage automatically:
- Key: `wfm_chat_session_[timestamp]`
- Contains full chat state, messages, and collected data
- Enables page refresh without losing progress
- Back button navigates through saved state snapshots

## Common Development Tasks

### Adding a New Special Item
1. Add to `SPECIAL_ITEMS` or relevant category in `src/constants/rates.js`
2. Update stage flow in `useConversationFlow.js` if needed
3. Ensure calculation functions include the new item
4. Test in all applicable service types

### Modifying Pricing
1. Update rates in `src/constants/rates.js`
2. If changing calculation logic, edit `src/utils/calculations.js`
3. Verify changes in both estimate display and email quotes

### Adding New Conversation Stage
1. Define stage constant in `src/constants/stages.js`
2. Add stage handling in `useConversationFlow.js` → `processResponse()`
3. Create UI for the stage in `FlowController.jsx`
4. Add appropriate messages in `src/constants/messages.js`

## Deployment

Build outputs to `build/` directory. Upload contents to web server. Can be embedded on any page using the global `window.openWFMChat()` function.
