// FILE: api/square-customer.js
// PURPOSE: Serverless function to create Square customer and store card on file
// DEPLOY TO: Vercel or Netlify

const https = require('https');

// Square API Configuration
const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_ENVIRONMENT = process.env.SQUARE_ENVIRONMENT || 'production';
const BASE_URL = SQUARE_ENVIRONMENT === 'production'
  ? 'https://connect.squareup.com'
  : 'https://connect.squareupsandbox.com';

/**
 * Make HTTPS request to Square API
 */
function makeSquareRequest(path, method, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL.replace('https://', ''),
      path: path,
      method: method,
      headers: {
        'Square-Version': '2024-01-18',
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(response);
          }
        } catch (e) {
          reject({ error: 'Invalid JSON response', body });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

/**
 * Main handler function
 */
module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customerData, cardToken, estimate } = req.body;

    if (!customerData || !cardToken) {
      return res.status(400).json({
        error: 'Missing required fields: customerData and cardToken'
      });
    }

    // Step 1: Create Square Customer
    console.log('Creating Square customer...');
    const customerPayload = {
      idempotency_key: `customer-${Date.now()}-${Math.random()}`,
      given_name: customerData.firstName,
      family_name: customerData.lastName,
      email_address: customerData.email,
      phone_number: customerData.phone,
      reference_id: `WFM-${Date.now()}`, // Your internal reference
      note: `Moving estimate: $${estimate?.total || 'N/A'}. Service: ${estimate?.type || 'N/A'}. Date: ${customerData.movingDate || 'TBD'}`
    };

    const customerResponse = await makeSquareRequest(
      '/v2/customers',
      'POST',
      customerPayload
    );

    const customerId = customerResponse.customer.id;
    console.log('✅ Customer created:', customerId);

    // Step 2: Store Card on File
    console.log('Storing card on file...');
    const cardPayload = {
      idempotency_key: `card-${Date.now()}-${Math.random()}`,
      source_id: cardToken,
      card: {
        customer_id: customerId
      }
    };

    const cardResponse = await makeSquareRequest(
      '/v2/cards',
      'POST',
      cardPayload
    );

    const cardId = cardResponse.card.id;
    const last4 = cardResponse.card.last_4;
    const cardBrand = cardResponse.card.card_brand;

    console.log('✅ Card stored:', { cardId, last4, cardBrand });

    // Return success response
    return res.status(200).json({
      success: true,
      customerId: customerId,
      cardId: cardId,
      cardLast4: last4,
      cardBrand: cardBrand,
      message: 'Card saved successfully. No charges have been made.'
    });

  } catch (error) {
    console.error('❌ Square API Error:', error);

    return res.status(500).json({
      error: 'Failed to save payment method',
      details: error.errors || error.message || 'Unknown error'
    });
  }
};
