// FILE: src/services/emailService.js
// PURPOSE: Email submission service

import { CONFIG } from '../constants/config';
import { formatMoney } from '../utils/formatters';

export const sendCustomerQuote = async (data) => {
  const estimateTotal = parseFloat(data.estimate?.total || 0) || 0;
  const fvpCost = parseFloat(data.fvpCost) || 0;
  const grandTotal = estimateTotal + fvpCost;
  
  let itemizedBreakdown = '';
  let jobDistance = '';
  let whatsIncluded = '';
  let serviceSpecificTerms = '';
  let closingMessage = '';
  
  if (data.estimate?.type === 'moving') {
    if (data.hasThirdLocation) {
      const tripDistance = parseFloat(data.tripDistance || 0);
      const thirdLocationDistance = parseFloat(data.thirdLocationDistance || 0);
      jobDistance = (tripDistance + thirdLocationDistance).toFixed(1);
    } else {
      jobDistance = parseFloat(data.tripDistance || 0).toFixed(1);
    }
    
    // Calculate moving hours (without packing)
    const movingHours = parseFloat(data.estimate.totalHours) - parseFloat(data.estimate.packingHours || 0);

    itemizedBreakdown = `
ITEMIZED BREAKDOWN
─────────────────────────────────────────
Base Moving Service (${movingHours.toFixed(1)} hrs @ $${data.estimate.hourlyRate}/hr): ${formatMoney(data.estimate.baseCost)}
Service Fee (14%): ${formatMoney(data.estimate.serviceCharge)}`;

    if (parseFloat(data.estimate.packingCost) > 0) {
      itemizedBreakdown += `\nPacking Service (${data.estimate.packingHours} hrs): ${formatMoney(data.estimate.packingCost)}`;
    }
    if (parseFloat(data.estimate.specialItemFee) > 0) {
      itemizedBreakdown += `\nSpecial Item Handling: ${formatMoney(data.estimate.specialItemFee)}`;
    }
    if (parseFloat(data.estimate.heavyItemFees) > 0) {
      itemizedBreakdown += `\nHeavy Item Surcharge: ${formatMoney(data.estimate.heavyItemFees)}`;
    }
    if (parseFloat(data.estimate.tvBoxFees) > 0) {
      itemizedBreakdown += `\nTV Protection Boxes: ${formatMoney(data.estimate.tvBoxFees)}`;
    }
    if (parseFloat(data.estimate.shopEquipmentFees) > 0) {
      itemizedBreakdown += `\nShop Equipment Fees: ${formatMoney(data.estimate.shopEquipmentFees)}`;
    }
    if (parseFloat(data.estimate.oversizedFees) > 0) {
      itemizedBreakdown += `\nOversized Item Fees: ${formatMoney(data.estimate.oversizedFees)}`;
    }
    if (parseFloat(data.estimate.stairFee) > 0) {
      itemizedBreakdown += `\nStair Fees: ${formatMoney(data.estimate.stairFee)}`;
    }
    if (parseFloat(data.estimate.packingMaterialsCost) > 0) {
      itemizedBreakdown += `\nPacking Materials: ${formatMoney(data.estimate.packingMaterialsCost)}`;
    }
    if (parseFloat(data.estimate.sameDayFee) > 0) {
      itemizedBreakdown += `\nSame-Day Service Fee (10%): ${formatMoney(data.estimate.sameDayFee)}`;
    }
    if (parseFloat(data.estimate.tollCost) > 0) {
      itemizedBreakdown += `\nEstimated Tolls: ${formatMoney(data.estimate.tollCost)}`;
    }
    if (fvpCost > 0) {
      itemizedBreakdown += `\nFull Value Protection: ${formatMoney(fvpCost)}`;
    }
    
    whatsIncluded = `WHAT'S INCLUDED - MOVERS + TRUCK SERVICE
─────────────────────────────────────────
✓ Professional, uniformed, background-checked crew
✓ Clean, fully-equipped moving truck
✓ All professional moving equipment included
✓ Furniture pads & protective blankets
✓ Professional shrink wrap & moving straps
✓ Wardrobe boxes available for purchase
✓ Free furniture disassembly & reassembly
✓ ${data.fvpOption === 'fvp' ? 'PREMIUM Full Value Protection - ' + formatMoney(data.fvpValue) : 'Basic liability coverage ($0.60/lb per article)'}
✓ Complete loading & unloading service
✓ Placement of furniture in your new home`;

    serviceSpecificTerms = `
MOVERS + TRUCK SERVICE TERMS:
- Estimate based on ${data.estimate.totalHours} hours of service
- Additional time charged at $${data.estimate.hourlyRate}/hour
- Professional padding & equipment included
- Crew will protect floors, walls, and doorways
- Large furniture professionally wrapped
- Wardrobe boxes available for purchase on move day`;

    closingMessage = `
🌟 READY TO EXPERIENCE WORRY-FREE MOVING? 🌟
─────────────────────────────────────────

${data.firstName} ${data.lastName}, you're making a GREAT choice! Here's why our customers love us:

✅ Over 500 five-star reviews
✅ Family-owned & operated since 2019
✅ Your items treated like our own
✅ No surprises - transparent pricing
✅ Professional crews that care

⚡ IMPORTANT: Your quote of ${formatMoney(grandTotal)} is locked in for 7 days!
   Don't miss out - our schedule fills quickly, especially for ${data.formattedDate || 'your selected date'}.

BOOK NOW & RELAX - WE'VE GOT THIS! 🚚💪`;
        
  } else if (data.estimate?.type === 'labor') {
    jobDistance = parseFloat(data.fromDistance || 0).toFixed(1);
    
    itemizedBreakdown = `
ITEMIZED BREAKDOWN
─────────────────────────────────────────
Labor Hours Requested: ${data.estimate.laborHours} hours
Travel Time: ${data.estimate.driveHours} hours
Round Trip Distance: ${data.estimate.totalDistance} miles

Labor Service (${data.estimate.laborHours} hrs @ $${data.estimate.hourlyRate}/hr): ${formatMoney(data.estimate.labor)}
Travel Fee: ${formatMoney(data.estimate.travel)}
Service Fee (8%): ${formatMoney(data.estimate.serviceCharge)}`;

    if (parseFloat(data.estimate.stairFee) > 0) {
      itemizedBreakdown += `\nStair Fees: ${formatMoney(data.estimate.stairFee)}`;
    }
    if (parseFloat(data.estimate.heavyItemFees) > 0) {
      itemizedBreakdown += `\nHeavy Item Surcharge: ${formatMoney(data.estimate.heavyItemFees)}`;
    }
    if (parseFloat(data.estimate.shopEquipmentFees) > 0) {
      itemizedBreakdown += `\nShop Equipment Fees: ${formatMoney(data.estimate.shopEquipmentFees)}`;
    }
    if (parseFloat(data.estimate.oversizedFees) > 0) {
      itemizedBreakdown += `\nOversized Item Fees: ${formatMoney(data.estimate.oversizedFees)}`;
    }
    if (parseFloat(data.estimate.sameDayFee) > 0) {
      itemizedBreakdown += `\nSame-Day Service Fee (10%): ${formatMoney(data.estimate.sameDayFee)}`;
    }
    
    whatsIncluded = `WHAT'S INCLUDED IN YOUR LABOR-ONLY SERVICE
─────────────────────────────────────────
✓ Professional, experienced moving crew
✓ All necessary moving tools & equipment
✓ Professional dollies & hand trucks
✓ Moving straps & tie-downs 
✓ Shrink wrap for securing items
✓ Basic liability coverage ($0.60/lb per article)
✓ Expert loading/unloading of YOUR truck
✓ Efficient, careful handling of all items

❌ NOT INCLUDED (Labor-Only Service):
- Moving truck (you provide)
- Furniture pads/blankets (available for purchase)
- Packing materials
- Long-distance driving`;

    serviceSpecificTerms = `
LABOR-ONLY SERVICE TERMS:
- Estimate based on ${data.estimate.laborHours} hours of labor
- Additional time charged at $${data.estimate.hourlyRate}/hour
- Customer provides moving truck/trailer
- Customer responsible for truck size selection
- Furniture pads available for purchase
- Travel time is included in quoted price`;

    closingMessage = `
💪 SMART CHOICE - SAVE MONEY WITH LABOR-ONLY! 💪
─────────────────────────────────────────

${data.firstName} ${data.lastName}, you're getting the BEST of both worlds:

✅ Professional muscle & expertise
✅ YOUR truck = BIG savings
✅ No rental markup fees
✅ Expert loading for maximum space
✅ Safe, efficient, FAST service

Your crew knows how to pack a truck RIGHT the first time!

⚡ LOCK IN YOUR ${formatMoney(grandTotal)} QUOTE NOW!
   Spots for ${data.formattedDate || 'your date'} are going fast!`;
        
  } else if (data.estimate?.type === 'single') {
    jobDistance = parseFloat(data.fromDistance || 0).toFixed(1);
    
    itemizedBreakdown = `
ITEMIZED BREAKDOWN
─────────────────────────────────────────
Item: ${data.estimate.item}
Point-to-Point Distance: ${data.estimate.totalDistance} miles
Estimated Time: ${data.estimate.totalMinutesEstimated} minutes
Crew Size: ${data.estimate.crew} movers

Base Service: ${formatMoney(data.estimate.base)}
Distance Fee: ${formatMoney(data.estimate.distance)}`;

    if (parseFloat(data.estimate.stairs) > 0) {
      itemizedBreakdown += `\nStair Fees: ${formatMoney(data.estimate.stairs)}`;
    }
    if (parseFloat(data.estimate.itemFee) > 0) {
      itemizedBreakdown += `\nSpecial Handling Fee: ${formatMoney(data.estimate.itemFee)}`;
    }
    if (parseFloat(data.estimate.heavyItemFee) > 0) {
      itemizedBreakdown += `\nHeavy Item Fee (300+ lbs): ${formatMoney(data.estimate.heavyItemFee)}`;
    }
    if (parseFloat(data.estimate.sameDayFee) > 0) {
      itemizedBreakdown += `\nSame-Day Service Fee (10%): ${formatMoney(data.estimate.sameDayFee)}`;
    }
    
    whatsIncluded = `WHAT'S INCLUDED IN YOUR SINGLE ITEM MOVE
─────────────────────────────────────────
✓ Dedicated ${data.estimate.crew}-person professional crew
✓ Appropriate truck for your ${data.estimate.item}
✓ Specialized equipment for safe transport
✓ Professional padding & protection
✓ Careful loading & securing
✓ Safe delivery & placement
✓ Basic liability coverage
✓ All tools & equipment needed
✓ Minimum ${data.estimate.minimumTime} minutes of service`;

    serviceSpecificTerms = `
SINGLE ITEM SERVICE TERMS:
- Includes ${data.estimate.minimumTime} minutes of service
- Additional time charged at $${data.estimate.hourlyRate}/hour
- Professional handling guaranteed
- Item properly padded & secured
- Direct point-to-point service`;

    closingMessage = `
📦 PERFECT SOLUTION FOR YOUR ${data.estimate.item.toUpperCase()}! 📦
─────────────────────────────────────────

${data.firstName} ${data.lastName}, here's why single item service is PERFECT for you:

✅ Clear, upfront pricing
✅ Professional ${data.estimate.crew}-person crew
✅ Your item gets VIP treatment
✅ Fast, focused service

🎯 Your all-inclusive price: ${formatMoney(grandTotal)}
   Simple. Transparent. Worry-Free!

⚡ Book NOW - Single item spots fill FAST!`;
  }
  
  itemizedBreakdown += `\n─────────────────────────────────────────
TOTAL ESTIMATE: ${formatMoney(grandTotal)}
─────────────────────────────────────────`;
  
  let locationString = '';
  if (data.estimate?.type === 'moving') {
    locationString = `From: ${data.from || 'N/A'}
To: ${data.to || 'N/A'}${data.hasThirdLocation ? '\nThird Location: ' + data.thirdLocation : ''}
Job Distance: ${jobDistance} miles`;
  } else if (data.estimate?.type === 'labor') {
    locationString = `Service Location: ${data.from || 'N/A'}
Distance from Base: ${jobDistance} miles`;
  } else if (data.estimate?.type === 'single') {
    locationString = `From: ${data.from || 'N/A'}
To: ${data.to || 'N/A'}
Distance from Base: ${jobDistance} miles`;
  }
  
  const plainTextQuote = `
🚚 YOUR PERSONALIZED MOVING QUOTE 🚚
Worry Free Moving - Making Your Move AMAZING!

Dear ${data.firstName} ${data.lastName},

FANTASTIC NEWS! We're thrilled to help make your move smooth, easy, and worry-free! 

QUOTE DETAILS
─────────────────────────────────────────
Service Type: ${data.estimate?.type === 'moving' ? '🚚 MOVERS + TRUCK 🚚' : 
               data.estimate?.type === 'labor' ? '💪 LABOR-ONLY SERVICE 💪' : '📦 SINGLE ITEM MOVE 📦'}
Moving Date: ${data.formattedDate || 'TBD'}
Crew Size: ${data.crewSize || data.estimate?.crew || 2} professional movers

CUSTOMER INFORMATION
─────────────────────────────────────────
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}

LOCATIONS
─────────────────────────────────────────
${locationString}

${itemizedBreakdown}

${whatsIncluded}

IMPORTANT TERMS & CONDITIONS
─────────────────────────────────────────

PRICING & TIME:
- Your estimated total: ${formatMoney(grandTotal)}
- Estimated time: ${data.estimate?.totalHours || data.estimate?.laborHours || (data.estimate?.minimumTime ? data.estimate.minimumTime + ' minutes' : '2 hours')}
- Rate for additional time: $${data.estimate?.hourlyRate || '0'}/hour
- Time exceeding estimate charged at hourly rate

${serviceSpecificTerms}

LIABILITY & PROTECTION:
- Basic coverage: $0.60 per pound per article (included FREE)
${data.fvpOption === 'fvp' ? '• ⭐ PREMIUM Protection selected: ' + formatMoney(data.fvpValue) + ' coverage with $' + data.fvpDeductible + ' deductible' : '• Upgrade to Full Value Protection available'}
- Customer-packed items: packed at customer's risk
- Excluded: cash, jewelry, important documents, plants

SCHEDULING & AVAILABILITY:
- This quote expires: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
- Your date is NOT reserved until booked
- Arrival window: 2-hour notification
- Weekend moves available (may have premium)

YOUR PROFESSIONAL CREW:
- ${data.crewSize || data.estimate?.crew || 2} experienced, background-checked movers
- Crew leader with 2+ years experience
- Additional crew available if needed ($55/hour each)
- English-speaking, uniformed professionals

WEATHER & UNFORESEEN EVENTS:
- We work in light rain - your move happens!
- Severe weather: we'll reschedule together
- No charge for weather delays
- Your safety is our priority

POTENTIAL ADDITIONAL CHARGES:
- Extra heavy items (300+ lbs) not disclosed: $150
- Excessive stairs beyond quoted amount: $25/flight
- Long walks (75+ feet) if not mentioned
- Extended wait time (after first 30 min free)
- Last-minute crew size changes

EASY CANCELLATION:
- 48+ hours notice: NO CHARGE
- 24-48 hours: $150 fee
- Less than 24 hours: 50% of estimate
- We understand plans change!

PAYMENT MADE EASY:
- Pay at completion - see the great job first!
- Cash or card accepted
- 3% fee for credit cards
- No deposits required!

${closingMessage}

─────────────────────────────────────────

BOOK YOUR MOVE NOW - 3 EASY WAYS:
📅 ONLINE (Fastest): ${CONFIG.bookingUrl}
   Direct Scheduling: ${CONFIG.acuityUrl}
📞 CALL: ${CONFIG.phone} (Friendly team waiting!)
📧 EMAIL: ${CONFIG.email}

Remember: This quote EXPIRES in 7 days and spots are filling up!

By booking, you're joining our family of 500+ happy customers!

─────────────────────────────────────────
Worry Free Moving LLC
"We Move Your Life, Not Just Your Stuff!"
${CONFIG.baseAddress}
Licensed & Insured | PUCO #652751 | DOT #3820498
⭐⭐⭐⭐⭐ 4.8 Star Rating | BBB Accredited

Office Hours:
Monday-Friday: 8:30 AM - 7:00 PM
Saturday: 8:30 AM - 7:00 PM
Sunday: 10:00 AM - 6:00 PM

Website: www.worryfreemovers.com
Facebook: facebook.com/worryfreemovers
`;

  const customerEmailData = {
    email: data.email,
    from_name: 'Worry Free Moving',
    subject: `Your Moving Quote - ${formatMoney(grandTotal)} - ${data.formattedDate || 'TBD'}`,
    message: plainTextQuote,
    _replyto: CONFIG.email,
    _cc: data.email,
    _template: 'box',
    _captcha: 'false',
    _autoresponse: 'true'
  };
  
  try {
    const response = await fetch(CONFIG.formSubmitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(customerEmailData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to send customer quote email');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending customer quote:', error);
    throw error;
  }
};

export const submitLead = async (data) => {
  const estimateTotal = parseFloat(data.estimate?.total || 0) || 0;
  const fvpCost = parseFloat(data.fvpCost) || 0;
  const grandTotal = estimateTotal + fvpCost;
  
  let locationDetails = `From: ${data.from || 'N/A'}\nTo: ${data.to || 'N/A'}`;
  if (data.hasThirdLocation) {
    locationDetails += `\nThird Location: ${data.thirdLocation}`;
    locationDetails += `\nThird Location Type: ${data.thirdLocationType || 'N/A'}`;
    locationDetails += `\nThird Location Action: ${data.thirdLocationAction || 'N/A'}`;
  }
  
  let applianceDetails = '';
  if (data.appliances?.length > 0) {
    applianceDetails = 'Main Location Appliances: ' + data.appliances.join(', ');
  }
  if (data.thirdLocationAppliances?.length > 0) {
    if (applianceDetails) applianceDetails += '\n';
    applianceDetails += 'Third Location Appliances: ' + data.thirdLocationAppliances.join(', ');
  }
  
  let specialEquipmentDetails = '';
  if (data.shopEquipment?.length > 0) {
    specialEquipmentDetails = 'Shop Equipment: ' + data.shopEquipment.join(', ');
  }
  if (data.oversizedFurniture?.length > 0) {
    if (specialEquipmentDetails) specialEquipmentDetails += '\n';
    specialEquipmentDetails += 'Oversized Items: ' + data.oversizedFurniture.join(', ');
  }
  if (data.tvHandling?.length > 0) {
    if (specialEquipmentDetails) specialEquipmentDetails += '\n';
    specialEquipmentDetails += 'TVs: ' + data.tvHandling.join(', ');
  }
  
  let photoUrlsString = '';
  if (data.photos?.length > 0) {
    photoUrlsString = data.photos.map(p => p.url).join('\n');
  }
  
  const estimateDetails = {
    first_name: data.firstName,
    last_name: data.lastName,
    full_name: `${data.firstName} ${data.lastName}`,
    email: data.email,
    phone: data.phone,
    moving_date: data.formattedDate || 'Not specified',
    service_type: data.serviceType,
    location_details: locationDetails,
    home_size: data.homeSize === 'large' ? 'Larger than 2,600 sq ft' : '2,600 sq ft or smaller',
    access_obstacles: data.accessObstacles?.join(', ') || 'None',
    appliances: applianceDetails || 'None',
    special_equipment: specialEquipmentDetails || 'None',
    special_items: data.specialItems || 'None',
    crew_size: data.crewSize || 'N/A',
    estimated_hours: data.estimate?.totalHours || 'N/A',
    packing_service: data.packingService || 'None',
    heavy_item_count: data.heavyItemCount || 0,
    heavy_item_fees: formatMoney(data.heavyItemFees || 0),
    pest_disclaimer_agreed: data.pestDisclaimerAgreed ? 'Yes' : 'No',
    pest_disclaimer_timestamp: data.pestDisclaimerTimestamp || 'N/A',
    photos_uploaded: data.hasPhotos || false,
    photo_count: data.photos?.length || 0,
    photo_urls: photoUrlsString,
    photo_category: data.photoCategory || 'N/A',
    estimate_details: JSON.stringify(data.estimate || {}, null, 2),
    total_estimate: formatMoney(estimateTotal),
    fvp_option: data.fvpOption || 'standard',
    fvp_cost: formatMoney(fvpCost),
    grand_total: formatMoney(grandTotal),
    source: 'Sarah AI Chat Widget',
    submission_type: data.isAutoSubmit ? 'auto_booking' : 'manual_quote',
    quote_auto_submitted: data.isAutoSubmit || false,
    submission_timestamp: new Date().toISOString(),
    _subject: 'New Moving Estimate Request - Via Sarah AI',
    _cc: CONFIG.additionalEmail,
    _captcha: 'false',
    _template: 'table'
  };
  
  try {
    const response = await fetch(CONFIG.formSubmitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(estimateDetails)
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit lead');
    }
    
    // Send customer quote
    await sendCustomerQuote(data);
    
    return { success: true };
  } catch (error) {
    console.error('Error submitting lead:', error);
    throw error;
  }
};