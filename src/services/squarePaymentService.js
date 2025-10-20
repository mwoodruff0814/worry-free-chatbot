// FILE: src/services/squarePaymentService.js
// PURPOSE: Handle Square payment processing and card tokenization

import { CONFIG } from '../constants/config';

class SquarePaymentService {
  constructor() {
    this.payments = null;
    this.card = null;
    this.isInitialized = false;
  }

  /**
   * Load Square Web Payments SDK script
   */
  async loadSquareSDK() {
    return new Promise((resolve, reject) => {
      if (window.Square) {
        resolve(window.Square);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://web.squarecdn.com/v1/square.js';
      script.async = true;
      script.onload = () => resolve(window.Square);
      script.onerror = () => reject(new Error('Failed to load Square SDK'));
      document.head.appendChild(script);
    });
  }

  /**
   * Initialize Square Web Payments SDK
   */
  async initialize() {
    if (this.isInitialized) {
      return this.payments;
    }

    try {
      const Square = await this.loadSquareSDK();

      this.payments = Square.payments(
        CONFIG.square.applicationId,
        CONFIG.square.locationId
      );

      this.isInitialized = true;
      console.log('✅ Square Payments initialized');
      return this.payments;
    } catch (error) {
      console.error('❌ Square initialization failed:', error);
      throw error;
    }
  }

  /**
   * Initialize card payment form
   * @param {string} elementId - ID of the HTML element to attach the card form
   */
  async initializeCard(elementId) {
    try {
      if (!this.payments) {
        await this.initialize();
      }

      // Destroy existing card instance if any
      if (this.card) {
        await this.card.destroy();
      }

      // Initialize card with autofill enabled
      this.card = await this.payments.card({
        style: {
          input: {
            fontSize: '16px'
          },
          '.input-container': {
            borderColor: '#e2e8f0',
            borderRadius: '8px'
          }
        },
        // Enable browser autofill if supported by Square
        includeInputLabels: true
      });
      await this.card.attach(`#${elementId}`);

      console.log('✅ Square Card form attached');
      return this.card;
    } catch (error) {
      console.error('❌ Card initialization failed:', error);
      throw error;
    }
  }

  /**
   * Tokenize the card (creates a secure token representing the card)
   * This token can be used to charge the card or store it
   */
  async tokenizeCard() {
    if (!this.card) {
      throw new Error('Card not initialized');
    }

    try {
      const result = await this.card.tokenize();

      if (result.status === 'OK') {
        console.log('✅ Card tokenized successfully');
        return {
          success: true,
          token: result.token,
          details: result.details
        };
      } else {
        console.error('❌ Tokenization failed:', result.errors);
        return {
          success: false,
          errors: result.errors
        };
      }
    } catch (error) {
      console.error('❌ Tokenization error:', error);
      throw error;
    }
  }

  /**
   * Create a customer and store their payment method
   * Calls the Vercel serverless function to create Square customer
   *
   * @param {Object} customerData - Customer information
   * @param {string} paymentToken - Token from tokenizeCard()
   * @param {Object} estimate - Estimate information
   */
  async createCustomerWithCard(customerData, paymentToken, estimate) {
    // Use dynamic API URL that works in all environments
    const API_URL = `${window.location.origin}/api/square-customer`;

    try {
      console.log('📤 Sending customer data to backend...');

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          customerData: {
            firstName: customerData.firstName,
            lastName: customerData.lastName,
            email: customerData.email,
            phone: customerData.phone,
            movingDate: customerData.movingDate
          },
          cardToken: paymentToken,
          estimate: estimate
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create customer');
      }

      const result = await response.json();
      console.log('✅ Customer created successfully:', result);

      return {
        success: true,
        customerId: result.customerId,
        cardId: result.cardId,
        cardLast4: result.cardLast4,
        cardBrand: result.cardBrand,
        message: result.message
      };
    } catch (error) {
      console.error('❌ Failed to create customer:', error);
      throw error;
    }
  }

  /**
   * Destroy card instance (cleanup)
   */
  async destroy() {
    if (this.card) {
      await this.card.destroy();
      this.card = null;
    }
  }
}

// Export singleton instance
export const squarePaymentService = new SquarePaymentService();
export default squarePaymentService;
