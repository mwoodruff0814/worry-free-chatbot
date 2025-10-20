// FILE: src/utils/calculations.js
// PURPOSE: All estimate calculation logic - FIXED TO INCLUDE HEAVY ITEMS IN LABOR SERVICE

import { RATES, SPECIAL_ITEMS, APPLIANCES, SHOP_EQUIPMENT, OVERSIZED_FURNITURE, TV_HANDLING, MATERIALS, ACCESS_FACTORS, SINGLE_ITEM_CATEGORIES } from '../constants/rates';
import { formatMoney } from './formatters';

/**
 * Calculate heavy item fees from shop equipment and oversized furniture
 */
export const calculateHeavyItemFees = (data) => {
  let fees = 0;
  let heavyItemCount = 0;
  
  // Check shop equipment
  (data.shopEquipment || []).forEach(item => {
    const equipment = SHOP_EQUIPMENT[item];
    if (equipment && equipment.weightThreshold >= 300) {
      fees += RATES.heavyItemFee;
      heavyItemCount++;
    }
  });
  
  // Check oversized furniture
  (data.oversizedFurniture || []).forEach(item => {
    const furniture = OVERSIZED_FURNITURE[item];
    if (furniture && furniture.weightThreshold >= 300) {
      fees += RATES.heavyItemFee;
      heavyItemCount++;
    }
  });
  
  return { fees, count: heavyItemCount };
};

/**
 * Calculate packing materials based on total rooms and move details
 * Custom to each move based on what they're moving
 */
export const calculatePackingMaterials = (totalRooms, moveData = {}) => {
  // Use totalRooms if available, otherwise fall back to bedrooms
  const rooms = totalRooms || moveData.bedrooms || 2;

  // Base materials scaled by room count
  const materials = {
    smallBox: { qty: 4 + (rooms * 5), cost: 0 },      // For books, small items
    mediumBox: { qty: 4 + (rooms * 4), cost: 0 },     // For general items
    largeBox: { qty: 2 + (rooms * 3), cost: 0 },      // For linens, pillows
    wardrobeBox: { qty: Math.max(moveData.bedrooms || 1, 1) * 2, cost: 0 },  // Based on bedrooms
    movingBlanket: { qty: 8 + (rooms * 4), cost: 0 }, // For furniture protection
    packingPaper: { qty: Math.ceil(rooms * 0.5), cost: 0 },
    packingTape: { qty: Math.ceil(rooms * 0.40), cost: 0 },
    furnitureCover: { qty: Math.ceil(rooms * 1.5), cost: 0 },
    dishpack: { qty: 0, cost: 0 },  // Will be added if kitchen items detected
    smallBubbleWrap: { qty: Math.ceil(rooms * 0.40), cost: 0 },
    largeBubbleWrap: { qty: Math.ceil(rooms * 0.40), cost: 0 }
  };

  // Customize based on appliances (kitchen = need dishpacks)
  const hasKitchenAppliances = (moveData.appliances || []).some(app =>
    ['refrigerator', 'washer', 'dryer', 'dishwasher', 'stove'].includes(app)
  );
  if (hasKitchenAppliances) {
    materials.dishpack.qty = Math.max(2, Math.ceil(rooms * 0.5));
  }

  // Add extra blankets if moving large furniture
  const hasOversizedFurniture = (moveData.oversizedFurniture || []).length > 0;
  if (hasOversizedFurniture) {
    materials.movingBlanket.qty += (moveData.oversizedFurniture || []).length * 2;
  }

  // Add extra protection for shop equipment
  const hasShopEquipment = (moveData.shopEquipment || []).length > 0;
  if (hasShopEquipment) {
    materials.largeBubbleWrap.qty += (moveData.shopEquipment || []).length;
    materials.movingBlanket.qty += (moveData.shopEquipment || []).length;
  }

  // Add TV boxes if TVs are being moved
  const hasTVs = (moveData.tvHandling || []).length > 0;
  if (hasTVs) {
    materials.largeBubbleWrap.qty += (moveData.tvHandling || []).length * 2;
  }

  let totalCost = 0;
  let itemsList = [];

  Object.keys(materials).forEach(key => {
    const item = materials[key];
    const materialConfig = MATERIALS[key];
    // Round each item cost to 2 decimal places to avoid floating point errors
    item.cost = parseFloat((item.qty * materialConfig.price).toFixed(2));
    totalCost += item.cost;

    if (item.qty > 0) {
      itemsList.push({
        name: materialConfig.name,
        qty: item.qty,
        unitPrice: materialConfig.price,
        total: item.cost
      });
    }
  });

  // Round total to 2 decimal places
  totalCost = parseFloat(totalCost.toFixed(2));

  return { items: itemsList, total: totalCost };
};

