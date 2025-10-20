const fs = require('fs');
const path = require('path');

console.log('Fixing labor-only mileage calculation...\n');

const filePath = path.join(__dirname, 'src', 'utils', 'calculations.js');
let content = fs.readFileSync(filePath, 'utf8');

// Fix the labor estimate function to include all mileage
const oldCode = `/**
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
  const travelCost = distance * 2 * RATES.labor.travel;`;

const newCode = `/**
 * ⭐ Calculate LABOR service estimate - FIXED TO INCLUDE HEAVY ITEMS AND ALL MILEAGE
 */
export const calculateLaborEstimate = (data) => {
  const crew = data.crewSize || 2;
  const hours = data.hours || 2;
  const fromDistance = data.fromDistance || 30;
  const stairs = data.stairsFrom || 0;
  const stairFee = stairs * RATES.stairFee;

  // Calculate total mileage: base → A → B → C → base
  let totalMiles = fromDistance; // Base to point A
  totalMiles += data.tripDistance || 0; // Point A to point B
  if (data.hasThirdLocation) {
    totalMiles += data.thirdLocationDistance || 0; // Point B to point C
  }
  // Add return trip from final location to base
  const finalLocationToBase = data.deliveryToBaseDistance || data.tripDistance || fromDistance;
  totalMiles += finalLocationToBase;

  const driveHours = data.fromDuration ?
    (data.fromDuration + (data.tripDuration || 0) + (data.hasThirdLocation ? (data.thirdLocationDuration || 0) : 0) + ((finalLocationToBase / 45) || 0)) :
    (totalMiles / 45);

  const baseRate = RATES.labor.base + (fromDistance * RATES.labor.distanceAdj);
  const hourlyRate = baseRate + ((crew - 2) * RATES.labor.crewAdd);
  const laborCost = hours * hourlyRate;
  const travelCost = totalMiles * RATES.labor.travel; // $1.60 per mile for ALL miles`;

content = content.replace(oldCode, newCode);

// Also update the return statement to include totalMiles
const oldReturn = `  return {
    type: 'labor',
    crew,
    laborHours: hours,
    driveHours: driveHours.toFixed(1),
    totalDistance: (distance * 2).toFixed(1),`;

const newReturn = `  return {
    type: 'labor',
    crew,
    laborHours: hours,
    driveHours: driveHours.toFixed(1),
    totalDistance: totalMiles.toFixed(1),`;

content = content.replace(oldReturn, newReturn);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Fixed labor-only mileage calculation');
console.log('   - Now includes: Base → A → B → C → Base');
console.log('   - Charges $1.60 per mile for ALL miles');
console.log('   - Updated totalDistance display\n');
console.log('📋 Mileage calculation now correct!');
