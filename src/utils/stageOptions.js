// FILE: src/utils/stageOptions.js
// PURPOSE: Get options for each conversation stage - COMPLETE

import { STAGES } from '../constants/stages';

export const getOptionsForStage = (stage) => {
  switch(stage) {
    case STAGES.GREETING:
      return [];
      
    case STAGES.GET_NAME_INITIAL:
      return []; // Uses input, not options
      
    case STAGES.SERVICE_SELECTION:
      return [
        { text: "🚚 Full Moving Service", value: "moving" },
        { text: "💪 Labor Only (I have truck)", value: "labor" },
        { text: "📦 Single Item Move", value: "single" },
        { text: "❓ I have questions", value: "questions" },
        { text: "🛡️ File Insurance Claim", value: "insurance_claim" }
      ];
      
    case STAGES.MOVING_DATE:
      return []; // Uses date picker
      
    case STAGES.PEST_DISCLAIMER:
      return [
        { text: "I agree to the terms", value: "continue_after_disclaimer", primary: true },
        { text: "I need to address pest issues first", value: "exit_pest_issues" },
        { text: "Call to discuss: 330-435-8686", value: "call" }
      ];
      
    case STAGES.LOCATION_FROM:
    case STAGES.LOCATION_TO:
    case STAGES.LOCATION_THIRD:
      return []; // Uses autocomplete input
      
    case STAGES.STAIRS_FROM:
    case STAGES.STAIRS_TO:
    case STAGES.STAIRS_THIRD:
      return [
        { text: "No stairs", value: "0" },
        { text: "1 flight", value: "1" },
        { text: "2 flights", value: "2" },
        { text: "3+ flights", value: "3" }
      ];
      
    case STAGES.ASK_THIRD_LOCATION:
      return [
        { text: "No, just these two locations", value: "no" },
        { text: "Yes, I have a third stop", value: "yes" }
      ];
      
    case STAGES.HOME_TYPE:
      return [
        { text: "🏠 House", value: "house" },
        { text: "🏢 Apartment", value: "apartment" },
        { text: "🏢 Condo", value: "condo" },
        { text: "📦 Storage Unit", value: "storage" }
      ];
      
    case STAGES.HOME_SIZE_ASSESSMENT:
      return [
        { text: "Yes, it's larger than 2,600 sq ft", value: "large" },
        { text: "No, it's 2,600 sq ft or smaller", value: "standard" }
      ];

    case STAGES.HOME_SIZE_ASSESSMENT_TO:
      return [
        { text: "Yes, it's larger than 2,600 sq ft", value: "large" },
        { text: "No, it's 2,600 sq ft or smaller", value: "standard" }
      ];

    case STAGES.ACCESS_OBSTACLES:
      return [
        { text: "No, normal distance", value: "normal" },
        { text: "Yes, long walk (75+ feet)", value: "long_walk" }
      ];
      
    case STAGES.DESTINATION_TYPE:
      return [
        { text: "🏠 House", value: "house" },
        { text: "🏢 Apartment", value: "apartment" },
        { text: "🏢 Condo", value: "condo" },
        { text: "📦 Storage Unit", value: "storage" }
      ];
      
    case STAGES.BEDROOMS_FROM:
    case STAGES.BEDROOMS_TO:
    case STAGES.BEDROOMS_THIRD:
      return [
        { text: "Studio/1 Bedroom", value: "1" },
        { text: "2 Bedrooms", value: "2" },
        { text: "3 Bedrooms", value: "3" },
        { text: "4 Bedrooms", value: "4" },
        { text: "5+ Bedrooms", value: "5" }
      ];
      
    case STAGES.TV_HANDLING_CHECK:
      return [
        { text: "Yes, I have large TVs", value: "yes" },
        { text: "No large TVs", value: "no" }
      ];
      
    case STAGES.TV_SIZE_DETAILS:
      const tvIndex = 0; // This would need to come from chatState
      const tvSizes = ['55-65 inch TV', '70-75 inch TV', '80+ inch TV'];
      if (tvIndex < tvSizes.length) {
        return [
          { text: "Yes", value: "yes" },
          { text: "No", value: "no" }
        ];
      }
      return [];
      
    case STAGES.TV_PACKING_OPTIONS:
      return [
        { text: "I have the original boxes", value: "have_boxes" },
        { text: "I need professional TV boxes", value: "need_boxes", primary: true },
        { text: "I'll wrap them myself", value: "no_boxes" }
      ];
      
    case STAGES.CHECK_APPLIANCES:
      return [
        { text: "Refrigerator 🧊", value: "refrigerator" },
        { text: "Washer 🧺", value: "washer" },
        { text: "Dryer", value: "dryer" },
        { text: "Stove/Range 🍳", value: "stove" },
        { text: "Deep Freezer ❄️", value: "freezer" },
        { text: "Dishwasher 🍽️", value: "dishwasher" }
      ];

    case STAGES.SELECT_APPLIANCES:
      return [
        { text: "Yes", value: "yes" },
        { text: "No", value: "no" }
      ];
      
    case STAGES.CHECK_THIRD_APPLIANCES:
      return [
        { text: "Yes, appliances at third location", value: "yes" },
        { text: "No appliances there", value: "no" }
      ];
      
    case STAGES.SHOP_EQUIPMENT_CHECK:
      return [
        { text: "Workbench 🔨", value: "workbench" },
        { text: "Tool Chest 🧰", value: "toolchest" },
        { text: "Air Compressor", value: "compressor" },
        { text: "Generator ⚡", value: "generator" },
        { text: "Ladders", value: "ladders" },
        { text: "Lawn Mower 🌱", value: "mower" },
        { text: "Snow Blower ❄️", value: "snowblower" },
        { text: "Other Equipment", value: "other" }
      ];

    case STAGES.SHOP_EQUIPMENT_DETAILS:
      return [
        { text: "Yes", value: "yes" },
        { text: "No", value: "no" }
      ];
      
    case STAGES.OVERSIZED_FURNITURE_CHECK:
      return [
        { text: "Yes, I have oversized/specialty items", value: "yes" },
        { text: "No oversized items", value: "no" }
      ];
      
    case STAGES.OVERSIZED_FURNITURE_DETAILS:
      return [
        { text: "Yes, I have specialty mattresses", value: "yes_mattress" },
        { text: "No specialty mattresses", value: "no_mattress" }
      ];
      
    case STAGES.MATTRESS_DETAILS:
      return [
        { text: "Yes", value: "yes" },
        { text: "No", value: "no" }
      ];
      
    case STAGES.OTHER_OVERSIZED_CHECK:
      return [
        { text: "Yes, I have oversized furniture", value: "yes" },
        { text: "No oversized furniture", value: "no" }
      ];
      
    case STAGES.SELECT_OVERSIZED_FURNITURE:
      return [
        { text: "Yes", value: "yes" },
        { text: "No", value: "no" }
      ];
      
    case STAGES.SPECIAL_ITEMS:
      return [
        { text: "Piano 🎹", value: "piano" },
        { text: "Safe 🔒", value: "safe" },
        { text: "Heavy Items (300+ lbs)", value: "heavyItems" },
        { text: "Universal Gym", value: "gym" },
        { text: "Free Weights", value: "freeWeights" },
        { text: "Treadmill/Elliptical", value: "treadmill" },
        { text: "China Hutch", value: "hutch" },
        { text: "Large Aquarium", value: "aquarium" }
      ];

    case STAGES.HEAVY_ITEMS_CHECK:
      return [
        { text: "Piano 🎹", value: "piano" },
        { text: "Safe 🔒", value: "safe" },
        { text: "Hot Tub ❌", value: "hotTub" },
        { text: "Pool Table ❌", value: "poolTable" },
        { text: "Large Aquarium ❌", value: "aquarium" },
        { text: "Shed ❌", value: "shed" },
        { text: "Universal Gym", value: "gym" },
        { text: "Free Weights", value: "freeWeights" },
        { text: "Treadmill/Elliptical", value: "treadmill" },
        { text: "China Hutch", value: "hutch" },
        { text: "Other Heavy Items (350+ lbs)", value: "otherHeavy" }
      ];

    case STAGES.PIANO_TYPE:
      return [
        { text: "Spinet Piano (3 movers needed)", value: "spinet" },
        { text: "Upright Piano (4 movers needed)", value: "upright" },
        { text: "Grand Piano", value: "grand" }
      ];

    case STAGES.SAFE_DETAILS:
      return [
        { text: "Under 350 lbs, no stairs", value: "light_no_stairs" },
        { text: "Under 350 lbs, with stairs", value: "light_with_stairs" },
        { text: "Over 350 lbs, no stairs", value: "heavy_no_stairs" },
        { text: "Over 350 lbs, with stairs", value: "heavy_with_stairs" },
        { text: "Not sure / Need help", value: "unsure" }
      ];

    case STAGES.OFFER_SPECIAL_ITEM_PHOTOS:
      return [
        { text: "Yes, add photos", value: "yes" },
        { text: "No photos needed", value: "no" }
      ];
      
    case STAGES.CREW_SIZE:
    case STAGES.CREW_SIZE_MOVING:
      return [
        { text: "👥 2 person crew", value: "2" },
        { text: "👥 3 person crew", value: "3" },
        { text: "👥 4 person crew", value: "4" }
      ];
      
    case STAGES.HOURS:
      return [
        { text: "2 hours (minimum)", value: "2" },
        { text: "4 hours", value: "4" },
        { text: "6 hours", value: "6" },
        { text: "8 hours (full day)", value: "8" },
        { text: "Other amount", value: "other_hours" }
      ];
      
    case STAGES.ASK_PACKING_SUPPLIES:
      return [
        { text: "Yes, I need packing materials", value: "yes" },
        { text: "No, I have my own", value: "no" }
      ];
      
    case STAGES.ASK_TOTAL_ROOMS:
      return []; // Uses input for room count

    case STAGES.ASK_PACKING_SERVICE:
      return [
        { text: "Yes, pack everything", value: "full" },
        { text: "Partial packing (fragile items)", value: "partial" },
        { text: "No packing service needed", value: "no" }
      ];

    case STAGES.ITEM_TYPE:
      return [
        { text: "🛋️ Furniture", value: "category_furniture" },
        { text: "🔌 Appliance", value: "category_appliance" },
        { text: "🛏️ Furniture Set", value: "category_set" },
        { text: "🏋️ Heavy/Special Item", value: "category_heavy" },
        { text: "📦 Other", value: "other" }
      ];
      
    case STAGES.SELECT_FURNITURE_ITEM:
      return [
        { text: "Couch/Sofa", value: "couch" },
        { text: "Loveseat", value: "loveseat" },
        { text: "Recliner/Chair", value: "chair" },
        { text: "Mattress & Box Spring", value: "mattress" },
        { text: "Dresser", value: "dresser" },
        { text: "Desk", value: "desk" },
        { text: "Dining Table", value: "table" },
        { text: "Other Furniture", value: "other" }
      ];
      
    case STAGES.SELECT_APPLIANCE_ITEM:
      return [
        { text: "Refrigerator", value: "refrigerator" },
        { text: "Washer", value: "washer" },
        { text: "Dryer", value: "dryer" },
        { text: "Stove/Range", value: "stove" },
        { text: "Deep Freezer", value: "freezer" },
        { text: "Dishwasher", value: "dishwasher" },
        { text: "Other Appliance", value: "other" }
      ];
      
    case STAGES.SELECT_SET_ITEM:
      return [
        { text: "Bedroom Set", value: "bedroomSet" },
        { text: "Dining Room Set", value: "diningSet" },
        { text: "Living Room Set", value: "livingSet" },
        { text: "Office Furniture Set", value: "officeSet" }
      ];
      
    case STAGES.SELECT_HEAVY_ITEM:
      return [
        { text: "Piano", value: "piano" },
        { text: "Gun Safe", value: "gunSafe" },
        { text: "Pool Table", value: "poolTable" },
        { text: "Hot Tub", value: "hotTub" },
        { text: "Large Safe (500+ lbs)", value: "safe" },
        { text: "Home Gym Equipment", value: "gym" },
        { text: "Treadmill", value: "treadmill" },
        { text: "Elliptical", value: "elliptical" },
        { text: "Other Heavy Item", value: "other" }
      ];
      
    case STAGES.DESCRIBE_ITEM:
      return []; // Uses input
      
    case STAGES.CUSTOM_ITEM_WEIGHT:
      return [
        { text: "Under 150 lbs (1-2 people can lift)", value: "light" },
        { text: "150-300 lbs (heavy but manageable)", value: "heavy" },
        { text: "Over 300 lbs (requires special handling)", value: "extra_heavy" }
      ];
      
    case STAGES.OFFER_PHOTOS_MOVING:
    case STAGES.OFFER_PHOTOS_LABOR:
    case STAGES.OFFER_PHOTOS_SINGLE:
      return [
        { text: "Skip photos", value: "proceed_without_photos" },
        { text: "Add photos", value: "add_photos", primary: true }
      ];
      
    case STAGES.SHOW_FVP_OPTIONS:
      return [
        { text: "📋 Standard Coverage (Included)", value: "standard" },
        { text: "🛡️ Full Value Protection", value: "fvp", primary: true },
        { text: "↪️ Skip & Continue", value: "skip" }
      ];
      
    case STAGES.FVP_VALUE:
      return []; // Uses input
      
    case STAGES.FVP_DEDUCTIBLE:
      return [
        { text: "$0 Deductible", value: "0" },
        { text: "$250 Deductible (15% discount)", value: "250" },
        { text: "$500 Deductible (30% discount)", value: "500" },
        { text: "$750 Deductible (45% discount)", value: "750" },
        { text: "$1,000 Deductible (60% discount)", value: "1000" }
      ];
      
    case STAGES.SHOW_BOOKING_OPTIONS:
      return [
        { text: "📅 Schedule with Sarah", value: "schedule_acuity", primary: true },
        { text: "📞 Call: 330-435-8686", value: "call" },
        { text: "📧 Email Estimate", value: "email_quote" },
        { text: "💬 New Estimate", value: "restart" }
      ];
      
    case STAGES.GET_EMAIL:
    case STAGES.COLLECT_EMAIL_REQUIRED:
      return []; // Uses input
      
    case STAGES.GET_PHONE:
    case STAGES.COLLECT_PHONE_REQUIRED:
      return []; // Uses input
      
    case STAGES.COLLECT_FULL_NAME:
      return []; // Uses input
      
    case STAGES.INSURANCE_CLAIMS_START:
      return [
        { text: "Free Standard Coverage ($0.60/lb per article)", value: "standard_coverage" },
        { text: "Full Value Protection (FVP)", value: "fvp_coverage" }
      ];
      
    case STAGES.INSURANCE_PHOTOS:
      return [
        { text: "Skip photos", value: "proceed_without_photos" },
        { text: "Add photos", value: "add_photos", primary: true }
      ];
      
    case STAGES.DAMAGE_DESCRIPTION:
      return []; // Uses input
      
    case STAGES.QUESTIONS:
      return [
        { text: "📍 Service areas", value: "service_areas" },
        { text: "💰 What's included?", value: "whats_included" },
        { text: "📦 Packing services", value: "packing_info" },
        { text: "🚫 Items you don't move", value: "restricted_items" },
        { text: "⭐ Why choose Worry Free?", value: "why_choose_us" },
        { text: "📸 Upload photos for estimate", value: "insurance_photos" },
        { text: "↩️ Get an estimate", value: "restart" }
      ];
      
    case STAGES.THIRD_LOCATION_TYPE:
      return [
        { text: "📦 Storage Unit", value: "storage" },
        { text: "🏠 House", value: "house" },
        { text: "🏢 Apartment", value: "apartment" },
        { text: "🏢 Business/Office", value: "business" }
      ];
      
    case STAGES.THIRD_LOCATION_ITEMS:
      return [
        { text: "Dropping off items only", value: "drop_only" },
        { text: "Picking up items only", value: "pick_only" },
        { text: "Both picking up and dropping off", value: "both" }
      ];
      
    default:
      console.warn('No options defined for stage:', stage);
      return [];
  }
};