/**
 * Calculate FVP cost
 */
export const calculateFVPCost = (value, deductible, tripDistance) => {
  const cleanValue = parseFloat(value) || 0;
  const cleanDeductible = parseInt(deductible) || 0;
  const cleanTripDistance = parseFloat(tripDistance) || 30;
  
  const baseRate = cleanTripDistance > 50 ? RATES.fvp.longDistance : RATES.fvp.local;
  let fvpCost = cleanValue * baseRate;
  
  // Apply deductible discount
  const deductibleLevels = [0, 250, 500, 750, 1000];
  const selectedIndex = deductibleLevels.indexOf(cleanDeductible);
  
  for (let i = 0; i < selectedIndex; i++) {
    fvpCost *= 0.85;
  }

  fvpCost = Math.max(fvpCost, RATES.fvp.minCharge);
  return parseFloat(fvpCost.toFixed(2));
};

/**
 * Calculate MOVING service estimate
 */
export const calculateMovingEstimate = async (data) => {
  // Calculate loading/unloading hours
  const baseHours = {
    'apartment': 1.35,
    'house': 1.50,
    'condo': 1.45,
    'storage': 1.20
  };
  const bedroomMultiplier = {
    'apartment': 0.775,
    'house': 0.85,
    'condo': 0.775,
    'storage': 0.70
  };
  
  const homeType = data.homeType || 'apartment';
  const bedrooms = Math.max(data.bedrooms || 2, data.bedroomsTo || 2);
  const stairsFrom = data.stairsFrom || 0;
  const stairsTo = data.stairsTo || 0;
  const stairsThird = data.stairsThird || 0;
  const totalStairs = stairsFrom + stairsTo + stairsThird;
  
  let loadingHours = baseHours[homeType] + ((bedrooms - 1) * bedroomMultiplier[homeType]);
  loadingHours += totalStairs * 0.275;
  
  if (data.hasThirdLocation) {
    loadingHours *= 2.5;
    if (data.thirdLocationAction === 'pick_only' || data.thirdLocationAction === 'both') {
      loadingHours += 0.75;
    }
  } else {
    loadingHours *= 2;
  }
  
  // Add time for equipment
  const allAppliances = [...(data.appliances || []), ...(data.thirdLocationAppliances || [])];
  allAppliances.forEach(appliance => {
    loadingHours += APPLIANCES[appliance].time;
  });
  
  (data.tvHandling || []).forEach(tv => {
    const tvConfig = TV_HANDLING[tv];
    if (tvConfig) loadingHours += tvConfig.time;
  });
  
  (data.shopEquipment || []).forEach(equipment => {
    const equipConfig = SHOP_EQUIPMENT[equipment];
    if (equipConfig) loadingHours += equipConfig.time;
  });
  
  (data.oversizedFurniture || []).forEach(furniture => {
    const furnitureConfig = OVERSIZED_FURNITURE[furniture];
    if (furnitureConfig) loadingHours += furnitureConfig.time;
  });
  
  if (data.specialItems && data.specialItems !== 'none') {
    const specialItem = SPECIAL_ITEMS[data.specialItems];
    if (specialItem) loadingHours += specialItem.time;
  }
  
  loadingHours *= data.accessMultiplier || 1.0;
  
  // Drive time
  let totalDriveHours = 0;
  totalDriveHours += data.fromDuration || 0;
  totalDriveHours += data.tripDuration || 0;
  
  if (data.hasThirdLocation) {
    totalDriveHours += data.thirdLocationDuration || 0;
    totalDriveHours += (data.thirdToBaseDuration || 0) / 2;
  } else {
    const deliveryToBaseDistance = data.deliveryToBaseDistance || data.fromDistance || 0;
    if (deliveryToBaseDistance > 85) {
      totalDriveHours += deliveryToBaseDistance / 45 / 2;
    }
  }
  
  const driveHours = totalDriveHours;

  // Calculate packing hours separately
  let packingHours = 0;
  if (data.packingService && data.packingService !== 'no') {
    // Base packing time on loading hours
    let basePackingHours = data.packingService === 'full' ? loadingHours * 1.75 : loadingHours * 0.75;

    // Add additional time for extra rooms beyond bedrooms
    if (data.totalRooms && data.totalRooms > bedrooms) {
      const extraRooms = data.totalRooms - bedrooms;
      // Each extra room adds 0.75 hours for full packing, 0.4 hours for partial
      const timePerRoom = data.packingService === 'full' ? 0.75 : 0.4;
      basePackingHours += (extraRooms * timePerRoom);
    }

    packingHours = basePackingHours;
  }

  // Calculate moving hours (without packing) for base cost
  let movingHours = loadingHours + driveHours;

  const crewSize = data.crewSize || data.minCrewSize || 2;
  const crewEfficiencyMultiplier = (1 - ((crewSize - 2) * 0.175));
  movingHours *= crewEfficiencyMultiplier;

  // Apply crew efficiency to packing hours as well
  packingHours *= crewEfficiencyMultiplier;

  // Calculate packing cost AFTER crew adjustment
  const packingCost = packingHours * RATES.packingRate;

  const fromDistance = data.fromDistance || 30;
  const baseRate = RATES.moving.base + (fromDistance * RATES.moving.distanceAdj);
  const hourlyRate = baseRate + ((crewSize - 2) * RATES.moving.crewAdd);
  const baseCost = movingHours * hourlyRate;
  const serviceCharge = baseCost * RATES.moving.serviceCharge;

  // Total hours includes packing for accurate time estimate shown to customer
  const totalHours = movingHours + packingHours;

  const specialItemFee = SPECIAL_ITEMS[data.specialItems]?.fee || 0;
  const heavyItemFees = data.heavyItemFees || 0;
  const stairFee = totalStairs * RATES.stairFee;

  let tvBoxFees = 0;
  (data.tvBoxes || []).forEach(box => {
    const boxConfig = TV_HANDLING[box];
    if (boxConfig) tvBoxFees += boxConfig.fee;
  });

  let shopEquipmentFees = 0;
  (data.shopEquipment || []).forEach(equipment => {
    const equipConfig = SHOP_EQUIPMENT[equipment];
    if (equipConfig) shopEquipmentFees += equipConfig.fee;
  });

  let oversizedFees = 0;
  (data.oversizedFurniture || []).forEach(furniture => {
    const furnitureConfig = OVERSIZED_FURNITURE[furniture];
    if (furnitureConfig) oversizedFees += furnitureConfig.fee;
  });

  let tollCost = data.tollCost || 0;
  if (data.hasThirdLocation) {
    tollCost += Math.max(5, (data.thirdLocationDistance || 0) * RATES.tollCostFactor);
  }

  let packingMaterialsCost = 0;
  let packingMaterialsItems = [];

  if (data.needsPackingMaterials) {
    const totalRooms = data.totalRooms || bedrooms;
    const materials = calculatePackingMaterials(totalRooms, data);
    packingMaterialsCost = materials.total;
    packingMaterialsItems = materials.items;
  }
  
  // Get FVP cost if provided
  const fvpCost = parseFloat(data.fvpCost) || 0;

  // Same-day fee (10%)
  let sameDayFee = 0;
  if (data.isSameDay) {
    sameDayFee = (baseCost + serviceCharge + specialItemFee + heavyItemFees +
                  tvBoxFees + shopEquipmentFees + oversizedFees + packingCost +
                  packingMaterialsCost + tollCost + stairFee + fvpCost) * RATES.sameDayMultiplier;
  }

  const total = baseCost + serviceCharge + specialItemFee + heavyItemFees +
                tvBoxFees + shopEquipmentFees + oversizedFees + packingCost +
                packingMaterialsCost + tollCost + stairFee + fvpCost + sameDayFee;
  
  return {
    type: 'moving',
    loadingHours: loadingHours.toFixed(1),
    driveHours: driveHours.toFixed(1),
    packingHours: packingHours.toFixed(1),
    totalHours: totalHours.toFixed(1),
    crew: crewSize,
    hourlyRate: hourlyRate.toFixed(2),
    baseCost: baseCost.toFixed(2),
    serviceCharge: serviceCharge.toFixed(2),
    specialItemFee,
    heavyItemFees,
    tvBoxFees,
    shopEquipmentFees,
    oversizedFees,
    packingCost: packingCost.toFixed(2),
    packingMaterialsCost,
    packingMaterialsItems,
    stairFee,
    fvpCost: fvpCost.toFixed(2),
    sameDayFee,
    tollCost,
    total: total.toFixed(2)
  };
};

