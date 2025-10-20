// FILE: src/api/emailService.js
// PURPOSE: Email sending service via FormSubmit

import { CONFIG } from '../constants/config';

class EmailService {
  constructor() {
    this.formSubmitUrl = CONFIG.formSubmitUrl;
  }

  // Send estimate email
  async sendEstimate(data) {
    try {
      console.log('📧 Sending estimate email...');
      
      const emailData = {
        _subject: `New ${data.serviceType} Estimate - ${data.name}`,
        _cc: CONFIG.additionalEmail,
        _template: 'table',
        _captcha: 'false',
        
        // Customer Info
        'Customer Name': data.name,
        'Email': data.email,
        'Phone': data.phone,
        'Service Type': data.serviceType,
        
        // Move Details
        'From': data.from || 'N/A',
        'To': data.to || 'N/A',
        'Moving Date': data.movingDate || 'N/A',
        'Distance': data.distance ? `${data.distance} miles` : 'N/A',
        
        // Estimate
        'Subtotal': data.estimate?.subtotal ? `$${data.estimate.subtotal}` : 'N/A',
        'Service Charge': data.estimate?.serviceCharge ? `$${data.estimate.serviceCharge}` : 'N/A',
        'Total Estimate': data.estimate?.total ? `$${data.estimate.total}` : 'N/A',
        
        // Additional Details
        'Bedrooms': data.bedrooms || 'N/A',
        'Crew Size': data.crewSize || 'N/A',
        'Hours': data.hours || 'N/A',
        'Photos': data.photos && data.photos.length > 0 ? data.photos.join(', ') : 'None',
        'Notes': data.notes || 'None'
      };

      const response = await fetch(this.formSubmitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        throw new Error('Email send failed');
      }

      const result = await response.json();
      console.log('✅ Email sent successfully');
      return result;
    } catch (error) {
      console.error('❌ Email send failed:', error);
      throw error;
    }
  }

  // Send insurance claim email
  async sendInsuranceClaim(data) {
    try {
      console.log('📧 Sending insurance claim...');
      
      const emailData = {
        _subject: `Insurance Claim - ${data.name}`,
        _cc: CONFIG.additionalEmail,
        _template: 'table',
        
        'Customer Name': data.name,
        'Email': data.email,
        'Phone': data.phone,
        'Move Date': data.moveDate,
        'Damage Description': data.damageDescription,
        'Photos': data.photos && data.photos.length > 0 ? data.photos.join(', ') : 'None'
      };

      const response = await fetch(this.formSubmitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        throw new Error('Claim submission failed');
      }

      console.log('✅ Insurance claim sent successfully');
      return await response.json();
    } catch (error) {
      console.error('❌ Claim submission failed:', error);
      throw error;
    }
  }

  // Send general inquiry
  async sendInquiry(data) {
    try {
      console.log('📧 Sending inquiry...');
      
      const emailData = {
        _subject: `New Inquiry - ${data.name}`,
        _cc: CONFIG.additionalEmail,
        _template: 'table',
        
        'Name': data.name,
        'Email': data.email,
        'Phone': data.phone || 'Not provided',
        'Message': data.message
      };

      const response = await fetch(this.formSubmitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        throw new Error('Inquiry send failed');
      }

      console.log('✅ Inquiry sent successfully');
      return await response.json();
    } catch (error) {
      console.error('❌ Inquiry send failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
