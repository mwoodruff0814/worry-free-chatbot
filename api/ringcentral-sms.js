// FILE: api/ringcentral-sms.js
// PURPOSE: Serverless function to send SMS via RingCentral with improved error handling

const https = require('https');

// RingCentral Configuration from environment variables
const RC_CLIENT_ID = process.env.RC_CLIENT_ID || 'ZfNZYTGQfR4cCYu1vugV6l';
const RC_CLIENT_SECRET = process.env.RC_CLIENT_SECRET || '4zPHtLi6abHdk2BgRx8wH32tCCQ55rYbOcGAY1b8A4dl';
const RC_JWT = process.env.RC_JWT;
const RC_SERVER = process.env.RC_SERVER || 'https://platform.ringcentral.com';
const BUSINESS_PHONE = process.env.BUSINESS_PHONE || '+13304358686';

/**
 * Make HTTPS request to RingCentral API
 */
function makeRCRequest(path, method, data, accessToken) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, RC_SERVER);

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject({
              statusCode: res.statusCode,
              ...response
            });
          }
        } catch (e) {
          reject({ error: 'Invalid JSON response', body, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', (err) => reject({ error: err.message, type: 'network' }));
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

/**
 * Get RingCentral access token using JWT
 */
async function getRCAccessToken() {
  if (!RC_JWT) {
    throw new Error('RC_JWT not configured');
  }

  const tokenUrl = `${RC_SERVER}/restapi/oauth/token`;
  const url = new URL(tokenUrl);

  const postData = `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${RC_JWT}`;

  return new Promise((resolve, reject) => {
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${RC_CLIENT_ID}:${RC_CLIENT_SECRET}`).toString('base64')
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response.access_token);
          } else {
            reject({
              statusCode: res.statusCode,
              error: response.error || 'Authentication failed',
              error_description: response.error_description || 'Could not authenticate'
            });
          }
        } catch (e) {
          reject({ error: 'Invalid JSON response', body, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', (err) => reject({ error: err.message, type: 'network' }));
    req.write(postData);
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
    // Validate RingCentral JWT is configured
    if (!RC_JWT) {
      console.error('❌ RC_JWT environment variable not configured');
      return res.status(500).json({
        error: 'Service unavailable',
        details: 'Live chat is temporarily unavailable. Please call us instead.'
      });
    }

    const { customerName, customerPhone, customerEmail, message } = req.body;

    // Validate required fields
    if (!message || !customerPhone) {
      return res.status(400).json({
        error: 'Missing required information',
        details: 'Please provide both a message and contact phone number'
      });
    }

    console.log('📱 Sending SMS via RingCentral...');
    console.log(`   Customer: ${customerName || 'Anonymous'}`);
    console.log(`   Phone: ${customerPhone}`);

    // Get access token
    let accessToken;
    try {
      accessToken = await getRCAccessToken();
      console.log('✅ Got access token');
    } catch (authError) {
      console.error('❌ Authentication failed:', authError);
      return res.status(500).json({
        error: 'Service authentication error',
        details: 'Unable to connect to messaging service. Please try again or call us.',
        debug: authError.error_description || authError.error
      });
    }

    // Format the message to include customer info
    const formattedMessage = `[LIVE CHAT]\nFrom: ${customerName || 'Anonymous'}\nPhone: ${customerPhone}\nEmail: ${customerEmail || 'Not provided'}\n\nMessage: ${message}`;

    // Send SMS
    const smsPayload = {
      from: { phoneNumber: BUSINESS_PHONE },
      to: [{ phoneNumber: BUSINESS_PHONE }], // Send to business number
      text: formattedMessage
    };

    let smsResponse;
    try {
      smsResponse = await makeRCRequest(
        '/restapi/v1.0/account/~/extension/~/sms',
        'POST',
        smsPayload,
        accessToken
      );
      console.log('✅ SMS sent successfully, ID:', smsResponse.id);
    } catch (smsError) {
      console.error('❌ SMS send failed:', smsError);
      return res.status(500).json({
        error: 'Failed to send message',
        details: 'Your message could not be delivered. Please try again or call us directly.',
        debug: smsError.message || smsError.errorCode || smsError.error
      });
    }

    return res.status(200).json({
      success: true,
      messageId: smsResponse.id,
      message: 'Message sent successfully! We\'ll respond shortly.'
    });

  } catch (error) {
    console.error('❌ Unexpected RingCentral SMS Error:', error);

    return res.status(500).json({
      error: 'Unexpected error',
      details: 'Something went wrong. Please try again or call us at (330) 435-8686.',
      debug: error.message
    });
  }
};