/**
 * ⭐ Calculate LABOR service estimate - FIXED TO INCLUDE HEAVY ITEMS
 */
export const calculateLaborEstimate = (data) => {
  const crew = data.crewSize || 2;
  const hours = data.hours || 2;
  const distance = data.fromDistance || 30;
  const stairs = data.stairsFrom || 0;
  const stairFee = stairs * RATES.stairFee;
  
  const driveHours = data.fromDuration ? 
    (data.fromDuration * 2) : 
    ((distance * 2) / 45);
  
  const baseRate = RATES.labor.base + (distance * RATES.labor.distanceAdj);
  const hourlyRate = baseRate + ((crew - 2) * RATES.labor.crewAdd);
  const laborCost = hours * hourlyRate;
  const travelCost = distance * 2 * RATES.labor.travel;
  const serviceCharge = (laborCost + travelCost) * RATES.labor.serviceCharge;
  
  // ⭐ FIXED: Calculate heavy item fees for LABOR service
  const heavyItemFeesData = calculateHeavyItemFees(data);
  const heavyItemFees = heavyItemFeesData.fees;
  
  // ⭐ FIXED: Calculate shop equipment and oversized furniture fees for LABOR
  let shopEquipmentFees = 0;
  (data.shopEquipment || []).forEach(equipment => {
    const equipConfig = SHOP_EQUIPMENT[equipment];
    if (equipConfig) shopEquipmentFees += equipConfig.fee;
  });
  
  let oversizedFees = 0;
  (data.oversizedFurniture || []).forEach(furniture => {
    const furnitureConfig = OVERSIZED_FURNITURE[furniture];
    if (furnitureConfig) oversizedFees += furnitureConfig.fee;
  });
  
  // Same-day fee (10%)
  let sameDayFee = 0;
  if (data.isSameDay) {
    sameDayFee = (laborCost + travelCost + serviceCharge + stairFee + 
                  heavyItemFees + shopEquipmentFees + oversizedFees) * RATES.sameDayMultiplier;
  }
  
  const total = laborCost + travelCost + serviceCharge + stairFee + 
                heavyItemFees + shopEquipmentFees + oversizedFees + sameDayFee;
  
  return {
    type: 'labor',
    crew,
    laborHours: hours,
    driveHours: driveHours.toFixed(1),
    totalDistance: (distance * 2).toFixed(1),
    hourlyRate: hourlyRate.toFixed(2),
    labor: laborCost.toFixed(2),
    travel: travelCost.toFixed(2),
    serviceCharge: serviceCharge.toFixed(2),
    stairFee,
    heavyItemFees,           // ⭐ ADDED
    shopEquipmentFees,       // ⭐ ADDED
    oversizedFees,           // ⭐ ADDED
    sameDayFee,
    total: total.toFixed(2)
  };
};

