// FILE: src/constants/rates.js
// PURPOSE: All pricing rates and fee structures

export const RATES = {
  moving: {
    base: 192.50,
    distanceAdj: 0.75,
    crewAdd: 55,
    serviceCharge: 0.14
  },
  labor: {
    base: 115,
    distanceAdj: 0.50,
    crewAdd: 55,
    travel: 1.60,
    serviceCharge: 0.08
  },
  singleItem: {
    base: 249,
    distance: 1.50,
    perMinute: 1.67,
    stairs: 25,
    crewRates: {
      2: 167,
      3: 222,
      4: 277
    },
    minimums: {
      standard: 60,
      set: 90,
      heavy: 120
    }
  },
  fvp: {
    local: 0.025,
    longDistance: 0.04,
    minCharge: 49.99
  },
  
  // General fees
  stairFee: 25, // Per flight
  heavyItemFee: 150, // Per item over 300lbs
  sameDayMultiplier: 0.10, // 10% fee
  packingRate: 135, // $125/hr + 8% service fee
  tollCostFactor: 0.08
};

// Single item categories with crew requirements
export const SINGLE_ITEM_CATEGORIES = {
  // Light items - 2 person crew, 60 min minimum
  couch: { name: "Couch/Sofa", crew: 2, minTime: 60, category: "standard", fee: 0 },
  loveseat: { name: "Loveseat", crew: 2, minTime: 60, category: "standard", fee: 0 },
  chair: { name: "Recliner/Chair", crew: 2, minTime: 60, category: "standard", fee: 0 },
  mattress: { name: "Mattress & Box Spring", crew: 2, minTime: 60, category: "standard", fee: 0 },
  dresser: { name: "Dresser", crew: 2, minTime: 60, category: "standard", fee: 0 },
  desk: { name: "Desk", crew: 2, minTime: 60, category: "standard", fee: 0 },
  table: { name: "Dining Table", crew: 2, minTime: 60, category: "standard", fee: 0 },
  
  // Appliances
  washer: { name: "Washer", crew: 2, minTime: 60, category: "standard", fee: 0 },
  dryer: { name: "Dryer", crew: 2, minTime: 60, category: "standard", fee: 0 },
  refrigerator: { name: "Refrigerator", crew: 2, minTime: 60, category: "standard", fee: 0 },
  stove: { name: "Stove/Range", crew: 2, minTime: 60, category: "standard", fee: 0 },
  freezer: { name: "Deep Freezer", crew: 2, minTime: 60, category: "standard", fee: 0 },
  dishwasher: { name: "Dishwasher", crew: 2, minTime: 60, category: "standard", fee: 0 },
  
  // Sets - 2-3 person crew, 90 min minimum
  bedroomSet: { name: "Bedroom Set", crew: 2, minTime: 90, category: "set", fee: 50 },
  diningSet: { name: "Dining Room Set", crew: 2, minTime: 90, category: "set", fee: 50 },
  livingSet: { name: "Living Room Set", crew: 2, minTime: 90, category: "set", fee: 50 },
  officeSet: { name: "Office Furniture Set", crew: 2, minTime: 90, category: "set", fee: 50 },
  
  // Heavy items - 3+ person crew
  piano: { name: "Piano", crew: 3, minTime: 90, category: "heavy", fee: 200, weight: 500 },
  gunSafe: { name: "Gun Safe", crew: 4, minTime: 120, category: "heavy", fee: 100, weight: 300 },
  treadmill: { name: "Treadmill", crew: 2, minTime: 60, category: "standard", fee: 0 },
  elliptical: { name: "Elliptical", crew: 2, minTime: 60, category: "standard", fee: 0 },
  gym: { name: "Home Gym Equipment", crew: 3, minTime: 90, category: "heavy", fee: 100, weight: 400 },
  
  // Extra heavy - 4 person crew, 2 hour minimum
  poolTable: { name: "Pool Table", crew: 4, minTime: 120, category: "heavy", fee: 200, weight: 1000 },
  hotTub: { name: "Hot Tub", crew: 4, minTime: 120, category: "heavy", fee: 200, weight: 800 },
  safe: { name: "Large Safe (500+ lbs)", crew: 4, minTime: 120, category: "heavy", fee: 200, weight: 600 },
  
  other: { name: "Other Item", crew: 2, minTime: 60, category: "standard", fee: 0 }
};

// Special items configuration
export const SPECIAL_ITEMS = {
  piano: { fee: 200, crew: 3, name: "Piano", time: 1.5 },
  safe: { fee: 200, crew: 4, name: "Safe", time: 1.5 },
  heavyItems: { fee: 150, crew: 3, name: "Heavy Items (300-350lbs)", time: 0.75 },
  gym: { fee: 200, crew: 3, name: "Universal Gym Equipment", time: 1.5 },
  freeWeights: { fee: 100, crew: 3, name: "Free Weights", time: 1.0 },
  treadmill: { fee: 0, crew: 2, name: "Treadmill/Elliptical", time: 0.5 },
  hutch: { fee: 0, crew: 2, name: "China Hutch/Cabinet", time: 0.35 },
  aquarium: { fee: 150, crew: 2, name: "Large Aquarium", time: 0.5 }
};