// Helper function to get input placeholder for stages that use input
export const getInputPlaceholderForStage = (stage) => {
  const placeholders = {
    [STAGES.GET_NAME_INITIAL]: "Enter your full name (first and last)...",
    [STAGES.COLLECT_FULL_NAME]: "Enter your first and last name...",
    [STAGES.LOCATION_FROM]: "Start typing your address...",
    [STAGES.LOCATION_TO]: "Start typing destination address...",
    [STAGES.LOCATION_THIRD]: "Start typing third location address...",
    [STAGES.HOURS]: "Enter number of hours...",
    [STAGES.ASK_TOTAL_ROOMS]: "Enter number of rooms (e.g., 5)...",
    [STAGES.DESCRIBE_ITEM]: "e.g., Large wardrobe, Gun safe...",
    [STAGES.GET_EMAIL]: "Enter your email...",
    [STAGES.COLLECT_EMAIL_REQUIRED]: "Enter your email...",
    [STAGES.GET_PHONE]: "Enter your phone number...",
    [STAGES.COLLECT_PHONE_REQUIRED]: "Enter your phone number...",
    [STAGES.FVP_VALUE]: "Enter total value...",
    [STAGES.DAMAGE_DESCRIPTION]: "Describe the damage in detail..."
  };
  return placeholders[stage] || "Type your answer...";
};

// Helper function to check if stage needs input
export const stageNeedsInput = (stage) => {
  const inputStages = [
    STAGES.GET_NAME_INITIAL,
    STAGES.COLLECT_FULL_NAME,
    STAGES.HOURS,
    STAGES.DESCRIBE_ITEM,
    STAGES.GET_EMAIL,
    STAGES.COLLECT_EMAIL_REQUIRED,
    STAGES.GET_PHONE,
    STAGES.COLLECT_PHONE_REQUIRED,
    STAGES.FVP_VALUE,
    STAGES.DAMAGE_DESCRIPTION
  ];
  return inputStages.includes(stage);
};

// Helper function to check if stage needs date picker
export const stageNeedsDatePicker = (stage) => {
  return stage === STAGES.MOVING_DATE;
};