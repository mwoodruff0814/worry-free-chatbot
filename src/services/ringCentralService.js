// FILE: src/services/ringCentralService.js
// PURPOSE: Handle live chat messages via RingCentral SMS with improved error handling

class RingCentralService {
  /**
   * Send a live chat message via SMS
   * Calls the Vercel serverless function to send SMS via RingCentral
   *
   * @param {Object} messageData - Message information
   * @param {string} messageData.customerName - Customer's name
   * @param {string} messageData.customerPhone - Customer's phone number
   * @param {string} messageData.customerEmail - Customer's email
   * @param {string} messageData.message - The message content
   */
  async sendMessage(messageData) {
    // Use dynamic API URL that works in all environments
    const API_URL = `${window.location.origin}/api/ringcentral-sms`;

    try {
      console.log('📱 Sending live chat message via RingCentral...');

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          customerName: messageData.customerName,
          customerPhone: messageData.customerPhone,
          customerEmail: messageData.customerEmail,
          message: messageData.message
        })
      });

      if (!response.ok) {
        // Try to get error details from server
        const errorData = await response.json().catch(() => ({}));

        // Use the user-friendly error message from the API
        const userMessage = errorData.details || errorData.error || 'Failed to send message. Please try again or call us.';

        const error = new Error(userMessage);
        error.details = errorData.debug;
        error.statusCode = response.status;

        console.error('❌ Server error:', errorData);
        throw error;
      }

      const result = await response.json();
      console.log('✅ Message sent successfully:', result);

      return {
        success: true,
        messageId: result.messageId,
        message: result.message || 'Message sent successfully!'
      };
    } catch (error) {
      console.error('❌ Failed to send message:', error);

      // If it's a network error, provide a helpful message
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        const networkError = new Error('Network error. Please check your connection and try again.');
        networkError.isNetworkError = true;
        throw networkError;
      }

      // Re-throw the error with the user-friendly message
      throw error;
    }
  }
}

// Export singleton instance
export const ringCentralService = new RingCentralService();
export default ringCentralService;