// Appliances
export const APPLIANCES = {
  washer: { fee: 0, time: 0.35, name: "Washer" },
  dryer: { fee: 0, time: 0.35, name: "Dryer" },
  refrigerator: { fee: 0, time: 0.35, name: "Refrigerator" },
  stove: { fee: 0, time: 0.35, name: "Stove" },
  freezer: { fee: 0, time: 0.35, name: "Deep Freezer" }
};

// Shop equipment
export const SHOP_EQUIPMENT = {
  workbench: { fee: 50, crew: 2, time: 0.5, name: "Workbench", weightThreshold: 200 },
  toolChest: { fee: 40, crew: 2, time: 0.3, name: "Large Tool Chest", weightThreshold: 150 },
  tablesaw: { fee: 80, crew: 3, time: 0.75, name: "Table Saw", weightThreshold: 250 },
  airCompressor: { fee: 60, crew: 2, time: 0.4, name: "Air Compressor", weightThreshold: 180 },
  weldingEquipment: { fee: 80, crew: 2, time: 0.5, name: "Welding Equipment", weightThreshold: 200 },
  drillPress: { fee: 100, crew: 3, time: 0.6, name: "Drill Press", weightThreshold: 250 },
  heavyMachinery: { fee: 200, crew: 4, time: 1.0, name: "Heavy Machinery (300+ lbs)", weightThreshold: 300 },
  vehicleLift: { fee: 300, crew: 4, time: 1.5, name: "Vehicle Lift/Hoist", weightThreshold: 500 },
  automotiveEquipment: { fee: 150, crew: 3, time: 0.75, name: "Heavy Automotive Equipment", weightThreshold: 300 }
};

// Oversized furniture
export const OVERSIZED_FURNITURE = {
  largeSectional: { fee: 40, crew: 2, time: 0.75, name: "Oversized Sectional (10ft+)", weightThreshold: 250 },
  purpleMattress: { fee: 40, crew: 2, time: 0.25, name: "Purple Mattress (Specialty Handling)" },
  tempurPedicMattress: { fee: 40, crew: 2, time: 0.25, name: "Tempur-Pedic Mattress" },
  adjustableBase: { fee: 0, crew: 2, time: 0.5, name: "Adjustable Bed Base" },
  californiaKing: { fee: 40, crew: 2, time: 0.2, name: "California King Mattress" },
  heavyFurniture: { fee: 100, crew: 3, time: 0.5, name: "Heavy Furniture (300+ lbs)", weightThreshold: 300 },
  poolTable: { fee: 200, crew: 4, time: 2.0, name: "Pool Table", weightThreshold: 500 },
  arcadeGame: { fee: 150, crew: 3, time: 0.75, name: "Arcade Game", weightThreshold: 300 },
  largeEntertainmentCenter: { fee: 100, crew: 2, time: 0.75, name: "Large Entertainment Center", weightThreshold: 250 }
};

// TV handling
export const TV_HANDLING = {
  tv55to65: { fee: 35, crew: 2, time: 0.3, name: "55-65 inch TV" },
  tv70to75: { fee: 50, crew: 2, time: 0.4, name: "70-75 inch TV" },
  tv80plus: { fee: 75, crew: 3, time: 0.5, name: "80+ inch TV" },
  tvBox55to65: { fee: 55, crew: 0, time: 0, name: "TV Box for 55-65 inch TV" },
  tvBox70to75: { fee: 65, crew: 0, time: 0, name: "TV Box for 70-75 inch TV" },
  tvBox80plus: { fee: 75, crew: 0, time: 0, name: "TV Box for 80+ inch TV" }
};

// Packing materials
export const MATERIALS = {
  smallBox: { price: 2.59, name: "Small Box (1.5 cu ft)" },
  mediumBox: { price: 3.19, name: "Medium Box (3.0 cu ft)" },
  largeBox: { price: 3.79, name: "Large Box (4.5 cu ft)" },
  wardrobeBox: { price: 14.59, name: "Wardrobe Box" },
  movingBlanket: { price: 14.99, name: "Moving Blanket" },
  packingPaper: { price: 18.99, name: "Packing Paper (10 lb)" },
  packingTape: { price: 6.29, name: "Packing Tape (55yd)" },
  furnitureCover: { price: 6.59, name: "Furniture Cover" },
  dishpack: { price: 9.99, name: "Dish Pack" },
  smallBubbleWrap: { price: 18.99, name: "Small Bubble Wrap" },
  largeBubbleWrap: { price: 18.99, name: "Large Bubble Wrap" },
  twinMattressCover: { price: 6.59, name: "Twin Mattress Cover" },
  twinMattressCoverPremium: { price: 24.99, name: "Twin Mattress Cover (Premium)" },
  fullMattressCover: { price: 7.99, name: "Full/Queen Mattress Cover" },
  fullMattressCoverPremium: { price: 29.99, name: "Full/Queen Mattress Cover (Premium)" },
  kingMattressCover: { price: 8.99, name: "King Mattress Cover" },
  kingMattressCoverPremium: { price: 39.99, name: "King Mattress Cover (Premium)" }
};

// Access factors
export const ACCESS_FACTORS = {
  largeHome: { multiplier: 1.15, name: "Large Home (2600+ sq ft)" },
  longWalk: { multiplier: 1.15, name: "Long Walk (75+ feet from truck)" },
  combinedAccess: { multiplier: 1.25, name: "Large Home + Long Walk" }
};