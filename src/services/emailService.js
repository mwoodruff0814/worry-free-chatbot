// FILE: src/services/emailService.js
// PURPOSE: Handle all email submissions

const CONFIG = {
  formSubmitUrl: "https://formsubmit.co/ajax/service@worryfreemovers.com",
  additionalEmail: "bwdrff1990@gmail.com,zlarimer24@gmail.com",
  email: "service@worryfreemovers.com",
  phone: "330-435-8686",
  bookingUrl: "https://worryfreemovers.com/moving/local",
  acuityUrl: "https://app.acuityscheduling.com/schedule.php?owner=26866067&ref=embedded_csp"
};

/**
 * Format currency for display
 */
export const formatMoney = (amount) => {
  const cleanAmount = parseFloat(amount) || 0;
  return '$' + cleanAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

/**
 * Send customer quote email
 */
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
    if (parseFloat(data.estimate.stairFee) > 0) {
      itemizedBreakdown += `\nStair Fees: ${formatMoney(data.estimate.stairFee)}`;
    }
    if (parseFloat(data.estimate.packingMaterialsCost) > 0) {
      itemizedBreakdown += `\nPacking Materials: ${formatMoney(data.estimate.packingMaterialsCost)}`;
    }
    if (parseFloat(data.estimate.sameDayFee) > 0) {
      itemizedBreakdown += `\nSame-Day Service Fee (10%): ${formatMoney(data.estimate.sameDayFee)}`;
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
✓ Free furniture disassembly & reassembly
✓ ${data.fvpOption === 'fvp' ? 'PREMIUM Full Value Protection' : 'Basic liability coverage'}
✓ Complete loading & unloading service`;

    serviceSpecificTerms = `
MOVERS + TRUCK SERVICE TERMS:
- Estimate based on ${data.estimate.totalHours} hours of service
- Additional time charged at $${data.estimate.hourlyRate}/hour
- Professional padding & equipment included`;

    closingMessage = `
🌟 READY TO EXPERIENCE WORRY-FREE MOVING? 🌟
─────────────────────────────────────────

${data.firstName} ${data.lastName}, you're making a GREAT choice!

✅ Over 500 five-star reviews
✅ Family-owned & operated since 2019
✅ Professional crews that care

⚡ Your quote of ${formatMoney(grandTotal)} is locked in for 7 days!`;
    
  } else if (data.estimate?.type === 'labor') {
    jobDistance = parseFloat(data.fromDistance || 0).toFixed(1);
    
    itemizedBreakdown = `
ITEMIZED BREAKDOWN
─────────────────────────────────────────
Labor Service (${data.estimate.laborHours} hrs @ $${data.estimate.hourlyRate}/hr): ${formatMoney(data.estimate.labor)}
Travel Fee: ${formatMoney(data.estimate.travel)}
Service Fee (8%): ${formatMoney(data.estimate.serviceCharge)}`;

    if (parseFloat(data.estimate.stairFee) > 0) {
      itemizedBreakdown += `\nStair Fees: ${formatMoney(data.estimate.stairFee)}`;
    }
    
    whatsIncluded = `WHAT'S INCLUDED IN YOUR LABOR-ONLY SERVICE
─────────────────────────────────────────
✓ Professional, experienced moving crew
✓ All necessary moving tools & equipment
✓ Expert loading/unloading of YOUR truck`;

    serviceSpecificTerms = `
LABOR-ONLY SERVICE TERMS:
- Estimate based on ${data.estimate.laborHours} hours of labor
- Additional time charged at $${data.estimate.hourlyRate}/hour
- Customer provides moving truck/trailer`;

    closingMessage = `
💪 SMART CHOICE - SAVE MONEY WITH LABOR-ONLY! 💪

${data.firstName} ${data.lastName}, you're getting the BEST of both worlds!

⚡ LOCK IN YOUR ${formatMoney(grandTotal)} QUOTE NOW!`;
    
  } else if (data.estimate?.type === 'single') {
    jobDistance = parseFloat(data.fromDistance || 0).toFixed(1);
    
    itemizedBreakdown = `
ITEMIZED BREAKDOWN
─────────────────────────────────────────
Item: ${data.estimate.item}
Distance: ${data.estimate.totalDistance} miles

Base Service: ${formatMoney(data.estimate.base)}
Distance Fee: ${formatMoney(data.estimate.distance)}`;

    if (parseFloat(data.estimate.stairs) > 0) {
      itemizedBreakdown += `\nStair Fees: ${formatMoney(data.estimate.stairs)}`;
    }
    if (parseFloat(data.estimate.itemFee) > 0) {
      itemizedBreakdown += `\nSpecial Handling Fee: ${formatMoney(data.estimate.itemFee)}`;
    }
    
    whatsIncluded = `WHAT'S INCLUDED IN YOUR SINGLE ITEM MOVE
─────────────────────────────────────────
✓ Dedicated ${data.estimate.crew}-person professional crew
✓ Appropriate truck for your item
✓ Professional padding & protection`;

    serviceSpecificTerms = `
SINGLE ITEM SERVICE TERMS:
- Includes ${data.estimate.minimumTime} minutes of service
- Additional time charged at $${data.estimate.hourlyRate}/hour`;

    closingMessage = `
📦 PERFECT SOLUTION FOR YOUR ${data.estimate.item.toUpperCase()}! 📦

${data.firstName} ${data.lastName}, clear upfront pricing!

🎯 Your all-inclusive price: ${formatMoney(grandTotal)}`;
  }
  
  itemizedBreakdown += `\n─────────────────────────────────────────
TOTAL ESTIMATE: ${formatMoney(grandTotal)}`;

  // Add detailed packing materials list if available
  let packingMaterialsBreakdown = '';
  if (data.estimate?.packingMaterialsItems && data.estimate.packingMaterialsItems.length > 0) {
    packingMaterialsBreakdown = `\n\n📦 PACKING MATERIALS BREAKDOWN
─────────────────────────────────────────`;

    data.estimate.packingMaterialsItems.forEach(item => {
      packingMaterialsBreakdown += `\n${item.name}: ${item.qty} × $${item.unitPrice.toFixed(2)} = ${formatMoney(item.total)}`;
    });

    packingMaterialsBreakdown += `\n─────────────────────────────────────────
TOTAL PACKING MATERIALS: ${formatMoney(data.estimate.packingMaterialsCost)}

⚠️ MATERIAL PURCHASE POLICY:
Additional materials available if needed. You must purchase
all materials initially brought out, even if not fully used.`;
  }
  
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
Distance: ${jobDistance} miles`;
  }
  
  const plainTextQuote = `
🚚 YOUR PERSONALIZED MOVING QUOTE 🚚
Worry Free Moving - Making Your Move AMAZING!

Dear ${data.firstName} ${data.lastName},

FANTASTIC NEWS! We're thrilled to help make your move smooth and worry-free! 

QUOTE DETAILS
─────────────────────────────────────────
Service Type: ${data.estimate?.type === 'moving' ? '🚚 MOVERS + TRUCK 🚚' : 
               data.estimate?.type === 'labor' ? '💪 LABOR-ONLY 💪' : '📦 SINGLE ITEM 📦'}
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
${packingMaterialsBreakdown}

${whatsIncluded}

${serviceSpecificTerms}

${closingMessage}

─────────────────────────────────────────

BOOK YOUR MOVE NOW - 3 EASY WAYS:
📅 ONLINE: ${CONFIG.bookingUrl}
📞 CALL: ${CONFIG.phone}
📧 EMAIL: ${CONFIG.email}

─────────────────────────────────────────
Worry Free Moving LLC
"We Move Your Life, Not Just Your Stuff!"
Licensed & Insured
`;

  const customerEmailData = {
    email: data.email,
    from_name: 'Worry Free Moving',
    _subject: `🎉 ${data.firstName}, Your Estimate is Ready! ${formatMoney(grandTotal)} for ${data.formattedDate || 'Your Move'}`,
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

/**
 * Submit lead to FormSubmit
 */
export const submitLead = async (data) => {
  const estimateTotal = parseFloat(data.estimate?.total || 0) || 0;
  const fvpCost = parseFloat(data.fvpCost) || 0;
  const grandTotal = estimateTotal + fvpCost;
  
  let photoUrlsString = '';
  if (data.photos && data.photos.length > 0) {
    photoUrlsString = data.photos.map(p => p.url).join('\n');
  }
  
  const estimateDetails = {
    first_name: data.firstName,
    last_name: data.lastName,
    full_name: `${data.firstName} ${data.lastName}`,
    customer_email: data.email,
    phone: data.phone,
    moving_date: data.formattedDate || 'Not specified',
    service_type: data.serviceType,
    from_location: data.from,
    to_location: data.to,
    crew_size: data.crewSize || 'N/A',
    estimated_hours: data.estimate?.totalHours || 'N/A',
    photos_uploaded: data.hasPhotos || false,
    photo_count: data.photos?.length || 0,
    photo_urls: photoUrlsString,
    estimate_details: JSON.stringify(data.estimate || {}, null, 2),
    total_estimate: formatMoney(estimateTotal),
    fvp_option: data.fvpOption || 'standard',
    fvp_cost: formatMoney(fvpCost),
    grand_total: formatMoney(grandTotal),
    source: 'Sarah AI Chat Widget',
    submission_type: data.isAutoSubmit ? 'auto_booking' : 'manual_quote',
    submission_timestamp: new Date().toISOString(),
    email: CONFIG.email,
    _subject: `🚨 NEW BOOKING REQUEST: ${data.firstName} ${data.lastName} | ${formatMoney(grandTotal)} ${data.serviceType?.toUpperCase() || 'MOVING'} | ${data.formattedDate || 'TBD'}`,
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
    
    await sendCustomerQuote(data);
    
    return { success: true };
  } catch (error) {
    console.error('Error submitting lead:', error);
    throw error;
  }
};

/**
 * Submit insurance claim
 */
export const submitInsuranceClaim = async (data) => {
  let photoUrlsString = '';
  if (data.photos && data.photos.length > 0) {
    photoUrlsString = data.photos.map(p => p.url).join('\n');
  }
  
  const claimDetails = {
    first_name: data.firstName,
    last_name: data.lastName,
    full_name: `${data.firstName} ${data.lastName}`,
    email: data.email,
    phone: data.phone,
    claim_type: 'Insurance Claim',
    coverage_type: data.coverageType === 'fvp_coverage' ? 'Full Value Protection' : 'Standard Coverage',
    damage_description: data.damageDescription,
    item_value: formatMoney(data.itemValue),
    damage_cause: data.damageCause,
    move_date: data.claimMoveDate,
    invoice_number: data.invoiceNumber,
    photos_uploaded: data.photos?.length || 0,
    photo_urls: photoUrlsString,
    submission_timestamp: new Date().toISOString(),
    _subject: 'INSURANCE CLAIM - Submitted via Sarah AI',
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
      body: JSON.stringify(claimDetails)
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit claim');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error submitting claim:', error);
    throw error;
  }
};

export default {
  sendCustomerQuote,
  submitLead,
  submitInsuranceClaim,
  formatMoney
};