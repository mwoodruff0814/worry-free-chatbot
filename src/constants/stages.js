// FILE: src/constants/stages.js
// PURPOSE: Define all conversation stages

export const STAGES = {
  // Initial stages
  GREETING: 'greeting',
  GET_NAME_INITIAL: 'get_name_initial',
  SERVICE_SELECTION: 'service_selection',
  MOVING_DATE: 'moving_date',

  // Pest disclaimer
  PEST_DISCLAIMER: 'pest_disclaimer',

  // Location stages
  LOCATION_FROM: 'location_from',
  LOCATION_TO: 'location_to',
  ASK_THIRD_LOCATION: 'ask_third_location',
  LOCATION_THIRD: 'location_third',

  // Location details phase (after all addresses collected)
  START_LOCATION_DETAILS: 'start_location_details',

  // Stairs
  STAIRS_FROM: 'stairs_from',
  STAIRS_TO: 'stairs_to',
  STAIRS_THIRD: 'stairs_third',
  
  // Home details
  HOME_TYPE: 'home_type',
  HOME_SIZE_ASSESSMENT: 'home_size_assessment',
  ACCESS_OBSTACLES: 'access_obstacles',
  BEDROOMS_FROM: 'bedrooms_from',
  DESTINATION_TYPE: 'destination_type',
  HOME_SIZE_ASSESSMENT_TO: 'home_size_assessment_to',
  BEDROOMS_TO: 'bedrooms_to',
  BEDROOMS_THIRD: 'bedrooms_third',

  // Equipment and items
  TV_HANDLING_CHECK: 'tv_handling_check',
  TV_SIZE_DETAILS: 'tv_size_details',
  TV_PACKING_OPTIONS: 'tv_packing_options',
  CHECK_APPLIANCES: 'check_appliances',
  SELECT_APPLIANCES: 'select_appliances',
  SHOP_EQUIPMENT_CHECK: 'shop_equipment_check',
  SHOP_EQUIPMENT_DETAILS: 'shop_equipment_details',
  OVERSIZED_FURNITURE_CHECK: 'oversized_furniture_check',
  OVERSIZED_FURNITURE_DETAILS: 'oversized_furniture_details',
  SPECIAL_ITEMS: 'special_items',
  HEAVY_ITEMS_CHECK: 'heavy_items_check',
  PIANO_TYPE: 'piano_type',
  SAFE_DETAILS: 'safe_details',
  OFFER_SPECIAL_ITEM_PHOTOS: 'offer_special_item_photos',

  // Crew and service
  CREW_SIZE: 'crew_size',
  CREW_SIZE_MOVING: 'crew_size_moving',
  HOURS: 'hours',
  
  // Packing
  ASK_PACKING_SUPPLIES: 'ask_packing_supplies',
  ASK_TOTAL_ROOMS: 'ask_total_rooms',
  ASK_PACKING_SERVICE: 'ask_packing_service',
  
  // Photos
  OFFER_PHOTOS_MOVING: 'offer_photos_moving',
  OFFER_PHOTOS_LABOR: 'offer_photos_labor',
  OFFER_PHOTOS_SINGLE: 'offer_photos_single',
  
  // Single item
  ITEM_TYPE: 'item_type',
  DESCRIBE_ITEM: 'describe_item',
  CUSTOM_ITEM_WEIGHT: 'custom_item_weight',
  
  // FVP
  SHOW_FVP_OPTIONS: 'show_fvp_options',
  FVP_VALUE: 'fvp_value',
  FVP_DEDUCTIBLE: 'fvp_deductible',

  // Booking and contact info
  SHOW_BOOKING_OPTIONS: 'show_booking_options',
  GET_EMAIL: 'get_email',
  GET_PHONE: 'get_phone',
  COLLECT_FULL_NAME: 'collect_full_name',
  COLLECT_EMAIL_REQUIRED: 'collect_email_required',
  COLLECT_PHONE_REQUIRED: 'collect_phone_required',
  
  // Insurance claims
  INSURANCE_CLAIMS_START: 'insurance_claims_start',
  INSURANCE_PHOTOS: 'insurance_photos',
  DAMAGE_DESCRIPTION: 'damage_description',
  
  // Questions
  QUESTIONS: 'questions'
};