/**
 * Calculate SINGLE ITEM estimate
 */
export const calculateSingleItemEstimate = (data) => {
  const itemType = data.selectedSingleItem || data.itemType || 'other';
  const itemConfig = SINGLE_ITEM_CATEGORIES[itemType] || { 
    name: data.itemDescription || 'Custom Item',
    crew: 2,
    minTime: 60,
    category: 'standard',
    fee: 0
  };
  
  const pickupStairs = data.stairsFrom || 0;
  const deliveryStairs = data.deliveryStairs || 0;
  const totalStairs = pickupStairs + deliveryStairs;
  const stairFees = totalStairs * RATES.singleItem.stairs;
  
  const fromDistance = data.fromDistance || 30;
  const tripDistance = data.tripDistance || 30;
  const totalDistance = fromDistance + tripDistance;
  
  const driveHours = (data.fromDuration || 0) + (data.tripDuration || 0) || (totalDistance / 45);
  const driveMinutes = Math.ceil(driveHours * 60);
  
  const crewSize = data.requiredCrew || itemConfig.crew;
  const minimumMinutes = data.minimumTime || itemConfig.minTime;
  
  const totalMinutesNeeded = Math.max(driveMinutes + 30, minimumMinutes);
  
  const hourlyRate = RATES.singleItem.crewRates[crewSize] || RATES.singleItem.crewRates[2];
  
  let baseCost;
  if (totalMinutesNeeded <= 60) {
    baseCost = RATES.singleItem.base;
  } else {
    const additionalHours = (totalMinutesNeeded - 60) / 60;
    baseCost = RATES.singleItem.base + (additionalHours * hourlyRate);
  }
  
  const distanceCost = totalDistance * RATES.singleItem.distance;
  const itemFee = data.itemFee || itemConfig.fee || 0;
  
  let heavyItemFee = 0;
  if ((data.itemWeight || itemConfig.weight || 0) >= 300) {
    heavyItemFee = RATES.heavyItemFee;
  }
  
  let sameDayFee = 0;
  if (data.isSameDay) {
    sameDayFee = (baseCost + distanceCost + stairFees + itemFee + heavyItemFee) * RATES.sameDayMultiplier;
  }
  
  const total = baseCost + distanceCost + stairFees + itemFee + heavyItemFee + sameDayFee;
  
  return {
    type: 'single',
    item: data.itemName || itemConfig.name,
    crew: crewSize,
    minimumTime: minimumMinutes,
    base: baseCost.toFixed(2),
    distance: distanceCost.toFixed(2),
    stairs: stairFees,
    itemFee,
    heavyItemFee,
    sameDayFee,
    total: total.toFixed(2),
    totalDistance: totalDistance.toFixed(1),
    driveMinutes,
    totalMinutesEstimated: totalMinutesNeeded,
    hourlyRate
  };
};