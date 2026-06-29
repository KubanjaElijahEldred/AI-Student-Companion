const axios = require('axios');

class WhatsAppService {
  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.webhookVerifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
    this.apiVersion = 'v18.0';
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
  }

  // Verify webhook for WhatsApp Business API
  verifyWebhook(mode, token, challenge) {
    if (mode === 'subscribe' && token === this.webhookVerifyToken) {
      return challenge;
    }
    return null;
  }

  // Send message via WhatsApp API
  async sendMessage(to, message, type = 'text') {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        to: to,
        type: type
      };

      if (type === 'text') {
        payload.text = { body: message };
      } else if (type === 'template') {
        payload.template = message;
      }

      const response = await axios.post(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error.response?.data || error.message);
      throw error;
    }
  }

  // Send interactive message (buttons, list)
  async sendInteractiveMessage(to, interactiveContent) {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'interactive',
        interactive: interactiveContent
      };

      const response = await axios.post(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error sending interactive WhatsApp message:', error.response?.data || error.message);
      throw error;
    }
  }

  // Send location message
  async sendLocation(to, latitude, longitude, name, address) {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'location',
        location: {
          latitude: latitude,
          longitude: longitude,
          name: name,
          address: address
        }
      };

      const response = await axios.post(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error sending location WhatsApp message:', error.response?.data || error.message);
      throw error;
    }
  }

  // Mark message as read
  async markAsRead(messageId) {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId
      };

      const response = await axios.post(
        `${this.baseUrl}/messages`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error marking WhatsApp message as read:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get message info
  async getMessageInfo(messageId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${messageId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error getting WhatsApp message info:', error.response?.data || error.message);
      throw error;
    }
  }

  // Format phone number (remove +, spaces, etc.)
  formatPhoneNumber(phoneNumber) {
    return phoneNumber.replace(/[\s\+\-\(\)]/g, '');
  }

  // Create interactive buttons
  createButtonMessage(bodyText, buttons) {
    return {
      type: 'button',
      body: {
        text: bodyText
      },
      action: {
        buttons: buttons.map((button, index) => ({
          type: 'reply',
          reply: {
            id: `btn_${index + 1}`,
            title: button.title
          }
        }))
      }
    };
  }

  // Create list message
  createListMessage(bodyText, buttonText, sections) {
    return {
      type: 'list',
      header: {
        text: 'AI Student Companion'
      },
      body: {
        text: bodyText
      },
      footer: {
        text: 'Powered by AI'
      },
      action: {
        button: buttonText,
        sections: sections
      }
    };
  }
}

module.exports = WhatsAppService;
